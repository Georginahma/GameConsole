
const gameContainer = document.getElementById("game-container");

let currentGame = null;

// Detener Snake antes de cambiar de videojuego

function stopCurrentGame() {
    if (!currentGame) {
        return;
    }

    if (currentGame instanceof Snake) {
    clearInterval(currentGame.interval);
    document.removeEventListener(
        "keydown",
        currentGame.keyHandler
    );

    if (!currentGame.gameOver) {
        currentGame.gameOver = true;
        currentGame.sendMatchFinished("ABANDONED");
    }
    }


    if (currentGame instanceof TicTacToe && !currentGame.gameOver) {
        currentGame.gameOver = true;
        currentGame.sendMatchFinished("ABANDONED");
    }
    if (currentGame instanceof Memory && !currentGame.gameOver) {
    currentGame.gameOver = true;
    currentGame.sendMatchFinished("ABANDONED");
    }
}

// Tres en raya
document.getElementById("tic-tac-toe").addEventListener("click", () => {
    stopCurrentGame();

    currentGame = new TicTacToe();
    currentGame.render(gameContainer);
    currentGame.sendMatchStarted();
});

// Snake
document.getElementById("snake").addEventListener("click", () => {
    stopCurrentGame();

    currentGame = new Snake();
    currentGame.start(gameContainer);
});

// Memory
document.getElementById("memory").addEventListener("click", () => {
    stopCurrentGame();

    currentGame = new Memory();
    currentGame.render(gameContainer);
    currentGame.sendMatchStarted();
});

updateStatsPanel();
setInterval(updateStatsPanel, 3000);


window.addEventListener("pagehide", () => {
    if (!currentGame || currentGame.gameOver) {
        return;
    }

    const gameId =
        currentGame instanceof TicTacToe ? "TICTACTOE" :
        currentGame instanceof Snake ? "SNAKE" :
        currentGame instanceof Memory ? "MEMORY" :
        null;

    if (!gameId) {
        return;
    }

    const event = {
        eventId: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        gameId: gameId,
        matchId: currentGame.matchId,
        playerId: currentGame.playerId,
        type: "MATCH",
        action: "MATCH_FINISHED",
        data: {
            result: "ABANDONED"
        }
    };

    sendGameEventOnClose(event);
});
