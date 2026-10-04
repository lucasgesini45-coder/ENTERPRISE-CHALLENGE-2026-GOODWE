const ASSISTENTE_IA_API =
    "http://127.0.0.1:8000";


/* =========================================================
   ESTILO
========================================================= */

const assistenteStyle =
    document.createElement("style");

assistenteStyle.textContent = `

    .assistente-ia-button {
        position: fixed;
        right: 24px;
        bottom: 24px;

        width: 62px;
        height: 62px;

        border:
            1px solid
            rgba(0, 229, 255, 0.28);

        border-radius: 50%;

        cursor: pointer;

        z-index: 9998;

        display: flex;
        align-items: center;
        justify-content: center;

        color: #ffffff;

        background:
            rgba(6, 10, 14, 0.92);

        box-shadow:
            0 0 0 1px
            rgba(255, 255, 255, 0.04),
            0 12px 38px
            rgba(0, 0, 0, 0.5),
            0 0 28px
            rgba(0, 229, 255, 0.12);

        backdrop-filter:
            blur(16px);

        -webkit-backdrop-filter:
            blur(16px);

        transition:
            transform 0.2s ease,
            border-color 0.2s ease,
            box-shadow 0.2s ease;
    }

    .assistente-ia-button:hover {
        transform:
            translateY(-3px)
            scale(1.04);

        border-color:
            rgba(0, 229, 255, 0.65);

        box-shadow:
            0 16px 45px
            rgba(0, 0, 0, 0.55),
            0 0 34px
            rgba(0, 229, 255, 0.24);
    }

    .assistente-ia-button svg {
        width: 32px;
        height: 32px;

        stroke: #00e5ff;

        fill: none;

        stroke-width: 1.7;

        stroke-linecap: round;

        stroke-linejoin: round;
    }


    .assistente-ia-panel {
        position: fixed;

        right: 24px;
        bottom: 100px;

        width: 410px;

        max-width:
            calc(100vw - 32px);

        height: 600px;

        max-height:
            calc(100vh - 130px);

        z-index: 9999;

        display: none;

        flex-direction: column;

        overflow: hidden;

        border-radius: 22px;

        background:
            rgba(4, 7, 10, 0.82);

        border:
            1px solid
            rgba(255, 255, 255, 0.08);

        box-shadow:
            0 30px 90px
            rgba(0, 0, 0, 0.58);

        backdrop-filter:
            blur(22px);

        -webkit-backdrop-filter:
            blur(22px);
    }

    .assistente-ia-panel.show {
        display: flex;

        animation:
            assistenteEntrada
            0.22s ease;
    }

    @keyframes assistenteEntrada {

        from {
            opacity: 0;

            transform:
                translateY(12px)
                scale(0.98);
        }

        to {
            opacity: 1;

            transform:
                translateY(0)
                scale(1);
        }

    }


    .assistente-ia-header {
        padding:
            18px 20px;

        display: flex;

        align-items: center;

        justify-content:
            space-between;

        background:
            rgba(255, 255, 255, 0.025);

        border-bottom:
            1px solid
            rgba(255, 255, 255, 0.07);

        color: #ffffff;
    }

    .assistente-ia-header-info {
        display: flex;

        align-items: center;

        gap: 12px;
    }

    .assistente-ia-header-icon {
        width: 42px;
        height: 42px;

        border-radius: 13px;

        display: flex;

        align-items: center;

        justify-content: center;

        background:
            rgba(0, 229, 255, 0.07);

        border:
            1px solid
            rgba(0, 229, 255, 0.17);

        box-shadow:
            inset 0 0 18px
            rgba(0, 229, 255, 0.04);
    }

    .assistente-ia-header-icon svg {
        width: 23px;
        height: 23px;

        stroke: #00e5ff;

        fill: none;

        stroke-width: 1.7;

        stroke-linecap: round;

        stroke-linejoin: round;
    }

    .assistente-ia-header h3 {
        margin: 0;

        font-size: 15px;

        font-weight: 650;

        letter-spacing:
            -0.2px;
    }

    .assistente-ia-header-status {
        margin-top: 4px;

        display: flex;

        align-items: center;

        gap: 6px;

        font-size: 11px;

        color: #9ca3af;
    }

    .assistente-ia-header-status::before {
        content: "";

        width: 7px;
        height: 7px;

        border-radius: 50%;

        background: #2ee6a6;

        box-shadow:
            0 0 8px
            rgba(46, 230, 166, 0.65);
    }


    .assistente-ia-close {
        width: 34px;
        height: 34px;

        border: none;

        border-radius: 10px;

        background:
            rgba(255, 255, 255, 0.04);

        color: #9ca3af;

        font-size: 21px;

        cursor: pointer;

        transition:
            color 0.2s ease,
            background 0.2s ease;
    }

    .assistente-ia-close:hover {
        color: #ffffff;

        background:
            rgba(255, 255, 255, 0.08);
    }


    .assistente-ia-messages {
        flex: 1;

        padding: 20px;

        overflow-y: auto;

        display: flex;

        flex-direction: column;

        gap: 14px;

        scrollbar-width: thin;
    }


    .assistente-message {
        max-width: 86%;

        padding:
            12px 14px;

        border-radius: 15px;

        font-size: 13.5px;

        line-height: 1.55;

        white-space: pre-wrap;
    }


    .assistente-message.bot {
        align-self:
            flex-start;

        color: #e5e7eb;

        background:
            rgba(255, 255, 255, 0.055);

        border:
            1px solid
            rgba(255, 255, 255, 0.055);

        border-bottom-left-radius:
            5px;
    }


    .assistente-message.user {
        align-self:
            flex-end;

        color: #061015;

        font-weight: 500;

        background:
            linear-gradient(
                135deg,
                #00e5ff,
                #33e6b0
            );

        border-bottom-right-radius:
            5px;

        box-shadow:
            0 8px 24px
            rgba(0, 229, 255, 0.10);
    }


    .assistente-ia-form {
        padding: 14px;

        display: flex;

        gap: 9px;

        border-top:
            1px solid
            rgba(255, 255, 255, 0.07);

        background:
            rgba(0, 0, 0, 0.20);
    }


    .assistente-ia-input {
        flex: 1;

        min-width: 0;

        padding:
            12px 14px;

        border-radius: 12px;

        border:
            1px solid
            rgba(255, 255, 255, 0.08);

        outline: none;

        background:
            rgba(255, 255, 255, 0.045);

        color: #ffffff;

        transition:
            border-color 0.2s ease,
            background 0.2s ease;
    }

    .assistente-ia-input:focus {
        border-color:
            rgba(0, 229, 255, 0.38);

        background:
            rgba(255, 255, 255, 0.065);
    }

    .assistente-ia-input::placeholder {
        color: #737b86;
    }


    .assistente-ia-send {
        border: none;

        min-width: 76px;

        padding:
            0 16px;

        border-radius: 12px;

        cursor: pointer;

        color: #071015;

        font-weight: 650;

        background:
            linear-gradient(
                135deg,
                #00e5ff,
                #33e6b0
            );

        transition:
            transform 0.2s ease,
            opacity 0.2s ease;
    }

    .assistente-ia-send:hover {
        transform:
            translateY(-1px);
    }

    .assistente-ia-send:disabled {
        opacity: 0.55;

        cursor: wait;

        transform: none;
    }


    @media (
        max-width: 600px
    ) {

        .assistente-ia-panel {
            right: 16px;

            bottom: 90px;

            width:
                calc(100vw - 32px);

            height:
                calc(100vh - 125px);
        }

        .assistente-ia-button {
            right: 16px;

            bottom: 16px;
        }

    }

`;

