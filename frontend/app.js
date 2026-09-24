const API_URL = "http://127.0.0.1:8000";

let graficoPrevisao = null;


/* =========================================
   UTILITÁRIOS
========================================= */

function escapeHtml(valor) {

    if (valor === null || valor === undefined) {
        return "";
    }

    return String(valor)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


/* =========================================
   TEMA
========================================= */

function aplicarTema(tema) {

    if (tema === "dark") {
        document.body.classList.add("dark");
    } else {
        document.body.classList.remove("dark");
    }

    localStorage.setItem(
        "evchargeops-theme",
        tema
    );

    atualizarGraficoTema();
}


function alternarTema() {

    const escuro =
        document.body.classList.contains(
            "dark"
        );

    aplicarTema(
        escuro
            ? "light"
            : "dark"
    );
}


function carregarTemaSalvo() {

    const tema =
        localStorage.getItem(
            "evchargeops-theme"
        );

    if (tema) {
        aplicarTema(tema);
        return;
    }

    const prefereEscuro =
        window.matchMedia &&
        window.matchMedia(
            "(prefers-color-scheme: dark)"
        ).matches;

    aplicarTema(
        prefereEscuro
            ? "dark"
            : "light"
    );
}


/* =========================================
   GRÁFICO - CORES
========================================= */

function obterCoresGrafico() {

    const dark =
        document.body.classList.contains(
            "dark"
        );

    return {
        linha: dark
            ? "#ff2a96"
            : "#e6007e",

        texto: dark
            ? "#a4a6b3"
            : "#858593",

        grade: dark
            ? "rgba(255,255,255,0.06)"
            : "rgba(0,0,0,0.05)",

        tooltip: dark
            ? "#2a2d38"
            : "#20202d",

        ponto: dark
            ? "#1d1f29"
            : "#ffffff"
    };
}


function atualizarGraficoTema() {

    if (!graficoPrevisao) {
        return;
    }

    const cores =
        obterCoresGrafico();

    const dataset =
        graficoPrevisao.data.datasets[0];

    dataset.borderColor =
        cores.linha;

    dataset.pointBorderColor =
        cores.linha;

    dataset.pointBackgroundColor =
        cores.ponto;

    graficoPrevisao.options
        .plugins
        .tooltip
        .backgroundColor =
        cores.tooltip;

    graficoPrevisao.options
        .scales
        .x
        .ticks
        .color =
        cores.texto;

    graficoPrevisao.options
        .scales
        .y
        .ticks
        .color =
        cores.texto;

    graficoPrevisao.options
        .scales
        .y
        .grid
        .color =
        cores.grade;

    graficoPrevisao.update();
}


/* =========================================
   API
========================================= */

async function verificarAPI() {

    const status =
        document.getElementById(
            "api-status"
        );

    if (!status) {
        return;
    }

    try {

        const resposta =
            await fetch(
                `${API_URL}/health`
            );

        if (!resposta.ok) {
            throw new Error();
        }

        status.className =
            "api-status online";

        status.innerHTML = `
            <span class="status-dot"></span>
            <span>Online</span>
        `;

    } catch (erro) {

        status.className =
            "api-status offline";

        status.innerHTML = `
            <span class="status-dot"></span>
            <span>Offline</span>
        `;
    }
}


/* =========================================
   DASHBOARD
========================================= */

async function carregarDashboard() {

    try {

        const resposta =
            await fetch(
                `${API_URL}/dashboard/resumo`
            );

        const dados =
            await resposta.json();

        document.getElementById(
            "consumo-total"
        ).textContent =
            dados.consumo_total_kwh ?? 0;

        document.getElementById(
            "valor-total"
        ).textContent =
            `R$ ${Number(
                dados.valor_total ?? 0
            ).toFixed(2)}`;

        document.getElementById(
            "total-sessoes"
        ).textContent =
            dados.sessoes_concluidas ?? 0;

        document.getElementById(
            "total-carregadores"
        ).textContent =
            dados.total_carregadores ?? 0;

    } catch (erro) {

        console.error(
            "Erro no dashboard:",
            erro
        );
    }
}


/* =========================================
   INDICADORES IA
========================================= */

async function carregarIndicadoresIA() {

    try {

        const resposta =
            await fetch(
                `${API_URL}/ia/indicadores?dias=7`
            );

        const dados =
            await resposta.json();

        document.getElementById(
            "previsao-consumo"
        ).textContent =
            dados.consumo_previsto_kwh ?? "--";

        document.getElementById(
            "horario-pico"
        ).textContent =
            dados.horario_pico_previsto ?? "--";

        document.getElementById(
            "nivel-demanda"
        ).textContent =
            dados.nivel_demanda ?? "--";

        document.getElementById(
            "total-anomalias"
        ).textContent =
            dados.total_anomalias ?? 0;

        document.getElementById(
            "nivel-atencao"
        ).textContent =
            dados.nivel_atencao ?? "NORMAL";

    } catch (erro) {

        console.error(
            "Erro na IA:",
            erro
        );
    }
}


/* =========================================
   PREVISÃO
========================================= */

async function carregarPrevisoes() {

    try {

        const resposta =
            await fetch(
                `${API_URL}/ia/previsao-consumo?dias=7`
            );

        const dados =
            await resposta.json();

        if (!dados.sucesso) {
            return;
        }

        const labels =
            dados.previsoes.map(
                item => {

                    const data =
                        new Date(
                            item.data
                        );

                    return (
                        `${String(
                            data.getDate()
                        ).padStart(2, "0")}/` +
                        `${String(
                            data.getMonth() + 1
                        ).padStart(2, "0")}`
                    );
                }
            );

        const valores =
            dados.previsoes.map(
                item =>
                    item.consumo_previsto_kwh
            );

        criarGrafico(
            labels,
            valores
        );

    } catch (erro) {

        console.error(
            "Erro na previsão:",
            erro
        );
    }
}


function criarGrafico(
    labels,
    valores
) {

    const canvas =
        document.getElementById(
            "grafico-consumo"
        );

    if (!canvas) {
        return;
    }

    const contexto =
        canvas.getContext("2d");

    const cores =
        obterCoresGrafico();

    const gradiente =
        contexto.createLinearGradient(
            0,
            0,
            0,
            260
        );

    gradiente.addColorStop(
        0,
        document.body.classList.contains(
            "dark"
        )
            ? "rgba(255,42,150,0.28)"
            : "rgba(230,0,126,0.25)"
    );

    gradiente.addColorStop(
        1,
        "rgba(230,0,126,0)"
    );

    if (graficoPrevisao) {
        graficoPrevisao.destroy();
    }

    graficoPrevisao =
        new Chart(
            contexto,
            {
                type: "line",

                data: {
                    labels,

                    datasets: [
                        {
                            data: valores,

                            borderColor:
                                cores.linha,

                            backgroundColor:
                                gradiente,

                            fill: true,

                            tension: 0.42,

                            borderWidth: 3,

                            pointRadius: 4,

                            pointHoverRadius: 6,

                            pointBackgroundColor:
                                cores.ponto,

                            pointBorderColor:
                                cores.linha,

                            pointBorderWidth: 2
                        }
                    ]
                },

                options: {
                    responsive: true,

                    maintainAspectRatio:
                        false,

                    interaction: {
                        intersect: false,
                        mode: "index"
                    },

                    plugins: {
                        legend: {
                            display: false
                        },

                        tooltip: {
                            backgroundColor:
                                cores.tooltip,

                            padding: 12,

                            displayColors:
                                false,

                            callbacks: {
                                label(context) {
                                    return (
                                        context.raw +
                                        " kWh"
                                    );
                                }
                            }
                        }
                    },

                    scales: {
                        x: {
                            grid: {
                                display: false
                            },

                            border: {
                                display: false
                            },

                            ticks: {
                                color:
                                    cores.texto
                            }
                        },

                        y: {
                            beginAtZero: true,

                            border: {
                                display: false
                            },

                            grid: {
                                color:
                                    cores.grade
                            },

                            ticks: {
                                color:
                                    cores.texto,

                                callback(valor) {
                                    return (
                                        valor +
                                        " kWh"
                                    );
                                }
                            }
                        }
                    }
                }
            }
        );
}


/* =========================================
   ANOMALIAS
========================================= */

async function carregarAnomalias() {

    try {

        const resposta =
            await fetch(
                `${API_URL}/ia/anomalias`
            );

        const dados =
            await resposta.json();

        const detalhe =
            document.getElementById(
                "detalhe-anomalia"
            );

        if (!dados.sucesso) {

            detalhe.textContent =
                dados.erro ??
                "Análise indisponível.";

            return;
        }

        document.getElementById(
            "total-anomalias"
        ).textContent =
            dados.total_anomalias;

        if (
            dados.total_anomalias === 0
        ) {

            detalhe.innerHTML = `
                <strong>
                    Nenhuma anomalia detectada
                </strong>
                <br><br>
                Todas as sessões analisadas
                estão dentro do padrão atual.
            `;

            return;
        }

        const anomalia =
            dados.anomalias[0];

        const motivos =
            anomalia.motivos?.length
                ? anomalia.motivos
                    .map(
                        motivo =>
                            `• ${escapeHtml(motivo)}`
                    )
                    .join("<br>")
                : "Comportamento diferente do histórico.";

        detalhe.innerHTML = `
            <strong>
                Sessão #${anomalia.sessao_id}
            </strong>

            <br><br>

            Consumo:
            <strong>
                ${anomalia.consumo_kwh} kWh
            </strong>

            <br>

            Duração:
            <strong>
                ${anomalia.duracao_minutos} min
            </strong>

            <br><br>

            ${motivos}
        `;

    } catch (erro) {

        console.error(
            "Erro nas anomalias:",
            erro
        );
    }
}


/* =========================================
   RATEIO
========================================= */

async function carregarRateio() {

    try {

        const resposta =
            await fetch(
                `${API_URL}/consumo/rateio-mensal`
            );

        const dados =
            await resposta.json();

        const tabela =
            document.getElementById(
                "tabela-rateio"
            );

        tabela.innerHTML = "";

        if (
            !dados.usuarios ||
            dados.usuarios.length === 0
        ) {

            tabela.innerHTML = `
                <tr>
                    <td colspan="4">
                        Nenhum consumo disponível.
                    </td>
                </tr>
            `;

            return;
        }

        dados.usuarios.forEach(
            usuario => {

                const iniciais =
                    usuario.nome
                        .split(" ")
                        .slice(0, 2)
                        .map(
                            nome =>
                                nome[0]
                        )
                        .join("")
                        .toUpperCase();

                const linha =
                    document.createElement(
                        "tr"
                    );

                linha.innerHTML = `
                    <td>
                        <div class="table-user">

                            <div class="table-avatar">
                                ${escapeHtml(iniciais)}
                            </div>

                            <strong>
                                ${escapeHtml(usuario.nome)}
                            </strong>

                        </div>
                    </td>

                    <td>
                        ${usuario.total_sessoes}
                    </td>

                    <td>
                        ${usuario.consumo_kwh} kWh
                    </td>

                    <td>
                        <strong>
                            R$ ${Number(
                                usuario.valor_total
                            ).toFixed(2)}
                        </strong>
                    </td>
                `;

                tabela.appendChild(
                    linha
                );
            }
        );

    } catch (erro) {

        console.error(
            "Erro no rateio:",
            erro
        );
    }
}


/* =========================================
   CRIAR PÁGINAS
========================================= */

function prepararPaginas() {

    const main =
        document.querySelector(
            ".main"
        );

    const filhos =
        Array.from(
            main.children
        );

    const paginaOverview =
        document.createElement(
            "div"
        );

    paginaOverview.id =
        "page-overview";

    paginaOverview.className =
        "app-page active";

    filhos.forEach(
        elemento => {

            paginaOverview.appendChild(
                elemento
            );
        }
    );

    main.appendChild(
        paginaOverview
    );


    const paginaCarregadores =
        document.createElement(
            "div"
        );

    paginaCarregadores.id =
        "page-chargers";

    paginaCarregadores.className =
        "app-page";

    paginaCarregadores.innerHTML = `
        <header class="topbar">

            <div class="topbar-title">

                <span class="page-eyebrow">
                    Infraestrutura
                </span>

                <h1>
                    Carregadores
                </h1>

                <p>
                    Visualize e acompanhe os equipamentos
                    cadastrados no EV ChargeOps.
                </p>

            </div>

            <div class="topbar-actions">

                <button
                    id="btn-atualizar-carregadores"
                    class="primary-action"
                    type="button"
                >
                    Atualizar
                </button>

            </div>

        </header>


        <section class="charger-summary">

            <article class="metric-card">

                <div class="metric-top">

                    <span class="metric-caption">
                        Total
                    </span>

                </div>

                <div class="metric-value">

                    <strong id="chargers-total">
                        --
                    </strong>

                </div>

                <p>
                    Carregadores cadastrados
                </p>

            </article>


            <article class="metric-card">

                <div class="metric-top">

                    <span class="metric-caption">
                        Ativos
                    </span>

                </div>

                <div class="metric-value">

                    <strong id="chargers-active">
                        --
                    </strong>

                </div>

                <p>
                    Disponíveis para operação
                </p>

            </article>


            <article class="metric-card">

                <div class="metric-top">

                    <span class="metric-caption">
                        Em recarga
                    </span>

                </div>

                <div class="metric-value">

                    <strong id="chargers-charging">
                        --
                    </strong>

                </div>

                <p>
                    Utilizados neste momento
                </p>

            </article>


            <article class="metric-card">

                <div class="metric-top">

                    <span class="metric-caption">
                        Offline
                    </span>

                </div>

                <div class="metric-value">

                    <strong id="chargers-offline">
                        --
                    </strong>

                </div>

                <p>
                    Equipamentos indisponíveis
                </p>

            </article>

        </section>


        <section class="dashboard-card">

            <div class="card-heading">

                <div>

                    <span class="section-label">
                        Equipamentos
                    </span>

                    <h2>
                        Infraestrutura de Recarga
                    </h2>

                    <p>
                        Informações dos carregadores registrados.
                    </p>

                </div>

            </div>


            <div
                id="charger-list"
                class="charger-grid"
            >

                <div class="charger-loading">
                    Carregando equipamentos...
                </div>

            </div>

        </section>


        <footer class="footer">

            EV ChargeOps • Gestão inteligente de recarga

        </footer>
    `;

    main.appendChild(
        paginaCarregadores
    );


    document.getElementById(
        "btn-atualizar-carregadores"
    ).addEventListener(
        "click",
        carregarCarregadores
    );
}


/* =========================================
   CARREGADORES
========================================= */

async function carregarCarregadores() {

    const lista =
        document.getElementById(
            "charger-list"
        );

    if (!lista) {
        return;
    }

    lista.innerHTML = `
        <div class="charger-loading">
            Carregando equipamentos...
        </div>
    `;

    try {

        const resposta =
            await fetch(
                `${API_URL}/carregadores/`
            );

        if (!resposta.ok) {
            throw new Error(
                "Erro ao buscar carregadores"
            );
        }

        const dados =
            await resposta.json();

        const carregadores =
            dados.carregadores ?? [];

        atualizarResumoCarregadores(
            carregadores
        );

        if (
            carregadores.length === 0
        ) {

            lista.innerHTML = `
                <div class="empty-state">

                    <strong>
                        Nenhum carregador cadastrado
                    </strong>

                    <p>
                        Cadastre o primeiro equipamento
                        para começar a operação.
                    </p>

                </div>
            `;

            return;
        }

        lista.innerHTML = "";

        carregadores.forEach(
            carregador => {

                const status =
                    (
                        carregador.status ??
                        "DESCONHECIDO"
                    )
                    .toUpperCase();

                let statusClasse =
                    "unknown";

                if (
                    status === "ATIVO"
                ) {
                    statusClasse =
                        "active";
                }

                if (
                    status === "EM_RECARGA"
                ) {
                    statusClasse =
                        "charging";
                }

                if (
                    status === "OFFLINE"
                ) {
                    statusClasse =
                        "offline";
                }

                const card =
                    document.createElement(
                        "article"
                    );

                card.className =
                    "charger-card";

                card.innerHTML = `

                    <div class="charger-card-header">

                        <div class="charger-symbol">

                            <svg viewBox="0 0 24 24">

                                <path
                                    d="M7 2h10v10h2a2 2 0 0 1 2 2v4
                                    a4 4 0 0 1-8 0v-1h2v1
                                    a2 2 0 1 0 4 0v-4h-2v3H7V2
                                    zm2 2v11h6V4H9z"
                                />

                            </svg>

                        </div>


                        <span
                            class="charger-status ${statusClasse}"
                        >
                            ${escapeHtml(status)}
                        </span>

                    </div>


                    <div class="charger-content">

                        <h3>
                            ${escapeHtml(
                                carregador.nome
                            )}
                        </h3>

                        <p>
                            ${escapeHtml(
                                carregador.localizacao ??
                                "Localização não informada"
                            )}
                        </p>

                    </div>


                    <div class="charger-info">

                        <div>

                            <span>
                                Serial GoodWe
                            </span>

                            <strong>
                                ${escapeHtml(
                                    carregador.serial_number ??
                                    "Não informado"
                                )}
                            </strong>

                        </div>


                        <div>

                            <span>
                                Modelo
                            </span>

                            <strong>
                                ${escapeHtml(
                                    carregador.modelo ??
                                    "Não informado"
                                )}
                            </strong>

                        </div>


                        <div>

                            <span>
                                Potência
                            </span>

                            <strong>
                                ${
                                    carregador.potencia_maxima
                                    ? `${carregador.potencia_maxima} kW`
                                    : "Não informada"
                                }
                            </strong>

                        </div>

                    </div>


                    <div class="charger-footer">

                        <span>
                            ID #${carregador.id}
                        </span>

                        <button
                            class="charger-detail-button"
                            type="button"
                            data-charger-id="${carregador.id}"
                        >
                            Ver detalhes
                        </button>

                    </div>
                `;

                lista.appendChild(
                    card
                );
            }
        );

    } catch (erro) {

        console.error(
            "Erro carregadores:",
            erro
        );

        lista.innerHTML = `
            <div class="empty-state error">

                <strong>
                    Não foi possível carregar
                    os equipamentos.
                </strong>

                <p>
                    Verifique se a FastAPI
                    está funcionando.
                </p>

            </div>
        `;
    }
}


function atualizarResumoCarregadores(
    carregadores
) {

    const total =
        carregadores.length;

    const ativos =
        carregadores.filter(
            item =>
                (
                    item.status ?? ""
                ).toUpperCase() ===
                "ATIVO"
        ).length;

    const carregando =
        carregadores.filter(
            item =>
                (
                    item.status ?? ""
                ).toUpperCase() ===
                "EM_RECARGA"
        ).length;

    const offline =
        carregadores.filter(
            item =>
                (
                    item.status ?? ""
                ).toUpperCase() ===
                "OFFLINE"
        ).length;

    document.getElementById(
        "chargers-total"
    ).textContent =
        total;

    document.getElementById(
        "chargers-active"
    ).textContent =
        ativos;

    document.getElementById(
        "chargers-charging"
    ).textContent =
        carregando;

    document.getElementById(
        "chargers-offline"
    ).textContent =
        offline;
}


/* =========================================
   NAVEGAÇÃO
========================================= */

function abrirPagina(nome) {

    document.querySelectorAll(
        ".app-page"
    ).forEach(
        pagina =>
            pagina.classList.remove(
                "active"
            )
    );

    const pagina =
        document.getElementById(
            `page-${nome}`
        );

    if (!pagina) {
        return;
    }

    pagina.classList.add(
        "active"
    );

    if (
        nome === "chargers"
    ) {
        carregarCarregadores();
    }

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


function configurarMenu() {

    const botoes =
        document.querySelectorAll(
            ".menu-item"
        );

    botoes.forEach(
        botao => {

            botao.addEventListener(
                "click",
                () => {

                    const pagina =
                        botao.dataset.page;

                    if (
                        pagina !== "overview" &&
                        pagina !== "chargers"
                    ) {

                        return;
                    }

                    botoes.forEach(
                        item =>
                            item.classList.remove(
                                "active"
                            )
                    );

                    botao.classList.add(
                        "active"
                    );

                    abrirPagina(
                        pagina
                    );
                }
            );
        }
    );
}


/* =========================================
   EVENTOS
========================================= */

function configurarEventos() {

    document.getElementById(
        "theme-toggle"
    ).addEventListener(
        "click",
        alternarTema
    );

    configurarMenu();
}


/* =========================================
   START
========================================= */

async function iniciarAplicacao() {

    prepararPaginas();

    carregarTemaSalvo();

    configurarEventos();

    verificarAPI();

    await Promise.all([
        carregarDashboard(),
        carregarIndicadoresIA(),
        carregarPrevisoes(),
        carregarAnomalias(),
        carregarRateio()
    ]);
}


iniciarAplicacao();