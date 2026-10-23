const output =
    document.getElementById(
        "result"
    );

const queueKey =
    "evchargeops-pending-measurements-v1";

const archiveKey =
    queueKey +
    "-archive";


let usuariosCache = [];
let carregadoresCache = [];
let cartoesCache = [];
let sessoesCache = [];


/* =========================================
   UTILITÁRIOS
========================================= */

function escapeHtml(
    valor
) {

    if (
        valor === null ||
        valor === undefined
    ) {
        return "";
    }


    return String(
        valor
    )
        .replaceAll(
            "&",
            "&amp;"
        )
        .replaceAll(
            "<",
            "&lt;"
        )
        .replaceAll(
            ">",
            "&gt;"
        )
        .replaceAll(
            '"',
            "&quot;"
        )
        .replaceAll(
            "'",
            "&#039;"
        );

}


function display(
    value
) {

    output.classList.add(
        "show"
    );


    output.textContent =
        typeof value ===
        "string"
            ? value
            : JSON.stringify(
                value,
                null,
                2
            );

}


function fields(
    form
) {

    return Object.fromEntries(
        new FormData(
            form
        )
    );

}


function queue() {

    const saved =
        JSON.parse(
            localStorage.getItem(
                queueKey
            ) ||
            "[]"
        );


    if (
        !Array.isArray(
            saved
        )
    ) {

        throw Error(
            "Fila local inválida."
        );

    }


    return saved;

}


function archive() {

    const saved =
        JSON.parse(
            localStorage.getItem(
                archiveKey
            ) ||
            "[]"
        );


    if (
        !Array.isArray(
            saved
        )
    ) {

        throw Error(
            "Arquivo local inválido."
        );

    }


    return saved;

}


function saveQueue(
    items
) {

    localStorage.setItem(
        queueKey,
        JSON.stringify(
            items
        )
    );


    atualizarResumo();

    renderQueueItems();

}


async function send(
    path,
    body,
    method = "POST"
) {

    const response =
        await apiFetch(
            API_URL + path,
            {
                method,

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body:
                    JSON.stringify(
                        body
                    )
            }
        );


    const data =
        await response.json();


    if (!response.ok) {

        const error =
            Error(
                typeof data.detail ===
                "string"
                    ? data.detail
                    : JSON.stringify(
                        data.detail
                    )
            );


        error.status =
            response.status;


        throw error;

    }


    return data;

}


function dataLocal(
    valor
) {

    if (!valor) {
        return "--";
    }


    const data =
        typeof sessionDate ===
        "function"
            ? sessionDate(
                valor
            )
            : new Date(
                valor
            );


    return data
        .toLocaleString(
            "pt-BR"
        );

}


function usuarioPorId(
    id
) {

    return (
        usuariosCache
            .find(
                item =>
                    Number(
                        item.id
                    ) ===
                    Number(
                        id
                    )
            ) ??
        null
    );

}


function carregadorPorId(
    id
) {

    return (
        carregadoresCache
            .find(
                item =>
                    Number(
                        item.id
                    ) ===
                    Number(
                        id
                    )
            ) ??
        null
    );

}


/* =========================================
   CARREGAR CENTRAL
========================================= */

