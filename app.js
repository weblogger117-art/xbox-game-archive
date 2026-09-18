let games = [];

let currentGame = null;


/* =========================================================
   SPIELE LADEN
   ========================================================= */

async function loadGames() {

    try {

        const response =
            await fetch("data/games.json");

        if (!response.ok) {

            throw new Error(
                "Spieldaten konnten nicht geladen werden."
            );

        }

        games =
            await response.json();


        displayGames(games);


    } catch (error) {

        console.error(error);

    }

}


/* =========================================================
   SPIELE ANZEIGEN
   ========================================================= */

function displayGames(gameList) {

    const gamesGrid =
        document.getElementById(
            "gamesGrid"
        );


    const counter =
        document.querySelector(
            ".counter-number"
        );


    counter.textContent =
        gameList.length;


    gamesGrid.innerHTML =
        "";


    if (gameList.length === 0) {

        gamesGrid.innerHTML = `

            <div class="no-games">

                Keine Spiele gefunden.

            </div>

        `;

        return;

    }


    gameList.forEach(game => {

        const card =
            document.createElement(
                "article"
            );


        card.className =
            "game-card";


        card.innerHTML = `

            <div class="game-cover">

                <img
                    src="${game.cover}"
                    alt="${game.title}"
                    loading="lazy"
                >

            </div>


            <div class="game-info">

                <h3>
                    ${game.title}
                </h3>


                <p class="game-platform">
                    ${game.platform}
                </p>


                <p class="game-genre">
                    ${game.genre}
                </p>


                <div class="game-meta">

                    <span
                        class="fsk-badge"
                        title="FSK ${game.fsk}"
                    >
                        ${game.fsk}
                    </span>


                    <span
                        class="meta-icon"
                        title="${game.availability}"
                    >
                        ${
                            game.availability === "Disc"
                                ? "💿"
                                : "☁"
                        }
                    </span>


                    ${
                        game.couchCoop
                            ? `
                                <span
                                    class="meta-icon coop"
                                    title="Couch-Coop"
                                >
                                    🎮
                                </span>
                            `
                            : ""
                    }

                </div>

            </div>

        `;


        /*
         * Karte anklickbar machen
         */

        card.addEventListener(
            "click",
            () => {

                openGameDetail(
                    game.id
                );

            }
        );


        gamesGrid.appendChild(
            card
        );

    });

}


/* =========================================================
   DETAILANSICHT ÖFFNEN
   ========================================================= */

