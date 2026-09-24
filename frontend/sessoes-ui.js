const iniciarSessoesUI = () => {

    const main =
        document.querySelector(".main");

    if (!main) {
        return;
    }


    let sessoesCache = [];
    let usuariosCache = [];
    let carregadoresCache = [];


    /* =========================================
       PÁGINA
    ========================================= */

    const paginaSessoes =
        document.createElement("div");

    paginaSessoes.id =
        "page-sessions";

    paginaSessoes.className =
        "app-page";


    paginaSessoes.innerHTML = `

        <header class="topbar">

            <div class="topbar-title">

                <span class="page-eyebrow">
                    Operação de recarga
                </span>

                <h1>
                    Sessões
                </h1>

                <p>
                    Acompanhe o histórico de recargas,
                    consumo e valores registrados.
                </p>

            </div>


            <div class="topbar-actions">

                <button
                    id="btn-atualizar-sessoes"
                    class="primary-action"
                    type="button"
                >
                    Atualizar
                </button>

            </div>

        </header>


        <!-- =========================================
             RESUMO
        ========================================== -->

        <section class="sessions-summary">


            <article class="metric-card">

                <div class="metric-top">

                    <span class="metric-caption">
                        Total
                    </span>

                </div>

                <div class="metric-value">

                    <strong id="sessions-total">
                        --
                    </strong>

                </div>

                <p>
                    Sessões registradas
                </p>

            </article>


            <article class="metric-card">

                <div class="metric-top">

                    <span class="metric-caption">
                        Concluídas
                    </span>

                </div>

                <div class="metric-value">

                    <strong id="sessions-completed">
                        --
                    </strong>

                </div>

                <p>
                    Recargas finalizadas
                </p>

            </article>


            <article class="metric-card">

                <div class="metric-top">

                    <span class="metric-caption">
                        Em recarga
                    </span>

                </div>

                <div class="metric-value">

                    <strong id="sessions-active">
                        --
                    </strong>

                </div>

                <p>
                    Sessões em andamento
                </p>

            </article>


            <article class="metric-card">

                <div class="metric-top">

                    <span class="metric-caption">
                        Consumo
                    </span>

                </div>

                <div class="metric-value">

                    <strong id="sessions-consumption">
                        --
                    </strong>

                    <span>
                        kWh
                    </span>

                </div>

                <p>
                    Energia das sessões
                </p>

            </article>


        </section>


        <!-- =========================================
             FILTROS
        ========================================== -->

        <section class="dashboard-card sessions-filters-card">

            <div class="card-heading">

                <div>

                    <span class="section-label">
                        Filtros
                    </span>

                    <h2>
                        Histórico de Recargas
                    </h2>

                    <p>
                        Filtre as sessões por usuário,
                        carregador ou status.
                    </p>

                </div>

            </div>


            <div class="sessions-filters">


                <div class="form-group">

                    <label for="session-user-filter">
                        Usuário
                    </label>

                    <select id="session-user-filter">

                        <option value="">
                            Todos os usuários
                        </option>

                    </select>

                </div>


                <div class="form-group">

                    <label for="session-charger-filter">
                        Carregador
                    </label>

                    <select id="session-charger-filter">

                        <option value="">
                            Todos os carregadores
                        </option>

                    </select>

                </div>


                <div class="form-group">

                    <label for="session-status-filter">
                        Status
                    </label>

                    <select id="session-status-filter">

                        <option value="">
                            Todos os status
                        </option>

                        <option value="AGUARDANDO">
                            Aguardando
                        </option>

                        <option value="AUTORIZADA">
                            Autorizada
                        </option>

                        <option value="EM_RECARGA">
                            Em recarga
                        </option>

                        <option value="CONCLUIDA">
                            Concluída
                        </option>

                        <option value="CANCELADA">
                            Cancelada
                        </option>

                    </select>

                </div>


                <div class="sessions-filter-action">

                    <button
                        id="btn-limpar-filtros-sessoes"
                        class="secondary-action"
                        type="button"
                    >
                        Limpar filtros
                    </button>

                </div>


            </div>

        </section>


        <!-- =========================================
             TABELA
        ========================================== -->

        <section class="dashboard-card">

            <div class="card-heading">

                <div>

                    <span class="section-label">
                        Sessões
                    </span>

                    <h2>
                        Registros de Recarga
                    </h2>

                    <p id="sessions-result-count">
                        Carregando registros...
                    </p>

                </div>

            </div>


            <div class="table-wrapper">

                <table class="sessions-table">

                    <thead>

                        <tr>

                            <th>
                                Sessão
                            </th>

                            <th>
                                Usuário
                            </th>

                            <th>
                                Carregador
                            </th>

                            <th>
                                Início
                            </th>

                            <th>
                                Duração
                            </th>

                            <th>
                                Consumo
                            </th>

                            <th>
                                Valor
                            </th>

                            <th>
                                Status
                            </th>

                            <th>
                            </th>

                        </tr>

                    </thead>


                    <tbody id="sessions-list">

                        <tr>

                            <td colspan="9">
                                Carregando sessões...
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
        paginaSessoes
    );


    /* =========================================
       MENU
    ========================================= */

    const botaoMenu =
        document.querySelector(
            '.menu-item[data-page="sessions"]'
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


                paginaSessoes.classList.add(
                    "active"
                );


                carregarSessoes();


                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });

            }
        );

    }


    /* =========================================
       FORMATAÇÃO
    ========================================= */

    function formatarData(data) {

        if (!data) {
            return "--";
        }


        const objeto =
            new Date(data);


        if (
            Number.isNaN(
                objeto.getTime()
            )
        ) {
            return "--";
        }


        return objeto.toLocaleString(
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


    function calcularDuracao(sessao) {

        if (
            sessao.duracao !== null &&
            sessao.duracao !== undefined
        ) {

            return `${Math.round(
                Number(sessao.duracao)
            )} min`;

        }


        if (
            sessao.inicio &&
            sessao.fim
        ) {

            const inicio =
                new Date(
                    sessao.inicio
                );


            const fim =
                new Date(
                    sessao.fim
                );


            const diferenca =
                fim - inicio;


            if (
                diferenca >= 0
            ) {

                const minutos =
                    Math.round(
                        diferenca /
                        60000
                    );


                return `${minutos} min`;

            }

        }


        return "--";

    }


    function formatarStatus(status) {

        const mapa = {

            AGUARDANDO:
                "Aguardando",

            AUTORIZADA:
                "Autorizada",

            EM_RECARGA:
                "Em recarga",

            CONCLUIDA:
                "Concluída",

            CANCELADA:
                "Cancelada"

        };


        return (
            mapa[status] ??
            status ??
            "Desconhecido"
        );

    }


    function classeStatus(status) {

        const classes = {

            AGUARDANDO:
                "waiting",

            AUTORIZADA:
                "authorized",

            EM_RECARGA:
                "charging",

            CONCLUIDA:
                "completed",

            CANCELADA:
                "cancelled"

        };


        return (
            classes[status] ??
            "unknown"
        );

    }


    /* =========================================
       MAPAS
    ========================================= */

    function obterUsuario(id) {

        return usuariosCache.find(
            usuario =>
                Number(usuario.id) ===
                Number(id)
        );

    }


    function obterCarregador(id) {

        return carregadoresCache.find(
            carregador =>
                Number(carregador.id) ===
                Number(id)
        );

    }


    /* =========================================
       FILTROS
    ========================================= */

    function preencherFiltros() {

        const usuarioSelect =
            document.getElementById(
                "session-user-filter"
            );


        const carregadorSelect =
            document.getElementById(
                "session-charger-filter"
            );


        usuarioSelect.innerHTML = `

            <option value="">
                Todos os usuários
            </option>

        `;


        carregadorSelect.innerHTML = `

            <option value="">
                Todos os carregadores
            </option>

        `;


        usuariosCache.forEach(
            usuario => {

                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    usuario.id;


                option.textContent =
                    usuario.nome;


                usuarioSelect.appendChild(
                    option
                );

            }
        );


        carregadoresCache.forEach(
            carregador => {

                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    carregador.id;


                option.textContent =
                    carregador.nome;


                carregadorSelect.appendChild(
                    option
                );

            }
        );

    }


    function aplicarFiltros() {

        const usuario =
            document.getElementById(
                "session-user-filter"
            ).value;


        const carregador =
            document.getElementById(
                "session-charger-filter"
            ).value;


        const status =
            document.getElementById(
                "session-status-filter"
            ).value;


        let resultado =
            [...sessoesCache];


        if (usuario) {

            resultado =
                resultado.filter(
                    sessao =>
                        Number(
                            sessao.usuario_id
                        ) ===
                        Number(usuario)
                );

        }


        if (carregador) {

            resultado =
                resultado.filter(
                    sessao =>
                        Number(
                            sessao.carregador_id
                        ) ===
                        Number(carregador)
                );

        }


        if (status) {

            resultado =
                resultado.filter(
                    sessao =>
                        sessao.status ===
                        status
                );

        }


        renderizarSessoes(
            resultado
        );

    }


    /* =========================================
       RESUMO
    ========================================= */

    function atualizarResumo(
        sessoes
    ) {

        const concluidas =
            sessoes.filter(
                sessao =>
                    sessao.status ===
                    "CONCLUIDA"
            ).length;


        const emRecarga =
            sessoes.filter(
                sessao =>
                    sessao.status ===
                    "EM_RECARGA"
            ).length;


        const consumo =
            sessoes.reduce(
                (
                    total,
                    sessao
                ) => {

                    return (
                        total +
                        Number(
                            sessao.consumo_kwh ??
                            0
                        )
                    );

                },
                0
            );


        document.getElementById(
            "sessions-total"
        ).textContent =
            sessoes.length;


        document.getElementById(
            "sessions-completed"
        ).textContent =
            concluidas;


        document.getElementById(
            "sessions-active"
        ).textContent =
            emRecarga;


        document.getElementById(
            "sessions-consumption"
        ).textContent =
            consumo.toFixed(2);

    }


    /* =========================================
       RENDERIZAR
    ========================================= */

    function renderizarSessoes(
        sessoes
    ) {

        const lista =
            document.getElementById(
                "sessions-list"
            );


        const contador =
            document.getElementById(
                "sessions-result-count"
            );


        contador.textContent =
            `${sessoes.length} registro(s) encontrado(s)`;


        atualizarResumo(
            sessoes
        );


        if (
            sessoes.length === 0
        ) {

            lista.innerHTML = `

                <tr>

                    <td colspan="9">

                        <div class="sessions-empty">

                            <strong>
                                Nenhuma sessão encontrada
                            </strong>

                            <span>
                                Altere os filtros ou importe
                                novas sessões.
                            </span>

                        </div>

                    </td>

                </tr>

            `;

            return;

        }


        lista.innerHTML =
            "";


        const ordenadas =
            [...sessoes].sort(
                (a, b) =>
                    new Date(b.inicio) -
                    new Date(a.inicio)
            );


        ordenadas.forEach(
            sessao => {

                const usuario =
                    obterUsuario(
                        sessao.usuario_id
                    );


                const carregador =
                    obterCarregador(
                        sessao.carregador_id
                    );


                const nomeUsuario =
                    usuario
                        ? usuario.nome
                        : sessao.usuario_id
                            ? `Usuário #${sessao.usuario_id}`
                            : "Não associado";


                const nomeCarregador =
                    carregador
                        ? carregador.nome
                        : `Carregador #${sessao.carregador_id}`;


                const linha =
                    document.createElement(
                        "tr"
                    );


                linha.innerHTML = `

                    <td>

                        <strong class="session-id">
                            #${sessao.id}
                        </strong>

                    </td>


                    <td>

                        <div class="session-user-cell">

                            <span
                                class="session-user-dot ${
                                    sessao.usuario_id
                                        ? ""
                                        : "unassigned"
                                }"
                            >
                            </span>

                            <span>
                                ${escapeHtml(
                                    nomeUsuario
                                )}
                            </span>

                        </div>

                    </td>


                    <td>

                        <strong>
                            ${escapeHtml(
                                nomeCarregador
                            )}
                        </strong>

                    </td>


                    <td>

                        ${formatarData(
                            sessao.inicio
                        )}

                    </td>


                    <td>

                        ${calcularDuracao(
                            sessao
                        )}

                    </td>


                    <td>

                        <strong>
                            ${Number(
                                sessao.consumo_kwh ??
                                0
                            ).toFixed(2)}
                            kWh
                        </strong>

                    </td>


                    <td>

                        R$
                        ${Number(
                            sessao.valor_total ??
                            0
                        ).toFixed(2)}

                    </td>


                    <td>

                        <span
                            class="
                                session-status
                                ${classeStatus(
                                    sessao.status
                                )}
                            "
                        >

                            ${formatarStatus(
                                sessao.status
                            )}

                        </span>

                    </td>


                    <td>

                        <button
                            class="session-detail-button"
                            type="button"
                            data-session-id="${sessao.id}"
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
       CARREGAR API
    ========================================= */

    async function carregarSessoes() {

        const lista =
            document.getElementById(
                "sessions-list"
            );


        lista.innerHTML = `

            <tr>

                <td colspan="9">
                    Carregando sessões...
                </td>

            </tr>

        `;


        try {

            const [
                respostaSessoes,
                respostaUsuarios,
                respostaCarregadores
            ] =
                await Promise.all([

                    fetch(
                        `${API_URL}/sessoes/`
                    ),

                    fetch(
                        `${API_URL}/usuarios/`
                    ),

                    fetch(
                        `${API_URL}/carregadores/`
                    )

                ]);


            if (
                !respostaSessoes.ok ||
                !respostaUsuarios.ok ||
                !respostaCarregadores.ok
            ) {

                throw new Error(
                    "Erro ao carregar os dados."
                );

            }


            const dadosSessoes =
                await respostaSessoes.json();


            const dadosUsuarios =
                await respostaUsuarios.json();


            const dadosCarregadores =
                await respostaCarregadores.json();


            sessoesCache =
                dadosSessoes.sessoes ??
                [];


            usuariosCache =
                dadosUsuarios.usuarios ??
                [];


            carregadoresCache =
                dadosCarregadores.carregadores ??
                [];


            preencherFiltros();


            renderizarSessoes(
                sessoesCache
            );


        } catch (erro) {

            console.error(
                "Erro ao carregar sessões:",
                erro
            );


            lista.innerHTML = `

                <tr>

                    <td colspan="9">

                        <div class="sessions-empty error">

                            <strong>
                                Não foi possível carregar
                                as sessões.
                            </strong>

                            <span>
                                Verifique se a FastAPI
                                está funcionando.
                            </span>

                        </div>

                    </td>

                </tr>

            `;

        }

    }


    /* =========================================
       EVENTOS
    ========================================= */

    document.getElementById(
        "btn-atualizar-sessoes"
    ).addEventListener(
        "click",
        carregarSessoes
    );


    document.getElementById(
        "session-user-filter"
    ).addEventListener(
        "change",
        aplicarFiltros
    );


    document.getElementById(
        "session-charger-filter"
    ).addEventListener(
        "change",
        aplicarFiltros
    );


    document.getElementById(
        "session-status-filter"
    ).addEventListener(
        "change",
        aplicarFiltros
    );


    document.getElementById(
        "btn-limpar-filtros-sessoes"
    ).addEventListener(
        "click",
        () => {

            document.getElementById(
                "session-user-filter"
            ).value =
                "";


            document.getElementById(
                "session-charger-filter"
            ).value =
                "";


            document.getElementById(
                "session-status-filter"
            ).value =
                "";


            renderizarSessoes(
                sessoesCache
            );

        }
    );

};


iniciarSessoesUI();