async function carregarCentral() {

    const lista =
        document.getElementById(
            "pending-list"
        );


    lista.innerHTML = `
        <div class="empty-state">
            Carregando sessões...
        </div>
    `;


    try {

        const [
            respostaSessoes,
            respostaUsuarios,
            respostaCarregadores,
            respostaCartoes
        ] =
            await Promise.all([

                apiFetch(
                    `${API_URL}/sessoes/`
                ),

                apiFetch(
                    `${API_URL}/usuarios/`
                ),

                apiFetch(
                    `${API_URL}/carregadores/`
                ),

                apiFetch(
                    `${API_URL}/cartoes/`
                )

            ]);


        if (
            !respostaSessoes.ok ||
            !respostaUsuarios.ok ||
            !respostaCarregadores.ok ||
            !respostaCartoes.ok
        ) {

            throw Error(
                "Não foi possível carregar os dados de contingência."
            );

        }


        const sessoes =
            await respostaSessoes
                .json();


        const usuarios =
            await respostaUsuarios
                .json();


        const carregadores =
            await respostaCarregadores
                .json();


        const cartoes =
            await respostaCartoes
                .json();


        sessoesCache =
            sessoes.sessoes ??
            [];


        usuariosCache =
            usuarios.usuarios ??
            [];


        carregadoresCache =
            carregadores.carregadores ??
            [];


        cartoesCache =
            cartoes.cartoes ??
            [];


        preencherSelects();

        renderPendentes();

        renderQueueItems();

        atualizarResumo();


        document.getElementById(
            "metric-update"
        ).textContent =
            new Date()
                .toLocaleTimeString(
                    "pt-BR",
                    {
                        hour:
                            "2-digit",

                        minute:
                            "2-digit"
                    }
                );


    } catch (
        erro
    ) {

        console.error(
            "Erro na central:",
            erro
        );


        lista.innerHTML = `
            <div class="empty-state">
                Não foi possível carregar as sessões.
            </div>
        `;


        display(
            erro.message
        );

    }

}


/* =========================================
   RESUMO
========================================= */

function atualizarResumo() {

    const pendentes =
        sessoesCache.filter(
            sessao =>
                String(
                    sessao.status
                )
                .toUpperCase() ===
                "PENDENTE_CONCILIACAO"
        );


    document.getElementById(
        "metric-pending"
    ).textContent =
        pendentes.length;


    let fila = [];

    let arquivados = [];


    try {

        fila =
            queue();


        arquivados =
            archive();


    } catch (
        erro
    ) {

        console.error(
            erro
        );

    }


    document.getElementById(
        "metric-queue"
    ).textContent =
        fila.length;


    const totalArquivado =
        arquivados.reduce(
            (
                total,
                grupo
            ) =>

                total +

                (
                    Array.isArray(
                        grupo.items
                    )
                        ? grupo.items.length
                        : 0
                ),

            0
        );


    document.getElementById(
        "metric-archived"
    ).textContent =
        totalArquivado;

}


/* =========================================
   SESSÕES PENDENTES
========================================= */

