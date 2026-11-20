
const GAMESTATS_URL = "http://localhost:8080/events";

// Enviar eventos de los videojuegos a GameStats
async function sendGameEvent(event) {
    const response = await fetch(GAMESTATS_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(event)
    });

    if (!response.ok) {
        throw new Error(
            `Error al enviar evento: HTTP ${response.status}`
        );
    }

    return await response.json();
}

function sendGameEventOnClose(event) {
    const data = new Blob(
        [JSON.stringify(event)],
        { type: "application/json" }
    );

    return navigator.sendBeacon(GAMESTATS_URL, data);
}


// Consultar y mostrar las estadísticas calculadas por Scala
async function updateStatsPanel() {
    const generalStats = document.getElementById("general-stats");
    const gameStats = document.getElementById("game-stats");

    try {
        const response = await fetch("http://localhost:8080/stats");

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const stats = await response.json();

        // Estadísticas generales
        generalStats.innerHTML = `
            <p>Eventos totales: ${stats.totalEvents}</p>
            <p>Acciones realizadas: ${stats.totalActions}</p>
            <p>Jugadores: ${stats.totalPlayers}</p>
            <p>Objetivos completados: ${stats.totalObjectives}</p>
        `;

        // Estadísticas por videojuego
        gameStats.innerHTML = "";

        const gameNames = {
            TICTACTOE: "Tres en raya",
            SNAKE: "Snake",
            MEMORY: "Memory"
        };

        for (const [gameId, data] of Object.entries(stats.games)) {
            // No mostrar eventos de prueba GAME001
            if (!gameNames[gameId]) {
                continue;
            }

            const card = document.createElement("div");
            card.className = "stats-card";

            const title = document.createElement("h4");
            title.textContent = gameNames[gameId];
            card.appendChild(title);

            const values = [
                ["Eventos", data.totalEvents],
                ["Acciones", data.totalActions],
                ["Partidas iniciadas", data.matchesStarted],
                ["Partidas finalizadas", data.matchesFinished],
                ["Partidas pendientes de cierre", data.matchesPending]
            ];

            for (const [label, value] of values) {
                const paragraph = document.createElement("p");
                paragraph.textContent = `${label}: ${value}`;
                card.appendChild(paragraph);
            }

            gameStats.appendChild(card);
        }

    } catch (error) {
        console.error("Error al consultar estadísticas:", error);
        generalStats.textContent =
            "No se pudieron obtener las estadísticas.";
    }
}
