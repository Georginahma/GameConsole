
# GameConsole - Especificación de eventos

## 1. Descripción general

GameConsole genera eventos durante la ejecución de los videojuegos y los envía a GameStats para su procesamiento y análisis estadístico.

Los eventos utilizan el formato JSON establecido en el Proyecto 1, con el propósito de mantener la compatibilidad entre ambos sistemas.

## 2. Estructura de los eventos

Cada evento contiene los siguientes campos:

| Campo | Descripción |
|---|---|
| eventId | Identificador único del evento. |
| timestamp | Fecha y hora en que ocurrió el evento. |
| gameId | Identificador del videojuego. |
| gameVersion | Versión del videojuego. |
| matchId | Identificador único de la partida. |
| playerId | Identificador del jugador. |
| type | Categoría general del evento. |
| action | Acción específica realizada. |
| data | Información adicional relacionada con la acción. |

## 3. Videojuego: Tres en raya (Tic-Tac-Toe)

### Descripción

Tres en raya es un videojuego de estrategia en el que un jugador compite contra la computadora en un tablero de 3x3.

El jugador utiliza el símbolo X y la computadora utiliza el símbolo O.

La computadora selecciona sus movimientos mediante un algoritmo implementado en Prolog.

### 3.1. Eventos del videojuego

| Evento | Descripción |
|---|---|
| MATCH_STARTED | Se genera cuando inicia una nueva partida. |
| PLAYER_MOVE | Se genera cuando el jugador selecciona una casilla. |
| AI_DECISION | Se genera cuando Prolog determina el movimiento de la computadora. |
| PLAYER_WON | Se genera cuando el jugador gana la partida. |
| PLAYER_LOST | Se genera cuando la computadora gana la partida. |
| MATCH_DRAW | Se genera cuando la partida termina en empate. |
| MATCH_FINISHED | Se genera cuando finaliza la partida. |

### 3.2. Ejemplo de evento

El siguiente JSON representa un movimiento realizado por el jugador:

```json
{
  "eventId": "EV002",
  "timestamp": "2026-11-18T22:30:00Z",
  "gameId": "TICTACTOE",
  "gameVersion": "1.0",
  "matchId": "MATCH001",
  "playerId": "PLAYER001",
  "type": "GAME",
  "action": "PLAYER_MOVE",
  "data": {
    "row": 0,
    "column": 1,
    "symbol": "X"
  }
}
```

### 3.3. Estadísticas esperadas

A partir de los eventos generados, GameStats podrá calcular:

- Cantidad de partidas iniciadas.
- Cantidad de partidas finalizadas.
- Victorias del jugador.
- Derrotas del jugador.
- Empates.
- Cantidad de movimientos realizados.
- Duración de las partidas.

### 3.4. Identificación de partidas

Cada partida tendrá un identificador `matchId` único.

Todos los eventos pertenecientes a una misma partida compartirán ese identificador.

Cada evento tendrá su propio `eventId` y su correspondiente marca de tiempo.

Esto permitirá identificar correctamente los eventos cuando existan varias partidas ejecutándose simultáneamente.



## 4. Videojuego: Snake (Serpiente)

### Descripción

Snake es un videojuego en el que el jugador controla una serpiente que se desplaza por un tablero, consume alimentos y aumenta su longitud.

El objetivo es obtener la mayor puntuación posible evitando chocar contra las paredes o contra el cuerpo de la serpiente.

### 4.1. Eventos del videojuego

| Evento | Descripción |
|---|---|
| MATCH_STARTED | Se genera cuando comienza una partida. |
| PLAYER_MOVE | Se genera cuando la serpiente realiza un movimiento. |
| FOOD_EATEN | Se genera cuando la serpiente consume un alimento. |
| SCORE_UPDATED | Se genera cuando aumenta la puntuación. |
| PLAYER_LOST | Se genera cuando la serpiente choca y termina el juego. |
| MATCH_FINISHED | Se genera cuando finaliza la partida. |

