
# GameConsole

GameConsole es una consola web que integra tres videojuegos desarrollados mediante programación orientada a objetos: Tres en raya, Snake y Memory.

El sistema permite ejecutar partidas independientes y simultáneas, registrar eventos de juego y consultar estadísticas mediante su integración con GameStats.

## Objetivo

Desarrollar una consola web de videojuegos que integre programación orientada a objetos, lógica declarativa mediante Prolog, procesamiento de eventos y contenedores Docker.

## Videojuegos

### Tres en raya

Juego en el que una persona compite contra la computadora.

La computadora utiliza reglas implementadas en SWI-Prolog para seleccionar sus movimientos. La comunicación se realiza mediante un servidor Node.js.

### Snake

Juego en el que la persona controla una serpiente mediante las flechas del teclado.

El objetivo es consumir alimentos, aumentar la puntuación y evitar colisiones contra los bordes o el propio cuerpo.

### Memory

Juego de memoria que consiste en encontrar cuatro parejas de cartas.

El sistema registra la cantidad de intentos y detecta cuándo se completa la partida.

## Tecnologías utilizadas

- **HTML y CSS:** estructura y diseño visual.
- **JavaScript:** implementación de los videojuegos mediante clases.
- **Node.js:** comunicación entre Tres en raya y Prolog.
- **SWI-Prolog:** selección de movimientos de la computadora.
- **Go:** recepción y almacenamiento temporal de eventos en GameStats.
- **Scala:** cálculo de estadísticas generales y por videojuego.
- **Docker y Docker Compose:** ejecución de los servicios en contenedores.
- **Git y GitHub:** control de versiones.
- **GitHub Actions:** validación y publicación automática de imágenes Docker.

## Arquitectura del sistema

GameConsole utiliza una arquitectura distribuida mediante servicios independientes.

### Componentes

1. **Frontend (Nginx):** presenta la interfaz web y los tres videojuegos.
2. **Backend (Node.js):** recibe las solicitudes de Tres en raya y consulta Prolog.
3. **SWI-Prolog:** aplica reglas para seleccionar los movimientos de la computadora.
4. **GameStats Go:** recibe y almacena temporalmente los eventos de las partidas.
5. **GameStats Scala:** procesa los eventos y calcula las estadísticas.

### Comunicación entre componentes

- El navegador solicita la interfaz al frontend mediante HTTP.
- Tres en raya consulta `POST /ai-move` para obtener los movimientos calculados por Prolog.
- Los videojuegos envían sus eventos a GameStats mediante `POST /events`.
- El panel consulta `GET /stats` para obtener las estadísticas calculadas por Scala a través de Go.

GameConsole muestra los resultados del análisis, pero no realiza los cálculos estadísticos.

## Ejecución con Docker

### Requisitos

- Docker Desktop
- Docker Compose
- Navegador web
- Proyecto GameStats disponible para ejecutar sus servicios

### Iniciar GameConsole

Desde la carpeta raíz del proyecto:

```powershell
docker compose up -d --build
```

Servicios disponibles:

| Servicio | Dirección |
|---|---|
| GameConsole | http://localhost:8081 |
| Backend Node.js | http://localhost:3000 |

### Iniciar GameStats

GameStats se ejecuta desde su propio proyecto y archivo Docker Compose:

```powershell
cd ruta/al/proyecto/gamestats
docker compose up -d --build
```

Servicios disponibles:

| Servicio | Dirección |
|---|---|
| GameStats Go | http://localhost:8080 |
| GameStats Scala | http://localhost:9000 |

Ambos proyectos deben estar ejecutándose para disponer de todas las funcionalidades.

### Verificar los contenedores

```powershell
docker ps
```

Este comando permite comprobar qué contenedores están activos y qué puertos utilizan.

### Detener GameConsole

Desde su carpeta raíz:

```powershell
docker compose down
```

GameStats se detiene por separado desde su propia carpeta.

## Deployment

El despliegue de GameConsole se realizó en un entorno local utilizando Docker Desktop y Docker Compose.

El frontend se ejecuta en un contenedor Nginx y el backend en un contenedor Node.js con SWI-Prolog.

GameStats se ejecuta mediante sus propios contenedores de Go y Scala. Ambos proyectos se comunican mediante HTTP.

