const index = require('./index.js');
const fs = require('fs');
const path = require('path');
const fetchMock = require('jest-fetch-mock');


describe('Test Checkers Game', () => {
    beforeAll(() => {
        const html = fs.readFileSync(path.resolve(__dirname, "index.html"), "utf8");
        document.documentElement.innerHTML = html;
    });
    beforeEach(() => {
        global.fetch = jest.fn(() => Promise.resolve({json: () => Promise.resolve([])}));
        index.initializeBoard();
        globalThis.moveCount = 0;
        globalThis.gameStartedAt = Date.now();
        fetchMock.resetMocks();
        global.fetch = fetchMock;
    });
    // ================ Tablero + Inicialización ================

    test('initializeBoard coloca las piezas iniciales en su lugar', () => {
        index.initializeBoard();
        // Reviso las 12 piezas negras
        let blacks = 0, whites = 0, nulls = 0;
        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                if (board[r][c] === 'black') blacks++;
                else if (board[r][c] === 'white') whites++;
                else if (board[r][c] === null) nulls++;
                else throw new Error('Valor de celda inesperado.');
            }
        }
        expect(blacks).toBe(12);
        expect(whites).toBe(12);
        expect(nulls).toBe(64 - 24);
        // En filas 0,1,2 sólo hay negras en celdas impares
        for (let r = 0; r < 3; r++) {
            for (let c = 0; c < 8; c++) {
                if ((r + c) % 2 === 1)
                    expect(board[r][c]).toBe('black');
                else
                    expect(board[r][c]).toBe(null);
            }
        }
        // En filas 5,6,7 sólo hay blancas en celdas impares
        for (let r = 5; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                if ((r + c) % 2 === 1)
                    expect(board[r][c]).toBe('white');
                else
                    expect(board[r][c]).toBe(null);
            }
        }
        // Filas 3 y 4 sólo null
        for (let r = 3; r < 5; r++) {
            for (let c = 0; c < 8; c++)
                expect(board[r][c]).toBe(null);
        }
    });

    test('guarda la pieza seleccionada y sus coordenadas', () => {
        index.selectPiece('white', 3, 2);
        expect(selectedPiece).toBe('white');
        expect(selectedPieceCoords).toEqual({row: 3, col: 2});
    });

    test('elimina la selección activa', () => {
        selectedPiece = 'black';
        selectedPieceCoords = {row: 5, col: 1};
        index.resetSelection();
        expect(selectedPiece).toBeNull();
        expect(selectedPieceCoords).toBeNull();
    });
    test('mueve la pieza de origen a destino y deja origen vacía', () => {
        index.initializeBoard();
        board[5][0] = 'white';
        index.updateBoard(5, 0, 4, 1);
        expect(board[4][1]).toBe('white');
        expect(board[5][0]).toBeNull();
    });
// ================ Contador de piezas ================
    test('debe devolver piezas correctas al inicio', () => {
        index.initializeBoard();
        expect(index.countPieces('white')).toBe(12);
        expect(index.countPieces('black')).toBe(12);
        expect(index.countPieces(null)).toBe(64 - 24); // 40
    });

    test('funciona si se eliminan o agregan piezas', () => {
        index.initializeBoard();
        board[5][0] = null;
        expect(index.countPieces('white')).toBe(11);
        board[2][3] = 'white';
        expect(index.countPieces('white')).toBe(12);
    });

// ================ Validación de movimiento ================


    test('permite movimientos diagonales simples de avance', () => {
        index.initializeBoard(); // <- <- <- ESSENCIAL
        jest.spyOn(index, 'isCaptureValid').mockReturnValue(false);

        expect(index.isMoveValid(5, 0, 4, 1)).toBe(true);
        expect(index.isMoveValid(5, 0, 5, 1)).toBe(false);
        expect(index.isMoveValid(4, 0, 2, 2)).toBe(false);
    });

    test('permite movimientos de captura sólo si isCaptureValid lo permite', () => {
        index.initializeBoard();
        // Prepara una pieza negra saltada
        board[4][1] = 'black';
        jest.spyOn(index, 'isCaptureValid').mockImplementation(
            (fromRow, fromCol, toRow, toCol) => {
                const jumpedRow = (fromRow + toRow) / 2;
                const jumpedCol = (fromCol + toCol) / 2;
                return board[jumpedRow][jumpedCol] === 'black';
            }
        );
        // 5,0 (blanca) -> 3,2 (salta por encima de 4,1 negra)
        expect(index.isMoveValid(5, 0, 3, 2)).toBe(true);

        // Si no hay pieza para saltar:
        board[4][1] = null;
        expect(index.isMoveValid(5, 0, 3, 2)).toBe(false);
    });

    test('isMoveValid devuelve false fuera de límites o celda ocupada', () => {
        index.initializeBoard();
        // Casilla destino ocupada
        board[4][1] = 'white';
        expect(index.isMoveValid(5, 0, 4, 1)).toBe(false);
        // Casilla fuera de límites
        expect(index.isMoveValid(5, 0, -1, -1)).toBe(false);
    });
    test('realiza un movimiento válido, actualiza el tablero y suma moveCount', () => {
        // Hacemos un simple mock para ignorar alert
        global.alert = jest.fn();
        board[5][0] = 'white';
        global.moveCount = 0;
        global.currentPlayer = 'Blancas';
        // Asegura que el movimiento es válido según la lógica del juego
        const result = index.movePiece(5, 0, 4, 1);
        expect(result).toBe(true);
        expect(board[4][1]).toBe('white');
        expect(board[5][0]).toBeNull();
        expect(moveCount).toBe(1);
    });

    test('no mueve si el movimiento es inválido y alerta', () => {
        global.alert = jest.fn();
        board[5][0] = 'white';
        global.moveCount = 0;
        global.currentPlayer = 'Blancas';
        // Intenta mover a casilla ocupada
        board[4][1] = 'black';
        const result = index.movePiece(5, 0, 4, 1);
        expect(global.alert).toHaveBeenCalledWith('Movimiento inválido');
        expect(result).toBe(false);
        // moveCount no aumenta
        expect(moveCount).toBe(0);
        // Las piezas quedan como estaban
        expect(board[5][0]).toBe('white');
        expect(board[4][1]).toBe('black');
    });