### 4.2. Ejemplo de evento

```json
{
  "eventId": "EV003",
  "timestamp": "2026-11-18T22:40:00Z",
  "gameId": "SNAKE",
  "gameVersion": "1.0",
  "matchId": "MATCH002",
  "playerId": "PLAYER001",
  "type": "GAME",
  "action": "FOOD_EATEN",
  "data": {
    "score": 10,
    "snakeLength": 4,
    "foodPosition": {
      "row": 5,
      "column": 7
    }
  }
}
```

### 4.3. Estadísticas esperadas

GameStats podrá calcular:

- Cantidad de partidas iniciadas y finalizadas.
- Puntuación máxima alcanzada.
- Puntuación promedio por partida.
- Cantidad de alimentos consumidos.
- Duración de las partidas.
- Cantidad total de movimientos.

### 4.4. Identificación de partidas

Cada partida tendrá un `matchId` único y todos sus eventos compartirán dicho identificador.

Los eventos podrán registrarse mientras se desarrollan varias partidas de Snake u otros videojuegos simultáneamente.



## 5. Videojuego: Memoria (Parejas)

### Descripción

Memoria es un videojuego en el que el jugador debe encontrar parejas de cartas iguales dentro de un tablero.

El objetivo es descubrir todas las parejas utilizando la menor cantidad de intentos y en el menor tiempo posible.

### 5.1. Eventos del videojuego

| Evento | Descripción |
|---|---|
| MATCH_STARTED | Se genera cuando inicia una partida. |
| CARD_FLIPPED | Se genera cuando el jugador selecciona una carta. |
| PAIR_MATCHED | Se genera cuando encuentra dos cartas iguales. |
| PAIR_FAILED | Se genera cuando las cartas seleccionadas son diferentes. |
| MATCH_FINISHED | Se genera cuando completa todas las parejas. |

### 5.2. Ejemplo de evento

El siguiente evento representa una pareja encontrada correctamente:

```json
{
  "eventId": "EV004",
  "timestamp": "2026-11-18T22:45:00Z",
  "gameId": "MEMORY",
  "gameVersion": "1.0",
  "matchId": "MATCH003",
  "playerId": "PLAYER001",
  "type": "GAME",
  "action": "PAIR_MATCHED",
  "data": {
    "firstCard": 2,
    "secondCard": 7,
    "attempt": 3,
    "pairsFound": 2
  }
}
```

### 5.3. Estadísticas esperadas

GameStats podrá calcular:

- Cantidad de partidas iniciadas y finalizadas.
- Cantidad de intentos realizados.
- Cantidad de parejas encontradas.
- Cantidad de intentos fallidos.
- Porcentaje de aciertos.
- Tiempo necesario para completar una partida.
- Mejor resultado por jugador.

### 5.4. Identificación de partidas

Cada partida tendrá un `matchId` único.

Todos los eventos generados durante una partida compartirán ese identificador, mientras que cada evento tendrá un `eventId` diferente.

Esto permitirá mantener separadas las estadísticas de distintas partidas, incluso cuando se ejecuten simultáneamente.
```

### Ajuste final del documento

Ahora que tenemos los tres videojuegos definidos:

- Cambia «Integración con GameStats» a **sección 6**.
- Elimina la sección «Videojuegos pendientes», porque ya documentamos los tres juegos.

**Con esto terminamos la definición inicial de eventos.**

El siguiente paso será revisar GameStats para asegurar que pueda interpretar estos eventos y generar las estadísticas que mostrará GameConsole.


## 6. Integración con GameStats

Los eventos serán enviados al módulo Go de GameStats mediante el mecanismo HTTP utilizado en el Proyecto 1.

Go será responsable de recibir y validar los eventos, mientras que Scala realizará el procesamiento estadístico.

GameConsole consultará los resultados de GameStats para mostrarlos en su panel de control.

## 7. Videojuegos pendientes

Los eventos de Snake y Memoria se documentarán posteriormente, manteniendo la misma estructura JSON.
