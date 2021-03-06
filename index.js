const CROSS = 'X';
const ZERO = 'O';
const EMPTY = ' ';
const RED_COLOR = '#ff0000';

const container = document.getElementById('fieldWrapper');

let fieldRows, fieldColumns;
let field, hasWinner, winner, stepCount, maxSteps;
let isUsingAI, isSimpleAI;

startGame();
addResetListener();

function startGame () {
    let rows = getNumber("Input rows number", "3");
    let columns = getNumber("Input columns number", "3");
    isUsingAI = confirm("Use AI?");
    if (isUsingAI)
        isSimpleAI = confirm("Use simple AI?");

    InitializeDependencies(rows, columns);

    renderGrid(fieldRows, fieldColumns);
}

function InitializeDependencies(rows, columns)
{
    fieldRows = rows;
    fieldColumns = columns;
    field = createField(fieldRows, fieldColumns);
    hasWinner = false;
    winner = undefined;
    stepCount = 0;
    maxSteps = fieldRows * fieldColumns;
}

function getNumber(text, defaultInput) {
    while (true)
    {
        let number = Number(prompt(text, defaultInput));
        if (!isNaN(number)) {
            return number;
        }
        alert("Incorrect input!");
    }
}

function createField(rows, columns) {
    let array = [];
    for (let i = 0; i < rows; i++) {
        array.push(new Array(columns));
    }
    return array;
}

function renderGrid (rows, columns) {
    container.innerHTML = '';

    for (let i = 0; i < rows; i++) {
        const row = document.createElement('tr');
        for (let j = 0; j < columns; j++) {
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

    if (stepCount >= maxSteps && !hasWinner)
    {
        alert("Победила дружба!");
        hasWinner = true;
    }

    if (!hasWinner && isUsingAI && currentSymbol === CROSS)
    {
        isSimpleAI
            ? playSimpleAI(ZERO)
            : playDifficultAI(ZERO);
    }
}

function playDifficultAI(symbol) {
    for (let row = 0; row < fieldRows; row++) {
        for (let col = 0; col < fieldColumns; col++) {
            let isSet = setSymbolOnField(symbol, row, col);
            if (isSet && containsWinner()) {
                unsetSymbolOnField(row, col);
                cellClickHandler(row,col);
                return;
            }

            if (isSet) {
                unsetSymbolOnField(row, col);
            }
        }
    }

    playSimpleAI(symbol);
}

function playSimpleAI(symbol) {
    while (true) {
        let row = randomInteger(0, fieldRows - 1);
        let col = randomInteger(0, fieldColumns - 1);
        if (setSymbolOnField(symbol, row, col)) {
            unsetSymbolOnField(row,col);
            cellClickHandler(row,col);
            return;
        }
    }
}

function randomInteger(min, max) {
    let num = min + Math.random() * (max + 1 - min);
    return Math.floor(num);
}

function containsWinner() {
    return hasHorizontalWinner().hasWinner
        || hasVerticalWinner().hasWinner
        || hasLeftSlashWinner()
        || hasRightSlashWinner();
}

function setSymbolOnField(symbol, row, col)
{
    if (isSellEmpty(row, col)){
        field[row][col] = symbol;
        return true;
    }
    return false;
}

function unsetSymbolOnField(row, col) {
    if (!isSellEmpty(row, col)) {
        field[row][col] = undefined;
        return true;
    }
    return false;
}

function isSellEmpty(row, col) {
    return field[row][col] === undefined;
}

function checkWinner(){
    checkHorizontal();
    checkVertical();
    checkLeftSlash();
    checkRightSlash();

    if (hasWinner)
    {
        alert("Победили " + winner);
    }
}

function checkHorizontal() {
    let result = hasHorizontalWinner();
    if (result.hasWinner) {
        hasWinner = true;
        winner = field[result.row][result.column];
        markHorizontalWinner(result.row);
    }
}

function checkVertical() {
    let result = hasVerticalWinner();
    if (result.hasWinner){
        hasWinner = true;
        winner = field[result.row][result.column];
        markVerticalWinner(result.column);
    }

    return result;
}

function checkLeftSlash() {
    if (hasLeftSlashWinner()) {
        hasWinner = true;
        winner = field[0][0];
        markLeftSlash();
    }
}

function checkRightSlash() {
    if (hasRightSlashWinner()) {
        hasWinner = true;
        winner = field[0][fieldColumns - 1];
        markRightSlash();
    }
}

function hasHorizontalWinner(){
    let result = {
        hasWinner: false,
        row: undefined,
        column: undefined
    }

    for (let row = 0; row < fieldRows; row++) {
        let countCross = 0, countZero = 0;

        for (let col = 0; col < fieldColumns; col++) {
            if (field[row][col] === ZERO)
                countZero++;
            else if (field[row][col] === CROSS)
                countCross++;
        }

        if (countCross === fieldRows || countZero === fieldRows) {
            result.hasWinner = true;
            result.row = row;
            result.column = 0;
            break;
        }
    }

    return result;
}

function hasVerticalWinner() {
    let result = {
        hasWinner: false,
        row: undefined,
        column: undefined
    }

    for (let col = 0; col < fieldColumns; col++) {
        let countCross = 0, countZero = 0;

        for (let row = 0; row < fieldRows; row++) {
            if (field[row][col] === ZERO)
                countZero++;
            else if (field[row][col] === CROSS)
                countCross++;
        }

        if (countCross === fieldColumns || countCross === fieldColumns) {
            result.hasWinner = true;
            result.row = 0;
            result.column = col
            break;
        }
    }
    return result;
}

function hasLeftSlashWinner() {
    if (fieldRows !== fieldColumns || field[0][0] === undefined) {
        return false;
    }

    let sym = field[0][0];
    for (let i = 0; i < fieldColumns; i++) {
        if (field[i][i] !== sym) {
            return false;
        }
    }
    return true;
}

function hasRightSlashWinner() {
    if (fieldRows !== fieldColumns || field[0][fieldColumns - 1] === undefined) {
        return false;
    }

    let sym = field[0][fieldColumns - 1];

    for (let col = fieldColumns - 1, row = 0; col >= 0 && row < fieldRows; col--, row++) {
        if (field[row][col] !== sym) {
            return false;
        }
    }
    return true;
}

function markHorizontalWinner(row) {
    for (let i = 0; i < fieldColumns; i++){
        renderSymbolInCell(winner, row, i, RED_COLOR);
    }
}

function markVerticalWinner(col) {
    for (let i = 0; i < fieldRows; i++){
        renderSymbolInCell(winner, i, col, RED_COLOR);
    }
}

function markLeftSlash() {
    if (fieldRows !== fieldColumns) {
        return;
    }

    let sym = field[0][0];
    for (let i = 0; i < fieldRows; i++) {
        renderSymbolInCell(sym, i, i, RED_COLOR);
    }
}

function markRightSlash() {
    if (fieldRows !== fieldColumns) {
        return;
    }

    let sym = field[0][fieldColumns - 1];
    for (let col = fieldColumns - 1, row = 0; col >= 0 && row < fieldRows; col--, row++) {
        renderSymbolInCell(sym, row, col, RED_COLOR);
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

    startGame()

    hasWinner = false;
    winner = undefined;
    stepCount = 0;
    maxSteps = fieldRows * fieldColumns;
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
