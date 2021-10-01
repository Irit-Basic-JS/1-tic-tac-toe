const CROSS = 'X';
const ZERO = 'O';
const EMPTY = ' ';

const RED = '#F00';

const container = document.getElementById('fieldWrapper');

let field;
let currentSymbol;
let isGameOver;
let winner;
let ai;

function Cell(symbol, x, y) {
    this.symbol = symbol;
    this.x = x;
    this.y = y;
}

function Field(size) {
    this.source = [];
    this.size = size;
    this.count = 0;

    this.getRow = function (index) {
        return this.source[index];
    }

    this.getColumn = function (index) {
        let column = [];
        for (let row = 0; row < this.size; row++) {
            column[row] = this.source[row][index];
        }
        return column;
    }

    this.getDiagonal = function (row, col) {
        let diagonal = [];

        if (row === col) {
            diagonal.push([]);
            for (let rowIndex = 0; rowIndex < this.size; rowIndex++) {
                diagonal[diagonal.length - 1][rowIndex] = this.source[rowIndex][rowIndex];
            }
        }

        if (row + col === this.size - 1) {
            diagonal.push([]);
            for (let rowIndex = 0; rowIndex < this.size; rowIndex++) {
                diagonal[diagonal.length - 1][rowIndex] = this.source[rowIndex][this.size - rowIndex - 1];
            }
        }

        return diagonal;
    }
}

function AI() {
    this.makeSimpleMove = function () {
        let emptyCells = getEmptyCells();
        let selectedCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        tryMakeMove(selectedCell.x, selectedCell.y);
    }

    function getEmptyCells() {
        let emptyCells = [];
        field.source.forEach(row => emptyCells.push(...row.filter(cell => cell.symbol === EMPTY)));
        return emptyCells;
    }
}

startGame();
addResetListener();

function startGame() {
    let dimension = +prompt('Введите размерность поля', 3);

    createField(dimension);
    ai = new AI();
    currentSymbol = CROSS;
    isGameOver = false;
    winner = null;
    renderGrid(dimension);
}

function createField(dimension) {
    field = new Field(dimension);
    for (let row = 0; row < dimension; row++) {
        field.source[row] = [];
        for (let col = 0; col < dimension; col++) {
            field.source[row][col] = new Cell(EMPTY, row, col);
        }
    }
}

function renderGrid(dimension) {
    container.innerHTML = '';

    for (let rowIndex = 0; rowIndex < dimension; rowIndex++) {
        const row = document.createElement('tr');
        for (let colIndex = 0; colIndex < dimension; colIndex++) {
            const cell = document.createElement('td');
            cell.textContent = field.source[rowIndex][colIndex].symbol;
            cell.addEventListener('click', () => cellClickHandler(rowIndex, colIndex));
            row.appendChild(cell);
        }
        container.appendChild(row);
    }
}

function updateGame(row, col) {
    if (isGameOver) {
        return;
    }

    field.source[row][col].symbol = currentSymbol;
    field.count++;
    renderSymbolInCell(currentSymbol, row, col);

    if (field.count === field.size * field.size) {
        isGameOver = true;
    }

    if (tryFindWinner(row, col) || isGameOver) {
        announceWinner();
    }

    switchCurrentSymbol();
}

function tryFindWinner(rowIndex, colIndex) {
    let symbol = field.source[rowIndex][colIndex].symbol;
    return isWinningLine(field.getRow(rowIndex), symbol)
        || isWinningLine(field.getColumn(colIndex), symbol)
        || field.getDiagonal(rowIndex, colIndex).some(diagonal => isWinningLine(diagonal, symbol));
}

function isWinningLine(cells, symbol) {
    if (cells.every(cell => cell.symbol === symbol)) {
        isGameOver = true;
        winner = symbol;
        paintCells(cells, RED);
        return true;
    }

    return false;
}

function paintCells(cellsInfo, color) {
    cellsInfo.forEach(cell => findCell(cell.x, cell.y).style.backgroundColor = color);
}

function announceWinner() {
    switch (winner) {
        case CROSS:
            alert('Крестики победили');
            break;
        case ZERO:
            alert('Нолики победили');
            break;
        default:
            alert('Победила дружба');
            break;
    }
}

function cellClickHandler(row, col) {
    tryMakeMove(row, col);

    ai.makeSimpleMove();
}

function tryMakeMove(row, col) {
    if (isGameOver || field.source[row][col].symbol !== EMPTY) {
        return;
    }

    console.log(`Clicked on cell: ${row}, ${col}`);

    updateGame(row, col);
}

function switchCurrentSymbol() {
    currentSymbol = currentSymbol === CROSS ? ZERO : CROSS;
}

function renderSymbolInCell(symbol, row, col, color = '#333') {
    const targetCell = findCell(row, col);

    targetCell.textContent = symbol;
    targetCell.style.color = color;
}

function findCell(row, col) {
    const targetRow = container.querySelectorAll('tr')[row];
    return targetRow.querySelectorAll('td')[col];
}

function addResetListener() {
    const resetButton = document.getElementById('reset');
    resetButton.addEventListener('click', resetClickHandler);
}

function resetClickHandler() {
    startGame();
}


/* Test Function */

/* Победа первого игрока */
function testWin() {
    clickOnCell(0, 2);
    clickOnCell(0, 0);
    clickOnCell(2, 0);
    clickOnCell(1, 1);
    clickOnCell(2, 2);
    clickOnCell(1, 2);
    clickOnCell(2, 1);
}

/* Ничья */
function testDraw() {
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

function clickOnCell(row, col) {
    findCell(row, col).click();
}
