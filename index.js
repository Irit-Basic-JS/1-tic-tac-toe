const CROSS = 'X';
const ZERO = 'O';
const EMPTY = ' ';
const container = document.getElementById('fieldWrapper');

let field;
let dimension;
let movesLeft;
let isGameOver;

startGame();
addResetListener();

function startGame () {
    dimension = prompt("Укажите размер поля");
    movesLeft = dimension**2;
    field = [];
    isGameOver = false;
    renderGrid(dimension);
}

function renderGrid (dimension) {
    container.innerHTML = '';

    for (let i = 0; i < dimension; i++) {
        const row = document.createElement('tr');
        field.push([]);
        for (let j = 0; j < dimension; j++) {
            const cell = document.createElement('td');
            cell.textContent = EMPTY;
            field[i][j] = EMPTY;
            cell.addEventListener('click', () => cellClickHandler(i, j));
            row.appendChild(cell);
        }
        container.appendChild(row);
    }
}

function cellClickHandler (row, col) {
    if (isGameOver){
        return;
    }
    if (findCell(row, col).textContent === EMPTY){
        if (movesLeft % 2 == 0){
            makeMove(CROSS, row, col);
        }
        else{
            makeMove(ZERO, row, col);
        }
    }
    console.log(`Clicked on cell: ${row}, ${col}`);
}

function makeMove(symbol, row, col){
    renderSymbolInCell(symbol, row, col);
    field[row][col] = symbol;
    movesLeft--;
    if (checkWinner(symbol, row, col)){
        switch (symbol){
            case CROSS:
                alert('Победили крестики!');
                break;
            case ZERO:
                alert('Победили нолики!');
                break;
        }
        isGameOver = true;
    }
    if (movesLeft === 0 && !isGameOver)
        alert('Победила дружба!');
}


function checkWinner (symbol, row, col) {
    let winFound = true;
    let winLine;
    for (let i = 0; i < dimension; i++) {
        if (field[row][i] !== symbol) {
            winFound = false;
            break;
        }
        winFound = true;
    }
    winLine = "vertical";

    if (!winFound) {
        for (let i = 0; i < dimension; i++) {
            if (field[i][col] !== symbol) {
                winFound = false;
                break;
            }
            winFound = true;
        }
        winLine = "horizontal";
    }

    if (!winFound) {
        for (let i = 0; i < dimension; i++) {
            if (field[i][i] !== symbol) {
                winFound = false;
                break;
            }
            winFound = true;
        }
        winLine = "diagonal";
    }

    if (!winFound) {
        for (let i = 0; i < dimension; i++) {
            if (field[i][dimension - (1 + i)] !== symbol) {
                winFound = false;
                break;
            }
            winFound = true;
        }
        winLine = "anti-diagonal";
    }

    if (winFound)
        colorWinningLine(winLine, row, col);
    return winFound;
}

function colorWinningLine(winLine, row, col){
    for (let i = 0; i < dimension; i++) {
        switch (winLine) {
            case "vertical":
                changeColor(findCell(row, i));
                break;

            case "horizontal":
                changeColor(findCell(i, col));
                break;

            case "diagonal":
                changeColor(findCell(i, i));
                break;

            case "anti-diagonal":
                changeColor(findCell(i, dimension - (i + 1)));
                break;
        }
    }
}

function changeColor(cell){
    cell.style.backgroundColor = '#b43030';
    cell.style.color = 'white';
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
    console.log('reset!');
    startGame();
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
