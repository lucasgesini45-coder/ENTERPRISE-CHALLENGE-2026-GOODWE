const carregarPaginaCarregadores = () => {

    const pagina =
        document.getElementById(
            "page-chargers"
        );

    if (!pagina) {
        return;
    }


    /* =========================================
       BOTÃO NOVO CARREGADOR
    ========================================= */

    const areaAcoes =
        pagina.querySelector(
            ".topbar-actions"
        );


    const botaoNovo =
        document.createElement(
            "button"
        );

    botaoNovo.type =
        "button";

    botaoNovo.className =
        "primary-action";

    botaoNovo.textContent =
        "+ Novo carregador";


    areaAcoes.prepend(
        botaoNovo
    );


    /* =========================================
       MODAL
    ========================================= */

    const modal =
        document.createElement(
            "div"
        );


    modal.className =
        "modal-overlay";


    modal.innerHTML = `

        <div class="modal-card">

            <div class="modal-header">

                <div>

                    <span class="section-label">
                        Infraestrutura
                    </span>

                    <h2>
                        Novo Carregador
                    </h2>

                    <p>
                        Cadastre um equipamento
                        no EV ChargeOps.
                    </p>

                </div>


                <button
                    class="modal-close"
                    type="button"
                    aria-label="Fechar"
                >
                    ×
                </button>

            </div>


            <form id="form-carregador">


                <div class="form-grid">


                    <!-- NOME -->

                    <div class="form-group">

                        <label for="charger-name">
                            Nome do carregador
                        </label>

                        <input
                            id="charger-name"
                            name="nome"
                            type="text"
                            placeholder="GoodWe HCA G2"
                            required
                        >

                    </div>


                    <!-- SERIAL -->

                    <div class="form-group">

                        <label for="charger-serial">
                            Serial GoodWe
                        </label>

                        <input
                            id="charger-serial"
                            name="serial_number"
                            type="text"
                            placeholder="57000HPA247L0002"
                            required
                        >

                    </div>


                    <!-- MODELO -->

                    <div class="form-group">

                        <label for="charger-model">
                            Modelo
                        </label>

                        <input
                            id="charger-model"
                            name="modelo"
                            type="text"
                            placeholder="HCA G2"
                        >

                    </div>


                    <!-- POTÊNCIA -->

                    <div class="form-group">

                        <label for="charger-power">
                            Potência máxima (kW)
                        </label>

                        <input
                            id="charger-power"
                            name="potencia_maxima"
                            type="number"
                            min="0"
                            step="0.1"
                            placeholder="7.4"
                        >

                    </div>


                    <!-- LOCALIZAÇÃO -->

                    <div class="form-group form-full">

                        <label for="charger-location">
                            Localização
                        </label>

                        <input
                            id="charger-location"
                            name="localizacao"
                            type="text"
                            placeholder="Garagem - Bloco A"
                            required
                        >

                    </div>


                    <!-- STATUS -->

                    <div class="form-group">

                        <label for="charger-status">
                            Status
                        </label>

                        <select
                            id="charger-status"
                            name="status"
                            required
                        >

                            <option value="ATIVO">
                                Ativo
                            </option>

                            <option value="EM_RECARGA">
                                Em recarga
                            </option>

                            <option value="OFFLINE">
                                Offline
                            </option>

                        </select>

                    </div>


                </div>


                <div
                    id="charger-form-message"
                    class="form-message"
                >
                </div>


                <div class="modal-actions">

                    <button
                        class="secondary-action"
                        id="cancelar-carregador"
                        type="button"
                    >
                        Cancelar
                    </button>


                    <button
                        class="primary-action"
                        id="salvar-carregador"
                        type="submit"
                    >
                        Cadastrar carregador
                    </button>

                </div>


            </form>

        </div>
    `;


    document.body.appendChild(
        modal
    );


    /* =========================================
       ABRIR / FECHAR MODAL
    ========================================= */

    function abrirModal() {

        modal.classList.add(
            "show"
        );

        document.getElementById(
            "charger-name"
        ).focus();
    }


    function fecharModal() {

        modal.classList.remove(
            "show"
        );


        document.getElementById(
            "form-carregador"
        ).reset();


        const mensagem =
            document.getElementById(
                "charger-form-message"
            );


        mensagem.textContent =
            "";

        mensagem.className =
            "form-message";
    }


    botaoNovo.addEventListener(
        "click",
        abrirModal
    );


    modal
        .querySelector(
            ".modal-close"
        )
        .addEventListener(
            "click",
            fecharModal
        );


    document.getElementById(
        "cancelar-carregador"
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
       CADASTRAR NA API
    ========================================= */

    document.getElementById(
        "form-carregador"
    ).addEventListener(
        "submit",
        async evento => {

            evento.preventDefault();


            const mensagem =
                document.getElementById(
                    "charger-form-message"
                );


            const botaoSalvar =
                document.getElementById(
                    "salvar-carregador"
                );


            const potenciaInput =
                document.getElementById(
                    "charger-power"
                ).value;


            const carregador = {

                nome:
                    document.getElementById(
                        "charger-name"
                    ).value.trim(),

                serial_number:
                    document.getElementById(
                        "charger-serial"
                    ).value.trim(),

                modelo:
                    document.getElementById(
                        "charger-model"
                    ).value.trim() || null,

                potencia_maxima:
                    potenciaInput
                        ? Number(potenciaInput)
                        : null,

                localizacao:
                    document.getElementById(
                        "charger-location"
                    ).value.trim(),

                status:
                    document.getElementById(
                        "charger-status"
                    ).value

            };


            /* =========================================
               VALIDAÇÃO
            ========================================= */

            if (
                carregador.potencia_maxima !== null &&
                (
                    Number.isNaN(
                        carregador.potencia_maxima
                    ) ||
                    carregador.potencia_maxima < 0
                )
            ) {

                mensagem.className =
                    "form-message error";


                mensagem.textContent =
                    "Informe uma potência válida.";

                return;
            }


            botaoSalvar.disabled =
                true;


            botaoSalvar.textContent =
                "Cadastrando...";


            mensagem.className =
                "form-message";


            mensagem.textContent =
                "";


            try {

                const resposta =
                    await fetch(
                        `${API_URL}/carregadores/`,
                        {

                            method:
                                "POST",

                            headers: {

                                "Content-Type":
                                    "application/json"

                            },

                            body:
                                JSON.stringify(
                                    carregador
                                )

                        }
                    );


                if (!resposta.ok) {

                    let textoErro =
                        "Não foi possível cadastrar o carregador.";


                    try {

                        const erro =
                            await resposta.json();


                        if (erro.detail) {

                            textoErro =
                                typeof erro.detail === "string"
                                    ? erro.detail
                                    : textoErro;

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
                    "Carregador cadastrado com sucesso.";


                await carregarCarregadores();


                setTimeout(
                    fecharModal,
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
                    "Cadastrar carregador";

            }

        }
    );

};


carregarPaginaCarregadores();