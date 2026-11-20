
class TicTacToe {
    constructor() {
        this.board = Array(9).fill(null);
        this.currentPlayer = "X";
        this.gameOver = false;
        this.aiThinking = false;
        this.matchId = crypto.randomUUID();
        this.playerId = "PLAYER001";
        this.result = null;
    }

    async sendMatchStarted() {
    const event = {
        eventId: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        gameId: "TICTACTOE",
        matchId: this.matchId,
        playerId: this.playerId,
        type: "MATCH",
        action: "MATCH_STARTED"
    };

    try {
        await sendGameEvent(event);
        console.log("Inicio de partida registrado en GameStats");
    } catch (error) {
        console.error("Error al registrar la partida:", error);
    }
 }

    async sendMoveEvent(position, player) {
    const event = {
        eventId: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        gameId: "TICTACTOE",
        matchId: this.matchId,
        playerId: player === "X" ? this.playerId : "COMPUTER",
        type: "PLAYER",
        action: "PLAYER_ACTION",
        data: {
            position: position,
            symbol: player
        }
    };

    try {
        await sendGameEvent(event);
        console.log("Movimiento registrado en GameStats:", player, position);
    } catch (error) {
        console.error("Error al registrar movimiento:", error);
    }
    }


   async sendMatchFinished(result) {
        const event = {
            eventId: crypto.randomUUID(),
            timestamp: new Date().toISOString(),
            gameId: "TICTACTOE",
            matchId: this.matchId,
            playerId: this.playerId,
            type: "MATCH",
            action: "MATCH_FINISHED",
            data: {
                result: result
            }
        };

        try {
            await sendGameEvent(event);
            console.log("Partida finalizada en GameStats:", result);
        } catch (error) {
            console.error("Error al registrar finalización:", error);
        }
    }

    makeMove(position) {
    if (this.board[position] !== null || this.gameOver) {
        return;
    }

    this.board[position] = this.currentPlayer;

    this.sendMoveEvent(position, this.currentPlayer);

    const winner = this.checkWinner();

    if (winner !== null) {
    this.gameOver = true;
    this.sendMatchFinished(winner);
    this.result = winner === "X"
    ? { type: "win", message: "¡Felicidades! Ganaste la partida." }
    : { type: "lose", message: "La computadora ganó esta partida." };
    return;
    }

    if (this.board.every(cell => cell !== null)) {
    this.gameOver = true;
    this.sendMatchFinished("DRAW");
    this.result = {
    type: "draw",
    message: "¡La partida terminó en empate!"
    };
    return;
    }

    this.currentPlayer = this.currentPlayer === "X" ? "O" : "X";
}

async computerMove() {
    const response = await fetch("http://localhost:3000/ai-move", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            board: this.board
        })
    });

    if (!response.ok) {
        throw new Error("No se pudo consultar a Prolog");
    }

    const data = await response.json();
    return data.position;
}


    checkWinner() {
    const combinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    for (const [a, b, c] of combinations) {
        if (
            this.board[a] &&
            this.board[a] === this.board[b] &&
            this.board[a] === this.board[c]
        ) {
            return this.board[a];
        }
    }

    return null;
}

    render(container) {
        container.innerHTML = "<h2>Tres en raya</h2>";
        
        const layout = document.createElement("div");
        layout.className = "game-layout";

        const playArea = document.createElement("div");
        playArea.className = "game-play-area";

        const sidePanel = document.createElement("div");
        sidePanel.className = "game-side-panel";
       

        const boardElement = document.createElement("div");
        boardElement.className = "tic-tac-toe-board";

        for (let i = 0; i < 9; i++) {
            const cell = document.createElement("button");
            cell.textContent = this.board[i] || "";

           cell.addEventListener("click", async () => {
         if (this.currentPlayer !== "X" || this.gameOver || this.aiThinking) {
        return;
    }

    this.makeMove(i);
    this.render(container);

    if (this.gameOver || this.currentPlayer !== "O") {
        return;
    }

    this.aiThinking = true;

    try {
        const position = await this.computerMove();

        this.makeMove(position);
        this.render(container);
    } catch (error) {
        console.error("Error al consultar Prolog:", error);
        alert("No se pudo obtener el movimiento de la computadora.");
    } finally {
        this.aiThinking = false;
    }
});

        boardElement.appendChild(cell);
        }

        playArea.appendChild(boardElement);
        
            const restartButton = document.createElement("button");
        restartButton.textContent = "Nueva partida";
        
        restartButton.className = "tic-restart";

        restartButton.addEventListener("click", () => {
            if (!this.gameOver) {
            this.gameOver = true;
            this.sendMatchFinished("RESTARTED");
            }
            this.board = Array(9).fill(null);
            this.currentPlayer = "X";
            this.gameOver = false;
            this.result = null;
            this.aiThinking = false;
            this.matchId = crypto.randomUUID();
            this.sendMatchStarted();

            this.render(container);
        });

            sidePanel.appendChild(restartButton);

        if (this.result) {
            const message = document.createElement("div");
            message.className = `game-result ${this.result.type}`;
            message.textContent = this.result.message;

            sidePanel.appendChild(message);
        }   
        layout.appendChild(playArea);
        layout.appendChild(sidePanel);
        container.appendChild(layout);

    }
}