La aplicación está disponible localmente en:

http://localhost:8081

El despliegue se puede reproducir siguiendo las instrucciones de la sección **Ejecución con Docker**.

Además, GitHub Actions publica automáticamente las imágenes Docker del frontend y backend en GitHub Container Registry.

Estas imágenes permiten distribuir los componentes de GameConsole. La publicación de imágenes no representa por sí misma un despliegue público de la aplicación.

## Ejecución de partidas simultáneas

GameConsole permite mantener partidas independientes en diferentes pestañas del navegador.

Cada nueva partida genera un identificador único (`matchId`) que permite distinguir sus eventos en GameStats.

### Verificación de concurrencia

Se realizó una prueba ejecutando Snake y Memory simultáneamente en dos pestañas independientes.

Durante la prueba:

- Snake continuó funcionando después de cambiar a la pestaña de Memory.
- Ambas partidas conservaron su estado.
- GameStats recibió cinco eventos de Snake y cinco de Memory.
- Los eventos quedaron asociados a identificadores `matchId` diferentes.

Esta prueba permitió comprobar el funcionamiento de partidas independientes y el registro de sus eventos sin mezclar sus identificadores.

## Eventos de juego

Los videojuegos generan eventos compatibles con GameStats durante la ejecución de las partidas.

Se utilizan principalmente las siguientes acciones:

| Acción | Descripción |
|---|---|
| `MATCH_STARTED` | Se registra al iniciar una partida. |
| `PLAYER_ACTION` | Se registra cuando ocurre una acción del jugador. |
| `MATCH_FINISHED` | Se registra cuando termina una partida. |

Cada evento contiene información como:

- `eventId`: identificador del evento.
- `timestamp`: fecha y hora del evento.
- `gameId`: videojuego al que pertenece.
- `matchId`: identificador de la partida.
- `playerId`: identificador del jugador.
- `type`: tipo de evento.
- `action`: acción registrada.
- `data`: información específica del evento.

### Finalización de partidas

Las partidas pueden finalizar por las condiciones propias de cada videojuego.

También se implementó el registro de finalización cuando el jugador reinicia o abandona una partida.

Al cambiar entre videojuegos se registra el abandono de la partida anterior, si todavía estaba activa.

Al cerrar o abandonar la página, GameConsole intenta enviar un evento de finalización mediante `navigator.sendBeacon()`.

Este mecanismo no garantiza la entrega si el navegador se cierra inesperadamente o se interrumpe la comunicación.

## Estadísticas

El panel consulta las estadísticas de GameStats automáticamente cada tres segundos.

### Estadísticas generales

- Total de eventos.
- Total de acciones.
- Total de objetivos completados.
- Total de jugadores identificados.
- Patrón calculado por GameStats.

### Estadísticas por videojuego

- Total de eventos.
- Total de acciones.
- Partidas iniciadas.
- Partidas finalizadas.
- Partidas pendientes de cierre.

Las partidas pendientes de cierre representan partidas que tienen un evento `MATCH_STARTED`, pero no un evento `MATCH_FINISHED`.

Por esta razón, no necesariamente equivalen a partidas que se están ejecutando en ese momento.

Los eventos se almacenan temporalmente en memoria en la implementación actual de GameStats. Reiniciar su contenedor Go puede eliminar los eventos registrados.

## Integración continua y publicación

GameConsole utiliza GitHub Actions para automatizar tareas de validación y publicación.

El pipeline ejecuta:

1. Verificación de sintaxis de los archivos JavaScript.
2. Construcción de las imágenes Docker del frontend y backend.
3. Publicación de ambas imágenes en GitHub Container Registry cuando los cambios se suben a la rama `main`.

La etapa de publicación se ejecuta después de completar correctamente las validaciones.

El funcionamiento del pipeline fue comprobado mediante una ejecución exitosa en GitHub Actions.

Repositorio del proyecto:

https://github.com/Georginahma/GameConsole

## Video demostrativo

El siguiente video presenta el funcionamiento de GameConsole, los tres videojuegos, la integración con Prolog y GameStats, la ejecución mediante Docker y el proceso de GitHub Actions.

[Ver demostración de GameConsole en YouTube](https://youtu.be/Um7IWfTIzrg)
