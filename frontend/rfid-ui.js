const iniciarRfidUI = () => {

    const main =
        document.querySelector(".main");


    if (!main) {

        return;

    }


    /* =========================================
       CONFIGURAÇÕES
    ========================================= */

    const RFID_API_URL =
        "http://127.0.0.1:8000";


    const cartoesDemo = [];


    let usuariosDisponiveis = [];


    function obterToken() {

        return localStorage.getItem(
            "ev_chargeops_token"
        );

    }


    function formatarDataRfid(data) {

        if (!data) {

            return "-";

        }


        return new Date(
            data
        ).toLocaleDateString(
            "pt-BR"
        );

    }


    /* =========================================
       PÁGINA RFID
    ========================================= */

    const paginaRfid =
        document.createElement("div");


    paginaRfid.id =
        "page-rfid";


    paginaRfid.className =
        "app-page";


    paginaRfid.innerHTML = `

        <header class="topbar">

            <div class="topbar-title">

                <span class="page-eyebrow">
                    Gestão de acesso
                </span>

                <h1>
                    Cartões RFID
                </h1>

                <p>
                    Identificação virtual de usuários
                    vinculados às sessões de recarga.
                </p>

            </div>


            <div class="topbar-actions">

                <button
                    id="btn-novo-rfid"
                    class="primary-action"
                    type="button"
                >
                    + Novo cartão
                </button>

            </div>

        </header>


        <section class="rfid-summary">

            <article class="metric-card">

                <div class="metric-top">

                    <span class="metric-caption">
                        Cartões cadastrados
                    </span>

                </div>


                <div class="metric-value">

                    <strong id="rfid-total">
                        --
                    </strong>

                </div>


                <p>
                    Identificações RFID registradas
                </p>

            </article>


            <article class="metric-card">

                <div class="metric-top">

                    <span class="metric-caption">
                        Cartões ativos
                    </span>

                </div>


                <div class="metric-value">

                    <strong id="rfid-active">
                        --
                    </strong>

                </div>


                <p>
                    Cartões disponíveis para uso
                </p>

            </article>


            <article class="metric-card">

                <div class="metric-top">

                    <span class="metric-caption">
                        Cartões bloqueados
                    </span>

                </div>


                <div class="metric-value">

                    <strong id="rfid-blocked">
                        --
                    </strong>

                </div>


                <p>
                    Identificações bloqueadas
                </p>

            </article>

        </section>


        <section class="dashboard-card rfid-section">

            <div class="rfid-filter-bar">

                <div class="form-group">

                    <label for="rfid-user-filter">
                        Filtrar por usuário
                    </label>


                    <select id="rfid-user-filter">

                        <option value="todos">
                            Todos os usuários
                        </option>

                    </select>

                </div>

            </div>


            <div class="card-heading">

                <div>

                    <span class="section-label">
                        Identificação digital
                    </span>

                    <h2>
                        Cartões virtuais
                    </h2>

                    <p>
                        Visualize os cartões vinculados
                        aos usuários do EV ChargeOps.
                    </p>

                </div>


                <span class="rfid-demo-badge">
                    Dados do sistema
                </span>

            </div>


            <div
                id="rfid-list"
                class="rfid-grid"
            >
            </div>

        </section>


        <footer class="footer">

            EV ChargeOps • Gestão inteligente de recarga

        </footer>

    `;


    main.appendChild(
        paginaRfid
    );


    /* =========================================
       MODAL DE DETALHES
    ========================================= */

    const modal =
        document.createElement("div");


    modal.className =
        "modal-overlay rfid-modal-overlay";


    modal.innerHTML = `

        <div class="modal-card rfid-detail-modal">

            <div class="modal-header">

                <div>

                    <span class="section-label">
                        Cartão RFID
                    </span>

                    <h2>
                        Dados do cartão
                    </h2>

                    <p>
                        Informações de identificação
                        e utilização.
                    </p>

                </div>


                <button
                    id="fechar-rfid-modal"
                    class="modal-close"
                    type="button"
                    aria-label="Fechar"
                >
                    ×
                </button>

            </div>


            <div id="rfid-detail-content">
            </div>

        </div>

    `;


    document.body.appendChild(
        modal
    );


    /* =========================================
       MODAL NOVO CARTÃO
    ========================================= */

    const modalCadastroRfid =
        document.createElement("div");


    modalCadastroRfid.className =
        "modal-overlay";


    modalCadastroRfid.innerHTML = `

        <div class="modal-card">

            <div class="modal-header">

                <div>

                    <span class="section-label">
                        Identificação RFID
                    </span>

                    <h2>
                        Novo cartão
                    </h2>

                    <p>
                        Vincule um cartão RFID
                        a um usuário.
                    </p>

                </div>


                <button
                    id="fechar-cadastro-rfid"
                    class="modal-close"
                    type="button"
                >
                    ×
                </button>

            </div>


            <form id="form-cadastro-rfid">

                <div class="form-grid">

                    <div class="form-group form-full">

                        <label for="cadastro-rfid-uid">
                            UID
                        </label>

                        <input
                            id="cadastro-rfid-uid"
                            type="text"
                            placeholder="EVC-RFID-0001"
                            required
                        >

                    </div>


                    <div class="form-group form-full">

                        <label for="cadastro-rfid-usuario">
                            Usuário
                        </label>

                        <select
                            id="cadastro-rfid-usuario"
                            required
                        >

                            <option value="">
                                Carregando usuários...
                            </option>

                        </select>

                    </div>


                    <div class="form-group form-full">

                        <label for="cadastro-rfid-status">
                            Status
                        </label>

                        <select
                            id="cadastro-rfid-status"
                        >

                            <option value="ATIVO">
                                Ativo
                            </option>

                            <option value="BLOQUEADO">
                                Bloqueado
                            </option>

                        </select>

                    </div>

                </div>


                <div
                    id="cadastro-rfid-mensagem"
                    class="form-message"
                >
                </div>


                <div class="modal-actions">

                    <button
                        id="cancelar-cadastro-rfid"
                        class="secondary-action"
                        type="button"
                    >
                        Cancelar
                    </button>


                    <button
                        class="primary-action"
                        type="submit"
                    >
                        Cadastrar cartão
                    </button>

                </div>

            </form>

        </div>

    `;


    document.body.appendChild(
        modalCadastroRfid
    );


    /* =========================================
       UTILITÁRIOS
    ========================================= */

    function ultimosDigitos(uid) {

        if (!uid) {

            return "----";

        }


        return uid
            .replace(/\D/g, "")
            .slice(-4)
            .padStart(
                4,
                "0"
            );

    }


    function iniciais(nome) {

        if (!nome) {

            return "EV";

        }


        return nome
            .split(" ")
            .filter(Boolean)
            .slice(0, 2)
            .map(
                parte =>
                    parte[0]
            )
            .join("")
            .toUpperCase();

    }


    function calcularProximoUid() {

        if (
            cartoesDemo.length === 0
        ) {

            return "EVC-RFID-0001";

        }


        const numeros =
            cartoesDemo.map(
                cartao => {

                    const resultado =
                        String(
                            cartao.uid
                        ).match(
                            /(\d+)$/
                        );


                    if (!resultado) {

                        return 0;

                    }


                    return Number(
                        resultado[1]
                    );

                }
            );


        const maiorNumero =
            Math.max(
                ...numeros
            );


        const proximo =
            maiorNumero + 1;


        return `EVC-RFID-${String(
            proximo
        ).padStart(
            4,
            "0"
        )}`;

    }


    /* =========================================
       CARREGAR USUÁRIOS
    ========================================= */

    async function carregarUsuariosRfid() {

        const token =
            obterToken();


        const select =
            document.getElementById(
                "cadastro-rfid-usuario"
            );


        if (!token) {

            select.innerHTML = `

                <option value="">
                    Sessão expirada
                </option>

            `;

            return;

        }


        try {

            const resposta =
                await fetch(
                    `${RFID_API_URL}/usuarios/`,
                    {
                        method: "GET",

                        headers: {

                            "Authorization":
                                `Bearer ${token}`

                        }
                    }
                );


            if (!resposta.ok) {

                select.innerHTML = `

                    <option value="">
                        Não foi possível carregar usuários
                    </option>

                `;

                return;

            }


            const dados =
                await resposta.json();


            usuariosDisponiveis =
                dados.usuarios || [];


            select.innerHTML = `

                <option value="">
                    Selecione um usuário
                </option>

            `;


            usuariosDisponiveis.forEach(
                usuario => {

                    const option =
                        document.createElement(
                            "option"
                        );


                    option.value =
                        usuario.id;


                    option.textContent =
                        `${usuario.nome} (${usuario.perfil})`;


                    select.appendChild(
                        option
                    );

                }
            );

        }

        catch (erro) {

            console.error(
                "Erro ao carregar usuários:",
                erro
            );


            select.innerHTML = `

                <option value="">
                    Erro ao carregar usuários
                </option>

            `;

        }

    }


    /* =========================================
       CARREGAR CARTÕES
    ========================================= */

    async function carregarCartoesRfid() {

        const token =
            obterToken();


        if (!token) {

            console.error(
                "Token de autenticação não encontrado."
            );

            return;

        }


        try {

            const resposta =
                await fetch(
                    `${RFID_API_URL}/rfid/`,
                    {
                        method: "GET",

                        headers: {

                            "Authorization":
                                `Bearer ${token}`

                        }
                    }
                );


            if (!resposta.ok) {

                const erro =
                    await resposta.json();


                console.error(
                    "Erro ao carregar RFID:",
                    erro
                );

                return;

            }


            const dados =
                await resposta.json();


            cartoesDemo.splice(
                0,
                cartoesDemo.length
            );


            dados.cartoes.forEach(
                cartao => {

                    cartoesDemo.push({

                        id:
                            cartao.id,

                        uid:
                            cartao.uid,

                        usuario_id:
                            cartao.usuario_id,

                        usuario:
                            cartao.usuario,

                        email:
                            cartao.email,

                        perfil:
                            cartao.perfil,

                        status:
                            cartao.status,

                        data_cadastro:
                            formatarDataRfid(
                                cartao.data_cadastro
                            ),

                        ultimo_uso:
                            "Nenhum uso registrado",

                        ultimo_carregador:
                            "Nenhum",

                        total_sessoes:
                            0

                    });

                }
            );


            atualizarFiltroUsuarios();


            renderizarCartoes();

        }

        catch (erro) {

            console.error(
                "Erro ao conectar com a API RFID:",
                erro
            );

        }

    }


    /* =========================================
       FILTRO
    ========================================= */

    function atualizarFiltroUsuarios() {

        const filtro =
            document.getElementById(
                "rfid-user-filter"
            );


        if (!filtro) {

            return;

        }


        const valorAtual =
            filtro.value;


        const nomesUsuarios =
            [
                ...new Set(
                    cartoesDemo.map(
                        cartao =>
                            cartao.usuario
                    )
                )
            ];


        filtro.innerHTML = `

            <option value="todos">
                Todos os usuários
            </option>

        `;


        nomesUsuarios.forEach(
            nome => {

                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    nome;


                option.textContent =
                    nome;


                filtro.appendChild(
                    option
                );

            }
        );


        const valorAindaExiste =
            [
                ...filtro.options
            ].some(
                option =>
                    option.value ===
                    valorAtual
            );


        if (valorAindaExiste) {

            filtro.value =
                valorAtual;

        }

        else {

            filtro.value =
                "todos";

        }

    }


    /* =========================================
       RENDERIZAR CARTÕES
    ========================================= */

    function renderizarCartoes() {

        const lista =
            document.getElementById(
                "rfid-list"
            );


        const filtro =
            document.getElementById(
                "rfid-user-filter"
            );


        const valorFiltro =
            filtro
                ? filtro.value
                : "todos";


        const cartoesFiltrados =
            valorFiltro === "todos"
                ? cartoesDemo
                : cartoesDemo.filter(
                    cartao =>
                        cartao.usuario ===
                        valorFiltro
                );


        lista.innerHTML =
            "";


        document.getElementById(
            "rfid-total"
        ).textContent =
            cartoesDemo.length;


        document.getElementById(
            "rfid-active"
        ).textContent =
            cartoesDemo.filter(
                cartao =>
                    cartao.status === "ATIVO"
            ).length;


        document.getElementById(
            "rfid-blocked"
        ).textContent =
            cartoesDemo.filter(
                cartao =>
                    cartao.status === "BLOQUEADO"
            ).length;


        if (
            cartoesFiltrados.length === 0
        ) {

            lista.innerHTML = `

                <div class="rfid-empty">

                    Nenhum cartão encontrado
                    para este usuário.

                </div>

            `;

            return;

        }


        cartoesFiltrados.forEach(
            cartao => {

                const artigo =
                    document.createElement(
                        "article"
                    );


                artigo.className =
                    "rfid-item";


                artigo.innerHTML = `

                    <div class="rfid-virtual-card">

                        <div class="rfid-card-top">

                            <div class="rfid-card-brand">

                                <span>
                                    EV
                                </span>

                                CHARGE<strong>OPS</strong>

                            </div>


                            <span class="rfid-card-type">
                                RFID ACCESS
                            </span>

                        </div>


                        <div class="rfid-chip">

                            <span></span>
                            <span></span>
                            <span></span>

                        </div>


                        <div class="rfid-number">

                            •••• •••• ••••
                            ${ultimosDigitos(
                                cartao.uid
                            )}

                        </div>


                        <div class="rfid-card-bottom">

                            <div>

                                <span class="rfid-small-label">
                                    TITULAR
                                </span>

                                <strong>
                                    ${escapeHtml(
                                        cartao.usuario
                                    )}
                                </strong>

                            </div>


                            <div>

                                <span class="rfid-small-label">
                                    PERFIL
                                </span>

                                <strong>
                                    ${escapeHtml(
                                        cartao.perfil
                                    )}
                                </strong>

                            </div>


                            <div
                                class="
                                    rfid-card-status
                                    ${
                                        cartao.status === "ATIVO"
                                            ? "active"
                                            : "blocked"
                                    }
                                "
                            >

                                <span></span>

                                ${escapeHtml(
                                    cartao.status
                                )}

                            </div>

                        </div>

                    </div>


                    <div class="rfid-card-info">

                        <div class="rfid-user">

                            <div class="rfid-user-avatar">

                                ${iniciais(
                                    cartao.usuario
                                )}

                            </div>


                            <div>

                                <strong>
                                    ${escapeHtml(
                                        cartao.usuario
                                    )}
                                </strong>

                                <span>
                                    ${escapeHtml(
                                        cartao.email
                                    )}
                                </span>

                            </div>

                        </div>


                        <div class="rfid-uid">

                            <span>
                                UID
                            </span>

                            <strong>
                                ${escapeHtml(
                                    cartao.uid
                                )}
                            </strong>

                        </div>


                        <button
                            class="secondary-action rfid-details-button"
                            type="button"
                            data-rfid-id="${cartao.id}"
                        >
                            Ver detalhes
                        </button>

                    </div>

                `;


                lista.appendChild(
                    artigo
                );

            }
        );


        document.querySelectorAll(
            ".rfid-details-button"
        ).forEach(
            botao => {

                botao.addEventListener(
                    "click",
                    () => {

                        const id =
                            Number(
                                botao.dataset.rfidId
                            );


                        const cartao =
                            cartoesDemo.find(
                                item =>
                                    item.id === id
                            );


                        if (cartao) {

                            abrirDetalhes(
                                cartao
                            );

                        }

                    }
                );

            }
        );

    }


    /* =========================================
       FILTRO AUTOMÁTICO
    ========================================= */

    const filtroUsuario =
        document.getElementById(
            "rfid-user-filter"
        );


    if (filtroUsuario) {

        filtroUsuario.addEventListener(
            "change",
            () => {

                renderizarCartoes();

            }
        );

    }


    /* =========================================
       DETALHES DO CARTÃO
    ========================================= */

    function abrirDetalhes(cartao) {

        const conteudo =
            document.getElementById(
                "rfid-detail-content"
            );


        conteudo.innerHTML = `

            <div class="rfid-detail-preview">

                <div class="rfid-detail-avatar">

                    ${iniciais(
                        cartao.usuario
                    )}

                </div>


                <div>

                    <span>
                        Titular
                    </span>

                    <strong>
                        ${escapeHtml(
                            cartao.usuario
                        )}
                    </strong>

                    <small>
                        ${escapeHtml(
                            cartao.email
                        )}
                    </small>

                </div>

            </div>


            <div class="rfid-detail-grid">

                <div>

                    <span>
                        UID RFID
                    </span>

                    <strong>
                        ${escapeHtml(
                            cartao.uid
                        )}
                    </strong>

                </div>


                <div>

                    <span>
                        Perfil
                    </span>

                    <strong>
                        ${escapeHtml(
                            cartao.perfil
                        )}
                    </strong>

                </div>


                <div>

                    <span>
                        Status
                    </span>

                    <strong class="rfid-detail-status">
                        ${escapeHtml(
                            cartao.status
                        )}
                    </strong>

                </div>


                <div>

                    <span>
                        Data de cadastro
                    </span>

                    <strong>
                        ${escapeHtml(
                            cartao.data_cadastro
                        )}
                    </strong>

                </div>


                <div>

                    <span>
                        Último uso
                    </span>

                    <strong>
                        ${escapeHtml(
                            cartao.ultimo_uso
                        )}
                    </strong>

                </div>


                <div>

                    <span>
                        Último carregador
                    </span>

                    <strong>
                        ${escapeHtml(
                            cartao.ultimo_carregador
                        )}
                    </strong>

                </div>


                <div>

                    <span>
                        Sessões vinculadas
                    </span>

                    <strong>
                        ${cartao.total_sessoes}
                    </strong>

                </div>

            </div>


            <div class="rfid-detail-actions">

                <button
                    id="btn-historico-rfid"
                    class="secondary-action"
                    type="button"
                    data-usuario-id="${cartao.usuario_id}"
                >
                    Histórico de uso
                </button>


                <button
                    id="btn-alterar-status-rfid"
                    class="danger-action"
                    type="button"
                    data-cartao-id="${cartao.id}"
                    data-status-atual="${cartao.status}"
                >
                    ${
                        cartao.status === "ATIVO"
                            ? "Bloquear cartão"
                            : "Reativar cartão"
                    }
                </button>

            </div>

        `;


        modal.classList.add(
            "show"
        );


        /* =========================================
           HISTÓRICO
        ========================================= */

        const botaoHistorico =
            document.getElementById(
                "btn-historico-rfid"
            );


        if (botaoHistorico) {

            botaoHistorico.addEventListener(
                "click",
                async () => {

                    await abrirHistoricoRfid(
                        cartao
                    );

                }
            );

        }


        /* =========================================
           BLOQUEAR / REATIVAR
        ========================================= */

        const botaoStatus =
            document.getElementById(
                "btn-alterar-status-rfid"
            );


        if (botaoStatus) {

            botaoStatus.addEventListener(
                "click",
                async () => {

                    const token =
                        obterToken();


                    const cartaoId =
                        Number(
                            botaoStatus.dataset.cartaoId
                        );


                    const statusAtual =
                        botaoStatus.dataset.statusAtual;


                    const novoStatus =
                        statusAtual === "ATIVO"
                            ? "BLOQUEADO"
                            : "ATIVO";


                    if (!token) {

                        alert(
                            "Sessão expirada. Faça login novamente."
                        );

                        return;

                    }


                    try {

                        botaoStatus.disabled =
                            true;


                        botaoStatus.textContent =
                            "Atualizando...";


                        const resposta =
                            await fetch(
                                `${RFID_API_URL}/rfid/${cartaoId}/status`,
                                {
                                    method:
                                        "PUT",

                                    headers: {

                                        "Content-Type":
                                            "application/json",

                                        "Authorization":
                                            `Bearer ${token}`

                                    },

                                    body:
                                        JSON.stringify({

                                            status:
                                                novoStatus

                                        })
                                }
                            );


                        const dados =
                            await resposta.json();


                        if (!resposta.ok) {

                            alert(
                                dados.detail ||
                                "Não foi possível alterar o status."
                            );


                            botaoStatus.disabled =
                                false;


                            botaoStatus.textContent =
                                statusAtual === "ATIVO"
                                    ? "Bloquear cartão"
                                    : "Reativar cartão";


                            return;

                        }


                        fecharModal();


                        await carregarCartoesRfid();

                    }

                    catch (erro) {

                        console.error(
                            "Erro ao alterar status RFID:",
                            erro
                        );


                        alert(
                            "Não foi possível conectar com o servidor."
                        );


                        botaoStatus.disabled =
                            false;

                    }

                }
            );

        }

    }


    /* =========================================
       HISTÓRICO RFID
    ========================================= */

    async function abrirHistoricoRfid(cartao) {

        const token =
            obterToken();


        if (!token) {

            alert(
                "Sessão expirada. Faça login novamente."
            );

            return;

        }


        const conteudo =
            document.getElementById(
                "rfid-detail-content"
            );


        conteudo.innerHTML = `

            <div class="rfid-history-loading">

                Carregando histórico...

            </div>

        `;


        try {

            const resposta =
                await fetch(
                    `${RFID_API_URL}/sessoes/usuario/${cartao.usuario_id}`,
                    {
                        method:
                            "GET",

                        headers: {

                            "Authorization":
                                `Bearer ${token}`

                        }
                    }
                );


            const dados =
                await resposta.json();


            if (!resposta.ok) {

                conteudo.innerHTML = `

                    <div class="rfid-empty">

                        Não foi possível carregar
                        o histórico.

                    </div>

                `;

                return;

            }


            const sessoes =
                dados.sessoes || [];


            if (
                sessoes.length === 0
            ) {

                conteudo.innerHTML = `

                    <div class="rfid-detail-preview">

                        <div class="rfid-detail-avatar">

                            ${iniciais(
                                cartao.usuario
                            )}

                        </div>


                        <div>

                            <span>
                                Histórico RFID
                            </span>

                            <strong>
                                ${escapeHtml(
                                    cartao.usuario
                                )}
                            </strong>

                            <small>
                                ${escapeHtml(
                                    cartao.uid
                                )}
                            </small>

                        </div>

                    </div>


                    <div class="rfid-empty">

                        Nenhuma sessão encontrada
                        para este usuário.

                    </div>


                    <div class="rfid-detail-actions">

                        <button
                            id="btn-voltar-rfid"
                            class="secondary-action"
                            type="button"
                        >
                            Voltar aos dados do cartão
                        </button>

                    </div>

                `;


                document.getElementById(
                    "btn-voltar-rfid"
                ).addEventListener(
                    "click",
                    () => {

                        abrirDetalhes(
                            cartao
                        );

                    }
                );


                return;

            }


            let htmlSessoes = "";

                sessoes.forEach(
                    sessao => {

                        const inicio =
                            sessao.inicio
                                ? new Date(
                                    sessao.inicio
                                ).toLocaleString("pt-BR")
                                : "-";

                        const fim =
                            sessao.fim
                                ? new Date(
                                    sessao.fim
                                ).toLocaleString("pt-BR")
                                : "-";

                        const consumo =
                            Number(
                                sessao.consumo_kwh || 0
                            ).toFixed(2);

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

                        const statusSessao =
                            (sessao.status || "-")
                                .toUpperCase();

                        const statusClass =
                            statusSessao === "CONCLUIDA"
                                ? "success"
                                : "neutral";

                        htmlSessoes += `

                            <article class="rfid-history-card">

                                <div class="rfid-history-card-header">

                                    <div>
                                        <span class="rfid-history-label">
                                            Sessão
                                        </span>

                                        <h3>
                                            #${sessao.id}
                                        </h3>
                                    </div>

                                    <span class="rfid-history-badge ${statusClass}">
                                        ${statusSessao}
                                    </span>

                                </div>

                                <div class="rfid-history-card-grid">

                                    <div class="rfid-history-info">
                                        <span>Início</span>
                                        <strong>${inicio}</strong>
                                    </div>

                                    <div class="rfid-history-info">
                                        <span>Fim</span>
                                        <strong>${fim}</strong>
                                    </div>

                                    <div class="rfid-history-info">
                                        <span>Consumo</span>
                                        <strong>${consumo} kWh</strong>
                                    </div>

                                    <div class="rfid-history-info">
                                        <span>Valor</span>
                                        <strong>${valor}</strong>
                                    </div>

                                    <div class="rfid-history-info">
                                        <span>Carregador</span>
                                        <strong>#${sessao.carregador_id}</strong>
                                    </div>

                                </div>

                            </article>

                        `;

                    }
                );

                const consumoTotal =
                    Number(
                        dados.consumo_total_kwh || 0
                    ).toFixed(2);

                const valorTotal =
                    Number(
                        dados.valor_total || 0
                    ).toLocaleString(
                        "pt-BR",
                        {
                            style: "currency",
                            currency: "BRL"
                        }
                    );

                conteudo.innerHTML = `

                    <div class="rfid-history-page">

                        <div class="rfid-history-hero">

                            <div class="rfid-detail-preview">

                                <div class="rfid-detail-avatar">
                                    ${iniciais(cartao.usuario)}
                                </div>

                                <div>
                                    <span>Histórico RFID</span>

                                    <strong>
                                        ${escapeHtml(cartao.usuario)}
                                    </strong>

                                    <small>
                                        Cartão ${escapeHtml(cartao.uid)}
                                    </small>
                                </div>

                            </div>

                        </div>

                        <div class="rfid-history-summary-grid">

                            <article class="rfid-history-summary-card">
                                <span>Total de sessões</span>
                                <strong>${dados.total_sessoes || 0}</strong>
                            </article>

                            <article class="rfid-history-summary-card">
                                <span>Consumo total</span>
                                <strong>${consumoTotal} kWh</strong>
                            </article>

                            <article class="rfid-history-summary-card">
                                <span>Valor acumulado</span>
                                <strong>${valorTotal}</strong>
                            </article>

                        </div>

                        <div class="rfid-history-list">
                            ${htmlSessoes}
                        </div>

                        <div class="rfid-detail-actions">
                            <button
                                id="btn-voltar-rfid"
                                class="secondary-action"
                                type="button"
                            >
                                Voltar aos dados do cartão
                            </button>
                        </div>

                    </div>

                `;

                document.getElementById(
                    "btn-voltar-rfid"
                ).addEventListener(
                    "click",
                    () => {
                        abrirDetalhes(cartao);
                    }
                );

        }

        catch (erro) {

            console.error(
                "Erro ao carregar histórico RFID:",
                erro
            );


            conteudo.innerHTML = `

                <div class="rfid-empty">

                    Não foi possível conectar
                    com o servidor.

                </div>


                <div class="rfid-detail-actions">

                    <button
                        id="btn-voltar-rfid"
                        class="secondary-action"
                        type="button"
                    >
                        Voltar
                    </button>

                </div>

            `;


            document.getElementById(
                "btn-voltar-rfid"
            ).addEventListener(
                "click",
                () => {

                    abrirDetalhes(
                        cartao
                    );

                }
            );

        }

    }


    /* =========================================
       FECHAR MODAL
    ========================================= */

    function fecharModal() {

        modal.classList.remove(
            "show"
        );

    }


    document.getElementById(
        "fechar-rfid-modal"
    ).addEventListener(
        "click",
        fecharModal
    );


    modal.addEventListener(
        "click",
        evento => {

            if (
                evento.target ===
                modal
            ) {

                fecharModal();

            }

        }
    );


    /* =========================================
       ABRIR CADASTRO
    ========================================= */

    async function abrirCadastro() {

        document.getElementById(
            "cadastro-rfid-mensagem"
        ).textContent =
            "";


        await carregarUsuariosRfid();


        document.getElementById(
            "cadastro-rfid-uid"
        ).value =
            calcularProximoUid();


        document.getElementById(
            "cadastro-rfid-status"
        ).value =
            "ATIVO";


        modalCadastroRfid.classList.add(
            "show"
        );

    }


    /* =========================================
       FECHAR CADASTRO
    ========================================= */

    function fecharCadastro() {

        modalCadastroRfid.classList.remove(
            "show"
        );


        document.getElementById(
            "form-cadastro-rfid"
        ).reset();


        document.getElementById(
            "cadastro-rfid-mensagem"
        ).textContent =
            "";

    }


    /* =========================================
       BOTÃO NOVO CARTÃO
    ========================================= */

    document.getElementById(
        "btn-novo-rfid"
    ).addEventListener(
        "click",
        abrirCadastro
    );


    /* =========================================
       FECHAR MODAL CADASTRO
    ========================================= */

    document.getElementById(
        "fechar-cadastro-rfid"
    ).addEventListener(
        "click",
        fecharCadastro
    );


    document.getElementById(
        "cancelar-cadastro-rfid"
    ).addEventListener(
        "click",
        fecharCadastro
    );


    modalCadastroRfid.addEventListener(
        "click",
        evento => {

            if (
                evento.target ===
                modalCadastroRfid
            ) {

                fecharCadastro();

            }

        }
    );


    /* =========================================
       CADASTRAR CARTÃO
    ========================================= */

    document.getElementById(
        "form-cadastro-rfid"
    ).addEventListener(
        "submit",
        async evento => {

            evento.preventDefault();


            const uid =
                document.getElementById(
                    "cadastro-rfid-uid"
                ).value.trim();


            const selectUsuario =
                document.getElementById(
                    "cadastro-rfid-usuario"
                );


            const status =
                document.getElementById(
                    "cadastro-rfid-status"
                ).value;


            const mensagem =
                document.getElementById(
                    "cadastro-rfid-mensagem"
                );


            if (
                !uid ||
                !selectUsuario.value
            ) {

                mensagem.textContent =
                    "Informe o UID e selecione um usuário.";

                mensagem.style.color =
                    "var(--danger)";

                return;

            }


            const uidExistente =
                cartoesDemo.some(
                    cartao =>
                        cartao.uid.toUpperCase() ===
                        uid.toUpperCase()
                );


            if (uidExistente) {

                mensagem.textContent =
                    "Este UID já está cadastrado.";

                mensagem.style.color =
                    "var(--danger)";

                return;

            }


            const token =
                obterToken();


            if (!token) {

                mensagem.textContent =
                    "Sessão expirada. Faça login novamente.";

                mensagem.style.color =
                    "var(--danger)";

                return;

            }


            try {

                const resposta =
                    await fetch(
                        `${RFID_API_URL}/rfid/`,
                        {
                            method:
                                "POST",

                            headers: {

                                "Content-Type":
                                    "application/json",

                                "Authorization":
                                    `Bearer ${token}`

                            },

                            body:
                                JSON.stringify({

                                    uid:
                                        uid,

                                    usuario_id:
                                        Number(
                                            selectUsuario.value
                                        ),

                                    status:
                                        status

                                })
                        }
                    );


                const dados =
                    await resposta.json();


                if (!resposta.ok) {

                    mensagem.textContent =
                        dados.detail ||
                        "Não foi possível cadastrar o cartão.";

                    mensagem.style.color =
                        "var(--danger)";

                    return;

                }


                mensagem.textContent =
                    "Cartão cadastrado com sucesso.";

                mensagem.style.color =
                    "#51d592";


                await carregarCartoesRfid();


                setTimeout(
                    fecharCadastro,
                    700
                );

            }

            catch (erro) {

                console.error(
                    "Erro ao cadastrar RFID:",
                    erro
                );


                mensagem.textContent =
                    "Não foi possível conectar com o servidor.";

                mensagem.style.color =
                    "var(--danger)";

            }

        }
    );


    /* =========================================
       MENU
    ========================================= */

    const botaoMenu =
        document.querySelector(
            '.menu-item[data-page="rfid"]'
        );


    if (botaoMenu) {

        botaoMenu.addEventListener(
            "click",
            async () => {

                document.querySelectorAll(
                    ".menu-item"
                ).forEach(
                    item =>
                        item.classList.remove(
                            "active"
                        )
                );


                botaoMenu.classList.add(
                    "active"
                );


                document.querySelectorAll(
                    ".app-page"
                ).forEach(
                    pagina =>
                        pagina.classList.remove(
                            "active"
                        )
                );


                paginaRfid.classList.add(
                    "active"
                );


                await carregarCartoesRfid();


                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });

            }
        );

    }


    /* =========================================
       INICIALIZAÇÃO
    ========================================= */

    carregarCartoesRfid();

};


iniciarRfidUI();