function openGameDetail(gameId) {

    const game =
        games.find(
            item =>
                item.id === gameId
        );


    if (!game) {

        return;

    }


    currentGame =
        game;


    /*
     * Sammlung ausblenden
     */

    document.querySelector(
        ".hero"
    ).hidden = true;


    document.querySelector(
        ".search-section"
    ).hidden = true;


    document.querySelector(
        ".filters"
    ).hidden = true;


    document.querySelector(
        ".game-counter"
    ).hidden = true;


    document.querySelector(
        ".games-section"
    ).hidden = true;


    /*
     * Detailansicht anzeigen
     */

    const detail =
        document.getElementById(
            "gameDetail"
        );


    detail.hidden =
        false;


    /*
     * Cover
     */

    const cover =
        document.getElementById(
            "detailCover"
        );


    cover.src =
        game.cover;


    cover.alt =
        game.title;


    /*
     * Plattform
     */

    document.getElementById(
        "detailPlatform"
    ).textContent =
        game.platform;


    /*
     * Titel
     */

    document.getElementById(
        "detailTitle"
    ).textContent =
        game.title;


    /*
     * Beschreibung
     */

    document.getElementById(
        "detailDescription"
    ).textContent =
        game.description;


    /*
     * Metadaten
     */

    const meta =
        document.getElementById(
            "detailMeta"
        );


    meta.innerHTML = `

        <span class="detail-badge fsk-detail">
            FSK ${game.fsk}
        </span>


        <span class="detail-badge">
            ${game.genre}
        </span>


        <span class="detail-badge">
            ${
                game.availability === "Disc"
                    ? "💿 Disc"
                    : "☁ Digital"
            }
        </span>


        <span
            class="detail-badge ${
                game.couchCoop
                    ? "coop-yes"
                    : "coop-no"
            }"
        >
            🎮 Couch-Coop:
            ${
                game.couchCoop
                    ? "Ja"
                    : "Nein"
            }
        </span>

    `;


    /*
 * Screenshot-Galerie
 */

const screenshots =
    document.getElementById(
        "detailScreenshots"
    );


screenshots.innerHTML = "";


/*
 * Wenn keine Screenshots vorhanden sind
 */

if (
    !game.screenshots ||
    game.screenshots.length === 0
) {

    screenshots.innerHTML = `

        <div class="no-screenshots">

            Noch keine Screenshots hinterlegt.

        </div>

    `;

} else {


    /*
     * Galerie aufbauen
     */

    const gallery =
        document.createElement(
            "div"
        );

    gallery.className =
        "screenshot-gallery";


    /*
     * Hauptbild
     */

    const mainContainer =
        document.createElement(
            "div"
        );

    mainContainer.className =
        "screenshot-main";


    const mainImage =
        document.createElement(
            "img"
        );

    mainImage.src =
        game.screenshots[0];

    mainImage.alt =
        `${game.title} Screenshot 1`;

    mainImage.loading =
        "lazy";


    mainContainer.appendChild(
        mainImage
    );


    /*
     * Vorschaubilder
     */

    const thumbnails =
        document.createElement(
            "div"
        );

    thumbnails.className =
        "screenshot-thumbnails";


    game.screenshots.forEach(
        (screenshot, index) => {

            const thumbnail =
                document.createElement(
                    "button"
                );

            thumbnail.className =
                "screenshot-thumbnail";


            if (index === 0) {

                thumbnail.classList.add(
                    "active"
                );

            }


            thumbnail.type =
                "button";


            const image =
                document.createElement(
                    "img"
                );


            image.src =
                screenshot;

            image.alt =
                `${game.title} Screenshot ${index + 1}`;

            image.loading =
                "lazy";


            thumbnail.appendChild(
                image
            );


            /*
             * Beim Anklicken
             * Hauptbild wechseln
             */

            thumbnail.addEventListener(
                "click",
                () => {

                    mainImage.src =
                        screenshot;

                    mainImage.alt =
                        `${game.title} Screenshot ${index + 1}`;


                    document
                        .querySelectorAll(
                            ".screenshot-thumbnail"
                        )
                        .forEach(
                            item =>
                                item.classList.remove(
                                    "active"
                                )
                        );


                    thumbnail.classList.add(
                        "active"
                    );

                }
            );


            thumbnails.appendChild(
                thumbnail
            );

        }
    );


    /*
     * Elemente zusammensetzen
     */

    gallery.appendChild(
        mainContainer
    );


    gallery.appendChild(
        thumbnails
    );


    screenshots.appendChild(
        gallery
    );

}


    /*
     * Nach oben scrollen
     */

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


/* =========================================================
   DETAILANSICHT SCHLIESSEN
   ========================================================= */

function closeGameDetail() {

    document.getElementById(
        "gameDetail"
    ).hidden = true;


    document.querySelector(
        ".hero"
    ).hidden = false;


    document.querySelector(
        ".search-section"
    ).hidden = false;


    document.querySelector(
        ".filters"
    ).hidden = false;


    document.querySelector(
        ".game-counter"
    ).hidden = false;


    document.querySelector(
        ".games-section"
    ).hidden = false;


    currentGame =
        null;


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


/* =========================================================
   ZURÜCK-BUTTON
   ========================================================= */

document
    .getElementById("backButton")
    .addEventListener(
        "click",
        closeGameDetail
    );


/* =========================================================
   START
   ========================================================= */

loadGames();
