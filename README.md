
# GameConsole

GameConsole es una consola web que integra tres videojuegos desarrollados mediante programación orientada a objetos: Tres en raya, Snake y Memory.

El sistema permite ejecutar partidas independientes, registrar eventos de juego y consultar estadísticas mediante su integración con GameStats.

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

- HTML y CSS: estructura y diseño visual.
- JavaScript: implementación de los videojuegos mediante clases.
- Node.js: comunicación entre Tres en raya y Prolog.
- SWI-Prolog: selección de movimientos de la computadora.
- Go: recepción y almacenamiento temporal de eventos en GameStats.
- Scala: cálculo de estadísticas generales e individuales.
- Docker y Docker Compose: ejecución de los servicios en contenedores.
- Git y GitHub: control de versiones.
- GitHub Actions: validación y publicación automática de imágenes Docker.



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

### Detener GameConsole

Desde su carpeta raíz:

```powershell
docker compose down
```

## Ejecución de partidas simultáneas

GameConsole permite abrir partidas en diferentes pestañas del navegador.

Cada nueva partida genera un identificador único (`matchId`) que permite distinguir sus eventos en GameStats.

## Estadísticas

El panel consulta las estadísticas de GameStats automáticamente cada tres segundos.

Incluye:

- Total de eventos, acciones, objetivos completados y jugadores.
- Eventos y acciones por videojuego.
- Partidas iniciadas y finalizadas por videojuego.

Los eventos se almacenan temporalmente en memoria en la implementación actual de GameStats. Reiniciar su contenedor Go puede eliminar los eventos registrados.

## Integración continua y publicación

GitHub Actions ejecuta automáticamente:

1. Verificación de sintaxis de los archivos JavaScript.
2. Construcción de las imágenes Docker del frontend y backend.
3. Publicación de ambas imágenes en GitHub Container Registry cuando los cambios se suben a `main`.

Repositorio: https://github.com/Georginahma/GameConsole


## Video demostrativo

El siguiente video presenta el funcionamiento de GameConsole, los tres videojuegos, la integración con GameStats, Docker y GitHub Actions.

[Ver demostración de GameConsole en YouTube](https://youtu.be/Um7IWfTIzrg)
