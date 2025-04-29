const PLAYER_WHITE = 'Blancas';
const PLAYER_BLACK = 'Negras';
const PIECE_WHITE = 'white';
const PIECE_BLACK = 'black';
const BOARD_SIZE = 8;

const API_URL = 'http://localhost:3000/games';

let currentPlayer = PLAYER_WHITE;
globalThis.moveCount = 0;
globalThis.gameStartedAt = Date.now();
globalThis.board = [];
globalThis.selectedPiece = null;
globalThis.selectedPieceCoords = {row : null, col: null};

// ========== INICIALIZAR ==========
document.addEventListener('DOMContentLoaded', () => {
    initializeBoard();
    setupEventListeners();
    drawBoard();
});

function setupEventListeners() {
    document.getElementById('fetchGamesBtn').addEventListener('click', fetchGames);
}

// ========== INICIALIZA EL TABLERO ==========
function initializeBoard() {
    // PASO 1: Vacía el array global del tablero para no acumular más filas si ya existía uno previo.
    // PASO 2: Crea 8 filas (usa BOARD_SIZE).
    // PASO 3: Para cada fila, crea un array de 8 columnas.
    // PASO 4: Para cada casilla determina si debe estar vacía, ser una ficha blanca o una ficha negra,
    // según la posición y usando la función getInitialPiece, y colócala en el tablero global.
}

function getInitialPiece(row, col) {
    // PASO 1: Si la fila es de 0 a 2 y (row+col) es impar, retorna la ficha NEGRA (usa PIECE_BLACK).
    // PASO 2: Si la fila es de 5 a 7 y (row+col) es impar, retorna la ficha BLANCA (usa PIECE_WHITE).
    // PASO 3: En cualquier otro caso, retorna null (casilla vacía).
}

// ========== DIBUJA EL TABLERO ==========
function drawBoard() {
    const gameElement = document.getElementById('game');
    gameElement.innerHTML = '';

    board.forEach((row, rowIndex) => {
        row.forEach((_, colIndex) => {
            const cell = createCell(rowIndex, colIndex);
            gameElement.appendChild(cell);
        });
    });

    if (currentPlayer === PLAYER_BLACK) {
        setTimeout(cpuMove, 500);
    }
}

function createCell(row, col) {
    const cell = document.createElement('div');
    cell.classList.add('w-16', 'h-16', 'flex', 'items-center', 'justify-center', 'border');
    cell.dataset.row = row;
    cell.dataset.col = col;

    cell.classList.add((row + col) % 2 === 0 ? 'bg-gray-300' : 'bg-gray-500');
    if (board[row][col]) cell.appendChild(createPiece(board[row][col]));

    cell.addEventListener('click', () => handleCellClick(row, col));
    return cell;
}

function createPiece(piece) {
    const pieceElement = document.createElement('div');
    pieceElement.classList.add(
        'w-10', 'h-10', 'rounded-full',
        piece === PIECE_WHITE ? 'bg-white' : 'bg-black'
    );
    return pieceElement;
}

// ========== MANEJO DE TURNO Y MOVER PIEZA ==========
function handleCellClick(row, col) {
    if (currentPlayer !== PLAYER_WHITE) return;

    const piece = board[row][col];
    if (selectedPiece) {
        movePiece(selectedPieceCoords.row, selectedPieceCoords.col, row, col);
        resetSelection();
        drawBoard();
    } else if (piece === PIECE_WHITE) {
        selectPiece(piece, row, col);
    }
}

function selectPiece(piece, row, col) {
    // PASO 1: Guarda la pieza seleccionada y sus coordenadas (fila/columna) en variables globales
    //        (usa selectedPiece y selectedPieceCoords).
}

function resetSelection() {
    // PASO 1: Elimina la selección activa, borrando la data de las variables globales.
    //(usa selectedPiece y selectedPieceCoords)
}

function movePiece(fromRow, fromCol, toRow, toCol, skipTurn = false) {
    // PASO 1: Comprueba que el movimiento es válido (usa isMoveValid).
    // PASO 2: Si no es válido, avisa, detén el proceso y envía un alert "Movimiento inválido".
    // PASO 3: Si es válido, procesa la captura si existe (usa handleCapture).
    // PASO 4: Actualiza el tablero (usa updateBoard).
    // PASO 5: Aumenta el contador de movimientos utiliza la variable global moveCount.
    // PASO 6: Si corresponde, cambia de turno utiliza el método (switchTurn).
    // PASO 7: Verifica si el juego ha terminado utiliza el método (checkGameEnd).
    // PASO 8: Devuelve true si se movió, false si no.
}
function handleCapture(fromRow, fromCol, toRow, toCol) {
    // PASO 1: Verifica si el movimiento fue de dos filas (salto).
    // PASO 2: Si fue así, localiza la ficha que ha sido saltada (posición intermedia).
    // PASO 3: Elimina la ficha saltada (coloca null en esa posición en el tablero) utiliza el método (isCaptureValid).
    // PASO 4: Devuelve true si hubo captura, false si no.
}

function updateBoard(fromRow, fromCol, toRow, toCol) {
    // PASO 1: Mueve la pieza de la casilla origen a la destino.
    // PASO 2: Deja la casilla origen vacía (null).
}

function switchTurn() {
    currentPlayer = currentPlayer === PLAYER_WHITE ? PLAYER_BLACK : PLAYER_WHITE;
}

function checkGameEnd() {
    const whitePieces = countPieces(PIECE_WHITE);
    const blackPieces = countPieces(PIECE_BLACK);

    if (whitePieces === 0) onPlayerWin(PLAYER_BLACK);
    if (blackPieces === 0) onPlayerWin(PLAYER_WHITE);
}

