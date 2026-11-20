
const http = require("http");
const { execFile } = require("child_process");
const path = require("path");

const prologFile = path.join(__dirname, "..", "prolog", "tictactoe.pl");

function consultarProlog(tablero, callback) {
    const tableroProlog = tablero
        .map(celda => celda === null ? "e" : celda.toLowerCase())
        .join(",");

    const consulta =
        `mejor_movimiento([${tableroProlog}], P), writeln(P)`;

    execFile(
        "swipl",
        ["-q", "-s", prologFile, "-g", consulta, "-t", "halt"],
        (error, stdout, stderr) => {
            if (error) {
                callback(error, null);
                return;
            }

            const posicion = Number(stdout.trim());
            callback(null, posicion);
        }
    );
}

// Prueba de comunicación con Prolog
consultarProlog(
    ["X", "X", null, "O", null, null, null, null, null],
    (error, posicion) => {
        if (error) {
            console.error("Error:", error.message);
            return;
        }

        console.log("Movimiento obtenido:", posicion);
    }
);

const PORT = 3000;

const server = http.createServer((req, res) => {
    if (req.method === "OPTIONS") {
        res.writeHead(204, {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type"
        });
        res.end();
        return;
    }
    if (req.method === "POST" && req.url === "/ai-move") {
        let body = "";

        req.on("data", chunk => {
            body += chunk;
        });

        req.on("end", () => {
            const { board } = JSON.parse(body);

            consultarProlog(board, (error, posicion) => {
                res.setHeader("Access-Control-Allow-Origin", "*");
                res.setHeader("Content-Type", "application/json");

                if (error) {
                    res.writeHead(500);
                    res.end(JSON.stringify({ error: "Error al consultar Prolog" }));
                    return;
                }

                res.writeHead(200);
                res.end(JSON.stringify({ position: posicion }));
            });
        });

        return;
    }
    res.writeHead(200, {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
    });

    res.end(JSON.stringify({
        message: "Servidor GameConsole funcionando"
    }));
});

server.listen(PORT, () => {
    console.log(`Servidor GameConsole iniciado en puerto ${PORT}`);
});
