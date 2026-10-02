const iniciarRateioUI = () => {

    const main =
        document.querySelector(".main");

    if (!main) {
        return;
    }


    let rateioCache = null;
    let graficoRateio = null;


    /* =========================================
       PÁGINA
    ========================================= */

    const paginaRateio =
        document.createElement("div");

    paginaRateio.id =
        "page-rateio";

    paginaRateio.className =
        "app-page";


    paginaRateio.innerHTML = `

        <header class="topbar">

            <div class="topbar-title">

                <span class="page-eyebrow">
                    Financeiro
                </span>

                <h1>
                    Rateio
                </h1>

                <p>
                    Distribuição do consumo e dos valores
                    entre os usuários do sistema.
                </p>

            </div>


            <div class="topbar-actions">

                <button
                    id="btn-atualizar-rateio"
                    class="primary-action"
                    type="button"
                >
                    Atualizar
                </button>

            </div>

        </header>


        <!-- RESUMO -->

        <section class="rateio-summary">

            <article class="metric-card">

                <div class="metric-top">

                    <span class="metric-caption">
                        Valor rateado
                    </span>

                </div>

                <div class="metric-value">

                    <strong id="rateio-total-value">
                        --
                    </strong>

                </div>

                <p>
                    Total das recargas
                </p>

            </article>


            <article class="metric-card">

                <div class="metric-top">

                    <span class="metric-caption">
                        Consumo
                    </span>

                </div>

                <div class="metric-value">

                    <strong id="rateio-total-consumption">
                        --
                    </strong>

                    <span>
                        kWh
                    </span>

                </div>

                <p>
                    Energia distribuída
                </p>

            </article>


            <article class="metric-card">

                <div class="metric-top">

                    <span class="metric-caption">
                        Usuários
                    </span>

                </div>

                <div class="metric-value">

                    <strong id="rateio-total-users">
                        --
                    </strong>

                </div>

                <p>
                    Usuários participantes
                </p>

            </article>


            <article class="metric-card">

                <div class="metric-top">

                    <span class="metric-caption">
                        Sessões
                    </span>

                </div>

                <div class="metric-value">

                    <strong id="rateio-total-sessions">
                        --
                    </strong>

                </div>

                <p>
                    Sessões contabilizadas
                </p>

            </article>

        </section>


        <!-- PERÍODO -->

        <section class="dashboard-card rateio-filter-card">

            <div class="card-heading">

                <div>

                    <span class="section-label">
                        Período
                    </span>

                    <h2>
                        Período do Rateio
                    </h2>

                    <p>
                        Escolha quais sessões serão
                        consideradas no cálculo.
                    </p>

                </div>

            </div>


            <div class="rateio-filters">

                <div class="form-group">

                    <label for="rateio-start">
                        Data inicial
                    </label>

                    <input
                        id="rateio-start"
                        type="date"
                    >

                </div>


                <div class="form-group">

                    <label for="rateio-end">
                        Data final
                    </label>

                    <input
                        id="rateio-end"
                        type="date"
                    >

                </div>


                <div class="rateio-filter-action">

                    <button
                        id="btn-filtrar-rateio"
                        class="primary-action"
                        type="button"
                    >
                        Aplicar período
                    </button>

                </div>

            </div>

        </section>


        <!-- GRÁFICO + INFORMAÇÕES -->

        <section class="dashboard-grid">

            <article class="dashboard-card">

                <div class="card-heading">

                    <div>

                        <span class="section-label">
                            Distribuição
                        </span>

                        <h2>
                            Consumo por Usuário
                        </h2>

                        <p>
                            Participação de cada usuário
                            no consumo total.
                        </p>

                    </div>

                </div>


                <div class="rateio-chart-container">

                    <canvas id="rateio-chart"></canvas>

                </div>

            </article>


            <article class="dashboard-card">

                <div class="card-heading">

                    <div>

                        <span class="section-label">
                            Indicadores
                        </span>

                        <h2>
                            Resumo do Rateio
                        </h2>

                    </div>

                </div>


                <div class="rateio-indicators">

                    <div>

                        <span>
                            Maior consumo
                        </span>

                        <strong id="rateio-highest-user">
                            --
                        </strong>

                    </div>


                    <div>

                        <span>
                            Maior consumo registrado
                        </span>

                        <strong id="rateio-highest-consumption">
                            --
                        </strong>

                    </div>


                    <div>

                        <span>
                            Média por usuário
                        </span>

                        <strong id="rateio-average-consumption">
                            --
                        </strong>

                    </div>


                    <div>

                        <span>
                            Valor médio
                        </span>

                        <strong id="rateio-average-value">
                            --
                        </strong>

                    </div>

                </div>

            </article>

        </section>


        <!-- TABELA -->

        <section class="dashboard-card">

            <div class="card-heading">

                <div>

                    <span class="section-label">
                        Detalhamento
                    </span>

                    <h2>
                        Rateio por Usuário
                    </h2>

                    <p id="rateio-result-count">
                        Carregando rateio...
                    </p>

                </div>

            </div>


            <div class="table-wrapper">

                <table class="rateio-table">

                    <thead>

                        <tr>

                            <th>
                                Usuário
                            </th>

                            <th>
                                Sessões
                            </th>

                            <th>
                                Consumo
                            </th>

                            <th>
                                Participação
                            </th>

                            <th>
                                Valor
                            </th>

                            <th>
                                Ações
                            </th>

                        </tr>

                    </thead>


                    <tbody id="rateio-list">

                        <tr>

                            <td colspan="6">
                                Carregando...
                            </td>

                        </tr>

                    </tbody>

                </table>

            </div>

        </section>


        <footer class="footer">

            EV ChargeOps • Gestão inteligente de recarga

        </footer>
    `;


    main.appendChild(
        paginaRateio
    );

    /* =========================================
   MODAL - DETALHES DO RATEIO
========================================= */

    const modalDetalhesRateio =
        document.createElement(
            "div"
        );

    modalDetalhesRateio.className =
        "modal-overlay";

    modalDetalhesRateio.id =
        "rateio-detail-modal";

    modalDetalhesRateio.innerHTML = `

        <div class="modal-card rateio-detail-modal">

            <div class="modal-header">

                <div>
                    <span class="section-label">
                        Financeiro
                    </span>

                    <h2>
                        Detalhes do Rateio
                    </h2>

                    <p>
                        Composição do consumo e do valor do usuário.
                    </p>
                </div>

                <button
                    id="fechar-detalhes-rateio"
                    class="modal-close"
                    type="button"
                    aria-label="Fechar"
                >
                    ×
                </button>

            </div>

            <div class="rateio-detail-profile">

                <div>
                    <strong id="detail-rateio-user">
                        --
                    </strong>

                    <span id="detail-rateio-period">
                        --
                    </span>
                </div>

            </div>

            <div class="rateio-detail-grid">

                <div>
                    <span>Sessões</span>
                    <strong id="detail-rateio-sessions">
                        --
                    </strong>
                </div>

                <div>
                    <span>Consumo</span>
                    <strong id="detail-rateio-consumption">
                        --
                    </strong>
                </div>

                <div>
                    <span>Participação</span>
                    <strong id="detail-rateio-share">
                        --
                    </strong>
                </div>

                <div>
                    <span>Valor</span>
                    <strong id="detail-rateio-value">
                        --
                    </strong>
                </div>

            </div>

            <div class="modal-actions">

                <button
                    id="fechar-detalhes-rateio-footer"
                    class="primary-action"
                    type="button"
                >
                    Fechar
                </button>

            </div>

        </div>

    `;

    document.body.appendChild(
        modalDetalhesRateio
    );


    /* =========================================
       MENU
    ========================================= */

    const botaoMenu =
        document.querySelector(
            '.menu-item[data-page="rateio"]'
        );


    if (botaoMenu) {

        botaoMenu.addEventListener(
            "click",
            () => {

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


                paginaRateio.classList.add(
                    "active"
                );


                carregarRateioCompleto();


                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });

            }
        );

    }


    /* =========================================
       PERÍODO PADRÃO
    ========================================= */

    function formatarDataInput(data) {

        const ano =
            data.getFullYear();


        const mes =
            String(
                data.getMonth() + 1
            ).padStart(
                2,
                "0"
            );


        const dia =
            String(
                data.getDate()
            ).padStart(
                2,
                "0"
            );


        return `${ano}-${mes}-${dia}`;

    }


    function configurarPeriodoPadrao() {

        const hoje =
            new Date();


        const inicio =
            new Date(
                hoje.getFullYear(),
                hoje.getMonth(),
                1
            );


        const fim =
            new Date(
                hoje.getFullYear(),
                hoje.getMonth() + 1,
                0
            );


        document.getElementById(
            "rateio-start"
        ).value =
            formatarDataInput(
                inicio
            );


        document.getElementById(
            "rateio-end"
        ).value =
            formatarDataInput(
                fim
            );

    }


    configurarPeriodoPadrao();


    function criarQueryPeriodo() {

        const inicio =
            document.getElementById(
                "rateio-start"
            ).value;


        const fim =
            document.getElementById(
                "rateio-end"
            ).value;


        const parametros =
            new URLSearchParams();


        if (inicio) {

            parametros.append(
                "inicio",
                `${inicio}T00:00:00`
            );

        }


        if (fim) {

            parametros.append(
                "fim",
                `${fim}T23:59:59`
            );

        }


        return parametros.toString();

    }


    /* =========================================
       CARREGAR
    ========================================= */

    async function carregarRateioCompleto() {

        const lista =
            document.getElementById(
                "rateio-list"
            );


        lista.innerHTML = `

            <tr>

                <td colspan="5">
                    Carregando rateio...
                </td>

            </tr>

        `;


        try {

            const query =
                criarQueryPeriodo();


            const token =
                localStorage.getItem(
                    "ev_chargeops_token"
                );

            const resposta =
                await fetch(
                    `${API_URL}/consumo/rateio-mensal?${query}`,
                    {
                        method: "GET",

                        headers: {
                            "Authorization":
                                `Bearer ${token}`
                        }
                    }
                );


            if (!resposta.ok) {

                throw new Error(
                    "Não foi possível carregar o rateio."
                );

            }


            rateioCache =
                await resposta.json();


            atualizarResumo();


            atualizarIndicadores();


            renderizarTabela();


            renderizarGrafico();


        } catch (erro) {

            console.error(
                "Erro rateio:",
                erro
            );


            lista.innerHTML = `

                <tr>

                    <td colspan="5">

                        <div class="sessions-empty error">

                            <strong>
                                Não foi possível carregar
                                o rateio.
                            </strong>

                            <span>
                                Verifique a conexão
                                com a API.
                            </span>

                        </div>

                    </td>

                </tr>

            `;

        }

    }


    /* =========================================
       RESUMO
    ========================================= */

    function atualizarResumo() {

        const usuarios =
            rateioCache?.usuarios ??
            [];


        const totalSessoes =
            usuarios.reduce(
                (
                    total,
                    usuario
                ) =>
                    total +
                    Number(
                        usuario.total_sessoes ??
                        0
                    ),
                0
            );


        document.getElementById(
            "rateio-total-value"
        ).textContent =
            `R$ ${Number(
                rateioCache?.valor_total ??
                0
            ).toFixed(2)}`;


        document.getElementById(
            "rateio-total-consumption"
        ).textContent =
            Number(
                rateioCache?.consumo_total_kwh ??
                0
            ).toFixed(2);


        document.getElementById(
            "rateio-total-users"
        ).textContent =
            rateioCache?.total_usuarios ??
            0;


        document.getElementById(
            "rateio-total-sessions"
        ).textContent =
            totalSessoes;

    }


    /* =========================================
       INDICADORES
    ========================================= */

    function atualizarIndicadores() {

        const usuarios =
            rateioCache?.usuarios ??
            [];


        if (
            usuarios.length === 0
        ) {

            document.getElementById(
                "rateio-highest-user"
            ).textContent =
                "--";


            document.getElementById(
                "rateio-highest-consumption"
            ).textContent =
                "--";


            document.getElementById(
                "rateio-average-consumption"
            ).textContent =
                "--";


            document.getElementById(
                "rateio-average-value"
            ).textContent =
                "--";


            return;

        }


        const maior =
            [...usuarios].sort(
                (a, b) =>
                    Number(
                        b.consumo_kwh
                    ) -
                    Number(
                        a.consumo_kwh
                    )
            )[0];


        const mediaConsumo =
            Number(
                rateioCache.consumo_total_kwh
            ) /
            usuarios.length;


        const mediaValor =
            Number(
                rateioCache.valor_total
            ) /
            usuarios.length;


        document.getElementById(
            "rateio-highest-user"
        ).textContent =
            maior.nome;


        document.getElementById(
            "rateio-highest-consumption"
        ).textContent =
            `${Number(
                maior.consumo_kwh
            ).toFixed(2)} kWh`;


        document.getElementById(
            "rateio-average-consumption"
        ).textContent =
            `${mediaConsumo.toFixed(2)} kWh`;


        document.getElementById(
            "rateio-average-value"
        ).textContent =
            `R$ ${mediaValor.toFixed(2)}`;

    }


    /* =========================================
       TABELA
    ========================================= */

    function renderizarTabela() {

        const lista =
            document.getElementById(
                "rateio-list"
            );


        const usuarios =
            rateioCache?.usuarios ??
            [];


        document.getElementById(
            "rateio-result-count"
        ).textContent =
            `${usuarios.length} usuário(s) no rateio`;


        if (
            usuarios.length === 0
        ) {

            lista.innerHTML = `

                <tr>

                    <td colspan="5">

                        <div class="sessions-empty">

                            <strong>
                                Nenhum dado para rateio
                            </strong>

                            <span>
                                Não existem sessões concluídas
                                no período selecionado.
                            </span>

                        </div>

                    </td>

                </tr>

            `;

            return;

        }


        lista.innerHTML =
            "";


        const consumoTotal =
            Number(
                rateioCache.consumo_total_kwh ??
                0
            );


        usuarios.forEach(
            usuario => {

                const consumo =
                    Number(
                        usuario.consumo_kwh ??
                        0
                    );


                const percentual =
                    consumoTotal > 0
                        ? (
                            consumo /
                            consumoTotal
                        ) * 100
                        : 0;


                const iniciais =
                    usuario.nome
                        .split(" ")
                        .filter(Boolean)
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
                                ${escapeHtml(
                                    usuario.nome
                                )}
                            </strong>

                        </div>

                    </td>


                    <td>
                        ${usuario.total_sessoes}
                    </td>


                    <td>

                        <strong>
                            ${consumo.toFixed(2)}
                            kWh
                        </strong>

                    </td>


                    <td>

                        <div class="rateio-share">

                            <div class="rateio-share-bar">

                                <span
                                    style="
                                        width:
                                        ${percentual}%;
                                    "
                                >
                                </span>

                            </div>

                            <strong>
                                ${percentual.toFixed(1)}%
                            </strong>

                        </div>

                    </td>


                    <td>

                        <strong class="rateio-value">

                            R$
                            ${Number(
                                usuario.valor_total ??
                                0
                            ).toFixed(2)}

                        </strong>

                    </td>

                    <td>

                        <button
                            class="rateio-detail-button"
                            type="button"
                            data-user-id="${usuario.usuario_id}"
                        >
                            Ver detalhes
                        </button>

                    </td>

                `;


                lista.appendChild(
                    linha
                );

            }
        );

    }


    /* =========================================
       GRÁFICO
    ========================================= */

    function renderizarGrafico() {

        const canvas =
            document.getElementById(
                "rateio-chart"
            );


        if (!canvas) {
            return;
        }


        const usuarios =
            rateioCache?.usuarios ??
            [];


        const labels =
            usuarios.map(
                usuario =>
                    usuario.nome
            );


        const valores =
            usuarios.map(
                usuario =>
                    Number(
                        usuario.consumo_kwh ??
                        0
                    )
            );


        const dark =
            document.body.classList.contains(
                "dark"
            );


        const corTexto =
            dark
                ? "#a4a6b3"
                : "#76798a";


        const corGrade =
            dark
                ? "rgba(255,255,255,0.06)"
                : "rgba(0,0,0,0.05)";


        if (graficoRateio) {

            graficoRateio.destroy();

        }


        graficoRateio =
            new Chart(
                canvas,
                {

                    type:
                        "bar",


                    data: {

                        labels,

                        datasets: [

                            {

                                label:
                                    "Consumo",

                                data:
                                    valores,

                                backgroundColor:
                                    dark
                                        ? "rgba(255,42,150,0.72)"
                                        : "rgba(230,0,126,0.72)",

                                borderColor:
                                    dark
                                        ? "#ff2a96"
                                        : "#e6007e",

                                borderWidth:
                                    1,

                                borderRadius:
                                    7

                            }

                        ]

                    },


                    options: {

                        responsive:
                            true,

                        maintainAspectRatio:
                            false,


                        plugins: {

                            legend: {

                                display:
                                    false

                            },


                            tooltip: {

                                displayColors:
                                    false,

                                callbacks: {

                                    label(
                                        contexto
                                    ) {

                                        return (
                                            `${contexto.raw} kWh`
                                        );

                                    }

                                }

                            }

                        },


                        scales: {

                            x: {

                                grid: {

                                    display:
                                        false

                                },

                                border: {

                                    display:
                                        false

                                },

                                ticks: {

                                    color:
                                        corTexto

                                }

                            },


                            y: {

                                beginAtZero:
                                    true,

                                border: {

                                    display:
                                        false

                                },

                                grid: {

                                    color:
                                        corGrade

                                },

                                ticks: {

                                    color:
                                        corTexto,

                                    callback(
                                        valor
                                    ) {

                                        return (
                                            `${valor} kWh`
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
    DETALHES DO RATEIO
    ========================================= */

    function abrirDetalhesRateio(usuario) {

        if (!usuario) {
            return;
        }

        const consumoTotal =
            Number(
                rateioCache?.consumo_total_kwh ??
                0
            );

        const consumoUsuario =
            Number(
                usuario.consumo_kwh ??
                0
            );

        const percentual =
            consumoTotal > 0
                ? (
                    consumoUsuario /
                    consumoTotal
                ) * 100
                : 0;

        const inicio =
            document.getElementById(
                "rateio-start"
            ).value;

        const fim =
            document.getElementById(
                "rateio-end"
            ).value;

        document.getElementById(
            "detail-rateio-user"
        ).textContent =
            usuario.nome ??
            "Usuário";

        document.getElementById(
            "detail-rateio-period"
        ).textContent =
            `${inicio || "--"} até ${fim || "--"}`;

        document.getElementById(
            "detail-rateio-sessions"
        ).textContent =
            usuario.total_sessoes ??
            0;

        document.getElementById(
            "detail-rateio-consumption"
        ).textContent =
            `${consumoUsuario.toFixed(2)} kWh`;

        document.getElementById(
            "detail-rateio-share"
        ).textContent =
            `${percentual.toFixed(1)}%`;

        document.getElementById(
            "detail-rateio-value"
        ).textContent =
            `R$ ${Number(
                usuario.valor_total ??
                0
            ).toFixed(2)}`;

        modalDetalhesRateio.classList.add(
            "show"
        );
    }

    function fecharDetalhesRateio() {

        modalDetalhesRateio.classList.remove(
            "show"
        );
    }

    document.addEventListener(
        "click",
        evento => {

            const botao =
                evento.target.closest(
                    ".rateio-detail-button"
                );

            if (!botao) {
                return;
            }

            const usuarioId =
                Number(
                    botao.dataset.userId
                );

            const usuario =
                rateioCache?.usuarios?.find(
                    item =>
                        Number(
                            item.usuario_id
                        ) === usuarioId
                );

            abrirDetalhesRateio(
                usuario
            );
        }
    );

    document.getElementById(
        "fechar-detalhes-rateio"
    ).addEventListener(
        "click",
        fecharDetalhesRateio
    );

    document.getElementById(
        "fechar-detalhes-rateio-footer"
    ).addEventListener(
        "click",
        fecharDetalhesRateio
    );

    modalDetalhesRateio.addEventListener(
        "click",
        evento => {

            if (
                evento.target ===
                modalDetalhesRateio
            ) {
                fecharDetalhesRateio();
            }
        }
    );
    
    /* =========================================
       EVENTOS
    ========================================= */

    document.getElementById(
        "btn-atualizar-rateio"
    ).addEventListener(
        "click",
        carregarRateioCompleto
    );


    document.getElementById(
        "btn-filtrar-rateio"
    ).addEventListener(
        "click",
        carregarRateioCompleto
    );


    const botaoTema =
        document.getElementById(
            "theme-toggle"
        );


    if (botaoTema) {

        botaoTema.addEventListener(
            "click",
            () => {

                setTimeout(
                    () => {

                        if (rateioCache) {

                            renderizarGrafico();

                        }

                    },
                    100
                );

            }
        );

    }

};


iniciarRateioUI();