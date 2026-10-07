const API_URL =
    "https://enterprise-challenge-2026-goodwe.onrender.com";

const token =
    localStorage.getItem(
        "ev_chargeops_token"
    );

const usuarioSalvo =
    localStorage.getItem(
        "ev_chargeops_usuario"
    );


/* =========================================
   PROTEÇÃO DA PÁGINA
========================================= */

if (!token || !usuarioSalvo) {

    window.location.href =
        "login.html";

}


let usuario = null;
let sessoesUsuario = [];

try {

    usuario =
        JSON.parse(
            usuarioSalvo
        );

} catch (erro) {

    console.error(
        "Erro ao carregar usuário:",
        erro
    );

    localStorage.removeItem(
        "ev_chargeops_token"
    );

    localStorage.removeItem(
        "ev_chargeops_usuario"
    );

    window.location.href =
        "login.html";

}


/* =========================================
   PERFIL
========================================= */

if (usuario) {

    const perfil =
        String(
            usuario.perfil || ""
        ).toUpperCase();

    /*
     * Impede ADMIN de permanecer
     * no painel pessoal.
     */

    if (perfil === "ADMIN") {

        window.location.href =
            "index.html";

    }

}


/* =========================================
   ELEMENTOS
========================================= */

const nomeSidebar =
    document.getElementById(
        "sidebar-user-name"
    );

const tituloBoasVindas =
    document.getElementById(
        "welcome-title"
    );

const avatar =
    document.getElementById(
        "user-avatar"
    );

const logoutButton =
    document.getElementById(
        "logout-button"
    );

const settingsButton =
    document.getElementById(
        "settings-button"
    );

const aiButton =
    document.getElementById(
        "ai-floating-button"
    );

const aiWelcomeMessage =
    document.getElementById(
        "ai-welcome-message"
    );


/* =========================================
   NOME DO USUÁRIO
========================================= */

function primeiroNome(nome) {

    if (!nome) {
        return "Usuário";
    }

    return nome
        .trim()
        .split(/\s+/)[0];

}


function iniciaisUsuario(nome) {

    if (!nome) {
        return "U";
    }

    const partes =
        nome
            .trim()
            .split(/\s+/)
            .filter(Boolean);

    if (partes.length === 1) {

        return partes[0]
            .charAt(0)
            .toUpperCase();

    }

    return (
        partes[0].charAt(0) +
        partes[partes.length - 1].charAt(0)
    ).toUpperCase();

}


function carregarDadosUsuario() {

    if (!usuario) {
        return;
    }

    if (nomeSidebar) {

        nomeSidebar.textContent =
            usuario.nome ||
            "Usuário";

    }

    if (tituloBoasVindas) {

        tituloBoasVindas.textContent =
            `Olá, ${primeiroNome(usuario.nome)}.`;

    }

    if (avatar) {

        avatar.textContent =
            iniciaisUsuario(
                usuario.nome
            );

    }

}

carregarDadosUsuario();
carregarResumoUsuario();

async function carregarResumoUsuario() {

    try {

        const resposta =
            await fetch(
                `${API_URL}/sessoes/minhas`,
                {
                    method: "GET",

                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    }
                }
            );


        if (resposta.status === 401) {

            localStorage.removeItem(
                "ev_chargeops_token"
            );

            localStorage.removeItem(
                "ev_chargeops_usuario"
            );

            window.location.href =
                "login.html";

            return;

        }


if (!resposta.ok) {

    throw new Error(
        "Não foi possível carregar os dados do usuário."
    );

}


        const dados =
            await resposta.json();

            sessoesUsuario =
                dados.sessoes || [];

            renderizarHistoricoSessoes(
                sessoesUsuario
            );

        const consumo =
            document.getElementById(
                "metric-consumo"
            );

        const sessoes =
            document.getElementById(
                "metric-sessoes"
            );

        const valor =
            document.getElementById(
                "metric-valor"
            );

        const media =
            document.getElementById(
                "metric-media"
            );


        if (consumo) {

            consumo.textContent =
                `${Number(
                    dados.consumo_total_kwh || 0
                ).toFixed(1)} kWh`;

        }


        if (sessoes) {

            sessoes.textContent =
                dados.total_sessoes || 0;

        }


        if (valor) {

            valor.textContent =
                Number(
                    dados.valor_total || 0
                ).toLocaleString(
                    "pt-BR",
                    {
                        style:
                            "currency",

                        currency:
                            "BRL"
                    }
                );

        }


        if (media) {

            media.textContent =
                `${Number(
                    dados.media_consumo_kwh || 0
                ).toFixed(1)} kWh`;

        }


        carregarUltimasSessoes(
            dados.sessoes || []
        );

    }

    catch (erro) {

        console.error(
            "Erro ao carregar resumo:",
            erro
        );

    }

}

