
class Snake {
    constructor() {
        this.gridSize = 20;
        this.snake = [{ x: 10, y: 10 }];
        this.direction = "RIGHT";
        this.food = { x: 5, y: 5 };
        this.score = 0;
        this.gameOver = false;
        this.result = null;
        this.matchId = crypto.randomUUID();
        this.playerId = "PLAYER001";
    }

    async sendMatchStarted() {
    const event = {
        eventId: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        gameId: "SNAKE",
        matchId: this.matchId,
        playerId: this.playerId,
        type: "MATCH",
        action: "MATCH_STARTED"
    };

    try {
        await sendGameEvent(event);
        console.log("Inicio de Snake registrado en GameStats");
    } catch (error) {
        console.error("Error al registrar Snake:", error);
    }
    }

    async sendScoreEvent() {
    const event = {
        eventId: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        gameId: "SNAKE",
        matchId: this.matchId,
        playerId: this.playerId,
        type: "PLAYER",
        action: "PLAYER_ACTION",
        data: {
            score: this.score,
            activity: "FOOD_EATEN"
        }
    };

    try {
        await sendGameEvent(event);
        console.log("Puntuación registrada en GameStats:", this.score);
    } catch (error) {
        console.error("Error al registrar puntuación:", error);
    }
    }

    async sendMatchFinished(reason) {
    const event = {
        eventId: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        gameId: "SNAKE",
        matchId: this.matchId,
        playerId: this.playerId,
        type: "MATCH",
        action: "MATCH_FINISHED",
        data: {
            result: "GAME_OVER",
            reason: reason,
            finalScore: this.score
        }
    };

    try {
        await sendGameEvent(event);
        console.log("Snake finalizado en GameStats:", reason, this.score);
    } catch (error) {
        console.error("Error al registrar finalización:", error);
    }
    }

