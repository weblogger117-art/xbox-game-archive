let games = [];
let currentGame = null;

/* =========================================================
   AKTIVE FILTER
   ========================================================= */

let activeFilters = {
    platform: "Alle",
    fsk: "Alle",
    genre: "Alle",
    availability: "Alle",
    couchCoop: "Alle"
};


/* =========================================================
   SPIELE LADEN
   ========================================================= */

async function loadGames() {
    try {
        const response = await fetch("data/games.json");

        if (!response.ok) {
            throw new Error("Spieldaten konnten nicht geladen werden.");
        }

        games = await response.json();

        displayGames(games);

    } catch (error) {
        console.error("Fehler beim Laden der Spiele:", error);
    }
}


/* =========================================================
   SPIELE ANZEIGEN
   ========================================================= */

function displayGames(gameList) {

    const gamesGrid = document.getElementById("gamesGrid");
    const counter = document.querySelector(".counter-number");

    counter.textContent = gameList.length;

    gamesGrid.innerHTML = "";

    if (gameList.length === 0) {

        gamesGrid.innerHTML = `
            <div class="no-games">
                Keine Spiele gefunden.
            </div>
        `;

        return;
    }


    gameList.forEach(game => {

        const card = document.createElement("article");

        card.className = "game-card";

        card.innerHTML = `
            <div class="game-cover">
                <img
                    src="${game.cover}"
                    alt="${game.title}"
                    loading="lazy"
                >
            </div>

            <div class="game-info">

                <h3>${game.title}</h3>

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


        /* Spiel anklickbar machen */

        card.addEventListener("click", function () {

            openGameDetail(game.id);

        });


        gamesGrid.appendChild(card);

    });
}


/* =========================================================
   DETAILANSICHT ÖFFNEN
   ========================================================= */

function openGameDetail(gameId) {

    const game = games.find(item => item.id === gameId);

    if (!game) {
        return;
    }

    currentGame = game;


    document.querySelector(".hero").hidden = true;
    document.querySelector(".search-section").hidden = true;
    document.querySelector(".filters").hidden = true;
    document.querySelector(".game-counter").hidden = true;
    document.querySelector(".games-section").hidden = true;


    const detail = document.getElementById("gameDetail");

    detail.hidden = false;


    /* Cover */

    const cover = document.getElementById("detailCover");

    cover.src = game.cover;
    cover.alt = game.title;


    /* Grunddaten */

    document.getElementById("detailPlatform").textContent =
        game.platform;

    document.getElementById("detailTitle").textContent =
        game.title;

    document.getElementById("detailDescription").textContent =
        game.description;


    /* Meta-Daten */

    const meta = document.getElementById("detailMeta");

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


    /* =====================================================
       SCREENSHOT-GALERIE
       ===================================================== */

    const screenshots =
        document.getElementById("detailScreenshots");

    screenshots.innerHTML = "";


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

        const gallery =
            document.createElement("div");

        gallery.className =
            "screenshot-gallery";


        const mainContainer =
            document.createElement("div");

        mainContainer.className =
            "screenshot-main";


        const mainImage =
            document.createElement("img");

        mainImage.src =
            game.screenshots[0];

        mainImage.alt =
            `${game.title} Screenshot 1`;

        mainImage.loading =
            "lazy";


        mainContainer.appendChild(mainImage);


        const thumbnails =
            document.createElement("div");

        thumbnails.className =
            "screenshot-thumbnails";


        game.screenshots.forEach(
            (screenshot, index) => {

                const thumbnail =
                    document.createElement("button");

                thumbnail.type =
                    "button";

                thumbnail.className =
                    "screenshot-thumbnail";


                if (index === 0) {

                    thumbnail.classList.add(
                        "active"
                    );

                }


                const image =
                    document.createElement("img");

                image.src =
                    screenshot;

                image.alt =
                    `${game.title} Screenshot ${index + 1}`;

                image.loading =
                    "lazy";


                thumbnail.appendChild(image);


                thumbnail.addEventListener(
                    "click",
                    function () {

                        mainImage.src =
                            screenshot;

                        mainImage.alt =
                            `${game.title} Screenshot ${index + 1}`;


                        thumbnails
                            .querySelectorAll(
                                ".screenshot-thumbnail"
                            )
                            .forEach(item => {

                                item.classList.remove(
                                    "active"
                                );

                            });


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


    currentGame = null;


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


/* =========================================================
   FILTER ANWENDEN
   ========================================================= */

function applyFilters() {

    const searchInput =
        document.getElementById("searchInput");

    const searchTerm =
        searchInput.value
            .trim()
            .toLowerCase();


    const filteredGames =
        games.filter(game => {


            /* Suche */

            const matchesSearch =
                game.title
                    .toLowerCase()
                    .includes(searchTerm);


            /* Plattform */

            const matchesPlatform =
                activeFilters.platform === "Alle" ||
                game.platform ===
                    activeFilters.platform;


            /* FSK */

            const matchesFsk =
                activeFilters.fsk === "Alle" ||
                game.fsk ===
                    Number(activeFilters.fsk);


            /* Genre */

            const matchesGenre =
                activeFilters.genre === "Alle" ||
                game.genre ===
                    activeFilters.genre;


            /* Verfügbarkeit */

            const matchesAvailability =
                activeFilters.availability === "Alle" ||
                game.availability ===
                    activeFilters.availability;


            /* Couch-Coop */

            const matchesCouchCoop =
                activeFilters.couchCoop === "Alle" ||

                (
                    activeFilters.couchCoop === "Ja" &&
                    game.couchCoop === true
                ) ||

                (
                    activeFilters.couchCoop === "Nein" &&
                    game.couchCoop === false
                );


            return (
                matchesSearch &&
                matchesPlatform &&
                matchesFsk &&
                matchesGenre &&
                matchesAvailability &&
                matchesCouchCoop
            );

        });


    displayGames(filteredGames);
}


/* =========================================================
   FILTER-BUTTONS
   ========================================================= */

document
    .querySelectorAll(".filter-buttons")
    .forEach(filterGroup => {

        const groupName =
            filterGroup.dataset.filterGroup;


        filterGroup
            .querySelectorAll(".filter-button")
            .forEach(button => {

                button.addEventListener(
                    "click",
                    function () {


                        /* Aktiven Button setzen */

                        filterGroup
                            .querySelectorAll(
                                ".filter-button"
                            )
                            .forEach(item => {

                                item.classList.remove(
                                    "active"
                                );

                            });


                        button.classList.add(
                            "active"
                        );


                        /* Filterwert speichern */

                        activeFilters[groupName] =
                            button.dataset.value;


                        /* Filter anwenden */

                        applyFilters();

                    }
                );

            });

    });


/* =========================================================
   SUCHE
   ========================================================= */

document
    .getElementById("searchInput")
    .addEventListener(
        "input",
        applyFilters
    );


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
