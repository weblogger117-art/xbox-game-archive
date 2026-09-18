let games = [];


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

        games = await response.json();

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
        document.getElementById("gamesGrid");

    const counter =
        document.querySelector(".counter-number");


    counter.textContent =
        gameList.length;


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

                    <span class="fsk-badge">
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


        gamesGrid.appendChild(card);

    });

}


/* =========================================================
   START
   ========================================================= */

loadGames();
