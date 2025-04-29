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
globalThis.selectedPieceCoords = null;

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
    globalThis.board = [];

    // FIXME: No se si ponerlo todo en un mismo paso para menos confusion.
    // PASO 2: Crea 8 filas (usa BOARD_SIZE).
    // PASO 3: Para cada fila, crea un array de 8 columnas.
    // PASO 4: Para cada casilla determina si debe estar vacía, ser una ficha blanca o una ficha negra,
    // según la posición y usando la función getInitialPiece, y colócala en el tablero global.
    for (let i = 0; i < BOARD_SIZE; i++) {
        globalThis.board[i] = []
        for (let j = 0; j < BOARD_SIZE; j++) {
            globalThis.board[i][j] = getInitialPiece(i, j)
        }
    }


}

function getInitialPiece(row, col) {
    // PASO 1: Si la fila es de 0 a 2 y (row+col) es impar, retorna la ficha NEGRA (usa PIECE_BLACK).
    if ((row+col) % 2 !== 0) {
        if (row <= 2) {
            return PIECE_BLACK;
        }
        // PASO 2: Si la fila es de 5 a 7 y (row+col) es impar, retorna la ficha BLANCA (usa PIECE_WHITE).
        if (row >= 5 && row <= 7) {
            return PIECE_WHITE;
        }
    }
    // PASO 3: En cualquier otro caso, retorna null (casilla vacía).
    return null;
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
    // FIXME: Estaria bueno poner el formato de como debe ser selectedPieceCoords

    globalThis.selectedPiece = piece
    globalThis.selectedPieceCoords = { row: row, col: col }
}

function resetSelection() {
    // PASO 1: Elimina la selección activa, borrando las variables globales.
    //(usa selectedPiece y selectedPieceCoords)
    // FIXME: Las borro poniendo undefined o null ? Estaria bueno aclararlo
    globalThis.selectedPiece = null
    globalThis.selectedPieceCoords = null
}

// FIXME: Para que es el skipTurn ? Si es algo que no tienen que hacer nada los chicos con esa variable lo aclararia
function movePiece(fromRow, fromCol, toRow, toCol, skipTurn = false) {
    // PASO 1: Comprueba que el movimiento es válido (usa isMoveValid).
    // PASO 2: Si no es válido, avisa y detén el proceso.

    // FIXME: No se especifica que mensaje debe tener el alert
    if (!isMoveValid(fromRow, fromCol, toRow, toCol)) {
        // alert("Movimiento no valido")
        alert("Movimiento inválido")
        return false;
    }

    // PASO 3: Si es válido, procesa la captura si existe (usa handleCapture).
    if (isCaptureValid((fromRow, fromCol, toRow, toCol))) {
        handleCapture(fromRow, fromCol, toRow, toCol)
    }
    // PASO 4: Actualiza el tablero (usa updateBoard).

    updateBoard(fromRow, fromCol, toRow, toCol)

    // PASO 5: Aumenta el contador de movimientos.
    // FIXME: Agregaria que es moveCount pq lo preguntarian en el parcial por las dudas jaja
    globalThis.moveCount ++;

    // PASO 6: Si corresponde, cambia de turno.
    // FIXME: Aclararia que metodo se usa
    switchTurn()

    // PASO 7: Verifica si el juego ha terminado.
    // FIXME: Aclararia que metodo se usa
    checkGameEnd()

    // PASO 8: Devuelve true si se movió, false si no.
    return true;
}

// FIXME: YO diria que en este metodo le digamos que usen isCapturedValid pq estarian repitiendo codigo
function handleCapture(fromRow, fromCol, toRow, toCol) {
    // PASO 1: Verifica si el movimiento fue de dos filas (salto).

    // if (!((rowMovement === 2 || rowMovement === -2) && (colMovement === 2 || colMovement === -2))) {
    //     return;
    // }

    // PASO 2: Si fue así, localiza la ficha que ha sido saltada (posición intermedia).

    let pivotRow;
    let pivotCol;

    if (fromRow > toRow) {
        pivotRow = toRow + 1;
    } else {
        pivotRow = toRow - 1;
    }

    if (fromCol > toCol) {
        pivotCol = toCol + 1;
    } else {
        pivotCol = toCol - 1;
    }

    // PASO 3: Elimina la ficha saltada (coloca null en esa posición en el tablero).

    if (isCaptureValid(fromRow, fromCol, toRow, toCol)) {
        globalThis.board[pivotRow][pivotCol] = null;
        return true;
    }
    return false;

    // PASO 4: Devuelve true si hubo captura, false si no.

}