document.head.appendChild(
    assistenteStyle
);


/* =========================================================
   BOTÃO FLUTUANTE
========================================================= */

const assistenteButton =
    document.createElement(
        "button"
    );

assistenteButton.className =
    "assistente-ia-button";

assistenteButton.type =
    "button";

assistenteButton.title =
    "Assistente EV ChargeOps";

assistenteButton.setAttribute(
    "aria-label",
    "Abrir assistente EV ChargeOps"
);

assistenteButton.innerHTML = `

    <svg
        viewBox="0 0 32 32"
        aria-hidden="true"
    >

        <path
            d="
                M16 6
                V3.5
            "
        />

        <circle
            cx="16"
            cy="2.7"
            r="1.2"
        />

        <rect
            x="7"
            y="8"
            width="18"
            height="16"
            rx="5"
        />

        <path
            d="
                M7 14
                H4.5
                V19
                H7
            "
        />

        <path
            d="
                M25 14
                H27.5
                V19
                H25
            "
        />

        <circle
            cx="12.5"
            cy="15"
            r="1.2"
        />

        <circle
            cx="19.5"
            cy="15"
            r="1.2"
        />

        <path
            d="
                M12 20
                C14 21.5
                18 21.5
                20 20
            "
        />

        <path
            d="
                M11 24
                V27
            "
        />

        <path
            d="
                M21 24
                V27
            "
        />

    </svg>

`;


