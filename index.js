const CROSS = 'X';
const ZERO = 'O';
const EMPTY = ' ';

const container = document.getElementById('fieldWrapper');

let matrix = createMatrix(3);
let isOver = false;
let currentPlayer = CROSS;

startGame();
addResetListener();

function startGame () {
    matrix = createMatrix(3);
    isOver = false;
    currentPlayer = CROSS;
    renderGrid(3);
}

function renderGrid (dimension) {
    container.innerHTML = '';

    for (let i = 0; i < dimension; i++) {
        const row = document.createElement('tr');
        for (let j = 0; j < dimension; j++) {
            const cell = document.createElement('td');
            cell.textContent = EMPTY;
            cell.addEventListener('click', () => cellClickHandler(i, j));
            row.appendChild(cell);
        }
        container.appendChild(row);
    }
}

function cellClickHandler (row, col) {
    isOver ||= isMatrixFilled();
    if (isOver || matrix[row][col] !== EMPTY) { return; }
    matrix[row][col] = currentPlayer;
    renderSymbolInCell(currentPlayer, row, col);
    let coords = getWinCoords();
    if (coords.length != 0) {
        for (let point of coords) {
            renderSymbolInCell(currentPlayer, point[0], point[1], '#ff0000');
        }
        isOver = true;
        alert(`${currentPlayer} is win!`);
        return;
    }
    if (isMatrixFilled()) {
        isOver = true;
        alert("Победила дружба");
    }
    currentPlayer = currentPlayer === CROSS ? ZERO : CROSS;
    console.log(`Clicked on cell: ${row}, ${col}`);


    /* Пользоваться методом для размещения символа в клетке так:
        renderSymbolInCell(ZERO, row, col);
     */
}

function getWinCoords() {
    let symbol = matrix[0][0];
    if (symbol === matrix[0][1] && symbol == matrix[0][2] && symbol != EMPTY) {return [[0, 0], [0, 1], [0, 2]];}
    if (symbol === matrix[1][0] && symbol == matrix[2][0] && symbol != EMPTY) {return [[0, 0], [1, 0], [2, 0]];}
    symbol = matrix[2][2];
    if (symbol === matrix[2][1] && symbol == matrix[2][0] && symbol != EMPTY) {return [[2, 0], [2, 1], [2, 2]];}
    if (symbol === matrix[0][2] && symbol == matrix[1][2] && symbol != EMPTY) {return [[0, 2], [1, 2], [2, 2]];}
    symbol = matrix[1][1];
    if (symbol === matrix[0][0] && symbol == matrix[2][2] && symbol != EMPTY) {return [[0, 0], [1, 1], [2, 2]];}
    if (symbol === matrix[2][0] && symbol == matrix[0][2] && symbol != EMPTY) {return [[2, 0], [1, 1], [0, 2]];}
    if (symbol === matrix[1][0] && symbol == matrix[1][2] && symbol != EMPTY) {return [[1, 0], [1, 1], [1, 2]];}
    if (symbol === matrix[0][1] && symbol == matrix[2][1] && symbol != EMPTY) {return [[0, 1], [1, 1], [2, 1]];}
    return [];
}

function isMatrixFilled() {
    for (let row of matrix) {
        if (row.some(i => i === EMPTY))
            return false;
    }
    return true;
}

function createMatrix(dimension) {
    let field = [];
    for (let i = 0; i < dimension; i++) {
        field[i] = [];
        for (let j = 0; j < dimension; j++) {
            field[i][j] = EMPTY;
        }
    }
    return field;
}

function renderSymbolInCell (symbol, row, col, color = '#333') {
    const targetCell = findCell(row, col);
    targetCell.textContent = symbol;
    targetCell.style.color = color;
}

function findCell (row, col) {
    const targetRow = container.querySelectorAll('tr')[row];
    return targetRow.querySelectorAll('td')[col];
}

function addResetListener () {
    const resetButton = document.getElementById('reset');
    resetButton.addEventListener('click', resetClickHandler);
}

function resetClickHandler () {
    startGame();
    console.log('reset!');
}


/* Test Function */
/* Победа первого игрока */
function testWin () {
    clickOnCell(0, 2);
    clickOnCell(0, 0);
    clickOnCell(2, 0);
    clickOnCell(1, 1);
    clickOnCell(2, 2);
    clickOnCell(1, 2);
    clickOnCell(2, 1);
}

/* Ничья */
function testDraw () {
    clickOnCell(2, 0);
    clickOnCell(1, 0);
    clickOnCell(1, 1);
    clickOnCell(0, 0);
    clickOnCell(1, 2);
    clickOnCell(1, 2);
    clickOnCell(0, 2);
    clickOnCell(0, 1);
    clickOnCell(2, 1);
    clickOnCell(2, 2);
}

function clickOnCell (row, col) {
    findCell(row, col).click();
}
