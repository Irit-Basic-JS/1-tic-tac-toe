const CROSS = 'X';
const ZERO = 'O';
const EMPTY = ' ';

const winStates = {
    CROSS: "Победили крестики!",
    ZERO: "Победили нолики!"
};

let horizontalWin = true;
let verticalWin = true;
let leftDiagonalWin = true;
let rightDiagonalWin = true;

const container = document.getElementById('fieldWrapper');

let turn = CROSS;
let fieldSize = 3;
let turnsCount = 0;
let field = [[], [], []];

let isGameOver = false;

fillField();
setInterface();
startGame();
addResetListener();

function startGame () {
    renderGrid(fieldSize);
}

function fillField(){
    for (let i = 0; i < fieldSize; i++)
        field.push([]);
}

function setInterface(){
    createInputField();
    createRandomTurnButton();
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
    field = []
    for (let i = 0; i < fieldSize; i++){
        for (let j = 0; j < fieldSize; j++){
            renderSymbolInCell(EMPTY, i, j);
        } 
    }
    fillField();
    isGameOver = false;
    turnsCount = 0;
    turn = CROSS;
}

function checkWinner(row, col){
    let cellValue = field[row][col];
    horizontalWin = true;
    verticalWin = true;
    leftDiagonalWin = true;
    rightDiagonalWin = true;
    for (let i = 0; i < fieldSize; i++)
    {
        if (horizontalWin && field[row][i] != cellValue)
            horizontalWin = false;

        if (verticalWin && field[i][col] != cellValue)
            verticalWin = false;

        if (leftDiagonalWin && field[i][i] != cellValue)
            leftDiagonalWin = false;

        if (rightDiagonalWin && field[i][fieldSize - i - 1] != cellValue)
            rightDiagonalWin = false;
    }

    if (horizontalWin || verticalWin || leftDiagonalWin || rightDiagonalWin)
    {
        isGameOver = true;
        paintWinnerCells(row, col);
        if (cellValue === CROSS)
            alert(winStates.CROSS);
        else
            alert(winStates.ZERO);
    }
}

function paintWinnerCells(row, col){
    for (let i = 0; i < fieldSize; i++)
    {
        if (horizontalWin)
            renderSymbolInCell(field[row][col], row, i, '#FF0000');
        
        else if (verticalWin)
            renderSymbolInCell(field[row][col], i, col, '#FF0000');

        else if (leftDiagonalWin)
            renderSymbolInCell(field[row][col], i, i, '#FF0000');

        else if (rightDiagonalWin)
            renderSymbolInCell(field[row][col], i, fieldSize - i - 1, '#FF0000');
    }
}

function checkDraw(){
    if (turnsCount === fieldSize * fieldSize)
    {
        alert("Победила дружба");
        isGameOver = true;
        return;
    }
}

function createInputField(){
    let inputField = document.createElement('input');
    let header = document.querySelector('h1');
    inputField.setAttribute('type', 'text');
    header.appendChild(inputField);
    inputField.onchange = function(){
        fieldSize = parseFloat(inputField.value);
        renderGrid(fieldSize);
        resetClickHandler();
    }
}

function createRandomTurnButton(){
    let button = document.createElement('button');
    button.style.width = '100px';
    button.style.height = '40px';
    let header = document.querySelector('h2');
    header.appendChild(button);

    button.onclick = function(){
        while(true){
            let rowRandom = Math.floor(Math.random() * fieldSize);
            let colRandom = Math.floor(Math.random() * fieldSize);
            if (field[rowRandom][colRandom] === undefined){
                clickOnCell(rowRandom, colRandom);
                break;
            }
        }
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
