const API_URL =
    "https://enterprise-challenge-2026-goodwe.onrender.com";

const formCadastro =
    document.getElementById(
        "form-cadastro"
    );

const mensagem =
    document.getElementById(
        "cadastro-mensagem"
    );

const botaoCadastrar =
    document.getElementById(
        "btn-cadastrar"
    );


formCadastro.addEventListener(
    "submit",
    async evento => {

        evento.preventDefault();

        mensagem.textContent = "";
        mensagem.className =
            "form-message";

        const nome =
            document.getElementById(
                "nome"
            ).value.trim();

        const email =
            document.getElementById(
                "email"
            ).value.trim();

        const telefone =
            document.getElementById(
                "telefone"
            ).value.trim();

        const senha =
            document.getElementById(
                "senha"
            ).value;

        const confirmarSenha =
            document.getElementById(
                "confirmar-senha"
            ).value;

        if (
            senha.length < 8
        ) {
            mensagem.textContent =
                "A senha deve ter pelo menos 8 caracteres.";

            mensagem.classList.add(
                "error"
            );

            return;
        }

        if (
            senha !== confirmarSenha
        ) {
            mensagem.textContent =
                "As senhas não conferem.";

            mensagem.classList.add(
                "error"
            );

            return;
        }

        botaoCadastrar.disabled =
            true;

        botaoCadastrar.textContent =
            "Criando conta...";

        try {

            const resposta =
                await fetch(
                    `${API_URL}/usuarios/cadastro`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify({
                                nome,
                                email,
                                telefone:
                                    telefone || null,
                                senha
                            })
                    }
                );

            const dados =
                await resposta.json();

            if (!resposta.ok) {
                throw new Error(
                    dados.detail ??
                    "Não foi possível criar a conta."
                );
            }

            mensagem.textContent =
                "Conta criada com sucesso. Redirecionando para o login...";

            mensagem.classList.add(
                "success"
            );

            formCadastro.reset();

            setTimeout(
                () => {
                    window.location.href =
                        "login.html";
                },
                1500
            );

        } catch (erro) {

            mensagem.textContent =
                erro.message;

            mensagem.classList.add(
                "error"
            );

        } finally {

            botaoCadastrar.disabled =
                false;

            botaoCadastrar.textContent =
                "Criar conta";
        }
    }
);