
const gameContainer = document.getElementById("game-container");

let currentGame = null;

// Detener Snake antes de cambiar de videojuego
function stopCurrentGame() {
    if (currentGame instanceof Snake) {
        clearInterval(currentGame.interval);
        document.removeEventListener(
            "keydown",
            currentGame.keyHandler
        );
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