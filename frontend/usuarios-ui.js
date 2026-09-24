const iniciarUsuariosUI = () => {

    const main =
        document.querySelector(".main");

    if (!main) {
        return;
    }


    /* =========================================
       PÁGINA DE USUÁRIOS
    ========================================= */

    const paginaUsuarios =
        document.createElement("div");

    paginaUsuarios.id =
        "page-users";

    paginaUsuarios.className =
        "app-page";


    paginaUsuarios.innerHTML = `

        <header class="topbar">

            <div class="topbar-title">

                <span class="page-eyebrow">
                    Gestão de moradores
                </span>

                <h1>
                    Usuários
                </h1>

                <p>
                    Gerencie os usuários vinculados
                    às sessões de recarga.
                </p>

            </div>


            <div class="topbar-actions">

                <button
                    id="btn-atualizar-usuarios"
                    class="secondary-action"
                    type="button"
                >
                    Atualizar
                </button>


                <button
                    id="btn-novo-usuario"
                    class="primary-action"
                    type="button"
                >
                    + Novo usuário
                </button>

            </div>

        </header>


        <!-- RESUMO -->

        <section class="user-summary">

            <article class="metric-card">

                <div class="metric-top">

                    <span class="metric-caption">
                        Usuários
                    </span>

                </div>


                <div class="metric-value">

                    <strong id="users-total">
                        --
                    </strong>

                </div>


                <p>
                    Moradores cadastrados
                </p>

            </article>

        </section>


        <!-- LISTAGEM -->

        <section class="dashboard-card">

            <div class="card-heading">

                <div>

                    <span class="section-label">
                        Cadastros
                    </span>

                    <h2>
                        Usuários do EV ChargeOps
                    </h2>

                    <p>
                        Usuários disponíveis para associação
                        às sessões de recarga.
                    </p>

                </div>

            </div>


            <div
                id="users-list"
                class="users-grid"
            >

                <div class="users-loading">
                    Carregando usuários...
                </div>

            </div>

        </section>


        <footer class="footer">

            EV ChargeOps • Gestão inteligente de recarga

        </footer>
    `;


    main.appendChild(
        paginaUsuarios
    );


    /* =========================================
       MODAL
    ========================================= */

    const modal =
        document.createElement("div");


    modal.className =
        "modal-overlay";


    modal.innerHTML = `

        <div class="modal-card">

            <div class="modal-header">

                <div>

                    <span class="section-label">
                        Usuários
                    </span>

                    <h2>
                        Novo Usuário
                    </h2>

                    <p>
                        Cadastre um morador no
                        EV ChargeOps.
                    </p>

                </div>


                <button
                    id="fechar-modal-usuario"
                    class="modal-close"
                    type="button"
                    aria-label="Fechar"
                >
                    ×
                </button>

            </div>


            <form id="form-usuario">

                <div class="form-grid">


                    <!-- NOME -->

                    <div class="form-group form-full">

                        <label for="usuario-nome">
                            Nome completo
                        </label>

                        <input
                            id="usuario-nome"
                            type="text"
                            placeholder="Lucas Gesini"
                            required
                        >

                    </div>


                    <!-- EMAIL -->

                    <div class="form-group form-full">

                        <label for="usuario-email">
                            E-mail
                        </label>

                        <input
                            id="usuario-email"
                            type="email"
                            placeholder="usuario@email.com"
                            required
                        >

                    </div>


                    <!-- TELEFONE -->

                    <div class="form-group form-full">

                        <label for="usuario-telefone">
                            Telefone
                        </label>

                        <input
                            id="usuario-telefone"
                            type="tel"
                            maxlength="15"
                            placeholder="(11) 99999-9999"
                        >

                    </div>


                </div>


                <div
                    id="usuario-form-message"
                    class="form-message"
                >
                </div>


                <div class="modal-actions">

                    <button
                        id="cancelar-usuario"
                        class="secondary-action"
                        type="button"
                    >
                        Cancelar
                    </button>


                    <button
                        id="salvar-usuario"
                        class="primary-action"
                        type="submit"
                    >
                        Cadastrar usuário
                    </button>

                </div>

            </form>

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
            '.menu-item[data-page="users"]'
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


                paginaUsuarios.classList.add(
                    "active"
                );


                carregarUsuarios();


                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });

            }
        );

    }


    /* =========================================
       MÁSCARA DO TELEFONE
    ========================================= */

    const campoTelefone =
        document.getElementById(
            "usuario-telefone"
        );


    campoTelefone.addEventListener(
        "input",
        evento => {

            let numero =
                evento.target.value
                    .replace(/\D/g, "")
                    .slice(0, 11);


            if (numero.length > 10) {

                numero =
                    numero.replace(
                        /^(\d{2})(\d{5})(\d{4})$/,
                        "($1) $2-$3"
                    );

            } else if (numero.length > 6) {

                numero =
                    numero.replace(
                        /^(\d{2})(\d{4})(\d{0,4})$/,
                        "($1) $2-$3"
                    );

            } else if (numero.length > 2) {

                numero =
                    numero.replace(
                        /^(\d{2})(\d+)/,
                        "($1) $2"
                    );

            } else if (numero.length > 0) {

                numero =
                    numero.replace(
                        /^(\d*)/,
                        "($1"
                    );

            }


            evento.target.value =
                numero;

        }
    );


    /* =========================================
       MODAL
    ========================================= */

    function abrirModalUsuario() {

        modal.classList.add(
            "show"
        );


        document.getElementById(
            "usuario-nome"
        ).focus();

    }


    function fecharModalUsuario() {

        modal.classList.remove(
            "show"
        );


        document.getElementById(
            "form-usuario"
        ).reset();


        const mensagem =
            document.getElementById(
                "usuario-form-message"
            );


        mensagem.textContent =
            "";


        mensagem.className =
            "form-message";

    }


    document.getElementById(
        "btn-novo-usuario"
    ).addEventListener(
        "click",
        abrirModalUsuario
    );


    document.getElementById(
        "fechar-modal-usuario"
    ).addEventListener(
        "click",
        fecharModalUsuario
    );


    document.getElementById(
        "cancelar-usuario"
    ).addEventListener(
        "click",
        fecharModalUsuario
    );


    modal.addEventListener(
        "click",
        evento => {

            if (
                evento.target === modal
            ) {

                fecharModalUsuario();

            }

        }
    );


    /* =========================================
       ATUALIZAR
    ========================================= */

    document.getElementById(
        "btn-atualizar-usuarios"
    ).addEventListener(
        "click",
        carregarUsuarios
    );


    /* =========================================
       CADASTRAR USUÁRIO
    ========================================= */

    document.getElementById(
        "form-usuario"
    ).addEventListener(
        "submit",
        async evento => {

            evento.preventDefault();


            const mensagem =
                document.getElementById(
                    "usuario-form-message"
                );


            const botaoSalvar =
                document.getElementById(
                    "salvar-usuario"
                );


            const telefone =
                document.getElementById(
                    "usuario-telefone"
                ).value.trim();


            const usuario = {

                nome:
                    document.getElementById(
                        "usuario-nome"
                    ).value.trim(),

                email:
                    document.getElementById(
                        "usuario-email"
                    ).value.trim(),

                telefone:
                    telefone || null

            };


            mensagem.textContent =
                "";


            mensagem.className =
                "form-message";


            botaoSalvar.disabled =
                true;


            botaoSalvar.textContent =
                "Cadastrando...";


            try {

                const resposta =
                    await fetch(
                        `${API_URL}/usuarios/`,
                        {

                            method:
                                "POST",

                            headers: {

                                "Content-Type":
                                    "application/json"

                            },

                            body:
                                JSON.stringify(
                                    usuario
                                )

                        }
                    );


                if (!resposta.ok) {

                    let textoErro =
                        "Não foi possível cadastrar o usuário.";


                    try {

                        const erro =
                            await resposta.json();


                        if (
                            typeof erro.detail ===
                            "string"
                        ) {

                            textoErro =
                                erro.detail;

                        }

                    } catch (_) {

                        // Mantém mensagem padrão.

                    }


                    throw new Error(
                        textoErro
                    );

                }


                mensagem.className =
                    "form-message success";


                mensagem.textContent =
                    "Usuário cadastrado com sucesso.";


                await carregarUsuarios();


                setTimeout(
                    fecharModalUsuario,
                    700
                );


            } catch (erro) {

                mensagem.className =
                    "form-message error";


                mensagem.textContent =
                    erro.message;


            } finally {

                botaoSalvar.disabled =
                    false;


                botaoSalvar.textContent =
                    "Cadastrar usuário";

            }

        }
    );


    /* =========================================
       CARREGAR USUÁRIOS
    ========================================= */

    async function carregarUsuarios() {

        const lista =
            document.getElementById(
                "users-list"
            );


        lista.innerHTML = `

            <div class="users-loading">
                Carregando usuários...
            </div>

        `;


        try {

            const resposta =
                await fetch(
                    `${API_URL}/usuarios/`
                );


            if (!resposta.ok) {

                throw new Error(
                    "Erro ao carregar usuários."
                );

            }


            const dados =
                await resposta.json();


            const usuarios =
                dados.usuarios ?? [];


            document.getElementById(
                "users-total"
            ).textContent =
                usuarios.length;


            /* =========================================
               SEM USUÁRIOS
            ========================================= */

            if (
                usuarios.length === 0
            ) {

                lista.innerHTML = `

                    <div class="empty-state">

                        <strong>
                            Nenhum usuário cadastrado
                        </strong>

                        <p>
                            Cadastre o primeiro morador
                            para começar.
                        </p>

                    </div>

                `;

                return;

            }


            lista.innerHTML =
                "";


            /* =========================================
               CARDS
            ========================================= */

            usuarios.forEach(
                usuario => {

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


                    const telefone =
                        usuario.telefone
                            ? escapeHtml(
                                usuario.telefone
                            )
                            : "Telefone não informado";


                    const card =
                        document.createElement(
                            "article"
                        );


                    card.className =
                        "user-card";


                    card.innerHTML = `

                        <div class="user-card-top">

                            <div class="user-avatar-large">
                                ${escapeHtml(iniciais)}
                            </div>


                            <span class="user-id">
                                ID #${usuario.id}
                            </span>

                        </div>


                        <div class="user-card-content">

                            <h3>
                                ${escapeHtml(
                                    usuario.nome
                                )}
                            </h3>


                            <p>
                                ${escapeHtml(
                                    usuario.email
                                )}
                            </p>


                            <div class="user-phone">

                                <span>
                                    Telefone
                                </span>

                                <strong>
                                    ${telefone}
                                </strong>

                            </div>

                        </div>


                        <div class="user-card-footer">

                            <div class="user-status">

                                <span class="status-dot"></span>

                                Usuário cadastrado

                            </div>


                            <button
                                class="user-detail-button"
                                type="button"
                                data-user-id="${usuario.id}"
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
                "Erro usuários:",
                erro
            );


            lista.innerHTML = `

                <div class="empty-state error">

                    <strong>
                        Não foi possível carregar
                        os usuários.
                    </strong>

                    <p>
                        Verifique a conexão com a API.
                    </p>

                </div>

            `;

        }

    }

};


iniciarUsuariosUI();