function updateBoard(fromRow, fromCol, toRow, toCol) {
    // PASO 1: Mueve la pieza de la casilla origen a la destino.
    globalThis.board[toRow][toCol] = globalThis.board[fromRow][fromCol];
    // PASO 2: Deja la casilla origen vacía (null).
    globalThis.board[fromRow][fromCol] = null;
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

    // FIXME: No especifica que no si no esta dentro del tableto o vacia devuelva false.
    if (!isWithinBounds(toRow, toCol) || globalThis.board[toRow][toCol] !== null) {
        return false;
    }

    // PASO 2: Comprueba que el movimiento es diagonal (¡usa la diferencia entre filas y columnas!).

    const rowMovement = fromRow - toRow;
    const colMovement = fromCol - toCol;

    let validMovement = false;


    // PASO 3: Si el movimiento es de una sola casilla, permítelo como válido (movimiento normal).
    if (((rowMovement === 1 || rowMovement === -1) && (colMovement === 1 || colMovement === -1))) {
        validMovement = true;
    }

    // PASO 4: Si el movimiento es de dos casillas, llama a isCaptureValid
    //         para ver si se trata de una captura válida (salto por encima de rival).
    else if (((rowMovement === 2 || rowMovement === -2) && (colMovement === 2 || colMovement === -2))) {
        validMovement = isCaptureValid(fromRow, fromCol, toRow, toCol)
    }

    // PASO 5: En cualquier otra situación, el movimiento no es válido.
    return validMovement;
}

function isWithinBounds(row, col) {
    return row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE;
}

function isCaptureValid(fromRow, fromCol, toRow, toCol) {
    // PASO 1: Calcula la posición intermedia entre la casilla de origen y destino.
    //         (Usa la media/arreglo del índice de fila y columna)

    let pivotRow;
    let pivotCol;

    if (fromRow > toRow) {
        pivotRow = toRow + 1;
    } else {
        pivotRow = toRow - 1;
    }

    if (fromCol > toCol) {
        pivotCol = toCol + 1;
    } else {
        pivotCol = toCol - 1;
    }

    // PASO 2: Asegúrate que la posición intermedia es válida dentro de los límites del tablero.

    if (!isWithinBounds(pivotRow, pivotCol)) {
        return;
    }

    // PASO 3: Busca (en el tablero) la pieza de la casilla intermedia.

    const capturedPiece = globalThis.board[pivotRow][pivotCol]

    // PASO 4: Devuelve true SOLO si hay una ficha rival en esa casilla (es decir,
    //         que no sea null y sea diferente a la actual).
    // FIXME:  que no sea null y sea diferente a la pieza seleccionada). O se refiere a obtener el lugar de la ficha from ?

    // PASO 5: Si no se cumplen las condiciones anteriores, devuelve false.
    return capturedPiece !== globalThis.board[fromRow][fromCol] && capturedPiece !== null

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
    // FIXME: Aclararia que ante cualquier duda miren la respuestas del http://localhost:3000/games
    // DEBES USAR LA VARIABLE API_URL
    //         - ganador (winner)
    //         - cantidad de movimientos (moveCount)
    //         - duración (usa formatGameDuration())
    //         - fecha (usa new Date().toISOString())

    const body = {
        winner: winner,
        moves: globalThis.moveCount,
        duration: formatGameDuration(),
        date: new Date().toISOString()
    }

    // PASO 2: Envía los datos al servidor usando fetch en POST con Content-Type adecuado.

    try {
        await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        })
            .then(response => response.json())
            .then(data => console.log("Partida guardada"))

    } catch (e) {
        // PASO 4: Si ocurre un error, manéjalo mostrando el error por consola.
        console.error(e)
    }

    // PASO 3: (Opcional) Muestra por consola si el guardado fue exitoso.

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
    try {
        // PASO 2: Espera la respuesta y transfórmala en un objeto/array (JSON).
        await fetch(API_URL)
            .then(response => response.json())
            // PASO 3: Llama a displayGames con el array recibido.
            .then(data => displayGames(data))
    } catch (e) {
        // PASO 4: Si falla la petición, muestra el error en un alert.
        alert(e)
    }
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

// FIXME: No estaba el movePiece en los exports
module.exports = {initializeBoard, isMoveValid,fetchGames,saveGame,countPieces,handleCapture,isCaptureValid,selectPiece,resetSelection,updateBoard, movePiece};