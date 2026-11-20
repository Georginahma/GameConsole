
FROM node:22-bookworm-slim

RUN apt-get update && \
    apt-get install -y --no-install-recommends swi-prolog-nox && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY backend/package.json ./backend/package.json
COPY backend/server.js ./backend/server.js
COPY prolog/tictactoe.pl ./prolog/tictactoe.pl

WORKDIR /app/backend

EXPOSE 3000

CMD ["node", "server.js"]