async function carregarRFIDUsuario() {

    try {

        const resposta =
            await fetch(
                `${API_URL}/rfid/meu`,
                {
                    method: "GET",

                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    }
                }
            );


        if (resposta.status === 401) {

            localStorage.removeItem(
                "ev_chargeops_token"
            );

            localStorage.removeItem(
                "ev_chargeops_usuario"
            );

            window.location.href =
                "login.html";

            return;

        }


        if (!resposta.ok) {

            throw new Error(
                "Não foi possível carregar o RFID."
            );

        }


        const dados =
            await resposta.json();


        const cartao =
            dados.cartao;


        const uidPrincipal =
            document.getElementById(
                "rfid-uid"
            );

        const statusBadge =
            document.getElementById(
                "rfid-status-badge"
            );

        const uidInfo =
            document.getElementById(
                "rfid-info-uid"
            );

        const statusInfo =
            document.getElementById(
                "rfid-info-status"
            );

        const dataInfo =
            document.getElementById(
                "rfid-info-date"
            );

        const vinculoInfo =
            document.getElementById(
                "rfid-info-link"
            );


        if (!cartao) {

            if (uidPrincipal) {
                uidPrincipal.textContent =
                    "Nenhum cartão";
            }

            if (statusBadge) {
                statusBadge.textContent =
                    "Não vinculado";
            }

            if (uidInfo) {
                uidInfo.textContent =
                    "--";
            }

            if (statusInfo) {
                statusInfo.textContent =
                    "--";
            }

            if (dataInfo) {
                dataInfo.textContent =
                    "--";
            }

            if (vinculoInfo) {
                vinculoInfo.textContent =
                    "Nenhum cartão vinculado";
            }

            return;

        }


        const status =
            String(
                cartao.status || ""
            ).toUpperCase();


        const dataCadastro =
            cartao.data_cadastro
                ? new Date(
                    cartao.data_cadastro
                ).toLocaleDateString(
                    "pt-BR"
                )
                : "--";


        if (uidPrincipal) {

            uidPrincipal.textContent =
                cartao.uid || "--";

        }


        if (statusBadge) {

            statusBadge.textContent =
                status || "--";

        }


        if (uidInfo) {

            uidInfo.textContent =
                cartao.uid || "--";

        }


        if (statusInfo) {

            statusInfo.textContent =
                status || "--";

        }


        if (dataInfo) {

            dataInfo.textContent =
                dataCadastro;

        }


        if (vinculoInfo) {

            vinculoInfo.textContent =
                "Vinculado à sua conta";

        }

    }

    catch (erro) {

        console.error(
            "Erro ao carregar RFID:",
            erro
        );

    }

}

function carregarUltimasSessoes(sessoes) {

    const container =
        document.getElementById(
            "recent-sessions-list"
        );

    if (!container) {
        return;
    }

    if (!sessoes || sessoes.length === 0) {

        container.innerHTML = `
            <div class="session-location">
                Nenhuma recarga encontrada.
            </div>
        `;

        return;

    }


    const ultimas =
        [...sessoes]
            .sort(
                (a, b) =>
                    new Date(b.inicio) -
                    new Date(a.inicio)
            )
            .slice(0, 3);


    container.innerHTML =
        ultimas.map(
            (sessao, indice) => {

                const data =
                    sessao.inicio
                        ? new Date(
                            sessao.inicio
                        )
                            .toLocaleDateString(
                                "pt-BR"
                            )
                        : "--";


                const consumo =
                    Number(
                        sessao.consumo_kwh || 0
                    )
                    .toFixed(1);


                const valor =
                    Number(
                        sessao.valor_total || 0
                    )
                    .toLocaleString(
                        "pt-BR",
                        {
                            style: "currency",
                            currency: "BRL"
                        }
                    );


                const status =
                    String(
                        sessao.status || ""
                    )
                    .toUpperCase();


                let statusClasse =
                    "desconhecido";

                let statusTexto =
                    "Status";


                if (
                    status === "FINALIZADA" ||
                    status === "CONCLUIDA"
                ) {

                    statusClasse =
                        "concluida";

                    statusTexto =
                        "Concluída";

                }
                else if (
                    status === "EM_ANDAMENTO" ||
                    status === "EM_RECARGA"
                ) {

                    statusClasse =
                        "em-andamento";

                    statusTexto =
                        "Em andamento";

                }


                const carregador =
                    sessao.carregador?.nome ||
                    sessao.carregador_nome ||
                    `Carregador #${sessao.carregador_id || "--"}`;


                return `
                    <div class="session-item">

                        <div class="session-top">

                            <div class="session-title">

                                <strong>
                                    Recarga #${indice + 1}
                                </strong>

                                <span class="session-date">
                                    ${data}
                                </span>

                            </div>


                            <span class="session-status ${statusClasse}">
                                ${statusTexto}
                            </span>

                        </div>


                        <div class="session-metrics">

                            <span class="session-chip">
                                ${consumo} kWh
                            </span>

                            <span class="session-chip">
                                ${valor}
                            </span>

                        </div>


                        <div class="session-location">
                            ${carregador}
                        </div>

                    </div>
                `;

            }
        )
        .join("");

}