/* =========================================================
   PAINEL
========================================================= */

const assistentePanel =
    document.createElement(
        "div"
    );

assistentePanel.className =
    "assistente-ia-panel";

assistentePanel.innerHTML = `

    <div
        class="assistente-ia-header"
    >

        <div
            class="assistente-ia-header-info"
        >

            <div
                class="assistente-ia-header-icon"
            >

                <svg
                    viewBox="0 0 32 32"
                    aria-hidden="true"
                >

                    <path
                        d="
                            M16 8
                            V5
                        "
                    />

                    <circle
                        cx="16"
                        cy="4"
                        r="1"
                    />

                    <rect
                        x="7"
                        y="8"
                        width="18"
                        height="16"
                        rx="5"
                    />

                    <circle
                        cx="12.5"
                        cy="15"
                        r="1.2"
                    />

                    <circle
                        cx="19.5"
                        cy="15"
                        r="1.2"
                    />

                    <path
                        d="
                            M12 20
                            C14 21.5
                            18 21.5
                            20 20
                        "
                    />

                </svg>

            </div>


            <div>

                <h3>
                    EV ChargeOps AI
                </h3>

                <div
                    class="assistente-ia-header-status"
                >
                    Assistente operacional online
                </div>

            </div>

        </div>


        <button
            class="assistente-ia-close"
            type="button"
            aria-label="Fechar assistente"
        >
            ×
        </button>

    </div>


    <div
        class="assistente-ia-messages"
        id="assistente-ia-messages"
    >

        <div
            class="assistente-message bot"
        >Olá! Eu sou o assistente inteligente do EV ChargeOps.

Posso analisar os dados da operação e responder perguntas sobre:

• consumo de energia
• faturamento
• sessões de recarga
• carregadores mais utilizados
• anomalias
• previsão de consumo

Experimente perguntar:
“Qual foi o consumo nos últimos 30 dias?”</div>

    </div>


    <form
        class="assistente-ia-form"
        id="assistente-ia-form"
    >

        <input
            class="assistente-ia-input"
            id="assistente-ia-input"
            type="text"
            autocomplete="off"
            placeholder="Pergunte sobre a operação..."
        >

        <button
            class="assistente-ia-send"
            id="assistente-ia-send"
            type="submit"
        >
            Enviar
        </button>

    </form>

`;


/* =========================================================
   ADICIONA NA PÁGINA
========================================================= */

document.body.appendChild(
    assistentePanel
);

document.body.appendChild(
    assistenteButton
);


/* =========================================================
   ELEMENTOS
========================================================= */

const assistenteMessages =
    document.getElementById(
        "assistente-ia-messages"
    );

const assistenteForm =
    document.getElementById(
        "assistente-ia-form"
    );

const assistenteInput =
    document.getElementById(
        "assistente-ia-input"
    );

