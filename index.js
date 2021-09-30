const CROSS = 'X';
const ZERO = 'O';
const EMPTY = ' ';

const winStates = {
    CROSS: "Победили крестики!",
    ZERO: "Победили нолики!"
};

const container = document.getElementById('fieldWrapper');

let turn = CROSS;
let fieldSize = 3;
let turnsCount = 0;
let field = [[], [], []];

let isGameOver = false;

startGame();
addResetListener();

function startGame () {
    renderGrid(fieldSize);
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
    if (field[row][col] != undefined || isGameOver)
        return;
    renderSymbolInCell(turn, row, col);
    
    turnsCount++;
    checkDraw();

    field[row][col] = turn;
    checkWinner(row, col);
    changeTurn();

    console.log(`Clicked on cell: ${row}, ${col}`);


    /* Пользоваться методом для размещения символа в клетке так:
        renderSymbolInCell(ZERO, row, col);
     */
}

function renderSymbolInCell (symbol, row, col, color = '#333') {
    const targetCell = findCell(row, col);

    targetCell.textContent = symbol;
    targetCell.style.color = color;
}

function changeTurn(){
    turn = turn === CROSS ? ZERO : CROSS;
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
    console.log('reset!');
}

function checkWinner(row, col){
    cellValue = field[row][col];
    horizontalWin = true;
    verticalWin = true;
    diagonalWin = row === col;
    for (let i = 0; i < fieldSize; i++)
    {
        if (horizontalWin && field[row][i] != cellValue)
            horizontalWin = false;
        if (verticalWin && field[i][col] != cellValue)
            verticalWin = false;

        if (diagonalWin && (field[i][i] != cellValue || field[i][fieldSize - i - 1] != cellValue))
            diagonalWin = false;
    }

    if (horizontalWin || verticalWin || diagonalWin)
    {
        isGameOver = true;
        if (cellValue === CROSS)
            alert(winStates.CROSS);
        else
            alert(winStates.ZERO);
    }
}

function checkDraw(){
    if (turnsCount === fieldSize * fieldSize)
    {
        alert("Победила дружба");
        return;
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