    render(container) {
       container.innerHTML = `
            <h2>Snake</h2>
            <p>Puntuación: ${this.score}</p>
        `;
        const layout = document.createElement("div");
        layout.className = "game-layout";

        const playArea = document.createElement("div");
        playArea.className = "game-play-area";

        const sidePanel = document.createElement("div");
        sidePanel.className = "game-side-panel";

        const canvas = document.createElement("canvas");
        canvas.width = 400;
        canvas.height = 400;

        const ctx = canvas.getContext("2d");
        const cellSize = canvas.width / this.gridSize;

     
        // Dibujar el cuerpo continuo de la serpiente
        for (let i = 0; i < this.snake.length; i++) {
            const segment = this.snake[i];

            const x = segment.x * cellSize;
            const y = segment.y * cellSize;

            ctx.fillStyle = i === 0 ? "#15803d" : "#22c55e";

        // Segmentos sin espacios ni bordes redondeados
            ctx.fillRect(x, y, cellSize, cellSize);
        }

        // Ojos de la serpiente
        const head = this.snake[0];
        const headX = head.x * cellSize;
        const headY = head.y * cellSize;

        ctx.fillStyle = "white";

        if (this.direction === "RIGHT" || this.direction === "LEFT") {
            ctx.beginPath();
            ctx.arc(headX + cellSize * 0.7, headY + cellSize * 0.3, 2.5, 0, Math.PI * 2);
            ctx.arc(headX + cellSize * 0.7, headY + cellSize * 0.7, 2.5, 0, Math.PI * 2);
            ctx.fill();
        } else {
            ctx.beginPath();
            ctx.arc(headX + cellSize * 0.3, headY + cellSize * 0.3, 2.5, 0, Math.PI * 2);
            ctx.arc(headX + cellSize * 0.7, headY + cellSize * 0.3, 2.5, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.fillStyle = "#111827";

        if (this.direction === "RIGHT" || this.direction === "LEFT") {
            ctx.beginPath();
            ctx.arc(headX + cellSize * 0.72, headY + cellSize * 0.3, 1.2, 0, Math.PI * 2);
            ctx.arc(headX + cellSize * 0.72, headY + cellSize * 0.7, 1.2, 0, Math.PI * 2);
            ctx.fill();
        } else {
            ctx.beginPath();
            ctx.arc(headX + cellSize * 0.3, headY + cellSize * 0.32, 1.2, 0, Math.PI * 2);
            ctx.arc(headX + cellSize * 0.7, headY + cellSize * 0.32, 1.2, 0, Math.PI * 2);
            ctx.fill();
        }

    
        // Dibujar una manzana
        const appleX = this.food.x * cellSize + cellSize / 2;
        const appleY = this.food.y * cellSize + cellSize / 2;

        // Cuerpo rojo de la manzana
        ctx.fillStyle = "#ef4444";
        ctx.beginPath();
        ctx.arc(appleX, appleY + 2, cellSize * 0.38, 0, Math.PI * 2);
        ctx.fill();

        // Brillo
        ctx.fillStyle = "#fca5a5";
        ctx.beginPath();
        ctx.ellipse(
            appleX - 4,
            appleY - 1,
            2,
            4,
            -0.5,
            0,
            Math.PI * 2
        );
        ctx.fill();

        // Tallo marrón
        ctx.strokeStyle = "#78350f";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(appleX, appleY - 5);
        ctx.lineTo(appleX + 1, appleY - 10);
        ctx.stroke();

        // Hoja verde
        ctx.fillStyle = "#22c55e";
        ctx.beginPath();
        ctx.ellipse(
            appleX + 4,
            appleY - 9,
            4,
            2,
            -0.5,
            0,
            Math.PI * 2
        );
        ctx.fill();


        playArea.appendChild(canvas);
        const restartButton = document.createElement("button");
         restartButton.textContent = "Nueva partida";

        restartButton.addEventListener("click", () => {
        this.restart(container);
        });

        sidePanel.appendChild(restartButton);

 
        if (this.result) {
            const message = document.createElement("div");
            message.className = `game-result ${this.result.type}`;
            message.textContent = this.result.message;
            sidePanel.appendChild(message);
        }

        // Mostrar siempre el tablero y los controles
        layout.appendChild(playArea);
        layout.appendChild(sidePanel);
        container.appendChild(layout);
        
        
    }

    move() {
        if (this.gameOver) {
            return;
        }

        const head = { ...this.snake[0] };

        switch (this.direction) {
            case "UP":
                head.y--;
                break;
            case "DOWN":
                head.y++;
                break;
            case "LEFT":
                head.x--;
                break;
            case "RIGHT":
                head.x++;
                break;
        }

         if (
        head.x < 0 ||
        head.x >= this.gridSize ||
        head.y < 0 ||
        head.y >= this.gridSize
         ) {
        this.gameOver = true;

        this.sendMatchFinished("WALL_COLLISION");

       this.result = {
            type: "lose",
            message: "¡Fin del juego! La serpiente chocó contra el borde."
        };
        return;
        }

        const eating = head.x === this.food.x && head.y === this.food.y;

        const body = eating ? this.snake : this.snake.slice(0, -1);


        if (body.some(segment =>
            segment.x === head.x && segment.y === head.y
        )) {
            this.gameOver = true;

            this.sendMatchFinished("SELF_COLLISION");

            this.result = {
                type: "lose",
                message: "¡Fin del juego! La serpiente chocó contra su cuerpo."
            };
            return;
        }

        this.snake.unshift(head);

        if (head.x === this.food.x && head.y === this.food.y) {
            this.score += 10;

            this.sendScoreEvent();

            this.food = this.generateFood();
        } 

        else {
            this.snake.pop();
        }

        }


    generateFood() {
        let position;

        do {
            position = {
                x: Math.floor(Math.random() * this.gridSize),
                y: Math.floor(Math.random() * this.gridSize)
            };
        } while (
            this.snake.some(segment =>
                segment.x === position.x &&
                segment.y === position.y
            )
        );

        return position;
        }

    restart(container) {
        if (!this.gameOver) {
        this.gameOver = true;
        this.sendMatchFinished("RESTARTED");
}
        clearInterval(this.interval);
        document.removeEventListener("keydown", this.keyHandler);

        this.snake = [{ x: 10, y: 10 }];
        this.direction = "RIGHT";
        this.food = { x: 5, y: 5 };
        this.score = 0;
        this.gameOver = false;
        this.result = null;
        this.matchId = crypto.randomUUID();

        this.start(container);
        }
    

    handleKey(event) {
        const directions = {
            ArrowUp: "UP",
            ArrowDown: "DOWN",
            ArrowLeft: "LEFT",
            ArrowRight: "RIGHT"
        };

        const newDirection = directions[event.key];

        if (!newDirection) {
            return;
        }

        event.preventDefault();

        const opposites = {
            UP: "DOWN",
            DOWN: "UP",
            LEFT: "RIGHT",
            RIGHT: "LEFT"
        };

        if (newDirection !== opposites[this.direction]) {
            this.direction = newDirection;
        }
    }

    start(container) {

        clearInterval(this.interval);

        this.render(container);

        this.sendMatchStarted();

        this.keyHandler = (event) => this.handleKey(event);
        document.addEventListener("keydown", this.keyHandler);

        this.interval = setInterval(() => {
            if (this.gameOver) {
                clearInterval(this.interval);
                return;
            }

            this.move();
            this.render(container);
        }, 200);
    }
}