function renderPendentes() {

    const container =
        document.getElementById(
            "pending-list"
        );


    const pendentes =
        sessoesCache
            .filter(
                sessao =>
                    String(
                        sessao.status
                    )
                    .toUpperCase() ===
                    "PENDENTE_CONCILIACAO"
            )
            .sort(
                (
                    a,
                    b
                ) =>

                    new Date(
                        b.ultima_medicao ??
                        b.inicio
                    ) -

                    new Date(
                        a.ultima_medicao ??
                        a.inicio
                    )
            );


    if (
        !pendentes.length
    ) {

        container.innerHTML = `
            <div class="empty-state">
                Nenhuma sessão pendente de conciliação.
            </div>
        `;

        return;

    }


    container.innerHTML =
        "";


    pendentes.forEach(
        sessao => {

            const usuario =
                usuarioPorId(
                    sessao.usuario_id
                );


            const carregador =
                carregadorPorId(
                    sessao.carregador_id
                );


            const card =
                document.createElement(
                    "article"
                );


            card.className =
                "incident-card";


            card.innerHTML = `

                <div>

                    <div class="incident-top">

                        <span class="incident-title">
                            Sessão #${sessao.id}
                        </span>

                        <span class="badge badge-warning">
                            Pendente de conciliação
                        </span>

                    </div>


                    <div class="incident-meta">

                        <div class="meta-item">

                            <span>
                                Usuário
                            </span>

                            <strong>
                                ${
                                    escapeHtml(
                                        usuario?.nome ??
                                        "Não associado"
                                    )
                                }
                            </strong>

                        </div>


                        <div class="meta-item">

                            <span>
                                Carregador
                            </span>

                            <strong>
                                ${
                                    escapeHtml(
                                        carregador?.nome ??
                                        `#${sessao.carregador_id ?? "--"}`
                                    )
                                }
                            </strong>

                        </div>


                        <div class="meta-item">

                            <span>
                                Consumo atual
                            </span>

                            <strong>
                                ${
                                    Number(
                                        sessao.consumo_kwh ??
                                        0
                                    )
                                    .toFixed(
                                        2
                                    )
                                }
                                kWh
                            </strong>

                        </div>


                        <div class="meta-item">

                            <span>
                                Última medição
                            </span>

                            <strong>
                                ${
                                    dataLocal(
                                        sessao.ultima_medicao ??
                                        sessao.inicio
                                    )
                                }
                            </strong>

                        </div>

                    </div>

                </div>


                <div class="incident-actions">

                    <button
                        class="btn"
                        type="button"
                        data-review="${sessao.id}"
                    >
                        Revisar
                    </button>

                    <button
                        class="btn btn-primary"
                        type="button"
                        data-finish="${sessao.id}"
                    >
                        Registrar encerramento
                    </button>

                </div>

            `;


            container.appendChild(
                card
            );

        }
    );

}


/* =========================================
   FILA LOCAL
========================================= */

function renderQueueItems() {

    const container =
        document.getElementById(
            "queue-items"
        );


    let items = [];


    try {

        items =
            queue();


    } catch (
        erro
    ) {

        container.innerHTML = `
            <div class="queue-item">
                ${escapeHtml(
                    erro.message
                )}
            </div>
        `;

        return;

    }


    if (
        !items.length
    ) {

        container.innerHTML = `
            <div class="empty-state">
                Nenhuma medição aguardando reenvio.
            </div>
        `;

        return;

    }


    container.innerHTML =
        items
            .map(
                item => {

                    const sessao =
                        String(
                            item.path
                        )
                        .match(
                            /sessoes\/(\d+)/
                        )?.[1] ??
                        "--";


                    return `

                        <div class="queue-item">

                            <strong>
                                Sessão #${sessao}
                            </strong>

                            <br>

                            ${
                                dataLocal(
                                    item.body
                                        ?.instante
                                )
                            }

                            •

                            ${
                                Number(
                                    item.body
                                        ?.consumo_kwh ??
                                    0
                                )
                                .toFixed(
                                    2
                                )
                            }
                            kWh

                            •

                            ${
                                item.body
                                    ?.encerrar
                                    ? "encerramento"
                                    : "medição"
                            }

                        </div>

                    `;

                }
            )
            .join("");

}


/* =========================================
   SELECTS AUTOMÁTICOS
========================================= */

function preencherSelects() {

    const userSelect =
        document.getElementById(
            "start-user"
        );


    const chargerSelect =
        document.getElementById(
            "start-charger"
        );


    const cardSelect =
        document.getElementById(
            "start-card"
        );


    userSelect.innerHTML =
        usuariosCache
            .map(
                usuario => `

                    <option value="${usuario.id}">
                        ${escapeHtml(
                            usuario.nome
                        )}
                    </option>

                `
            )
            .join("");


    chargerSelect.innerHTML =
        carregadoresCache
            .map(
                carregador => `

                    <option value="${carregador.id}">
                        ${escapeHtml(
                            carregador.nome
                        )}
                    </option>

                `
            )
            .join("");


    atualizarCartoesDoUsuario();


    userSelect.addEventListener(
        "change",
        atualizarCartoesDoUsuario
    );


    function atualizarCartoesDoUsuario() {

        const usuarioId =
            Number(
                userSelect.value
            );


        const cartoes =
            cartoesCache.filter(
                cartao =>

                    Number(
                        cartao.usuario_id
                    ) ===
                    usuarioId

                    &&

                    String(
                        cartao.status
                    )
                    .toUpperCase() ===
                    "ATIVO"
            );


        cardSelect.innerHTML =
            cartoes.length
                ? cartoes
                    .map(
                        cartao => `

                            <option value="${cartao.id}">

                                ${
                                    escapeHtml(
                                        cartao.codigo ??
                                        cartao.uid
                                    )
                                }

                            </option>

                        `
                    )
                    .join("")

                : `

                    <option value="">
                        Nenhum cartão ativo
                    </option>

                `;

    }

}


/* =========================================
   AÇÕES DOS CARDS
========================================= */

document.addEventListener(
    "click",
    evento => {

        const revisar =
            evento.target.closest(
                "[data-review]"
            );


        const encerrar =
            evento.target.closest(
                "[data-finish]"
            );


        if (
            !revisar &&
            !encerrar
        ) {
            return;
        }


        const botao =
            revisar ??
            encerrar;


        const id =
            Number(
                revisar
                    ? botao.dataset.review
                    : botao.dataset.finish
            );


        const sessao =
            sessoesCache.find(
                item =>
                    Number(
                        item.id
                    ) ===
                    id
            );


        if (!sessao) {
            return;
        }


        abrirAvancado();


        document.getElementById(
            "measure-session"
        ).value =
            sessao.id;


        document.getElementById(
            "measure-consumption"
        ).value =
            Number(
                sessao.consumo_kwh ??
                0
            );


        document.getElementById(
            "measure-time"
        ).value =
            datetimeLocalAgora();


        if (
            encerrar
        ) {

            document.getElementById(
                "measure-finish"
            ).value =
                "true";

        }


        document.getElementById(
            "measure"
        ).scrollIntoView({
            behavior:
                "smooth",

            block:
                "center"
        });

    }
);


/* =========================================
   OPERAÇÕES AVANÇADAS
========================================= */

function abrirAvancado() {

    const area =
        document.getElementById(
            "advanced-area"
        );


    area.classList.add(
        "show"
    );


    document.getElementById(
        "btn-advanced"
    ).textContent =
        "Ocultar operações avançadas";

}


document.getElementById(
    "btn-advanced"
).addEventListener(
    "click",
    () => {

        const area =
            document.getElementById(
                "advanced-area"
            );


        area.classList.toggle(
            "show"
        );


        document.getElementById(
            "btn-advanced"
        ).textContent =
            area.classList.contains(
                "show"
            )
                ? "Ocultar operações avançadas"
                : "Operações avançadas";

    }
);


function datetimeLocalAgora() {

    const agora =
        new Date();


    agora.setMinutes(
        agora.getMinutes() -
        agora.getTimezoneOffset()
    );


    return agora
        .toISOString()
        .slice(
            0,
            16
        );

}


/* =========================================
   REGISTRAR INÍCIO
========================================= */

const startForm =
    document.getElementById(
        "start"
    );


let operationId;


try {

    operationId =
        sessionStorage.getItem(
            "evchargeops-start-id"
        ) ||
        crypto.randomUUID();


    sessionStorage.setItem(
        "evchargeops-start-id",
        operationId
    );


} catch {

    operationId =
        crypto.randomUUID();

}


startForm.addEventListener(
    "input",
    () => {

        operationId =
            crypto.randomUUID();


        sessionStorage.setItem(
            "evchargeops-start-id",
            operationId
        );

    }
);


startForm.addEventListener(
    "submit",
    async evento => {

        evento.preventDefault();


        const data =
            fields(
                startForm
            );


        const body = {

            chave_operacao:
                operationId,

            usuario_id:
                Number(
                    data.usuario_id
                ),

            carregador_id:
                Number(
                    data.carregador_id
                ),

            cartao_id:
                Number(
                    data.cartao_id
                ),

            inicio:
                new Date(
                    data.inicio
                ).toISOString(),

            tarifa:
                Number(
                    data.tarifa
                )

        };


        try {

            const resposta =
                await send(
                    "/sessoes/",
                    body
                );


            display(
                resposta
            );


            await carregarCentral();


        } catch (
            erro
        ) {

            display(
                erro.message +
                " — Tente novamente sem alterar os campos."
            );

        }

    }
);


/* =========================================
   MEDIÇÃO / ENCERRAMENTO
========================================= */

document.getElementById(
    "measure"
).addEventListener(
    "submit",
    async evento => {

        evento.preventDefault();


        const form =
            evento.target;


        const data =
            fields(
                form
            );


        const button =
            form.querySelector(
                "button"
            );


        if (
            button.disabled
        ) {
            return;
        }


        button.disabled =
            true;


        const body = {

            chave_evento:
                crypto.randomUUID(),

            instante:
                new Date(
                    data.instante
                ).toISOString(),

            consumo_kwh:
                Number(
                    data.consumo_kwh
                ),

            encerrar:
                data.encerrar ===
                "true"

        };


        const item = {

            path:
                `/sessoes/${
                    Number(
                        data.sessao_id
                    )
                }/medicoes`,

            body

        };


        try {

            const items =
                queue();


            items.push(
                item
            );


            saveQueue(
                items
            );


            const resposta =
                await send(
                    item.path,
                    item.body
                );


            saveQueue(

                queue()
                    .filter(
                        entry =>

                            entry.body
                                .chave_evento !==

                            body.chave_evento
                    )

            );


            display(
                resposta
            );


            await carregarCentral();


        } catch (
            erro
        ) {

            display(
                erro.message +
                " — Confira a fila antes de enviar outra medição."
            );


        } finally {

            button.disabled =
                false;

        }

    }
);


/* =========================================
   REENVIAR FILA
========================================= */

document.getElementById(
    "replay"
).addEventListener(
    "click",
    async () => {

        try {

            for (
                const item
                of queue()
            ) {

                await send(
                    item.path,
                    item.body
                );


                saveQueue(

                    queue()
                        .filter(
                            entry =>

                                entry.body
                                    .chave_evento !==

                                item.body
                                    .chave_evento
                        )

                );

            }


            display(
                "Reenvio concluído."
            );


            await carregarCentral();


        } catch (
            erro
        ) {

            display(
                "Reenvio pausado: " +
                erro.message +
                ". Os itens restantes foram preservados."
            );

        }

    }
);


/* =========================================
   MARCAR COMO PENDENTE
========================================= */

document.getElementById(
    "pending"
).addEventListener(
    "submit",
    async evento => {

        evento.preventDefault();


        try {

            const id =
                Number(
                    fields(
                        evento.target
                    )
                    .sessao_id
                );


            const resposta =
                await send(
                    `/sessoes/${id}/pendente`,
                    {},
                    "PATCH"
                );


            display(
                resposta
            );


            await carregarCentral();


        } catch (
            erro
        ) {

            display(
                erro.message
            );

        }

    }
);


/* =========================================
   RELATÓRIO SEMS
========================================= */

document.getElementById(
    "report"
).addEventListener(
    "submit",
    async evento => {

        evento.preventDefault();


        try {

            const response =
                await apiFetch(
                    API_URL +
                    "/goodwe/importar-relatorio",
                    {
                        method:
                            "POST",

                        body:
                            new FormData(
                                evento.target
                            )
                    }
                );


            const data =
                await response.json();


            if (
                !response.ok
            ) {

                throw Error(
                    JSON.stringify(
                        data.detail
                    )
                );

            }


            display(
                data
            );


        } catch (
            erro
        ) {

            display(
                erro.message
            );

        }

    }
);


/* =========================================
   REVISÃO DA FILA
========================================= */

function renderQueueReview() {

    const items =
        queue();


    const panel =
        document.getElementById(
            "queue-review"
        );


    panel.hidden =
        false;


    panel.replaceChildren();


    const title =
        document.createElement(
            "h3"
        );


    title.textContent =
        "Revisar tentativas pendentes";


    panel.append(
        title
    );


    if (
        !items.length
    ) {

        const vazio =
            document.createElement(
                "p"
            );


        vazio.textContent =
            "Nenhuma tentativa pendente.";


        panel.append(
            vazio
        );


        return;

    }


    const selected =
        new Set();


    items.forEach(
        item => {

            const label =
                document.createElement(
                    "label"
                );


            label.style.display =
                "flex";

            label.style.gap =
                "8px";

            label.style.alignItems =
                "flex-start";

            label.style.padding =
                "10px 0";


            const checkbox =
                document.createElement(
                    "input"
                );


            checkbox.type =
                "checkbox";

            checkbox.style.width =
                "auto";


            const key =
                JSON.stringify(
                    item
                );


            checkbox.addEventListener(
                "change",
                () => {

                    if (
                        checkbox.checked
                    ) {

                        selected.add(
                            key
                        );

                    } else {

                        selected.delete(
                            key
                        );

                    }

                }
            );


            const descricao =
                document.createElement(
                    "span"
                );


            descricao.textContent =
                `${item.path} — ` +
                `${dataLocal(
                    item.body.instante
                )} — ` +
                `${item.body.consumo_kwh} kWh`;


            label.append(
                checkbox,
                descricao
            );


            panel.append(
                label
            );

        }
    );


    const discard =
        document.createElement(
            "button"
        );


    discard.className =
        "btn btn-danger";


    discard.textContent =
        "Arquivar selecionadas";


    discard.addEventListener(
        "click",
        () => {

            const current =
                queue();


            const discarded =
                current.filter(
                    item =>

                        selected.has(
                            JSON.stringify(
                                item
                            )
                        )
                );


            if (
                !discarded.length
            ) {

                display(
                    "Selecione as tentativas que já foram revisadas."
                );

                return;

            }


            if (
                !window.confirm(
                    `Arquivar ${discarded.length} tentativa(s)?`
                )
            ) {
                return;
            }


            const historico =
                archive();


            historico.push({
                archivedAt:
                    new Date()
                        .toISOString(),

                items:
                    discarded
            });


            localStorage.setItem(
                archiveKey,
                JSON.stringify(
                    historico
                )
            );


            saveQueue(

                current.filter(
                    item =>

                        !selected.has(
                            JSON.stringify(
                                item
                            )
                        )
                )

            );


            renderQueueReview();

            atualizarResumo();


            display(
                "Tentativas arquivadas."
            );

        }
    );


    panel.append(
        discard
    );

}


document.getElementById(
    "btn-review-queue"
).addEventListener(
    "click",
    () => {

        try {

            renderQueueReview();

        } catch (
            erro
        ) {

            display(
                erro.message
            );

        }

    }
);


/* =========================================
   EXPORTAR FILA
========================================= */

document.getElementById(
    "btn-export-queue"
).addEventListener(
    "click",
    () => {

        try {

            const dados = {

                pending:
                    queue(),

                archived:
                    archive(),

                exportedAt:
                    new Date()
                        .toISOString()

            };


            const blob =
                new Blob(
                    [
                        JSON.stringify(
                            dados,
                            null,
                            2
                        )
                    ],
                    {
                        type:
                            "application/json"
                    }
                );


            const url =
                URL.createObjectURL(
                    blob
                );


            const link =
                document.createElement(
                    "a"
                );


            link.href =
                url;


            link.download =
                "contingencias-charge-vision.json";


            document.body
                .appendChild(
                    link
                );


            link.click();


            link.remove();


            URL.revokeObjectURL(
                url
            );


        } catch (
            erro
        ) {

            display(
                erro.message
            );

        }

    }
);


/* =========================================
   ATUALIZAR
========================================= */

document.getElementById(
    "btn-refresh"
).addEventListener(
    "click",
    carregarCentral
);


/* =========================================
   INICIALIZAÇÃO
========================================= */

document.getElementById(
    "measure-time"
).value =
    datetimeLocalAgora();


try {

    saveQueue(
        queue()
    );

} catch (
    erro
) {

    display(
        erro.message
    );

}


carregarCentral();