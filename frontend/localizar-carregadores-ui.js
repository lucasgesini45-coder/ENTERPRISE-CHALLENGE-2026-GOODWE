const iniciarLocalizarCarregadoresUI = () => {

    const main =
        document.querySelector(
            ".main"
        );

    if (!main) {
        return;
    }

    let mapa = null;

    /* =========================================
       PÁGINA
    ========================================= */

    const paginaLocalizar =
        document.createElement(
            "div"
        );
    
        /* =========================================
    MENU
    ========================================= */

    const botaoMenu =
        document.querySelector(
            '.menu-item[data-page="locator"]'
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

                paginaLocalizar.classList.add(
                    "active"
                );

                setTimeout(
                    () => {
                        mapa.invalidateSize();
                    },
                    200
                );

                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });
            }
        );
    }

    paginaLocalizar.id =
        "page-charger-map";

    paginaLocalizar.className =
        "app-page";

    paginaLocalizar.innerHTML = `

        <header class="topbar">

            <div class="topbar-title">

                <span class="page-eyebrow">
                    Operação
                </span>

                <h1>
                    Localizar carregadores
                </h1>

                <p>
                    Encontre carregadores disponíveis
                    e identifique o ponto mais próximo.
                </p>

            </div>

        </header>

        <section class="locator-shell">

    <div class="locator-toolbar">

        <div class="locator-search">
            <span>⌕</span>

            <input
                type="text"
                placeholder="Buscar endereço ou carregador..."
            >
        </div>

        <div class="locator-filters">

            <button
                class="locator-filter active"
                type="button"
            >
                Todos
            </button>

            <button
                class="locator-filter"
                type="button"
            >
                Disponíveis
            </button>

            <button
                class="locator-filter"
                type="button"
            >
                Alta potência
            </button>

        </div>

    </div>

    <div class="locator-map-wrapper">

        <div
            id="chargers-map"
            class="chargers-map"
        >
            Carregando mapa...
        </div>
        
        <button
            id="btn-centralizar-localizacao"
            class="locator-location-button"
            type="button"
            aria-label="Centralizar na minha localização"
        >
            ⦿
        </button>

        <aside class="locator-panel">

            <span class="section-label">
                Mais próximo
            </span>

            <h2>
                Carregador selecionado
            </h2>

            <p>
                Selecione um ponto no mapa para ver
                os detalhes da estação.
            </p>

            <div class="locator-panel-info">

                <div>
                    <span>Status</span>
                    <strong>--</strong>
                </div>

                <div>
                    <span>Distância</span>
                    <strong>--</strong>
                </div>

                <div>
                    <span>Potência</span>
                    <strong>--</strong>
                </div>

            </div>

            <button
                class="primary-action locator-route-button"
                type="button"
            >
                Traçar rota
            </button>

        </aside>

    </div>

</section>

        <footer class="footer">
            EV ChargeOps • Gestão inteligente de recarga
        </footer>

    `;

    main.appendChild(
        paginaLocalizar
    );
    /* =========================================
    MAPA
    ========================================= */

    const elementoMapa =
        document.getElementById(
            "chargers-map"
        );

    if (
        typeof L === "undefined"
    ) {

        elementoMapa.textContent =
            "Erro ao carregar o mapa.";

        console.error(
            "Leaflet não foi carregado."
        );

    } else {

        elementoMapa.innerHTML =
            "";

        mapa =
            L.map(
                elementoMapa
            ).setView(
                [-23.5505, -46.6333],
                11
            );

            const CARTO_API_KEY =
                "cb1_487w_1_d7f4e16b314bbc3679613787";

        L.tileLayer(
            `https://basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}.png?key=${CARTO_API_KEY}`,
            {
                attribution:
                    "&copy; OpenStreetMap contributors &copy; CARTO",
                maxZoom: 20
            }
        ).addTo(mapa);

        /* =========================================
   CARREGADORES NO MAPA
========================================= */

        const marcadoresCarregadores = [];

        let carregadorSelecionado = null;

        async function carregarCarregadoresNoMapa() {

            try {

                const token =
                    localStorage.getItem(
                        "ev_chargeops_token"
                    );

                const resposta =
                    await fetch(
                        `${API_URL}/carregadores/`,
                        {
                            method: "GET",

                            headers: {
                                "Authorization":
                                    `Bearer ${token}`
                            }
                        }
                    );

                if (!resposta.ok) {

                    throw new Error(
                        "Não foi possível carregar os carregadores."
                    );

                }

                const dados =
                    await resposta.json();

                const carregadores =
                    dados.carregadores ?? [];

                marcadoresCarregadores.forEach(
                    marcador => {
                        mapa.removeLayer(
                            marcador
                        );
                    }
                );

                marcadoresCarregadores.length =
                    0;
                
                carregadores.forEach(
                    carregador => {

                        const latitude =
                            Number(
                                carregador.latitude
                            );

                        const longitude =
                            Number(
                                carregador.longitude
                            );

                        if (
                            !Number.isFinite(
                                latitude
                            ) ||
                            !Number.isFinite(
                                longitude
                            )
                        ) {

                            return;
                        }

                        const status =
                            (
                                carregador.status ??
                                ""
                            ).toUpperCase();

                        let cor =
                            "#e6007e";

                        if (
                            status === "ATIVO"
                        ) {

                            cor =
                                "#149657";

                        }

                        if (
                            status === "EM_RECARGA"
                        ) {

                            cor =
                                "#f0a020";

                        }

                        if (
                            status === "OFFLINE"
                        ) {

                            cor =
                                "#76798a";

                        }

                        const iconeCarregador =
                            L.divIcon({
                                className:
                                    "charger-map-marker-wrapper",

                                html: `
                                    <div
                                        class="charger-map-marker"
                                        style="--marker-color: ${cor};"
                                    >
                                        <span>
                                            ⚡
                                        </span>
                                    </div>
                                `,

                                iconSize:
                                    [42, 42],

                                iconAnchor:
                                    [21, 21],

                                tooltipAnchor:
                                    [0, -22]
                            });


                        const marcador =
                            L.marker(
                                [
                                    latitude,
                                    longitude
                                ],
                                {
                                    icon:
                                        iconeCarregador,

                                    interactive:
                                        true,

                                    keyboard:
                                        true,

                                    riseOnHover:
                                        true
                                }
                            ).addTo(
                                mapa
                            );

                        marcador.bindTooltip(
                            carregador.nome ??
                            "Carregador",
                            {
                                direction:
                                    "top"
                            }
                        );
                                                marcadoresCarregadores.push(
                            marcador
                        );

                    }
                );

                        marcador.on(
                            "click",
                            () => {

                                console.log(
                                    "Carregador clicado:",
                                    carregador
                                );

                                carregadorSelecionado = {
                                    ...carregador,
                                    latitude,
                                    longitude
                                };

                                const painel =
                                    document.querySelector(
                                        ".locator-panel"
                                    );

                                if (!painel) {
                                    return;
                                }

                                const statusTexto =
                                    (
                                        carregador.status ??
                                        "DESCONHECIDO"
                                    )
                                    .replace(
                                        "_",
                                        " "
                                    );

                                let distanciaTexto =
                                    "--";

                                if (posicaoUsuario) {

                                    const distancia =
                                        mapa.distance(
                                            [
                                                posicaoUsuario.latitude,
                                                posicaoUsuario.longitude
                                            ],
                                            [
                                                latitude,
                                                longitude
                                            ]
                                        );

                                    distanciaTexto =
                                        distancia < 1000
                                            ? `${Math.round(distancia)} m`
                                            : `${(
                                                distancia / 1000
                                            ).toFixed(1)} km`;

                                }

                                painel.querySelector(
                                    "h2"
                                ).textContent =
                                    carregador.nome ??
                                    "Carregador";

                                painel.querySelector(
                                    "p"
                                ).textContent =
                                    carregador.localizacao ??
                                    "Localização não informada";

                                const infos =
                                    painel.querySelectorAll(
                                        ".locator-panel-info strong"
                                    );

                                if (infos[0]) {
                                    infos[0].textContent =
                                        statusTexto;
                                }

                                if (infos[1]) {
                                    infos[1].textContent =
                                        distanciaTexto;
                                }

                                if (infos[2]) {
                                    infos[2].textContent =
                                        carregador.potencia_maxima
                                            ? `${Number(
                                                carregador.potencia_maxima
                                            ).toFixed(1)} kW`
                                            : "--";
                                }

                            }
                        );

                console.log(
                    `${marcadoresCarregadores.length} carregadores adicionados ao mapa.`
                );

            } catch (erro) {

                console.error(
                    "Erro ao carregar carregadores no mapa:",
                    erro
                );

            }

        }

        carregarCarregadoresNoMapa();

        const botaoRota =
            document.querySelector(
                ".locator-route-button"
            );

        if (botaoRota) {

            botaoRota.addEventListener(
                "click",
                () => {

                    if (!carregadorSelecionado) {

                        alert(
                            "Selecione um carregador no mapa primeiro."
                        );

                        return;
                    }

                    const destinoLatitude =
                        carregadorSelecionado.latitude;

                    const destinoLongitude =
                        carregadorSelecionado.longitude;

                    const url =
                        `https://www.google.com/maps/dir/?api=1&destination=${destinoLatitude},${destinoLongitude}`;

                    window.open(
                        url,
                        "_blank"
                    );

                }
            );

        }

        /* =========================================
           LOCALIZAÇÃO DO USUÁRIO
        ========================================= */
     /* =========================================
        LOCALIZAÇÃO DO USUÁRIO
        ========================================= */

        let posicaoUsuario = null;
        let marcadorUsuario = null;

        function localizarUsuario() {

            if (!navigator.geolocation) {

                alert(
                    "Seu navegador não suporta geolocalização."
                );

                return;
            }

            navigator.geolocation.getCurrentPosition(

                posicao => {

                    const latitude =
                        posicao.coords.latitude;

                    const longitude =
                        posicao.coords.longitude;

                    posicaoUsuario = {
                        latitude,
                        longitude
                    };

                    if (marcadorUsuario) {

                        marcadorUsuario.setLatLng(
                            [
                                latitude,
                                longitude
                            ]
                        );

                    } else {

                        marcadorUsuario =
                            L.circleMarker(
                                [
                                    latitude,
                                    longitude
                                ],
                                {
                                    radius: 9,
                                    color: "#ffffff",
                                    weight: 4,
                                    fillColor: "#e6007e",
                                    fillOpacity: 1
                                }
                            ).addTo(
                                mapa
                            );

                        marcadorUsuario.bindTooltip(
                            "Você está aqui",
                            {
                                permanent: false,
                                direction: "top"
                            }
                        );

                    }

                    mapa.flyTo(
                        [
                            latitude,
                            longitude
                        ],
                        16,
                        {
                            duration: 1.2
                        }
                    );

                },

                erro => {

                    console.error(
                        "Erro de geolocalização:",
                        erro
                    );

                    alert(
                        "Não foi possível acessar sua localização. Verifique a permissão do navegador."
                    );

                },

                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 30000
                }

            );
        }


        const botaoLocalizacao =
            document.getElementById(
                "btn-centralizar-localizacao"
            );

        if (botaoLocalizacao) {

            botaoLocalizacao.addEventListener(
                "click",
                localizarUsuario
            );

        }

        setTimeout(
            () => {
                mapa.invalidateSize();
            },
            200
        );

    }
};

iniciarLocalizarCarregadoresUI();

