const CROSS = 'X';
const ZERO = 'O';
const EMPTY = ' ';

let dimension;
let emptyCellsCount;
let curSymbol = CROSS;
let hasWinner = false;
let isGameOver = false;
let grid;

const container = document.getElementById('fieldWrapper');

startGame();
addResetListener();

function startGame () {
    dimension = prompt('Введите размер поля:');
    emptyCellsCount = dimension ** 2;
    renderGrid(dimension);
}

function createEmptyGrid(dimension) {
    grid = new Array(dimension);
    for (let i = 0; i < dimension; i++) {
        grid[i] = new Array(dimension);
        for (let j = 0; j < dimension; j++)
            grid[i][j] = EMPTY;
    }
}

function renderGrid (dimension) {
    createEmptyGrid(dimension);
    container.innerHTML = '';
    for (let i = 0; i < grid.length; i++) {
        const row = document.createElement('tr');
        for (let j = 0; j < grid.length; j++) {
            const cell = document.createElement('td');
            cell.textContent = EMPTY;
            cell.addEventListener('click', () => cellClickHandler(i, j));
            row.appendChild(cell);
        }
        container.appendChild(row);
    }
}

function cellClickHandler (row, col) {
    if (!hasWinner && !isGameOver && curSymbol === ZERO) {
        randomZeroMove();
        changeSymbol();
        return;
    }
    if (!hasWinner && !isGameOver && grid[row][col] === EMPTY) {
        grid[row][col] = curSymbol;
        emptyCellsCount--;
        renderSymbolInCell(curSymbol, row, col);
        changeSymbol(); 
        hasWinner = whoIsWinner();
    }
    if (hasWinner) {
        isGameOver = true;
        alert(hasWinner);
    }
    else if (isGameFinished()) {
        isGameOver = true;
        alert('Победила дружба!');
    }
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
    curSymbol = CROSS;
    isGameOver = false;
    hasWinner = false;

    startGame();
    addResetListener();
}

const changeSymbol = () => curSymbol = curSymbol === CROSS ? ZERO : CROSS;

const isGameFinished = () => emptyCellsCount === 0;

function whoIsWinner() {
    let verticalChecker = [];
    const diagonalChecker1 = [];
    const diagonalChecker2 = [];

    for (let i = 0; i < grid.length; i++) {
        if (new Set(grid[i]).size === 1 && !grid[i].some(item => item === EMPTY)) {
            const winLine = [];
            for (let j = 0; j < grid.length; j++)
                winLine.push(i, j);
            paintWinLine(winLine);
            return grid[i][0];
        }
        diagonalChecker1.push(grid[i][i]);
        diagonalChecker2.push(grid[i][grid.length - 1 - i]);
        for (let j = 0; j < grid.length; j++)
            verticalChecker.push(grid[j][i]);
        if (new Set(verticalChecker).size === 1 && !verticalChecker.some(item => item === EMPTY)) {
            const winLine = [];
            for (let x = 0; x < grid.length; x++)
                winLine.push(x, i);
            paintWinLine(winLine);
            return verticalChecker[0];
        }
        verticalChecker = [];
    }

    if (new Set(diagonalChecker1).size === 1 && !diagonalChecker1.some(item => item === EMPTY)) {
        const winLine = [];
        for (let i = 0; i < grid.length; i++)
            winLine.push(i, i);
        paintWinLine(winLine);
        return diagonalChecker1[0];
    }
    else if (new Set(diagonalChecker2).size === 1 && !diagonalChecker2.some(item => item === EMPTY)) {
        const winLine = [];
        for (let i = 0; i < grid.length; i++)
            winLine.push(i, grid.length - 1 - i);
        paintWinLine(winLine);
        return diagonalChecker2[0];
    }
    return false;
}

function paintWinLine(coords) {
    for (let i = 0; i < coords.length; i += 2) {
        findCell(coords[i], coords[i + 1]).style.color = 'red';
    }
}

function randomZeroMove() {
    const indexEmpty = Math.floor(Math.random() * emptyCellsCount);
    const gridLine = grid.flat();
    let index = 0;

    for (let i = 0; i < gridLine.length; i++)
        if (gridLine[i] === EMPTY) 
            if (index++ === indexEmpty) {
                const row = Math.floor(i / dimension);
                const col = i % dimension;
                grid[row][col] = ZERO;
                renderSymbolInCell(ZERO, row, col);
                emptyCellsCount--;
                break;
            }
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
