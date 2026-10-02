const iniciarLocalizarCarregadoresUI = () => {

    const main =
        document.querySelector(
            ".main"
        );

    if (!main) {
        return;
    }

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

        <section class="dashboard-card">

            <div class="card-heading">

                <div>

                    <span class="section-label">
                        Localização
                    </span>

                    <h2>
                        Mapa de carregadores
                    </h2>

                    <p>
                        Visualize os pontos cadastrados
                        no sistema.
                    </p>

                </div>

            </div>

            <div
                id="chargers-map"
                class="chargers-map"
            >
                Carregando mapa...
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

        const mapa =
            L.map(
                elementoMapa
            ).setView(
                [-23.5505, -46.6333],
                11
            );

        L.tileLayer(
            "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
            {
                attribution:
                    "&copy; OpenStreetMap contributors"
            }
        ).addTo(
            mapa
        );

        setTimeout(
            () => {
                mapa.invalidateSize();
            },
            200
        );

    }
};

iniciarLocalizarCarregadoresUI();

