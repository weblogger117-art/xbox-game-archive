let games = [];
let currentGame = null;
let currentSort = "title-asc";

console.log("NEUE APP.JS WIRD GELADEN");


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
        const files = [
            "data/xbox-classic.json",
            "data/xbox-360.json",
            "data/xbox-one.json",
            "data/xbox-series.json"
        ];

        const responses = await Promise.all(
            files.map(file => fetch(file))
        );

        responses.forEach(response => {
            if (!response.ok) {
                throw new Error("Spieldaten konnten nicht geladen werden.");
            }
        });

        const data = await Promise.all(
            responses.map(response => response.json())
        );

        games = data.flat();

// Spiele standardmäßig alphabetisch nach Titel sortieren
games.sort((a, b) =>
    a.title.localeCompare(b.title, "de", {
        sensitivity: "base"
    })
);

displayGames(games);

    } catch (error) {
        console.error("Fehler beim Laden der Spieldaten:", error);
    }
}

/* =========================================================
   SPIELE ANZEIGEN
   ========================================================= */

function sortGames(gameList) {
    const sortedGames = [...gameList];

    switch (currentSort) {

        case "title-asc":
            sortedGames.sort((a, b) =>
                a.title.localeCompare(b.title, "de", {
                    sensitivity: "base"
                })
            );
            break;

        case "title-desc":
            sortedGames.sort((a, b) =>
                b.title.localeCompare(a.title, "de", {
                    sensitivity: "base"
                })
            );
            break;

        case "year-desc":
            sortedGames.sort((a, b) =>
                (b.year || 0) - (a.year || 0)
            );
            break;

        case "year-asc":
            sortedGames.sort((a, b) =>
                (a.year || 0) - (b.year || 0)
            );
            break;
    }

    return sortedGames;
}