// ================ isCaptureValid ================
    test('devuelve true si hay una pieza rival para capturar y casilla destino libre', () => {
        index.initializeBoard();

        // Blanca en 5,0, negra en 4,1, vacía en 3,2
        board[5][0] = 'white';
        board[4][1] = 'black';
        board[3][2] = null;

        // from: 5,0 -> to: 3,2 (salta sobre 4,1)
        expect(index.isCaptureValid(5, 0, 3, 2)).toBe(true);
    });

    test('devuelve false si la ficha rival no existe', () => {
        index.initializeBoard();
        board[5][0] = 'white';
        board[4][1] = null;
        board[3][2] = null;
        expect(index.isCaptureValid(5, 0, 3, 2)).toBe(false);
    });

    test('devuelve false si se salta la propia ficha', () => {
        index.initializeBoard();
        board[5][0] = 'white';
        board[4][1] = 'white';
        board[3][2] = null;
        expect(index.isCaptureValid(5, 0, 3, 2)).toBe(false);
    });

// ================ handleCapture ================

    test('elimina sólo la ficha capturada para saltos de dos', () => {
        index.initializeBoard();
        // Pieza blanca en 5,0 salta por encima de una negra en 4,1
        board[5][0] = 'white';
        board[4][1] = 'black';
        board[3][2] = null;

        index.handleCapture(5, 0, 3, 2);

        expect(board[4][1]).toBe(null);
        // La pieza origen y destino no cambian aquí, sólo la capturada
    });

    test('no elimina fichas en movimiento normal', () => {
        index.initializeBoard();
        // Movimiento de avance, sin salto
        board[5][0] = 'white';
        board[4][1] = null;
        index.handleCapture(5, 0, 4, 1);
        // Ningún cambio en el tablero
        expect(board[4][1]).toBe(null);
    });

// ================ fetchGames y saveGame ================

    test('fetchGames obtiene y muestra las partidas en el DOM', async () => {
        // Prepara el DOM para la prueba
        document.body.innerHTML = `<div id="gamesList"></div>`;

        const mockGames = [
            {winner: 'Blancas', moves: 20, duration: '5:30', date: new Date().toISOString()}
        ];
        fetchMock.mockResponseOnce(JSON.stringify(mockGames));

        await index.fetchGames();

        expect(fetchMock).toHaveBeenCalledTimes(1);
        const gamesList = document.getElementById('gamesList');
        expect(gamesList.innerHTML).toContain('Blancas');
        expect(gamesList.innerHTML).toContain('5:30');
        expect(gamesList.innerHTML).toContain('2025'); // Debe mostrar la fecha
    });
    test('saveGame envía los datos de la partida correctamente', async () => {
        fetchMock.mockResponseOnce(JSON.stringify({success: true}));

        // Manipula moveCount y gameStartedAt globales (hacky, por ser módulo global)
        moveCount = 17;
        gameStartedAt = Date.now() - 5 * 60 * 1000; // 5 minutos atrás

        await index.saveGame('Blancas');

        expect(fetchMock).toHaveBeenCalledTimes(1);
        const call = fetchMock.mock.calls[0];
        expect(call[0]).toBe('http://localhost:3000/games');
        expect(call[1].method).toBe('POST');

        const body = JSON.parse(call[1].body);
        expect(body).toHaveProperty('winner', 'Blancas');
        expect(body).toHaveProperty('moves', 17);
        expect(body).toHaveProperty('duration');
        expect(body.duration).toMatch(/\d+:\d{2}/);
        expect(Date.parse(body.date)).not.toBeNaN();
    });
});