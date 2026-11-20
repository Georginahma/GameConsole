# GameConsole — Especificación y registro de eventos

## 1. Descripción general

GameConsole es una consola web que integra tres videojuegos: Tres en raya, Snake y Memory.

Durante las partidas, cada videojuego genera eventos que se envían a GameStats mediante HTTP. Estos eventos permiten registrar las acciones realizadas, identificar las partidas y obtener estadísticas generales e individuales de los videojuegos.

La implementación utiliza JavaScript para generar los eventos, Go para recibirlos y Scala para calcular las estadísticas.

## 2. Estructura de los eventos

Los eventos utilizan una estructura JSON compatible con GameStats.

| Campo | Descripción |
|---|---|
| `eventId` | Identificador único del evento. |
| `timestamp` | Fecha y hora del evento en formato ISO 8601. |
| `gameId` | Identificador del videojuego. |
| `gameVersion` | Versión del videojuego, contemplada en el esquema original. |
| `matchId` | Identificador único de la partida. |
| `playerId` | Identificador del jugador. |
| `type` | Categoría general del evento. |
| `action` | Acción registrada. |
| `data` | Información adicional del evento, cuando corresponde. |

**Nota:** la implementación actual de GameConsole no envía `gameVersion`. Este campo se mantiene documentado porque forma parte de la especificación original de eventos.

Los identificadores `eventId` y `matchId` se generan mediante `crypto.randomUUID()`.

## 3. Videojuego: Tres en raya

### 3.1. Descripción

Tres en raya es un videojuego de estrategia en el que una persona compite contra la computadora en un tablero de 3 × 3.

El jugador utiliza el símbolo X y la computadora utiliza O. Los movimientos de la computadora se determinan mediante reglas implementadas en SWI-Prolog y consultadas desde Node.js.

### 3.2. Eventos implementados

| Acción | Tipo | Descripción |
|---|---|---|
| `MATCH_STARTED` | MATCH | Se registra cuando inicia una partida. |
| `PLAYER_ACTION` | PLAYER | Registra una posición seleccionada y el símbolo X u O. |
| `MATCH_FINISHED` | MATCH | Registra el ganador o el resultado `DRAW` cuando existe empate. |

El campo `playerId` identifica al jugador humano como `PLAYER001` y a la computadora como `COMPUTER` en los eventos de movimiento.

### 3.3. Ejemplo de evento

El siguiente JSON representa un movimiento del jugador:

```json
{
  "eventId": "EV002",
  "timestamp": "2026-11-18T22:30:00Z",
  "gameId": "TICTACTOE",
  "matchId": "MATCH001",
  "playerId": "PLAYER001",
  "type": "PLAYER",
  "action": "PLAYER_ACTION",
  "data": {
    "position": 1,
    "symbol": "X"
  }
}
```

Los identificadores del ejemplo son ilustrativos. En la ejecución real se generan identificadores UUID.

### 3.4. Estadísticas disponibles

GameStats calcula para Tres en raya:

- Cantidad de eventos registrados.
- Cantidad de acciones realizadas.
- Cantidad de partidas iniciadas.
- Cantidad de partidas finalizadas.

Los resultados de victoria, derrota y empate se registran en los eventos de finalización, pero todavía no se muestran como estadísticas independientes en el panel.

## 4. Videojuego: Snake

### 4.1. Descripción

Snake es un videojuego en el que el jugador controla una serpiente mediante las flechas del teclado.

La serpiente aumenta su longitud y puntuación al consumir alimentos. La partida termina cuando choca contra un borde o contra su propio cuerpo.

### 4.2. Eventos implementados

| Acción | Tipo | Descripción |
|---|---|---|
| `MATCH_STARTED` | MATCH | Registra el inicio de una partida. |
| `PLAYER_ACTION` | PLAYER | Registra la puntuación cuando la serpiente consume un alimento. |
| `MATCH_FINISHED` | MATCH | Registra el motivo de finalización y la puntuación final. |

Los motivos de finalización incluyen `WALL_COLLISION`, `SELF_COLLISION` y `RESTARTED`.

### 4.3. Ejemplo de evento

El siguiente evento representa un alimento consumido:

```json
{
  "eventId": "EV003",
  "timestamp": "2026-11-18T22:40:00Z",
  "gameId": "SNAKE",
  "matchId": "MATCH002",
  "playerId": "PLAYER001",
  "type": "PLAYER",
  "action": "PLAYER_ACTION",
  "data": {
    "score": 10,
    "activity": "FOOD_EATEN"
  }
}
```