function renderizarHistoricoSessoes(
    sessoes
) {

    const container =
        document.getElementById(
            "sessions-history-list"
        );
    const resumoTotal =
    document.getElementById(
        "sessions-summary-total"
    );

    const resumoConsumo =
        document.getElementById(
            "sessions-summary-consumo"
        );

    const resumoValor =
        document.getElementById(
            "sessions-summary-valor"
        );
    
    if (!container) {
        return;
    }

    const totalSessoes =
    sessoes?.length || 0;

    const consumoTotal =
        (sessoes || []).reduce(
            (total, sessao) =>
                total +
                Number(
                    sessao.consumo_kwh || 0
                ),
            0
        );

    const valorTotal =
        (sessoes || []).reduce(
            (total, sessao) =>
                total +
                Number(
                    sessao.valor_total || 0
                ),
            0
        );


    if (resumoTotal) {

        resumoTotal.textContent =
            totalSessoes;

    }


    if (resumoConsumo) {

        resumoConsumo.textContent =
            `${consumoTotal.toFixed(1)} kWh`;

    }


    if (resumoValor) {

        resumoValor.textContent =
            valorTotal.toLocaleString(
                "pt-BR",
                {
                    style: "currency",
                    currency: "BRL"
                }
            );

    }


    if (!sessoes || sessoes.length === 0) {

        container.innerHTML = `
            <div class="history-session-card">
                Nenhuma sessão encontrada.
            </div>
        `;

        return;

    }


    const ordenadas =
        [...sessoes]
            .sort(
                (a, b) =>
                    new Date(b.inicio) -
                    new Date(a.inicio)
            );


    container.innerHTML =
        ordenadas.map(
            sessao => {

                const data =
                    sessao.inicio
                        ? new Date(
                            sessao.inicio
                        ).toLocaleDateString(
                            "pt-BR"
                        )
                        : "--";


                const consumo =
                    Number(
                        sessao.consumo_kwh || 0
                    ).toFixed(1);


                const valor =
                    Number(
                        sessao.valor_total || 0
                    ).toLocaleString(
                        "pt-BR",
                        {
                            style: "currency",
                            currency: "BRL"
                        }
                    );


                const status =
                    String(
                        sessao.status || ""
                    ).toUpperCase();


                let statusTexto =
                    "Não informado";

                let statusClasse =
                    "desconhecido";


                if (
                    status === "FINALIZADA" ||
                    status === "CONCLUIDA"
                ) {

                    statusTexto =
                        "Concluída";

                    statusClasse =
                        "concluida";

                }
                else if (
                    status === "EM_ANDAMENTO" ||
                    status === "EM_RECARGA"
                ) {

                    statusTexto =
                        "Em andamento";

                    statusClasse =
                        "em-andamento";

                }


                const carregador =
                    sessao.carregador?.nome ||
                    sessao.carregador_nome ||
                    `Carregador #${sessao.carregador_id || "--"}`;


                return `
                    <div class="history-session-card">

                        <div class="history-session-top">

                            <div class="history-session-title">

                                <strong>
                                    ${carregador}
                                </strong>

                                <span>
                                    ${data}
                                </span>

                            </div>


                            <span class="session-status ${statusClasse}">
                                ${statusTexto}
                            </span>

                        </div>


                        <div class="history-session-info">

                            <div class="history-info-box">

                                <span>
                                    Consumo
                                </span>

                                <strong>
                                    ${consumo} kWh
                                </strong>

                            </div>


                            <div class="history-info-box">

                                <span>
                                    Valor
                                </span>

                                <strong>
                                    ${valor}
                                </strong>

                            </div>


                            <div class="history-info-box">

                                <span>
                                    Status
                                </span>

                                <strong>
                                    ${statusTexto}
                                </strong>

                            </div>

                        </div>

                    </div>
                `;

            }
        )
        .join("");

}

/* =========================================
   FILTROS - MINHAS SESSÕES
========================================= */

const filtrosSessoes =
    document.querySelectorAll(
        "[data-session-filter]"
    );


filtrosSessoes.forEach(
    botao => {

        botao.addEventListener(
            "click",
            () => {

                filtrosSessoes.forEach(
                    item => {
                        item.classList.remove(
                            "active"
                        );
                    }
                );


                botao.classList.add(
                    "active"
                );


                const filtro =
                    botao.dataset
                        .sessionFilter;


                let sessoesFiltradas =
                    [...sessoesUsuario];


                if (
                    filtro ===
                    "finalizadas"
                ) {

                    sessoesFiltradas =
                        sessoesUsuario.filter(
                            sessao => {

                                const status =
                                    String(
                                        sessao.status ||
                                        ""
                                    ).toUpperCase();

                                return (
                                    status ===
                                        "FINALIZADA" ||
                                    status ===
                                        "CONCLUIDA"
                                );

                            }
                        );

                }


                if (
                    filtro ===
                    "andamento"
                ) {

                    sessoesFiltradas =
                        sessoesUsuario.filter(
                            sessao => {

                                const status =
                                    String(
                                        sessao.status ||
                                        ""
                                    ).toUpperCase();

                                return (
                                    status ===
                                        "EM_ANDAMENTO" ||
                                    status ===
                                        "EM_RECARGA"
                                );

                            }
                        );

                }


                renderizarHistoricoSessoes(
                    sessoesFiltradas
                );

            }
        );

    }
);

