% Representación de un tablero de Tres en raya
% x = jugador humano
% o = computadora
% e = casilla vacía

tablero_inicial([
    e, e, e,
    e, e, e,
    e, e, e
]).

% Combinaciones ganadoras: filas
linea(0, 1, 2).
linea(3, 4, 5).
linea(6, 7, 8).

% Columnas
linea(0, 3, 6).
linea(1, 4, 7).
linea(2, 5, 8).

% Diagonales
linea(0, 4, 8).
linea(2, 4, 6).

% Comprueba si un jugador tiene tres símbolos en línea
ganador(Tablero, Jugador) :-
    linea(A, B, C),
    nth0(A, Tablero, Jugador),
    nth0(B, Tablero, Jugador),
    nth0(C, Tablero, Jugador),
    Jugador \= e.

% Identifica una casilla vacía del tablero
movimiento_valido(Tablero, Posicion) :-
    nth0(Posicion, Tablero, e).

% Crea un nuevo tablero colocando un símbolo en una casilla vacía
aplicar_movimiento(Tablero, Posicion, Jugador, NuevoTablero) :-
    movimiento_valido(Tablero, Posicion),
    nth0(Posicion, Tablero, e, Resto),
    nth0(Posicion, NuevoTablero, Jugador, Resto).

% Busca una jugada que permita ganar inmediatamente
movimiento_ganador(Tablero, Jugador, Posicion) :-
    movimiento_valido(Tablero, Posicion),
    aplicar_movimiento(Tablero, Posicion, Jugador, NuevoTablero),
    ganador(NuevoTablero, Jugador).


% Identifica una casilla donde el jugador humano podría ganar
movimiento_bloqueo(Tablero, Posicion) :-
    movimiento_ganador(Tablero, x, Posicion).

% Prioridad 1: ganar
mejor_movimiento(Tablero, Posicion) :-
    movimiento_ganador(Tablero, o, Posicion),
    !.

% Prioridad 2: bloquear al jugador
mejor_movimiento(Tablero, Posicion) :-
    movimiento_bloqueo(Tablero, Posicion),
    !.

% Prioridad 3: seleccionar una casilla disponible
mejor_movimiento(Tablero, Posicion) :-
    movimiento_valido(Tablero, Posicion),
    !.