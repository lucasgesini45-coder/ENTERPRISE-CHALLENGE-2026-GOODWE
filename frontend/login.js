

const loginForm =
    document.getElementById("login-form");

const emailInput =
    document.getElementById("email");

const senhaInput =
    document.getElementById("senha");

const loginButton =
    document.getElementById("login-button");

const loginMessage =
    document.getElementById("login-message");

const togglePassword =
    document.getElementById("toggle-password");

const forgotPassword =
    document.getElementById("forgot-password");


/* =========================================================
   MOSTRAR / OCULTAR SENHA
========================================================= */

if (togglePassword && senhaInput) {

    togglePassword.addEventListener(
        "click",
        () => {

            const senhaVisivel =
                senhaInput.type === "text";

            senhaInput.type =
                senhaVisivel
                    ? "password"
                    : "text";

            togglePassword.textContent =
                senhaVisivel
                    ? "👁"
                    : "◉";

        }
    );

}


/* =========================================================
   MENSAGEM
========================================================= */

function mostrarMensagem(
    mensagem,
    tipo = "erro"
) {

    if (!loginMessage) {
        return;
    }

    loginMessage.textContent =
        mensagem;

    if (tipo === "sucesso") {

        loginMessage.style.color =
            "#00d7a5";

        return;
    }

    loginMessage.style.color =
        "#ff174f";

}


/* =========================================================
   ESTADO DO BOTÃO
========================================================= */

function definirCarregando(carregando) {

    if (!loginButton) {
        return;
    }

    loginButton.disabled =
        carregando;

    if (carregando) {

        loginButton.innerHTML = `
            <span>Entrando...</span>
            <span class="arrow">...</span>
        `;

        return;
    }

    loginButton.innerHTML = `
        <span>Entrar</span>
        <span class="arrow">→</span>
    `;

}


/* =========================================================
   BUSCAR USUÁRIO AUTENTICADO
========================================================= */

async function buscarUsuario(token) {

    const response =
        await apiFetch(
            `${API_URL}/auth/me`,
            {
                method: "GET",

                headers: {
                    Authorization:
                        `Bearer ${token}`
                }
            }
        );

    if (!response.ok) {

        throw new Error(
            "Não foi possível validar sua sessão."
        );

    }

    return await response.json();

}


/* =========================================================
   REDIRECIONAMENTO POR PERFIL
========================================================= */

function redirecionarUsuario(usuario) {

    const perfil =
        String(
            usuario.perfil || ""
        ).toUpperCase();

    if (perfil === "ADMIN") {

        window.location.href =
            "index.html";

        return;

    }

    if (perfil === "USER") {

        window.location.href =
            "usuario.html";

        return;

    }

    mostrarMensagem(
        "Perfil de usuário não reconhecido."
    );

    definirCarregando(false);

}


/* =========================================================
   LOGIN
========================================================= */

if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();

            const email =
                emailInput.value.trim();

            const senha =
                senhaInput.value;

            if (!email || !senha) {

                mostrarMensagem(
                    "Preencha o e-mail e a senha."
                );

                return;

            }

            mostrarMensagem("");

            definirCarregando(true);

            try {

                /* -----------------------------------------
                   1. REALIZA LOGIN
                ----------------------------------------- */

                const response =
                    await apiFetch(
                        `${API_URL}/auth/login`,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify({
                                    email: email,
                                    senha: senha
                                })
                        }
                    );


                /* -----------------------------------------
                   2. LOGIN INVÁLIDO
                ----------------------------------------- */

                if (!response.ok) {

                    if (
                        response.status === 401
                    ) {

                        throw new Error(
                            "E-mail ou senha inválidos."
                        );

                    }

                    throw new Error(
                        "Não foi possível realizar o login."
                    );

                }


                /* -----------------------------------------
                   3. RECEBE JWT
                ----------------------------------------- */

                const dados =
                    await response.json();

                const token =
                    dados.access_token;

                if (!token) {

                    throw new Error(
                        "Token de acesso não recebido."
                    );

                }


                /* -----------------------------------------
                   4. SALVA TOKEN
                ----------------------------------------- */

                sessionStorage.setItem(
                    "ev_chargeops_token",
                    token
                );


                /* -----------------------------------------
                   5. BUSCA /AUTH/ME
                ----------------------------------------- */

                const usuario =
                    await buscarUsuario(
                        token
                    );


                /* -----------------------------------------
                   6. SALVA DADOS DO USUÁRIO
                ----------------------------------------- */

                sessionStorage.setItem(
                    "ev_chargeops_usuario",
                    JSON.stringify(
                        usuario
                    )
                );


                /* -----------------------------------------
                   7. REDIRECIONA PELO PERFIL
                ----------------------------------------- */

                redirecionarUsuario(
                    usuario
                );

            }
            catch (erro) {

                console.error(
                    "Erro no login:",
                    erro
                );

                sessionStorage.removeItem(
                    "ev_chargeops_token"
                );

                sessionStorage.removeItem(
                    "ev_chargeops_usuario"
                );

                mostrarMensagem(
                    erro.message ||
                    "Erro ao realizar login."
                );

                definirCarregando(false);

            }

        }
    );

}


/* =========================================================
   ESQUECI MINHA SENHA
========================================================= */

if (forgotPassword) {

    forgotPassword.addEventListener(
        "click",
        (event) => {

            event.preventDefault();

            mostrarMensagem(
                "A recuperação de senha será configurada em seguida."
            );

        }
    );

}