/* =========================================
   NAVEGAÇÃO
========================================= */

function abrirPagina(nomePagina) {

    document
        .querySelectorAll(
            ".user-page"
        )
        .forEach(
            pagina => {

                pagina.classList.remove(
                    "active"
                );

            }
        );


    const paginaDestino =
        document.getElementById(
            `page-${nomePagina}`
        );

    if (paginaDestino) {

        paginaDestino.classList.add(
            "active"
        );

    }

    if (
        nomePagina ===
        "carregadores"
    ) {

        setTimeout(
            () => {

                iniciarMapaCarregadores();

            },
            100
        );

    }

    carregarResumoUsuario();

    if (nomePagina === "rfid") {
        carregarRFIDUsuario();
    }

    document
        .querySelectorAll(
            ".user-menu-item"
        )
        .forEach(
            item => {

                item.classList.remove(
                    "active"
                );

            }
        );


    const itemMenu =
        document.querySelector(
            `.user-menu-item[data-page="${nomePagina}"]`
        );

    if (itemMenu) {

        itemMenu.classList.add(
            "active"
        );

    }


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


/* MENU LATERAL */

document
    .querySelectorAll(
        ".user-menu-item"
    )
    .forEach(
        item => {

            item.addEventListener(
                "click",
                () => {

                    const pagina =
                        item.dataset.page;

                    abrirPagina(
                        pagina
                    );

                }
            );

        }
    );


/* ACESSOS RÁPIDOS */

document
    .querySelectorAll(
        "[data-open-page]"
    )
    .forEach(
        botao => {

            botao.addEventListener(
                "click",
                () => {

                    abrirPagina(
                        botao.dataset.openPage
                    );

                }
            );

        }
    );


/* =========================================
   CONFIGURAÇÕES
========================================= */

if (settingsButton) {

    settingsButton.addEventListener(
        "click",
        () => {

            alert(
                "As configurações da conta serão adicionadas nesta área."
            );

        }
    );

}


/* =========================================
   ASSISTENTE IA
========================================= */

function mostrarMensagemIA() {

    if (!aiWelcomeMessage) {
        return;
    }

    aiWelcomeMessage.classList.add(
        "show"
    );

}


function esconderMensagemIA() {

    if (!aiWelcomeMessage) {
        return;
    }

    aiWelcomeMessage.classList.remove(
        "show"
    );

}


/*
 * Mostra o aviso pouco depois
 * de o usuário entrar.
 */

setTimeout(
    () => {

        mostrarMensagemIA();

    },
    800
);


/*
 * Fecha automaticamente depois
 * de alguns segundos.
 */

setTimeout(
    () => {

        esconderMensagemIA();

    },
    7000
);


/* =========================================
   LOGOUT
========================================= */

if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        () => {

            localStorage.removeItem(
                "ev_chargeops_token"
            );

            localStorage.removeItem(
                "ev_chargeops_usuario"
            );

            window.location.href =
                "login.html";

        }
    );

}

/* =========================================
   MAPA DE CARREGADORES
========================================= */

let mapaCarregadores = null;
let marcadorUsuario = null;
let carregadorSelecionado = null;
let rotaAtual = null;

function atualizarPainelCarregador(
    carregador,
    latitude,
    longitude
) {

    carregadorSelecionado = {
        ...carregador,
        latitude,
        longitude
    };


    const nome =
        document.getElementById(
            "selected-charger-name"
        );

    const localizacao =
        document.getElementById(
            "selected-charger-location"
        );

    const status =
        document.getElementById(
            "selected-charger-status"
        );

    const distancia =
        document.getElementById(
            "selected-charger-distance"
        );

    const potencia =
        document.getElementById(
            "selected-charger-power"
        );

    const botaoRota =
        document.getElementById(
            "charger-route-button"
        );


    if (nome) {

        nome.textContent =
            carregador.nome ||
            "Carregador";

    }


    if (localizacao) {

        localizacao.textContent =
            carregador.localizacao ||
            "Localização não informada";

    }


    if (status) {

        status.textContent =
            carregador.status ||
            "Não informado";

    }


    if (potencia) {

        potencia.textContent =
            carregador.potencia_maxima
                ? `${Number(
                    carregador.potencia_maxima
                ).toFixed(1)} kW`
                : "--";

    }


    /* =====================================
       DISTÂNCIA
    ====================================== */

    if (
        distancia &&
        marcadorUsuario &&
        mapaCarregadores
    ) {

        const usuarioLatLng =
            marcadorUsuario.getLatLng();

        const metros =
            mapaCarregadores.distance(
                usuarioLatLng,
                [
                    latitude,
                    longitude
                ]
            );


        distancia.textContent =
            metros < 1000
                ? `${Math.round(metros)} m`
                : `${(
                    metros / 1000
                ).toFixed(1)} km`;

    }
    else if (distancia) {

        distancia.textContent =
            "Ative sua localização";

    }


    if (botaoRota) {

        botaoRota.disabled = false;

    }

}

