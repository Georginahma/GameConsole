class Memory {
    constructor() {
        this.cards = ["🍓", "🍋", "🍇", "🍒", "🍓", "🍋", "🍇", "🍒"];
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));

            [this.cards[i], this.cards[j]] =
                [this.cards[j], this.cards[i]];
        }
        this.flippedCards = [];
        this.matchedCards = [];
        this.attempts = 0;
        this.gameOver = false;
        this.matchId = crypto.randomUUID();
        this.playerId = "PLAYER001";
        this.result = null;
    }

    async sendMatchStarted() {
        const event = {
            eventId: crypto.randomUUID(),
            timestamp: new Date().toISOString(),
            gameId: "MEMORY",
            matchId: this.matchId,
            playerId: this.playerId,
            type: "MATCH",
            action: "MATCH_STARTED"
        };

        try {
            await sendGameEvent(event);
            console.log("Inicio de Memory registrado en GameStats");
        } catch (error) {
            console.error("Error al registrar Memory:", error);
        }
        }

    async sendAttemptEvent(matched) {
        const event = {
            eventId: crypto.randomUUID(),
            timestamp: new Date().toISOString(),
            gameId: "MEMORY",
            matchId: this.matchId,
            playerId: this.playerId,
            type: "PLAYER",
            action: "PLAYER_ACTION",
            data: {
                attempts: this.attempts,
                matched: matched
            }
        };

        try {
            await sendGameEvent(event);
            console.log("Intento registrado en GameStats:", this.attempts, matched);
        } catch (error) {
            console.error("Error al registrar intento:", error);
        }
    }

    async sendMatchFinished(result = "COMPLETED") {
        const event = {
            eventId: crypto.randomUUID(),
            timestamp: new Date().toISOString(),
            gameId: "MEMORY",
            matchId: this.matchId,
            playerId: this.playerId,
            type: "MATCH",
            action: "MATCH_FINISHED",
            data: {
                result: result,
                totalAttempts: this.attempts,
                totalPairs: this.matchedCards.length / 2
            }
        };

        try {
            await sendGameEvent(event);
            console.log("Memory finalizado en GameStats:", this.attempts);
        } catch (error) {
            console.error("Error al registrar finalización:", error);
        }
    }

    render(container) {
    this.container = container;
    container.innerHTML = `
        <h2>Memory</h2>
        <p>Intentos: ${this.attempts}</p>
    `;

        const layout = document.createElement("div");
        layout.className = "game-layout";

        const playArea = document.createElement("div");
        playArea.className = "game-play-area";

        const sidePanel = document.createElement("div");
        sidePanel.className = "game-side-panel";

        const board = document.createElement("div");
        board.className = "memory-board";

        for (let i = 0; i < this.cards.length; i++) {
            const card = document.createElement("button");

            const isFlipped = this.flippedCards.includes(i);
            const isMatched = this.matchedCards.includes(i);

            card.className = "memory-card";

            if (isFlipped) {
                card.classList.add("flipped");
            }

            if (isMatched) {
                card.classList.add("matched");
            }

            card.textContent = isFlipped || isMatched ? this.cards[i] : "✦";

            card.addEventListener("click", () => {
                this.flipCard(i);
                this.render(container);
            });

            board.appendChild(card);
        }

    playArea.appendChild(board);

    const restartButton = document.createElement("button");
    restartButton.textContent = "Nueva partida";
    restartButton.className = "memory-restart";

    restartButton.addEventListener("click", () => {
        if (!this.gameOver) {
            this.gameOver = true;
            this.sendMatchFinished("RESTARTED");
        }

        const newGame = new Memory();
        newGame.render(container);
        newGame.sendMatchStarted();
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

    flipCard(index) {
        if (
            this.gameOver ||
            this.flippedCards.includes(index) ||
            this.matchedCards.includes(index) ||
            this.flippedCards.length >= 2
        ) 
        {
            return;
        }

        this.flippedCards.push(index);

        if (this.flippedCards.length === 2) {
            this.attempts++;

            const [first, second] = this.flippedCards;

            const matched = this.cards[first] === this.cards[second];
            this.sendAttemptEvent(matched);

            if (this.cards[first] === this.cards[second]) {
                    this.matchedCards.push(first, second);
                    this.flippedCards = [];
                }

                if (this.matchedCards.length === this.cards.length) {
                    this.gameOver = true;
                    this.sendMatchFinished();

                    this.result = {
                        type: "win",
                        message: `¡Felicidades! Completaste Memory en ${this.attempts} intentos.`
                    };
                    }
                                     
                else {
                    setTimeout(() => {
                        this.flippedCards = [];
                        this.render(this.container);
                    }, 1000);
                }
        }
    }


}