const assistenteSend =
    document.getElementById(
        "assistente-ia-send"
    );

const assistenteClose =
    assistentePanel.querySelector(
        ".assistente-ia-close"
    );


/* =========================================================
   ABRIR / FECHAR
========================================================= */

assistenteButton.addEventListener(
    "click",
    () => {

        assistentePanel.classList.toggle(
            "show"
        );

        if (
            assistentePanel.classList.contains(
                "show"
            )
        ) {

            setTimeout(
                () => {

                    assistenteInput.focus();

                },
                100
            );

        }

    }
);


assistenteClose.addEventListener(
    "click",
    () => {

        assistentePanel.classList.remove(
            "show"
        );

    }
);


/* =========================================================
   ADICIONAR MENSAGEM
========================================================= */

function adicionarMensagem(
    texto,
    tipo
) {

    const mensagem =
        document.createElement(
            "div"
        );

    mensagem.className =
        `assistente-message ${tipo}`;

    mensagem.textContent =
        texto;

    assistenteMessages.appendChild(
        mensagem
    );

    assistenteMessages.scrollTop =
        assistenteMessages.scrollHeight;

    return mensagem;

}

/* =========================================================
   USUÁRIO LOGADO
========================================================= */

function obterUsuarioIdAssistente() {

    const usuarioSalvo =
        localStorage.getItem(
            "ev_chargeops_usuario"
        );

    if (!usuarioSalvo) {
        return null;
    }

    try {

        const usuario =
            JSON.parse(
                usuarioSalvo
            );

        const perfil =
            String(
                usuario.perfil || ""
            ).toUpperCase();

        /*
         * ADMIN consulta visão geral
         * da operação.
         */
        if (
            perfil === "ADMIN"
        ) {
            return null;
        }

        /*
         * USER consulta somente
         * os próprios dados.
         */
        if (
            perfil === "USER" &&
            usuario.id
        ) {
            return Number(
                usuario.id
            );
        }

        return null;

    }
    catch (erro) {

        console.error(
            "Erro ao identificar usuário do assistente:",
            erro
        );

        return null;

    }

}

/* =========================================================
   ENVIAR PERGUNTA
========================================================= */

assistenteForm.addEventListener(
    "submit",
    async event => {

        event.preventDefault();

        const pergunta =
            assistenteInput.value.trim();

        if (!pergunta) {
            return;
        }

        adicionarMensagem(
            pergunta,
            "user"
        );

        assistenteInput.value =
            "";

        assistenteSend.disabled =
            true;

        const aguardando =
            adicionarMensagem(
                "Analisando os dados da operação...",
                "bot"
            );

        try {

            const resposta =
                await fetch(
                    `${ASSISTENTE_IA_API}/assistente-ia/perguntar`,
                    {
                        method:
                            "POST",

                        headers: {
                            "Content-Type":
                                "application/json",

                            "Authorization":
                                `Bearer ${localStorage.getItem("ev_chargeops_token")}`
                        },

                        body:
                            JSON.stringify({
                                pergunta:
                                    pergunta
                            })
                    }
                );


            const dados =
                await resposta.json();


            aguardando.remove();


            if (!resposta.ok) {

                throw new Error(
                    dados.detail ||
                    "Não foi possível consultar o assistente."
                );

            }


            adicionarMensagem(
                dados.resposta ||
                "Não encontrei uma resposta.",
                "bot"
            );


            if (dados.aviso) {

                adicionarMensagem(
                    dados.aviso,
                    "bot"
                );

            }

        }
        catch (erro) {

            if (
                document.body.contains(
                    aguardando
                )
            ) {

                aguardando.remove();

            }

            console.error(
                "Erro no assistente IA:",
                erro
            );

            adicionarMensagem(
                "Não consegui consultar os dados agora. Tente novamente.",
                "bot"
            );

        }
        finally {

            assistenteSend.disabled =
                false;

            assistenteInput.focus();

        }

    }
);