async function iniciarMapaCarregadores() {

    if (mapaCarregadores) {

        setTimeout(
            () => {
                mapaCarregadores.invalidateSize();
            },
            100
        );

        return;
    }


    const elementoMapa =
        document.getElementById(
            "user-map"
        );

    const statusMapa =
        document.getElementById(
            "map-status"
        );


    if (!elementoMapa) {
        return;
    }


    if (typeof L === "undefined") {

        if (statusMapa) {

            statusMapa.textContent =
                "Não foi possível carregar o mapa.";

        }

        return;
    }


    /* -----------------------------------------
       CRIA O MAPA
    ----------------------------------------- */

    mapaCarregadores =
        L.map(
            "user-map"
        ).setView(
            [
                -23.5700,
                -46.6380
            ],
            13
        );

        const CARTO_API_KEY =
            "cb1_487w_1_d7f4e16b314bbc3679613787";

        L.tileLayer(
            `https://basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}.png?key=${CARTO_API_KEY}`,
            {
                attribution:
                    "&copy; OpenStreetMap contributors &copy; CARTO",

                maxZoom: 20
            }
        ).addTo(
            mapaCarregadores
        );


    /* -----------------------------------------
       BUSCA CARREGADORES
    ----------------------------------------- */

    try {

        const resposta =
            await fetch(
                `${API_URL}/carregadores/`,
                {
                    method: "GET",

                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );


        if (!resposta.ok) {

            throw new Error(
                "Erro ao carregar carregadores."
            );

        }


        const dados =
            await resposta.json();


        const carregadores =
            dados.carregadores || [];


        const pontosValidos =
            [];


        carregadores.forEach(
            carregador => {

                const latitude =
                    Number(
                        carregador.latitude
                    );

                const longitude =
                    Number(
                        carregador.longitude
                    );


                if (
                    !Number.isFinite(latitude) ||
                    !Number.isFinite(longitude)
                ) {

                    return;

                }


                pontosValidos.push(
                    [
                        latitude,
                        longitude
                    ]
                );


                /* ---------------------------------
                   MARCADOR DO CARREGADOR
                --------------------------------- */

                const marcador =
                    L.circleMarker(
                        [
                            latitude,
                            longitude
                        ],
                        {
                            radius: 9,

                            color:
                                "#8fa9ff",

                            weight: 3,

                            fillColor:
                                "#4f7cff",

                            fillOpacity:
                                0.85
                        }
                    );


                const status =
                    carregador.status ||
                    "Não informado";

                const potencia =
                    carregador.potencia_maxima
                        ? `${carregador.potencia_maxima} kW`
                        : "Não informada";

                const modelo =
                    carregador.modelo ||
                    "Não informado";


                marcador.bindPopup(`
                    <div class="charger-popup">

                        <strong>
                            ${carregador.nome}
                        </strong>

                        <p>
                            ${carregador.localizacao || ""}
                        </p>

                        <p>
                            <b>Status:</b>
                            ${status}
                        </p>

                        <p>
                            <b>Potência:</b>
                            ${potencia}
                        </p>

                        <p>
                            <b>Modelo:</b>
                            ${modelo}
                        </p>

                    </div>
                `);

                marcador.on(
                    "click",
                    () => {

                        atualizarPainelCarregador(
                            carregador,
                            latitude,
                            longitude
                        );

                    }
                );

                marcador.addTo(
                    mapaCarregadores
                );

            }
        );


        /* -----------------------------------------
           AJUSTA MAPA PARA MOSTRAR OS PONTOS
        ----------------------------------------- */

        if (
            pontosValidos.length > 0
        ) {

            mapaCarregadores.fitBounds(
                pontosValidos,
                {
                    padding:
                        [
                            60,
                            60
                        ],

                    maxZoom: 15
                }
            );

        }


        if (statusMapa) {

            statusMapa.textContent =
                `${pontosValidos.length} carregador(es) localizado(s)`;

        }

    }

    catch (erro) {

        console.error(
            "Erro no mapa:",
            erro
        );


        if (statusMapa) {

            statusMapa.textContent =
                "Não foi possível carregar os carregadores.";

        }

    }

}


/* =========================================
   LOCALIZAÇÃO DO USUÁRIO
========================================= */

const botaoLocalizacao =
    document.getElementById(
        "user-location-button"
    );


if (botaoLocalizacao) {

    botaoLocalizacao.addEventListener(
        "click",
        () => {

            const statusMapa =
                document.getElementById(
                    "map-status"
                );


            if (
                !navigator.geolocation
            ) {

                if (statusMapa) {

                    statusMapa.textContent =
                        "Seu navegador não permite geolocalização.";

                }

                return;
            }


            if (statusMapa) {

                statusMapa.textContent =
                    "Buscando sua localização...";

            }


            navigator.geolocation.getCurrentPosition(

                posicao => {

                    const latitude =
                        posicao.coords.latitude;

                    const longitude =
                        posicao.coords.longitude;


                    if (
                        marcadorUsuario
                    ) {

                        mapaCarregadores.removeLayer(
                            marcadorUsuario
                        );

                    }


                    marcadorUsuario =
                        L.circleMarker(
                            [
                                latitude,
                                longitude
                            ],
                            {
                                radius: 10,

                                color:
                                    "#ffffff",

                                weight: 3,

                                fillColor:
                                    "#4f7cff",

                                fillOpacity:
                                    1
                            }
                        )
                        .addTo(
                            mapaCarregadores
                        )
                        .bindPopup(
                            "<strong>Você está aqui</strong>"
                        )
                        .openPopup();


                    mapaCarregadores.setView(
                        [
                            latitude,
                            longitude
                        ],
                        14
                    );


                    if (statusMapa) {

                        statusMapa.textContent =
                            "Sua localização foi encontrada.";

                    }

                },


                erro => {

                    console.error(
                        "Erro de localização:",
                        erro
                    );


                    if (statusMapa) {

                        statusMapa.textContent =
                            "Não foi possível acessar sua localização.";

                    }

                },


                {
                    enableHighAccuracy:
                        true,

                    timeout:
                        10000,

                    maximumAge:
                        60000
                }

            );

        }
    );

}

/* =========================================
   TRAÇAR ROTA DENTRO DO MAPA
========================================= */

const botaoRota =
    document.getElementById(
        "charger-route-button"
    );


if (botaoRota) {

    botaoRota.addEventListener(
        "click",
        async () => {

            if (!carregadorSelecionado) {

                alert(
                    "Selecione um carregador no mapa primeiro."
                );

                return;

            }


            if (!marcadorUsuario) {

                alert(
                    "Primeiro clique no botão de localização para encontrarmos sua posição."
                );

                return;

            }


            const statusMapa =
                document.getElementById(
                    "map-status"
                );


            const origem =
                marcadorUsuario.getLatLng();


            const destinoLat =
                carregadorSelecionado.latitude;

            const destinoLng =
                carregadorSelecionado.longitude;


            if (statusMapa) {

                statusMapa.textContent =
                    "Calculando melhor rota...";

            }


            botaoRota.disabled =
                true;

            botaoRota.textContent =
                "Calculando rota...";


            try {

                /* =====================================
                   CONSULTA AO OSRM
                ====================================== */

                const url =
                    `https://router.project-osrm.org/route/v1/driving/` +
                    `${origem.lng},${origem.lat};` +
                    `${destinoLng},${destinoLat}` +
                    `?overview=full&geometries=geojson`;


                const resposta =
                    await fetch(
                        url
                    );


                if (!resposta.ok) {

                    throw new Error(
                        "Não foi possível calcular a rota."
                    );

                }


                const dados =
                    await resposta.json();


                if (
                    !dados.routes ||
                    dados.routes.length === 0
                ) {

                    throw new Error(
                        "Nenhuma rota encontrada."
                    );

                }


                const rota =
                    dados.routes[0];


                /* =====================================
                   REMOVE ROTA ANTERIOR
                ====================================== */

                if (rotaAtual) {

                    mapaCarregadores.removeLayer(
                        rotaAtual
                    );

                }


                /* =====================================
                   DESENHA ROTA
                ====================================== */

                rotaAtual =
                    L.geoJSON(
                        rota.geometry,
                        {
                            style: {
                                color:
                                    "#4f7cff",

                                weight:
                                    6,

                                opacity:
                                    0.9
                            }
                        }
                    )
                    .addTo(
                        mapaCarregadores
                    );


                /* =====================================
                   AJUSTA MAPA À ROTA
                ====================================== */

                mapaCarregadores.fitBounds(
                    rotaAtual.getBounds(),
                    {
                        padding:
                            [
                                50,
                                50
                            ]
                    }
                );


                /* =====================================
                   DISTÂNCIA E TEMPO
                ====================================== */

                const distanciaKm =
                    rota.distance /
                    1000;


                const minutos =
                    Math.round(
                        rota.duration /
                        60
                    );


                const distanciaPainel =
                    document.getElementById(
                        "selected-charger-distance"
                    );


                if (distanciaPainel) {

                    distanciaPainel.textContent =
                        `${distanciaKm.toFixed(1)} km`;

                }


                if (statusMapa) {

                    statusMapa.textContent =
                        `Rota calculada: ${distanciaKm.toFixed(1)} km · aproximadamente ${minutos} min`;

                }

            }

            catch (erro) {

                console.error(
                    "Erro ao traçar rota:",
                    erro
                );


                if (statusMapa) {

                    statusMapa.textContent =
                        "Não foi possível calcular a rota.";

                }

            }

            finally {

                botaoRota.disabled =
                    false;

                botaoRota.textContent =
                    "Traçar rota";

            }

        }
    );

}

/* =========================================
   ASSISTENTE EV
========================================= */

const assistantForm =
    document.getElementById(
        "user-ai-form"
    );

const assistantInput =
    document.getElementById(
        "user-ai-input"
    );

const assistantChat =
    document.getElementById(
        "user-ai-chat"
    );

function adicionarMensagemAssistente(
    texto,
    tipo = "assistant"
) {

    if (!assistantChat) {
        return;
    }


    const mensagem =
        document.createElement("div");


    mensagem.className =
        `user-ai-message ${tipo}`;


    if (tipo === "user") {

        mensagem.innerHTML = `
            <div class="user-ai-bubble">
                <p>${texto}</p>
            </div>
        `;

    } else {

        mensagem.innerHTML = `
            <div class="user-ai-avatar">
                ✦
            </div>

            <div class="user-ai-bubble">

                <strong>
                    Assistente EV
                </strong>

                <p>${texto}</p>

            </div>
        `;

    }


    assistantChat.appendChild(
        mensagem
    );


    assistantChat.scrollTop =
        assistantChat.scrollHeight;

}



function normalizarTexto(texto) {

    return String(texto || "")
        .normalize("NFD")
        .replace(
            /[\u0300-\u036f]/g,
            ""
        )
        .toLowerCase();

}



function formatarDinheiro(valor) {

    return Number(valor || 0)
        .toLocaleString(
            "pt-BR",
            {
                style: "currency",
                currency: "BRL"
            }
        );

}



function responderPerguntaUsuario(
    pergunta
) {

    const texto =
        normalizarTexto(pergunta);


    const sessoes =
        sessoesUsuario || [];


    if (sessoes.length === 0) {

        return (
            "Você ainda não possui sessões de " +
            "recarga registradas."
        );

    }


    /*
     * TOTAL GASTO
     */
    if (
        texto.includes("gastei") ||
        texto.includes("gasto") ||
        texto.includes("valor") ||
        texto.includes("paguei")
    ) {

        const total =
            sessoes.reduce(
                (soma, sessao) =>
                    soma +
                    Number(
                        sessao.valor_total || 0
                    ),
                0
            );


        return (
            `Até agora você gastou ` +
            `${formatarDinheiro(total)} ` +
            `em suas recargas.`
        );

    }


    /*
     * CONSUMO TOTAL
     */
    if (
        texto.includes("consumi") ||
        texto.includes("consumo") ||
        texto.includes("kwh") ||
        texto.includes("energia")
    ) {

        const consumo =
            sessoes.reduce(
                (soma, sessao) =>
                    soma +
                    Number(
                        sessao.consumo_kwh || 0
                    ),
                0
            );


        return (
            `Seu consumo total é de ` +
            `${consumo.toFixed(1)} kWh.`
        );

    }


    /*
     * QUANTIDADE DE RECARGAS
     */
    if (
        texto.includes("quantas") ||
        texto.includes("quantidade") ||
        texto.includes("sessoes") ||
        texto.includes("recargas fiz")
    ) {

        return (
            `Você possui ${sessoes.length} ` +
            `sessão${sessoes.length === 1 ? "" : "ões"} ` +
            `de recarga registrada${sessoes.length === 1 ? "" : "s"}.`
        );

    }


    /*
     * ÚLTIMA RECARGA
     */
    if (
        texto.includes("ultima") ||
        texto.includes("recente")
    ) {

        const ordenadas =
            [...sessoes].sort(
                (a, b) =>
                    new Date(b.inicio) -
                    new Date(a.inicio)
            );


        const ultima =
            ordenadas[0];


        const data =
            ultima.inicio
                ? new Date(
                    ultima.inicio
                ).toLocaleDateString(
                    "pt-BR"
                )
                : "--";


        const consumo =
            Number(
                ultima.consumo_kwh || 0
            ).toFixed(1);


        const valor =
            formatarDinheiro(
                ultima.valor_total
            );


        const carregador =
            ultima.carregador?.nome ||
            ultima.carregador_nome ||
            `Carregador #${
                ultima.carregador_id || "--"
            }`;


        return (
            `Sua última recarga foi em ${data}, ` +
            `no ${carregador}. ` +
            `Você consumiu ${consumo} kWh ` +
            `e o valor foi ${valor}.`
        );

    }


    /*
     * MÉDIA
     */
    if (
        texto.includes("media")
    ) {

        const consumoTotal =
            sessoes.reduce(
                (soma, sessao) =>
                    soma +
                    Number(
                        sessao.consumo_kwh || 0
                    ),
                0
            );


        const media =
            consumoTotal /
            sessoes.length;


        return (
            `Sua média de consumo é de ` +
            `${media.toFixed(1)} kWh ` +
            `por sessão.`
        );

    }


    /*
     * RESPOSTA PADRÃO
     */
    return (
        "Posso consultar informações sobre " +
        "seu consumo, gastos, quantidade de " +
        "recargas, média de consumo e sua " +
        "última sessão."
    );

}



async function enviarPerguntaAssistente(
    pergunta
) {

    pergunta =
        String(
            pergunta || ""
        ).trim();


    if (!pergunta) {
        return;
    }


    /* =========================================
       MOSTRA PERGUNTA DO USUÁRIO
    ========================================= */

    adicionarMensagemAssistente(
        "user",
        pergunta
    );


    /* =========================================
       LIMPA INPUT
    ========================================= */

    if (assistantInput) {

        assistantInput.value = "";

    }


    /* =========================================
       CONSULTA BACKEND
    ========================================= */

    const dados =
        await perguntarAssistenteBackend(
            pergunta
        );


    if (!dados) {
        return;
    }


    /* =========================================
       MOSTRA RESPOSTA
    ========================================= */

    adicionarMensagemAssistente(
        "assistant",
        dados.resposta
    );


    /* =========================================
       AVISO OPCIONAL
    ========================================= */

    if (dados.aviso) {

        adicionarMensagemAssistente(
            "assistant",
            dados.aviso
        );

    }
}



if (assistantForm) {

    assistantForm.addEventListener(
        "submit",
        evento => {

            evento.preventDefault();


            const pergunta =
                assistantInput.value;


            if (!pergunta.trim()) {
                return;
            }


            assistantInput.value = "";


            enviarPerguntaAssistente(
                pergunta
            );

        }
    );

}



document
    .querySelectorAll(
        "[data-ai-question]"
    )
    .forEach(botao => {

        botao.addEventListener(
            "click",
            () => {

                enviarPerguntaAssistente(
                    botao.dataset.aiQuestion
                );

            }
        );

    });

    const aiPanel =
    document.getElementById(
        "user-ai-panel"
    );

const aiOverlay =
    document.getElementById(
        "user-ai-overlay"
    );

const aiClose =
    document.getElementById(
        "user-ai-close"
    );

const openAiAssistant =
    document.getElementById(
        "open-ai-assistant"
    );


function abrirAssistenteIA() {

    if (aiPanel) {
        aiPanel.classList.add("show");
    }

    if (aiOverlay) {
        aiOverlay.classList.add("show");
    }

    esconderMensagemIA();

}


function fecharAssistenteIA() {

    if (aiPanel) {
        aiPanel.classList.remove("show");
    }

    if (aiOverlay) {
        aiOverlay.classList.remove("show");
    }

}


if (aiButton) {

    aiButton.addEventListener(
        "click",
        abrirAssistenteIA
    );

}


if (openAiAssistant) {

    openAiAssistant.addEventListener(
        "click",
        abrirAssistenteIA
    );

}


if (aiClose) {

    aiClose.addEventListener(
        "click",
        fecharAssistenteIA
    );

}


if (aiOverlay) {

    aiOverlay.addEventListener(
        "click",
        fecharAssistenteIA
    );

}

async function perguntarAssistenteBackend(
    pergunta
) {

    try {

        const resposta =
            await fetch(
                `${API_URL}/assistente-ia/perguntar`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",

                        "Authorization":
                            `Bearer ${token}`
                    },

                    body: JSON.stringify({
                        pergunta: pergunta
                    })
                }
            );


        /* =========================================
           TOKEN EXPIRADO
        ========================================= */

        if (resposta.status === 401) {

            localStorage.removeItem(
                "ev_chargeops_token"
            );

            localStorage.removeItem(
                "ev_chargeops_usuario"
            );

            window.location.href =
                "login.html";

            return null;
        }


        /* =========================================
           ERRO DE PERMISSÃO
        ========================================= */

        if (resposta.status === 403) {

            return {
                resposta:
                    "Você não tem permissão para consultar essa informação."
            };
        }


        /* =========================================
           OUTROS ERROS
        ========================================= */

        if (!resposta.ok) {

            const erro =
                await resposta
                    .json()
                    .catch(() => null);

            console.error(
                "Erro do assistente:",
                erro
            );

            throw new Error(
                "Não foi possível consultar o assistente."
            );
        }


        /* =========================================
           RESPOSTA
        ========================================= */

        const dados =
            await resposta.json();


        return dados;

    }

    catch (erro) {

        console.error(
            "Erro ao consultar Assistente EV:",
            erro
        );


        return {
            resposta:
                "Não consegui consultar seus dados agora. Tente novamente em alguns instantes."
        };
    }
}