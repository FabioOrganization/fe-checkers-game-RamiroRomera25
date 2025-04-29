# Juego de Damas (Checkers) - Proyecto

## Descripción

Vas a programar en JavaScript la **lógica de un juego de damas**, uno de los juegos de tablero tradicionales más conocidos en el mundo. El objetivo es mover tus piezas en diagonal y capturar las piezas del rival saltando sobre ellas, jugando en un tablero de 8x8. El juego termina cuando un jugador captura todas las piezas rivales.


## ¿Qué tienes que hacer?

- Completar las funciones del archivo principal para que pasen los tests.
- Seguir los comentarios y pasos en cada función (estarás implementando lógica de tablero, movimientos, captura de fichas, guardar/rellenar historial de partidas, etc).
- El código debe cumplir las reglas del juego y pasar los tests automáticos.


---

## 🧩**Reglas básicas de las damas en este proyecto**

- El tablero es de 8x8, solo se usan las casillas oscuras.
- Ambos jugadores empiezan con 12 piezas (blancas y negras).
- Solo se pueden mover en diagonal.
- Si es posible capturar, se debe hacer (clásico salto a casilla vacía saltando a un rival).
- Gana quien elimina todas las piezas rivales.

---

## **¿Qué funciones debes completar?**

Las funciones tienen comentarios `PASO 1 … PASO N` para guiarte.  
Algunas tareas:
- Inicializar el tablero desde cero.
- Validar si un movimiento es posible.
- Ejecutar movimientos y capturas.
- Llevar el conteo de piezas y registrar historial de partidas.

---

## **Historial de partidas - Uso de JSON Server**

Para poder guardar y consultar las partidas, usamos **json-server** como backend simulado.  
Esto te permite trabajar con un archivo `db.json` simulando una base de datos RESTful.

###  **Instalar json-server**

Abre una terminal en la raíz de tu proyecto y ejecuta:

```bash
npm install -g json-server
```
o (si prefieres solo en este proyecto)

```bash
npm install --save-dev json-server
```

###  **Ejecuta el servidor**

En la terminal, lanza:

```bash
json-server --watch db.json --port 3000
```

- El backend estará disponible en: [http://localhost:3000/games](http://localhost:3000/games)
- Las funciones de guardar y mostrar historial de partidas funcionan usando esta URL.

### 4. **Verifica**

Puedes visitar [http://localhost:3000/games](http://localhost:3000/games) en tu navegador para ver las partidas guardadas.

## 💡 **Sugerencias**

- Trabaja cada función por separado, siguiendo los pasos.
- Usa el feedback de los tests para ajustar tu código.
- Si tienes dudas, pide ayuda mostrando el mensaje del test que falla.
- **Recuerda usar las siguientes variables globales para el juego:**

```javascript
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
globalThis.selectedPieceCoords = { row: null, col: null };
```
---

## 🛠 **¿Cómo probar los tests?**

Ejecuta `npm test`.

---

## 🕹️ **¿Cómo ejecuto el backend y pruebo el juego?**

1. Instala las dependencias y ejecuta:

```bash
npm install
npm install -g json-server # si no lo tenías ya
```

2. Lanza el backend de partidas:
```bash
json-server --watch db.json --port 3000
```
3. Abre tu juego en el navegador desde el archivo index.html.

4. Juega, guarda partidas, revisa el historial.

---

## ¡Happy Coding!.