function countPieces(pieceType) {
    let count = 0;
    for (let row of board) {
        for (let piece of row) {
            if (piece === pieceType) count++;
        }
    }
    return count;
}

// ========== VALIDACIÓN DE MOVIMIENTOS ==========
function isMoveValid(fromRow, fromCol, toRow, toCol) {
    // PASO 1: Verifica que la casilla destino está dentro de los límites del tablero
    //         y esté vacía. Usa la función isWithinBounds.
    // PASO 2: Comprueba que el movimiento es diagonal (¡usa la diferencia entre filas y columnas!).
    // PASO 3: Si el movimiento es de una sola casilla, permítelo como válido (movimiento normal).
    // PASO 4: Si el movimiento es de dos casillas, llama a isCaptureValid
    //         para ver si se trata de una captura válida (salto por encima de rival).
    // PASO 5: En cualquier otra situación, el movimiento no es válido.
}

function isWithinBounds(row, col) {
    return row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE;
}

function isCaptureValid(fromRow, fromCol, toRow, toCol) {
    // PASO 1: Calcula la posición intermedia entre la casilla de origen y destino.
    //         (Usa la media/arreglo del índice de fila y columna)
    // PASO 2: Asegúrate que la posición intermedia es válida dentro de los límites del tablero.
    // PASO 3: Busca (en el tablero) la pieza de la casilla intermedia.
    // PASO 4: Devuelve true SOLO si hay una ficha rival en esa casilla (es decir,
    //         que no sea null y sea diferente a la actual).
    // PASO 5: Si no se cumplen las condiciones anteriores, devuelve false.
}

// ========== LÓGICA DEL CPU ==========
function cpuMove() {
    const moves = getAllValidMoves(PIECE_BLACK);
    if (moves.length === 0) return;

    const move = moves[Math.floor(Math.random() * moves.length)];
    movePiece(move.fromRow, move.fromCol, move.toRow, move.toCol);
    drawBoard();
}

function getAllValidMoves(pieceType) {
    const moves = [];
    board.forEach((row, rowIndex) => {
        row.forEach((piece, colIndex) => {
            if (piece !== pieceType) return;
            getValidMovesForPiece(rowIndex, colIndex).forEach(move => moves.push(move));
        });
    });
    return moves;
}

function getValidMovesForPiece(row, col) {
    const directions = [[1, -1], [1, 1], [-1, -1], [-1, 1]];
    const moves = [];

    directions.forEach(([dr, dc]) => {
        const toRow = row + dr;
        const toCol = col + dc;
        if (isMoveValid(row, col, toRow, toCol)) moves.push({fromRow: row, fromCol: col, toRow, toCol});

        const jumpRow = row + 2 * dr;
        const jumpCol = col + 2 * dc;
        if (isMoveValid(row, col, jumpRow, jumpCol)) moves.push({
            fromRow: row,
            fromCol: col,
            toRow: jumpRow,
            toCol: jumpCol
        });
    });

    return moves;
}

// ========== GESTIÓN DEL JUEGO ==========
async function saveGame(winner) {
    // PASO 1: Crea un objeto con los datos de la partida:
    // DEBES USAR LA VARIABLE API_URL
    //         - ganador (winner)
    //         - cantidad de movimientos (moveCount)
    //         - duración (usa formatGameDuration())
    //         - fecha (usa new Date().toISOString())
    // PASO 2: Envía los datos al servidor usando fetch en POST con Content-Type adecuado.
    // PASO 3: (Opcional) Muestra por consola si el guardado fue exitoso.
    // PASO 4: Si ocurre un error, manéjalo mostrando el error por consola.

}
function formatGameDuration() {
    const durationMs = Date.now() - gameStartedAt;
    const minutes = Math.floor(durationMs / 60000);
    const seconds = Math.floor((durationMs % 60000) / 1000);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

async function fetchGames() {
    // PASO 1: Haz una petición (fetch) al backend para obtener las partidas (GET).
    // DEBES USAR LA VARIABLE API_URL
    // PASO 2: Espera la respuesta y transfórmala en un objeto/array (JSON).
    // PASO 3: Llama a displayGames con el array recibido.
    // PASO 4: Si falla la petición, muestra el error en un alert.
}
function displayGames(games) {
    const historyDiv = document.getElementById('gamesList');
    historyDiv.innerHTML = games.map(game => createGameCard(game)).join('');
}

function createGameCard(game) {
    return `
                    <div class="p-4 mb-4 bg-gray-800 text-white rounded shadow-md border border-gray-700">
                        <div class="flex justify-between items-center mb-2">
                            <span class="text-lg font-bold">Ganador: ${game.winner}</span>
                            <span class="text-sm text-gray-400">${new Date(game.date).toLocaleString()}</span>
                        </div>
                        <div class="grid grid-cols-2 gap-4">
                            <div><strong>Movimientos:</strong> ${game.moves}</div>
                            <div><strong>Duración:</strong> ${game.duration}</div>
                        </div>
                    </div>
                `;
}

function onPlayerWin(winner) {
    saveGame(winner);
    alert(`${winner} ha ganado la partida!`);
    resetGame();
}

function resetGame() {
    moveCount = 0;
    gameStartedAt = Date.now();
    board = [];
    currentPlayer = PLAYER_WHITE;
    initializeBoard();
    drawBoard();
}
module.exports = {initializeBoard, isMoveValid,fetchGames,saveGame,countPieces,handleCapture,isCaptureValid,selectPiece,resetSelection,updateBoard,movePiece};
