const CROSS = 'X';
const ZERO = 'O';
const EMPTY = ' ';
const RED_COLOR = '#ff0000';

const container = document.getElementById('fieldWrapper');

startGame();
addResetListener();

function startGame () {
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

function addResetListener () {
    const resetButton = document.getElementById('reset');
    resetButton.addEventListener('click', resetClickHandler);
}


let field = [
    new Array(3),
    new Array(3),
    new Array(3)
];

let hasWinner = false;
let winner = undefined;
let stepCount = 0;

function cellClickHandler (row, col) {
    console.log(`Clicked on cell: ${row}, ${col}`);

    if (hasWinner)
        return;

    let currentSymbol = stepCount % 2 === 0 ? CROSS : ZERO;
    let isSymbolSet = setSymbolOnField(currentSymbol, row, col);

    if (isSymbolSet) {
        renderSymbolInCell(currentSymbol, row, col);
    }

    checkWinner();
    stepCount++;

    if (stepCount >= 9 && !hasWinner)
    {
        alert("Победила дружба!");
        hasWinner = true;
    }
}

function setSymbolOnField(symbol, row, col)
{
    if (field[row][col] === undefined){
        field[row][col] = symbol;
        return true;
    }
    return false;
}

function checkWinner(){
    checkHorizontalAndVertical();
    checkLeftSlash();
    checkRightSlash();

    if (hasWinner)
    {
        alert("Победили " + winner);
    }
}

function checkHorizontalAndVertical() {

    for (let row = 0; row < 3; row++) {
        let countCrossHor = 0, countCrossVer = 0;
        let countZeroHor = 0, countZeroVer = 0;

        for (let col = 0; col < 3; col++) {
            if (field[row][col] === ZERO)
                countZeroHor++;
            else if (field[row][col] === CROSS)
                countCrossHor++;

            if (field[col][row] === ZERO)
                countZeroVer++;
            else if (field[col][row] === CROSS)
                countCrossVer++;
        }

        if (countCrossHor === 3 || countZeroHor === 3) {
            hasWinner = true;
            winner = field[row][0];
            markHorizontalWinner(row);
            break;
        }

        if (countCrossVer === 3 || countZeroVer === 3) {
            hasWinner = true;
            winner = field[0][row];
            markVerticalWinner(row);
            break;
        }
    }
}

function markHorizontalWinner(row) {
    let sym = field[row][0];
    for (let i = 0; i < 3; i++){
        renderSymbolInCell(sym, row, i, RED_COLOR);
    }
}

function markVerticalWinner(col) {
    let sym = field[0][col];
    for (let i = 0; i < 3; i++){
        renderSymbolInCell(sym, i, col, RED_COLOR);
    }
}

function checkLeftSlash() {
    if (field[0][0] === undefined) {
        return;
    }

    let sym = field[0][0];
    for (let i = 0; i < 3; i++) {
        if (field[i][i] !== sym) {
            return;
        }
    }

    hasWinner = true;
    winner = sym;
    markLeftSlash();
}

function checkRightSlash() {
    if (field[0][2] === undefined) {
        return;
    }

    let sym = field[0][2];
    for (let i = 2, j = 0; i >= 0 && j < 3; i--, j++) {
        if (field[j][i] !== sym) {
            return;
        }
    }

    hasWinner = true;
    winner = sym;
    markRightSlash();
}

function markLeftSlash() {
    let sym = field[0][0];
    for (let i = 0; i < 3; i++) {
        renderSymbolInCell(sym, i, i, RED_COLOR);
    }
}

function markRightSlash() {
    let sym = field[0][2];
    for (let i = 2, j = 0; i >= 0 && j < 3; i--, j++) {
        renderSymbolInCell(sym, j, i, RED_COLOR);
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

function resetClickHandler () {
    console.log('reset!');

    hasWinner = false;
    winner = undefined;
    stepCount = 0;

    field = [
        new Array(3),
        new Array(3),
        new Array(3)
    ];

    for (let i = 0; i < 3; i++)
        for (let j = 0; j < 3; j++)
            renderSymbolInCell(EMPTY, i, j);
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