function displayGames(gameList) {
    gameList = sortGames(gameList);

    const gamesGrid = document.getElementById("gamesGrid");

    const counter =
        document.querySelector(".counter-number");


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

        const card =
            document.createElement("article");

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

                    <span class="fsk-badge fsk-${game.fsk}" title="FSK ${game.fsk}">
    ${game.fsk}
</span>


                    <img
        src="${game.availability === "Disc" ? "images/icons/disc.png" : "images/icons/cloud.png"}"
        class="availability-icon"
        alt="${game.availability === "Disc" ? "Disc" : "Digital"}"
        title="${game.availability}"
    >


                    ${game.couchCoop ? `
    <img
        src="images/icons/coop.png"
        class="availability-icon coop-icon"
        alt="Couch-Coop"
        title="Couch-Coop"
    >
` : ""}

                </div>

            </div>

        `;


        /* Spiel öffnen */

        card.addEventListener(
            "click",
            () => openGameDetail(game.id)
        );


        gamesGrid.appendChild(card);

    });

}


/* =========================================================
   DETAILANSICHT ÖFFNEN
   ========================================================= */

function openGameDetail(gameId) {

    const game =
        games.find(
            item => item.id === gameId
        );


    if (!game) {
        return;
    }


    currentGame = game;


    document.body.classList.add("detail-view");


    /* Detailansicht anzeigen */

    const detail =
        document.getElementById("gameDetail");

    detail.hidden = false;


    /* Cover */

    const cover =
        document.getElementById("detailCover");

    cover.src = game.cover;
    cover.alt = game.title;


    /* Plattform */

    document
        .getElementById("detailPlatform")
        .textContent = game.platform;


    /* Titel */

    document
        .getElementById("detailTitle")
        .textContent = game.title;


    /* Beschreibung */

    document
        .getElementById("detailDescription")
        .textContent = game.description;


    /* =====================================================
       META-DATEN
       ===================================================== */

    const meta =
        document.getElementById("detailMeta");


    meta.innerHTML = `

        <span class="detail-badge fsk-detail fsk-${game.fsk}">
    FSK ${game.fsk}
</span>


        <span class="detail-badge">
            ${game.genre}
        </span>


        <span class="detail-badge availability-detail">
    <img
        src="${game.availability === "Disc" ? "images/icons/disc.png" : "images/icons/cloud.png"}"
        class="availability-icon"
        alt="${game.availability === "Disc" ? "Disc" : "Digital"}"
    >
    ${game.availability === "Disc" ? "Disc" : "Digital"}
</span>


       <span class="detail-badge ${game.couchCoop ? "coop-yes" : "coop-no"}">
    ${game.couchCoop ? `
        <img
            src="images/icons/coop.png"
            class="availability-icon coop-icon"
            alt="Couch-Coop"
        >
    ` : ""}
    Couch-Coop: ${game.couchCoop ? "Ja" : "Nein"}
</span>

    `;


    /* =====================================================
       SCREENSHOT-GALERIE
       ===================================================== */

    const screenshots =
        document.getElementById(
            "detailScreenshots"
        );


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


        /* Hauptbild */

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


        mainContainer.appendChild(
            mainImage
        );


        /* Vorschaubilder */

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


                thumbnail.appendChild(
                    image
                );


                /* Screenshot wechseln */

                thumbnail.addEventListener(
                    "click",
                    () => {

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

    document
        .getElementById("gameDetail")
        .hidden = true;

   document.body.classList.remove("detail-view");

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
                game.platform === activeFilters.platform;


            /* FSK */

            const matchesFsk =
                activeFilters.fsk === "Alle" ||
                game.fsk === Number(activeFilters.fsk);


            /* Genre */

            const matchesGenre =
                activeFilters.genre === "Alle" ||
                game.genre === activeFilters.genre;


            /* Verfügbarkeit */

            const matchesAvailability =
                activeFilters.availability === "Alle" ||
                game.availability === activeFilters.availability;


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

    updateActiveFilters();

}


/* =========================================================
   AKTIVE FILTER ANZEIGEN
   ========================================================= */

function updateActiveFilters() {

    const container =
        document.getElementById("activeFilters");


    if (!container) {
        return;
    }


    container.innerHTML = "";


    const labels = {
        platform: "Plattform",
        fsk: "FSK",
        genre: "Genre",
        availability: "Verfügbarkeit",
        couchCoop: "Couch-Coop"
    };


    let activeCount = 0;
   const countDisplay =
    document.getElementById("filterActiveCount");


    Object.entries(activeFilters).forEach(
        ([key, value]) => {

            if (value === "Alle") {
                return;
            }


            activeCount++;


            const tag =
                document.createElement("span");

            tag.className =
                "active-filter-tag";


            tag.innerHTML = `

                <span>
                    ${labels[key]}:
                    <strong>${value}</strong>
                </span>


                <button
                    type="button"
                    aria-label="${labels[key]} entfernen"
                >
                    ×
                </button>

            `;


            tag
                .querySelector("button")
                .addEventListener(
                    "click",
                    () => {

                        resetSingleFilter(key);

                    }
                );


            container.appendChild(tag);

        }
    );


    if (activeCount === 0) {

    container.hidden = true;

    countDisplay.textContent =
        "Keine Filter aktiv";

} else {

    container.hidden = false;

    countDisplay.textContent =
        activeCount === 1
            ? "1 Filter aktiv"
            : `${activeCount} Filter aktiv`;

}

}


/* =========================================================
   EINZELNEN FILTER ZURÜCKSETZEN
   ========================================================= */

function resetSingleFilter(filterName) {

    activeFilters[filterName] = "Alle";


    const filterGroup =
        document.querySelector(
            `.filter-buttons[data-filter-group="${filterName}"]`
        );


    if (filterGroup) {

        filterGroup
            .querySelectorAll(".filter-button")
            .forEach(button => {

                button.classList.remove(
                    "active"
                );

            });


        const allButton =
            filterGroup.querySelector(
                '[data-value="Alle"]'
            );


        if (allButton) {

            allButton.classList.add(
                "active"
            );

        }

    }


    applyFilters();

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
                    () => {

                        /* Andere Buttons dieser Gruppe
                           deaktivieren */

                        filterGroup
                            .querySelectorAll(
                                ".filter-button"
                            )
                            .forEach(item => {

                                item.classList.remove(
                                    "active"
                                );

                            });


                        /* Gewählten Button aktivieren */

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
   ALLE FILTER ZURÜCKSETZEN
   ========================================================= */

document
    .getElementById("resetFilters")
    .addEventListener(
        "click",
        () => {

            /* Filter zurücksetzen */

            activeFilters = {
                platform: "Alle",
                fsk: "Alle",
                genre: "Alle",
                availability: "Alle",
                couchCoop: "Alle"
            };


            /* Alle Filtergruppen zurücksetzen */

            document
                .querySelectorAll(".filter-buttons")
                .forEach(filterGroup => {

                    filterGroup
                        .querySelectorAll(".filter-button")
                        .forEach(button => {

                            button.classList.remove(
                                "active"
                            );

                        });


                    const allButton =
                        filterGroup.querySelector(
                            '[data-value="Alle"]'
                        );


                    if (allButton) {

                        allButton.classList.add(
                            "active"
                        );

                    }

                });


            /* Suche leeren */

            document.getElementById(
                "searchInput"
            ).value = "";


            /* Filter anwenden */

            applyFilters();

        }
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
   FILTER AUF- UND ZUKLAPPEN
   ========================================================= */

const filterToggle =
    document.getElementById("filterToggle");

const filterContent =
    document.getElementById("filterContent");

const filterArrow =
    document.getElementById("filterArrow");


filterToggle.addEventListener(
    "click",
    () => {

        const isOpen =
            filterToggle.getAttribute(
                "aria-expanded"
            ) === "true";


        if (isOpen) {

            filterToggle.setAttribute(
                "aria-expanded",
                "false"
            );

            filterContent.hidden = true;

            filterArrow.textContent = "⌄";

        } else {

            filterToggle.setAttribute(
                "aria-expanded",
                "true"
            );

            filterContent.hidden = false;

            filterArrow.textContent = "⌃";

        }

    }
);

/* =========================================================
   START
   ========================================================= */
const sortSelect = document.getElementById("sortSelect");

sortSelect.addEventListener("change", () => {
    currentSort = sortSelect.value;

    applyFilters();
});

loadGames();
