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


if (aiButton) {

    aiButton.addEventListener(
        "click",
        () => {

            if (!aiWelcomeMessage) {
                return;
            }

            const estaVisivel =
                aiWelcomeMessage.classList
                    .contains(
                        "show"
                    );

            if (estaVisivel) {

                esconderMensagemIA();

                return;

            }

            mostrarMensagemIA();

        }
    );

}


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