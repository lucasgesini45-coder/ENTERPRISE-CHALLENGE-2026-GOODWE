const iniciarInteligenciaUI = () => {

    const main =
        document.querySelector(".main");

    if (!main) {
        return;
    }


    let graficoIA = null;
    let previsaoCache = null;
    let anomaliasCache = null;


    /* =========================================
       PÁGINA
    ========================================= */

    const paginaIA =
        document.createElement("div");

    paginaIA.id =
        "page-ai";

    paginaIA.className =
        "app-page";


    paginaIA.innerHTML = `

        <header class="topbar">

            <div class="topbar-title">

                <span class="page-eyebrow">
                    Inteligência Artificial
                </span>

                <h1>
                    Inteligência do Sistema
                </h1>

                <p>
                    Previsão de consumo e detecção automática
                    de comportamentos fora do padrão.
                </p>

            </div>


            <div class="topbar-actions">

                <button
                    id="btn-atualizar-ia"
                    class="primary-action"
                    type="button"
                >
                    Executar análise
                </button>

            </div>

        </header>


        <!-- =====================================
             INDICADORES
        ====================================== -->

        <section class="ai-metrics-grid">


            <article class="metric-card">

                <div class="metric-top">

                    <span class="metric-caption">
                        Previsão
                    </span>

                </div>


                <div class="metric-value">

                    <strong id="ai-total-forecast">
                        --
                    </strong>

                    <span>
                        kWh
                    </span>

                </div>


                <p>
                    Consumo previsto para 7 dias
                </p>

            </article>


            <article class="metric-card">

                <div class="metric-top">

                    <span class="metric-caption">
                        Horário de pico
                    </span>

                </div>


                <div class="metric-value">

                    <strong id="ai-peak-time">
                        --
                    </strong>

                </div>


                <p>
                    Maior demanda prevista
                </p>

            </article>


            <article class="metric-card">

                <div class="metric-top">

                    <span class="metric-caption">
                        Demanda
                    </span>

                </div>


                <div class="metric-value">

                    <strong id="ai-demand-level">
                        --
                    </strong>

                </div>


                <p>
                    Classificação da previsão
                </p>

            </article>


            <article class="metric-card">

                <div class="metric-top">

                    <span class="metric-caption">
                        Anomalias
                    </span>

                </div>


                <div class="metric-value">

                    <strong id="ai-total-anomalies">
                        --
                    </strong>

                </div>


                <p>
                    Sessões fora do padrão
                </p>

            </article>


        </section>


        <!-- =====================================
             PREVISÃO
        ====================================== -->

        <section class="dashboard-grid ai-main-grid">


            <article class="dashboard-card">

                <div class="card-heading">

                    <div>

                        <span class="section-label">
                            Machine Learning
                        </span>

                        <h2>
                            Previsão de Consumo
                        </h2>

                        <p>
                            Estimativa baseada no histórico
                            das sessões concluídas.
                        </p>

                    </div>


                    <span class="model-badge">
                        Random Forest
                    </span>

                </div>


                <div
                    id="ai-training-warning"
                    class="ai-training-warning"
                >
                </div>


                <div class="ai-chart-container">

                    <canvas id="ai-forecast-chart"></canvas>

                </div>

            </article>


            <!-- =====================================
                 MODELO
            ====================================== -->

            <article class="dashboard-card">

                <div class="card-heading">

                    <div>

                        <span class="section-label">
                            Modelo preditivo
                        </span>

                        <h2>
                            Indicadores da Previsão
                        </h2>

                    </div>

                </div>


                <div class="ai-indicator-list">


                    <div>

                        <span>
                            Modelo
                        </span>

                        <strong id="ai-model-name">
                            --
                        </strong>

                    </div>


                    <div>

                        <span>
                            Dados de treinamento
                        </span>

                        <strong id="ai-training-data">
                            --
                        </strong>

                    </div>


                    <div>

                        <span>
                            Média por sessão
                        </span>

                        <strong id="ai-average-session">
                            --
                        </strong>

                    </div>


                    <div>

                        <span>
                            Maior consumo previsto
                        </span>

                        <strong id="ai-highest-forecast">
                            --
                        </strong>

                    </div>


                    <div>

                        <span>
                            Horizonte
                        </span>

                        <strong>
                            7 dias
                        </strong>

                    </div>


                </div>

            </article>


        </section>


        <!-- =====================================
             ANOMALIAS
        ====================================== -->

        <section class="dashboard-grid">


            <article class="dashboard-card">

                <div class="card-heading">

                    <div>

                        <span class="section-label">
                            Detecção de anomalias
                        </span>

                        <h2>
                            Sessões Fora do Padrão
                        </h2>

                        <p>
                            O modelo compara consumo e duração
                            com o comportamento histórico.
                        </p>

                    </div>


                    <span class="model-badge">
                        Isolation Forest
                    </span>

                </div>


                <div
                    id="ai-anomaly-list"
                    class="ai-anomaly-list"
                >

                    <div class="ai-loading">
                        Executando análise...
                    </div>

                </div>

            </article>


            <!-- RESUMO ANOMALIAS -->

            <article class="dashboard-card">

                <div class="card-heading">

                    <div>

                        <span class="section-label">
                            Monitoramento
                        </span>

                        <h2>
                            Resumo da Análise
                        </h2>

                    </div>

                </div>


                <div class="ai-indicator-list">


                    <div>

                        <span>
                            Sessões analisadas
                        </span>

                        <strong id="ai-analyzed-sessions">
                            --
                        </strong>

                    </div>


                    <div>

                        <span>
                            Consumo médio
                        </span>

                        <strong id="ai-average-consumption">
                            --
                        </strong>

                    </div>


                    <div>

                        <span>
                            Duração média
                        </span>

                        <strong id="ai-average-duration">
                            --
                        </strong>

                    </div>


                    <div>

                        <span>
                            Modelo
                        </span>

                        <strong id="ai-anomaly-model">
                            --
                        </strong>

                    </div>


                    <div>

                        <span>
                            Situação
                        </span>

                        <strong
                            id="ai-analysis-status"
                            class="ai-analysis-status"
                        >
                            Analisando...
                        </strong>

                    </div>


                </div>

            </article>


        </section>


        <!-- =====================================
             INFORMAÇÃO
        ====================================== -->

        <section class="ai-info-card">

            <div class="ai-info-icon">
                i
            </div>


            <div>

                <strong>
                    Como interpretar estes resultados?
                </strong>

                <p>
                    As previsões e anomalias são geradas com base
                    nos dados disponíveis no histórico do EV ChargeOps.
                    Quanto maior e mais variada a base de sessões,
                    mais informação o modelo terá para realizar
                    suas análises.
                </p>

            </div>

        </section>


        <footer class="footer">

            EV ChargeOps • Inteligência aplicada à gestão de recarga

        </footer>
    `;


    main.appendChild(
        paginaIA
    );


    /* =========================================
       MENU
    ========================================= */

    const botaoMenu =
        document.querySelector(
            '.menu-item[data-page="ai"]'
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


                paginaIA.classList.add(
                    "active"
                );


                carregarIA();


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

    function formatarData(
        valor
    ) {

        if (!valor) {
            return "--";
        }


        const data =
            new Date(valor);


        return data.toLocaleDateString(
            "pt-BR",
            {
                day: "2-digit",
                month: "2-digit"
            }
        );

    }


    function traduzirMotivo(
        motivo
    ) {

        const traducoes = {

            "Consumo abaixo da media historica":
                "Consumo abaixo da média histórica",

            "Consumo acima da media historica":
                "Consumo acima da média histórica",

            "Duracao abaixo da media historica":
                "Duração abaixo da média histórica",

            "Duracao acima da media historica":
                "Duração acima da média histórica"

        };


        return (
            traducoes[motivo] ??
            motivo
        );

    }


    /* =========================================
       CARREGAR IA
    ========================================= */

    async function carregarIA() {

        definirCarregando();


        try {

            const [
                respostaPrevisao,
                respostaAnomalias
            ] =
                await Promise.all([

                    fetch(
                        `${API_URL}/ia/previsao-consumo?dias=7`
                    ),

                    fetch(
                        `${API_URL}/ia/anomalias`
                    )

                ]);


            if (
                !respostaPrevisao.ok ||
                !respostaAnomalias.ok
            ) {

                throw new Error(
                    "Não foi possível executar a análise."
                );

            }


            previsaoCache =
                await respostaPrevisao.json();


            anomaliasCache =
                await respostaAnomalias.json();


            renderizarPrevisao();


            renderizarAnomalias();


        } catch (erro) {

            console.error(
                "Erro IA:",
                erro
            );


            document.getElementById(
                "ai-anomaly-list"
            ).innerHTML = `

                <div class="sessions-empty error">

                    <strong>
                        Não foi possível executar a análise.
                    </strong>

                    <span>
                        Verifique a conexão com a API.
                    </span>

                </div>

            `;

        }

    }


    function definirCarregando() {

        document.getElementById(
            "ai-anomaly-list"
        ).innerHTML = `

            <div class="ai-loading">
                Executando análise...
            </div>

        `;

    }


    /* =========================================
       PREVISÃO
    ========================================= */

    function renderizarPrevisao() {

        if (
            !previsaoCache?.sucesso
        ) {

            document.getElementById(
                "ai-training-warning"
            ).innerHTML = `

                <strong>
                    Previsão indisponível
                </strong>

                <span>
                    ${escapeHtml(
                        previsaoCache?.erro ??
                        "Dados insuficientes."
                    )}
                </span>

            `;


            return;

        }


        document.getElementById(
            "ai-total-forecast"
        ).textContent =
            Number(
                previsaoCache
                    .consumo_total_previsto_kwh
            ).toFixed(2);


        document.getElementById(
            "ai-peak-time"
        ).textContent =
            previsaoCache
                .horario_pico_previsto;


        document.getElementById(
            "ai-demand-level"
        ).textContent =
            previsaoCache
                .nivel_demanda;


        document.getElementById(
            "ai-model-name"
        ).textContent =
            previsaoCache.modelo;


        document.getElementById(
            "ai-training-data"
        ).textContent =
            `${previsaoCache.dados_treinamento} sessão(ões)`;


        document.getElementById(
            "ai-average-session"
        ).textContent =
            `${Number(
                previsaoCache
                    .media_consumo_sessao_kwh
            ).toFixed(2)} kWh`;


        document.getElementById(
            "ai-highest-forecast"
        ).textContent =
            `${Number(
                previsaoCache
                    .maior_consumo_previsto_kwh
            ).toFixed(2)} kWh`;


        const aviso =
            document.getElementById(
                "ai-training-warning"
            );


        if (
            previsaoCache
                .dados_treinamento < 20
        ) {

            aviso.className =
                "ai-training-warning show";


            aviso.innerHTML = `

                <strong>
                    Base de treinamento reduzida
                </strong>

                <span>
                    O modelo está utilizando
                    ${previsaoCache.dados_treinamento}
                    sessão(ões). Os resultados atuais
                    devem ser tratados como demonstrativos.
                </span>

            `;

        } else {

            aviso.className =
                "ai-training-warning";


            aviso.innerHTML =
                "";

        }


        criarGraficoIA(
            previsaoCache.previsoes
        );

    }


    /* =========================================
       GRÁFICO IA
    ========================================= */

    function criarGraficoIA(
        previsoes
    ) {

        const canvas =
            document.getElementById(
                "ai-forecast-chart"
            );


        if (!canvas) {
            return;
        }


        const dark =
            document.body.classList.contains(
                "dark"
            );


        const labels =
            previsoes.map(
                item =>
                    formatarData(
                        item.data
                    )
            );


        const valores =
            previsoes.map(
                item =>
                    Number(
                        item.consumo_previsto_kwh
                    )
            );


        const contexto =
            canvas.getContext("2d");


        const gradiente =
            contexto.createLinearGradient(
                0,
                0,
                0,
                300
            );


        gradiente.addColorStop(
            0,
            dark
                ? "rgba(255,42,150,0.32)"
                : "rgba(230,0,126,0.25)"
        );


        gradiente.addColorStop(
            1,
            "rgba(230,0,126,0)"
        );


        if (graficoIA) {

            graficoIA.destroy();

        }


        graficoIA =
            new Chart(
                contexto,
                {

                    type:
                        "line",


                    data: {

                        labels,

                        datasets: [

                            {

                                data:
                                    valores,

                                borderColor:
                                    dark
                                        ? "#ff2a96"
                                        : "#e6007e",

                                backgroundColor:
                                    gradiente,

                                fill:
                                    true,

                                tension:
                                    0.42,

                                borderWidth:
                                    3,

                                pointRadius:
                                    4,

                                pointHoverRadius:
                                    6,

                                pointBackgroundColor:
                                    dark
                                        ? "#1d1f29"
                                        : "#ffffff",

                                pointBorderColor:
                                    dark
                                        ? "#ff2a96"
                                        : "#e6007e",

                                pointBorderWidth:
                                    2

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
                                        dark
                                            ? "#a4a6b3"
                                            : "#76798a"

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
                                        dark
                                            ? "rgba(255,255,255,0.06)"
                                            : "rgba(0,0,0,0.05)"

                                },

                                ticks: {

                                    color:
                                        dark
                                            ? "#a4a6b3"
                                            : "#76798a",

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
       ANOMALIAS
    ========================================= */

    function renderizarAnomalias() {

        const lista =
            document.getElementById(
                "ai-anomaly-list"
            );


        if (
            !anomaliasCache?.sucesso
        ) {

            lista.innerHTML = `

                <div class="sessions-empty">

                    <strong>
                        Análise indisponível
                    </strong>

                    <span>
                        ${escapeHtml(
                            anomaliasCache?.erro ??
                            "Dados insuficientes."
                        )}
                    </span>

                </div>

            `;


            return;

        }


        document.getElementById(
            "ai-total-anomalies"
        ).textContent =
            anomaliasCache
                .total_anomalias;


        document.getElementById(
            "ai-analyzed-sessions"
        ).textContent =
            anomaliasCache
                .total_sessoes_analisadas;


        document.getElementById(
            "ai-average-consumption"
        ).textContent =
            `${Number(
                anomaliasCache
                    .media_consumo_kwh
            ).toFixed(2)} kWh`;


        document.getElementById(
            "ai-average-duration"
        ).textContent =
            `${Number(
                anomaliasCache
                    .media_duracao_minutos
            ).toFixed(0)} min`;


        document.getElementById(
            "ai-anomaly-model"
        ).textContent =
            anomaliasCache.modelo;


        const status =
            document.getElementById(
                "ai-analysis-status"
            );


        if (
            anomaliasCache
                .total_anomalias > 0
        ) {

            status.textContent =
                "ATENÇÃO";


            status.className =
                "ai-analysis-status attention";

        } else {

            status.textContent =
                "NORMAL";


            status.className =
                "ai-analysis-status normal";

        }


        if (
            anomaliasCache
                .anomalias.length === 0
        ) {

            lista.innerHTML = `

                <div class="ai-no-anomaly">

                    <div class="ai-ok-icon">
                        ✓
                    </div>

                    <div>

                        <strong>
                            Nenhuma anomalia detectada
                        </strong>

                        <p>
                            As sessões analisadas estão
                            dentro do padrão identificado
                            pelo modelo.
                        </p>

                    </div>

                </div>

            `;


            return;

        }


        lista.innerHTML =
            "";


        anomaliasCache
            .anomalias
            .forEach(
                anomalia => {

                    const card =
                        document.createElement(
                            "div"
                        );


                    card.className =
                        "ai-anomaly-card";


                    const motivos =
                        (
                            anomalia.motivos ??
                            []
                        )
                        .map(
                            motivo => `

                                <li>
                                    ${escapeHtml(
                                        traduzirMotivo(
                                            motivo
                                        )
                                    )}
                                </li>

                            `
                        )
                        .join("");


                    card.innerHTML = `

                        <div class="ai-anomaly-header">

                            <div>

                                <span>
                                    Sessão
                                </span>

                                <strong>
                                    #${anomalia.sessao_id}
                                </strong>

                            </div>


                            <span class="ai-anomaly-badge">
                                Atenção
                            </span>

                        </div>


                        <div class="ai-anomaly-metrics">

                            <div>

                                <span>
                                    Consumo
                                </span>

                                <strong>
                                    ${Number(
                                        anomalia
                                            .consumo_kwh ??
                                        0
                                    ).toFixed(2)}
                                    kWh
                                </strong>

                            </div>


                            <div>

                                <span>
                                    Duração
                                </span>

                                <strong>
                                    ${Number(
                                        anomalia
                                            .duracao_minutos ??
                                        0
                                    ).toFixed(0)}
                                    min
                                </strong>

                            </div>


                            <div>

                                <span>
                                    Score
                                </span>

                                <strong>
                                    ${anomalia.score_anomalia}
                                </strong>

                            </div>

                        </div>


                        <div class="ai-anomaly-reasons">

                            <span>
                                Motivos identificados
                            </span>

                            <ul>
                                ${motivos}
                            </ul>

                        </div>

                    `;


                    lista.appendChild(
                        card
                    );

                }
            );

    }


    /* =========================================
       EVENTOS
    ========================================= */

    document.getElementById(
        "btn-atualizar-ia"
    ).addEventListener(
        "click",
        carregarIA
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

                        if (
                            previsaoCache?.sucesso
                        ) {

                            criarGraficoIA(
                                previsaoCache
                                    .previsoes
                            );

                        }

                    },
                    100
                );

            }
        );

    }

};


iniciarInteligenciaUI();