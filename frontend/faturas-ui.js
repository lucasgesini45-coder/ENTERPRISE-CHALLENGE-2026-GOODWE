const iniciarFaturasUI = () => {

    const main =
        document.querySelector(".main");

    if (!main) {
        return;
    }


    let usuariosCache = [];
    let rateioCache = null;


    /* =========================================
       PÁGINA DE FATURAS
    ========================================= */

    const paginaFaturas =
        document.createElement("div");

    paginaFaturas.id =
        "page-invoices";

    paginaFaturas.className =
        "app-page";


    paginaFaturas.innerHTML = `

        <header class="topbar">

            <div class="topbar-title">

                <span class="page-eyebrow">
                    Financeiro
                </span>

                <h1>
                    Faturas
                </h1>

                <p>
                    Consulte o consumo, os valores
                    e as faturas dos usuários.
                </p>

            </div>


            <div class="topbar-actions">

                <button
                    id="btn-atualizar-faturas"
                    class="primary-action"
                    type="button"
                >
                    Atualizar
                </button>

            </div>

        </header>


        <!-- =====================================
             RESUMO
        ====================================== -->

        <section class="invoice-summary">


            <article class="metric-card">

                <div class="metric-top">

                    <span class="metric-caption">
                        Faturamento
                    </span>

                </div>

                <div class="metric-value">

                    <strong id="invoice-total-value">
                        --
                    </strong>

                </div>

                <p>
                    Valor total do período
                </p>

            </article>


            <article class="metric-card">

                <div class="metric-top">

                    <span class="metric-caption">
                        Usuários
                    </span>

                </div>

                <div class="metric-value">

                    <strong id="invoice-total-users">
                        --
                    </strong>

                </div>

                <p>
                    Usuários faturados
                </p>

            </article>


            <article class="metric-card">

                <div class="metric-top">

                    <span class="metric-caption">
                        Sessões
                    </span>

                </div>

                <div class="metric-value">

                    <strong id="invoice-total-sessions">
                        --
                    </strong>

                </div>

                <p>
                    Sessões faturadas
                </p>

            </article>


            <article class="metric-card">

                <div class="metric-top">

                    <span class="metric-caption">
                        Consumo
                    </span>

                </div>

                <div class="metric-value">

                    <strong id="invoice-total-consumption">
                        --
                    </strong>

                    <span>
                        kWh
                    </span>

                </div>

                <p>
                    Energia faturada
                </p>

            </article>


        </section>


        <!-- =====================================
             FILTRO DE PERÍODO
        ====================================== -->

        <section class="dashboard-card invoice-filter-card">

            <div class="card-heading">

                <div>

                    <span class="section-label">
                        Período
                    </span>

                    <h2>
                        Consulta Financeira
                    </h2>

                    <p>
                        Escolha o período das recargas
                        que deseja faturar.
                    </p>

                </div>

            </div>


            <div class="invoice-filters">


                <div class="form-group">

                    <label for="invoice-start">
                        Data inicial
                    </label>

                    <input
                        id="invoice-start"
                        type="date"
                    >

                </div>


                <div class="form-group">

                    <label for="invoice-end">
                        Data final
                    </label>

                    <input
                        id="invoice-end"
                        type="date"
                    >

                </div>


                <div class="invoice-filter-action">

                    <button
                        id="btn-filtrar-faturas"
                        class="primary-action"
                        type="button"
                    >
                        Aplicar período
                    </button>

                </div>


            </div>

        </section>


        <!-- =====================================
             TABELA
        ====================================== -->

        <section class="dashboard-card">

            <div class="card-heading">

                <div>

                    <span class="section-label">
                        Cobranças
                    </span>

                    <h2>
                        Faturas por Usuário
                    </h2>

                    <p id="invoice-result-count">
                        Carregando faturas...
                    </p>

                </div>

            </div>


            <div class="table-wrapper">

                <table class="invoice-table">

                    <thead>

                        <tr>

                            <th>
                                Usuário
                            </th>

                            <th>
                                Período
                            </th>

                            <th>
                                Sessões
                            </th>

                            <th>
                                Consumo
                            </th>

                            <th>
                                Valor
                            </th>

                            <th>
                                Ações
                            </th>

                        </tr>

                    </thead>


                    <tbody id="invoice-list">

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
        paginaFaturas
    );


    /* =========================================
       MODAL DA FATURA
    ========================================= */

    const modal =
        document.createElement("div");

    modal.className =
        "modal-overlay";


    modal.innerHTML = `

        <div class="modal-card invoice-modal">

            <div class="modal-header">

                <div>

                    <span class="section-label">
                        EV ChargeOps
                    </span>

                    <h2>
                        Detalhes da Fatura
                    </h2>

                    <p id="invoice-modal-number">
                        Carregando...
                    </p>

                </div>


                <button
                    id="fechar-modal-fatura"
                    class="modal-close"
                    type="button"
                >
                    ×
                </button>

            </div>


            <div id="invoice-modal-content">

                Carregando fatura...

            </div>

        </div>
    `;


    document.body.appendChild(
        modal
    );


    /* =========================================
       MENU
    ========================================= */

    const botaoMenu =
        document.querySelector(
            '.menu-item[data-page="invoices"]'
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


                paginaFaturas.classList.add(
                    "active"
                );


                carregarFaturas();


                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });

            }
        );

    }


    /* =========================================
       DATAS PADRÃO
    ========================================= */

    function configurarPeriodoPadrao() {

        const hoje =
            new Date();


        const ano =
            hoje.getFullYear();


        const mes =
            hoje.getMonth();


        const inicio =
            new Date(
                ano,
                mes,
                1
            );


        const fim =
            new Date(
                ano,
                mes + 1,
                0
            );


        document.getElementById(
            "invoice-start"
        ).value =
            formatarDataInput(
                inicio
            );


        document.getElementById(
            "invoice-end"
        ).value =
            formatarDataInput(
                fim
            );

    }


    function formatarDataInput(
        data
    ) {

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


    configurarPeriodoPadrao();


    /* =========================================
       PERÍODO
    ========================================= */

    function obterPeriodo() {

        const inicio =
            document.getElementById(
                "invoice-start"
            ).value;


        const fim =
            document.getElementById(
                "invoice-end"
            ).value;


        return {
            inicio,
            fim
        };

    }


    function criarQueryPeriodo() {

        const periodo =
            obterPeriodo();


        const parametros =
            new URLSearchParams();


        if (periodo.inicio) {

            parametros.append(
                "inicio",
                `${periodo.inicio}T00:00:00`
            );

        }


        if (periodo.fim) {

            parametros.append(
                "fim",
                `${periodo.fim}T23:59:59`
            );

        }


        return parametros.toString();

    }


    function formatarPeriodoVisual() {

        const periodo =
            obterPeriodo();


        if (
            !periodo.inicio &&
            !periodo.fim
        ) {

            return "Todos os períodos";

        }


        function converter(
            valor
        ) {

            if (!valor) {
                return "--";
            }


            const partes =
                valor.split("-");


            return (
                `${partes[2]}/` +
                `${partes[1]}/` +
                `${partes[0]}`
            );

        }


        return (
            `${converter(periodo.inicio)} ` +
            `até ` +
            `${converter(periodo.fim)}`
        );

    }


    /* =========================================
       FORMATAÇÃO
    ========================================= */

    function formatarDataHora(
        valor
    ) {

        if (!valor) {
            return "--";
        }


        const data =
            new Date(valor);


        return data.toLocaleString(
            "pt-BR",
            {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            }
        );

    }


    /* =========================================
       CARREGAR FATURAS
    ========================================= */

    async function carregarFaturas() {

        const lista =
            document.getElementById(
                "invoice-list"
            );


        lista.innerHTML = `

            <tr>

                <td colspan="6">
                    Carregando faturas...
                </td>

            </tr>

        `;


        try {

            const query =
                criarQueryPeriodo();


            const [
                respostaRateio,
                respostaUsuarios
            ] =
                await Promise.all([

                    fetch(
                        `${API_URL}/consumo/rateio-mensal?${query}`
                    ),

                    fetch(
                        `${API_URL}/usuarios/`
                    )

                ]);


            if (
                !respostaRateio.ok ||
                !respostaUsuarios.ok
            ) {

                throw new Error(
                    "Erro ao carregar faturamento."
                );

            }


            rateioCache =
                await respostaRateio.json();


            const usuariosDados =
                await respostaUsuarios.json();


            usuariosCache =
                usuariosDados.usuarios ??
                [];


            atualizarResumo();


            renderizarFaturas();


        } catch (erro) {

            console.error(
                "Erro nas faturas:",
                erro
            );


            lista.innerHTML = `

                <tr>

                    <td colspan="6">

                        <div class="sessions-empty error">

                            <strong>
                                Não foi possível carregar
                                as faturas.
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
            "invoice-total-value"
        ).textContent =
            `R$ ${Number(
                rateioCache?.valor_total ??
                0
            ).toFixed(2)}`;


        document.getElementById(
            "invoice-total-users"
        ).textContent =
            rateioCache?.total_usuarios ??
            0;


        document.getElementById(
            "invoice-total-sessions"
        ).textContent =
            totalSessoes;


        document.getElementById(
            "invoice-total-consumption"
        ).textContent =
            Number(
                rateioCache?.consumo_total_kwh ??
                0
            ).toFixed(2);

    }


    /* =========================================
       RENDERIZAR
    ========================================= */

    function renderizarFaturas() {

        const lista =
            document.getElementById(
                "invoice-list"
            );


        const usuarios =
            rateioCache?.usuarios ??
            [];


        document.getElementById(
            "invoice-result-count"
        ).textContent =
            `${usuarios.length} fatura(s) disponível(is)`;


        if (
            usuarios.length === 0
        ) {

            lista.innerHTML = `

                <tr>

                    <td colspan="6">

                        <div class="sessions-empty">

                            <strong>
                                Nenhuma fatura disponível
                            </strong>

                            <span>
                                Não existem sessões concluídas
                                nesse período.
                            </span>

                        </div>

                    </td>

                </tr>

            `;

            return;

        }


        lista.innerHTML =
            "";


        usuarios.forEach(
            usuario => {

                const cadastro =
                    usuariosCache.find(
                        item =>
                            Number(item.id) ===
                            Number(
                                usuario.usuario_id
                            )
                    );


                const email =
                    cadastro?.email ??
                    "E-mail não informado";


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

                        <div class="invoice-user">

                            <div class="table-avatar">
                                ${escapeHtml(iniciais)}
                            </div>


                            <div>

                                <strong>
                                    ${escapeHtml(
                                        usuario.nome
                                    )}
                                </strong>

                                <span>
                                    ${escapeHtml(
                                        email
                                    )}
                                </span>

                            </div>

                        </div>

                    </td>


                    <td>
                        ${formatarPeriodoVisual()}
                    </td>


                    <td>
                        ${usuario.total_sessoes}
                    </td>


                    <td>

                        <strong>
                            ${Number(
                                usuario.consumo_kwh
                            ).toFixed(2)}
                            kWh
                        </strong>

                    </td>


                    <td>

                        <strong class="invoice-value">

                            R$
                            ${Number(
                                usuario.valor_total
                            ).toFixed(2)}

                        </strong>

                    </td>


                    <td>

                        <div class="invoice-actions">

                            <button
                                class="invoice-view-button"
                                type="button"
                                data-user-id="${usuario.usuario_id}"
                            >
                                Visualizar
                            </button>


                            <button
                                class="invoice-pdf-button"
                                type="button"
                                data-user-id="${usuario.usuario_id}"
                            >
                                PDF
                            </button>

                        </div>

                    </td>

                `;


                lista.appendChild(
                    linha
                );

            }
        );


        configurarBotoesFaturas();

    }


    /* =========================================
       BOTÕES
    ========================================= */

    function configurarBotoesFaturas() {

        document.querySelectorAll(
            ".invoice-view-button"
        ).forEach(
            botao => {

                botao.addEventListener(
                    "click",
                    () => {

                        visualizarFatura(
                            botao.dataset.userId
                        );

                    }
                );

            }
        );


        document.querySelectorAll(
            ".invoice-pdf-button"
        ).forEach(
            botao => {

                botao.addEventListener(
                    "click",
                    () => {

                        abrirPdf(
                            botao.dataset.userId
                        );

                    }
                );

            }
        );

    }


    /* =========================================
       VISUALIZAR FATURA
    ========================================= */

    async function visualizarFatura(
        usuarioId
    ) {

        modal.classList.add(
            "show"
        );


        const conteudo =
            document.getElementById(
                "invoice-modal-content"
            );


        conteudo.innerHTML =
            "Carregando fatura...";


        try {

            const query =
                criarQueryPeriodo();


            const resposta =
                await fetch(
                    `${API_URL}/consumo/fatura-usuario/${usuarioId}?${query}`
                );


            if (!resposta.ok) {

                throw new Error(
                    "Erro ao carregar a fatura."
                );

            }


            const dados =
                await resposta.json();


            if (!dados.sucesso) {

                throw new Error(
                    dados.erro ??
                    "Fatura indisponível."
                );

            }


            document.getElementById(
                "invoice-modal-number"
            ).textContent =
                dados.numero_fatura;


            let sessoesHtml =
                "";


            dados.sessoes.forEach(
                sessao => {

                    sessoesHtml += `

                        <tr>

                            <td>
                                #${sessao.sessao_id}
                            </td>

                            <td>
                                ${escapeHtml(
                                    sessao.carregador_nome
                                )}
                            </td>

                            <td>
                                ${formatarDataHora(
                                    sessao.inicio
                                )}
                            </td>

                            <td>
                                ${Number(
                                    sessao.consumo_kwh ??
                                    0
                                ).toFixed(2)}
                                kWh
                            </td>

                            <td>
                                R$
                                ${Number(
                                    sessao.valor ??
                                    0
                                ).toFixed(2)}
                            </td>

                        </tr>

                    `;

                }
            );


            conteudo.innerHTML = `

                <div class="invoice-detail-user">

                    <div>

                        <span>
                            Usuário
                        </span>

                        <strong>
                            ${escapeHtml(
                                dados.usuario.nome
                            )}
                        </strong>

                    </div>


                    <div>

                        <span>
                            E-mail
                        </span>

                        <strong>
                            ${escapeHtml(
                                dados.usuario.email
                            )}
                        </strong>

                    </div>


                    <div>

                        <span>
                            Emissão
                        </span>

                        <strong>
                            ${formatarDataHora(
                                dados.data_emissao
                            )}
                        </strong>

                    </div>

                </div>


                <div class="invoice-detail-summary">

                    <div>

                        <span>
                            Sessões
                        </span>

                        <strong>
                            ${dados.total_sessoes}
                        </strong>

                    </div>


                    <div>

                        <span>
                            Consumo
                        </span>

                        <strong>
                            ${Number(
                                dados.consumo_total_kwh
                            ).toFixed(2)}
                            kWh
                        </strong>

                    </div>


                    <div>

                        <span>
                            Tarifa média
                        </span>

                        <strong>
                            R$
                            ${Number(
                                dados.tarifa_media
                            ).toFixed(2)}
                            /kWh
                        </strong>

                    </div>


                    <div>

                        <span>
                            Total
                        </span>

                        <strong class="invoice-modal-total">
                            R$
                            ${Number(
                                dados.valor_total
                            ).toFixed(2)}
                        </strong>

                    </div>

                </div>


                <div class="table-wrapper">

                    <table class="invoice-detail-table">

                        <thead>

                            <tr>

                                <th>
                                    Sessão
                                </th>

                                <th>
                                    Carregador
                                </th>

                                <th>
                                    Início
                                </th>

                                <th>
                                    Consumo
                                </th>

                                <th>
                                    Valor
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            ${sessoesHtml}

                        </tbody>

                    </table>

                </div>


                <div class="invoice-modal-actions">

                    <button
                        id="modal-pdf-button"
                        class="primary-action"
                        type="button"
                    >
                        Gerar PDF
                    </button>

                </div>

            `;


            document.getElementById(
                "modal-pdf-button"
            ).addEventListener(
                "click",
                () => {

                    abrirPdf(
                        usuarioId
                    );

                }
            );


        } catch (erro) {

            conteudo.innerHTML = `

                <div class="sessions-empty error">

                    <strong>
                        ${escapeHtml(
                            erro.message
                        )}
                    </strong>

                </div>

            `;

        }

    }


    /* =========================================
       PDF
    ========================================= */

    function abrirPdf(
        usuarioId
    ) {

        const query =
            criarQueryPeriodo();


        const url =
            `${API_URL}/consumo/fatura-usuario/${usuarioId}/pdf?${query}`;


        window.open(
            url,
            "_blank"
        );

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
        "fechar-modal-fatura"
    ).addEventListener(
        "click",
        fecharModal
    );


    modal.addEventListener(
        "click",
        evento => {

            if (
                evento.target === modal
            ) {

                fecharModal();

            }

        }
    );


    /* =========================================
       EVENTOS
    ========================================= */

    document.getElementById(
        "btn-atualizar-faturas"
    ).addEventListener(
        "click",
        carregarFaturas
    );


    document.getElementById(
        "btn-filtrar-faturas"
    ).addEventListener(
        "click",
        carregarFaturas
    );

};


iniciarFaturasUI();