### 4.4. Estadísticas disponibles

GameStats calcula para Snake:

- Cantidad de eventos registrados.
- Cantidad de acciones realizadas.
- Cantidad de partidas iniciadas.
- Cantidad de partidas finalizadas.

La puntuación final queda registrada en los eventos, pero el panel todavía no calcula la puntuación máxima ni el promedio de puntuaciones.

## 5. Videojuego: Memory

### 5.1. Descripción

Memory es un videojuego de memoria que consiste en encontrar cuatro parejas de cartas iguales.

El jugador debe descubrir las parejas utilizando la menor cantidad posible de intentos.

### 5.2. Eventos implementados

| Acción | Tipo | Descripción |
|---|---|---|
| `MATCH_STARTED` | MATCH | Registra el inicio de una partida. |
| `PLAYER_ACTION` | PLAYER | Registra cada intento y si las cartas seleccionadas coinciden. |
| `MATCH_FINISHED` | MATCH | Registra el resultado y la cantidad total de intentos. |

### 5.3. Ejemplo de evento

El siguiente evento representa un intento correcto:

```json
{
  "eventId": "EV004",
  "timestamp": "2026-11-18T22:45:00Z",
  "gameId": "MEMORY",
  "matchId": "MATCH003",
  "playerId": "PLAYER001",
  "type": "PLAYER",
  "action": "PLAYER_ACTION",
  "data": {
    "attempts": 3,
    "matched": true
  }
}
```

### 5.4. Estadísticas disponibles

GameStats calcula para Memory:

- Cantidad de eventos registrados.
- Cantidad de acciones realizadas.
- Cantidad de partidas iniciadas.
- Cantidad de partidas finalizadas.

Los eventos también contienen información sobre los intentos y las coincidencias, aunque el panel todavía no calcula el porcentaje de aciertos ni el mejor resultado.

## 6. Integración con GameStats

La comunicación utiliza solicitudes HTTP y datos en formato JSON.

### 6.1. Registro de eventos

Los videojuegos envían eventos mediante:

`POST http://localhost:8080/events`

El módulo Go de GameStats recibe y valida los eventos antes de almacenarlos temporalmente.

### 6.2. Procesamiento estadístico

El módulo Scala procesa los eventos para generar estadísticas generales y estadísticas agrupadas por `gameId`.

Las estadísticas generales incluyen:

- `totalEvents`: total de eventos registrados.
- `totalActions`: cantidad de eventos `PLAYER_ACTION`.
- `totalObjectives`: cantidad de eventos `OBJECTIVE_COMPLETED`.
- `totalPlayers`: cantidad de identificadores de jugadores distintos.
- `pattern`: patrón de actividad detectado.

Las estadísticas individuales incluyen:

- `totalEvents`: eventos por videojuego.
- `totalActions`: acciones por videojuego.
- `matchesStarted`: partidas iniciadas.
- `matchesFinished`: partidas finalizadas.

### 6.3. Consulta de estadísticas

GameConsole obtiene las estadísticas mediante:

`GET http://localhost:8080/stats`

El frontend actualiza el panel automáticamente cada tres segundos.

Los cálculos estadísticos se realizan en Scala. GameConsole únicamente consulta y presenta los resultados.

## 7. Partidas independientes y simultáneas

Cada partida genera un `matchId` único mediante `crypto.randomUUID()`.

Todos los eventos de una misma partida comparten ese identificador, mientras que cada evento tiene su propio `eventId`.

Esto permite identificar las partidas de forma independiente, incluso cuando se ejecutan simultáneamente en diferentes pestañas del navegador.

La independencia de las partidas de Memory se verificó abriendo dos pestañas y comprobando que GameStats registrara diferentes identificadores.

## 8. Limitaciones actuales

- Los eventos se almacenan temporalmente en memoria en Go; pueden perderse al reiniciar el contenedor.
- El campo `gameVersion` todavía no se envía desde los videojuegos.
- El panel no muestra aún métricas específicas como victorias, derrotas, puntuación máxima o porcentaje de aciertos.
- Las estadísticas de partidas iniciadas y finalizadas representan eventos registrados, por lo que las partidas interrumpidas pueden quedar sin un evento de finalización.

## 9. Conclusión

La integración entre GameConsole y GameStats permite registrar eventos de los tres videojuegos y consultar estadísticas calculadas externamente.

La identificación mediante `matchId` facilita el seguimiento de partidas independientes, mientras que la separación entre Go, Scala y GameConsole mantiene diferenciadas las responsabilidades de registro, procesamiento y visualización de los datos.