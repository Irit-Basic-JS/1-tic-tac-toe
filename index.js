const CROSS = 'X';
const ZERO = 'O';
const EMPTY = ' ';

const container = document.getElementById('fieldWrapper');

let currentPlayer;
let currentTurn;
let field;
let maxTurns;
let dimension;
let winCombination;
let isGameOver;

getDimensionCount();
startGame();
addResetListener();

function startGame () {
    isGameOver = false;
    maxTurns = dimension ** 2;
    field = [];
    renderGrid(dimension);
    currentPlayer = CROSS;
    currentTurn = 1;
}

function getDimensionCount() {
    dimension = parseInt(prompt('Введите количество измерений', '3'));
}

function renderGrid (dimension) {
    container.innerHTML = '';

    for (let i = 0; i < dimension; i++) {
        field[i] = [];
        const row = document.createElement('tr');
        for (let j = 0; j < dimension; j++) {
            field[i][j] = EMPTY;
            const cell = document.createElement('td');
            cell.textContent = EMPTY;
            cell.addEventListener('click', () => cellClickHandler(i, j));
            row.appendChild(cell);
        }
        container.appendChild(row);
    }
}

function cellClickHandler (row, col) {
    cellClick(row, col);
}

function cellClick (row, col) {
    if (field[row][col] != EMPTY || isGameOver) {
        return;
    }
    renderSymbolInCell(currentPlayer, row, col);
    checkWinner(currentPlayer, row, col);
    currentTurn++;
    currentPlayer = (currentPlayer == CROSS) ? ZERO : CROSS;
}

function checkWinner(player, row, col) {
    if (currentTurn < dimension * 2 - 1) return;
    if (isWinCombination(rowWinnerCombination(player, row)) 
    || isWinCombination(colWinnerCombination(player, col)) 
    || isWinCombination(mainDiagWinnerCombination(player)) 
    || isWinCombination(secondDiagWinnerCombination(player))) {
        alertWinner(player);
    }
    if (currentTurn == maxTurns){
        alert('Победила дружба!');
        isGameOver = true;
        return;
    }
}

function isWinCombination(combination) {
    if (combination.length == dimension) {
        winCombination = combination;
        return true;
    }
    return false;
}

function mainDiagWinnerCombination(player) {
    combination = [];
    for (let i = 0; i < dimension; i++){
        if (field[i][i] == player){
            combination.push([i, i]);
        }
        else return [];
    }
    return combination;
}

function secondDiagWinnerCombination(player) {
    combination = [];
    for (let i = 0; i < dimension; i++){
        if (field[dimension - 1 - i][i] == player){
            combination.push([dimension - 1 - i, i]);
        }
        else return [];
    }
    return combination;
}

function rowWinnerCombination(player, row) {
    combination = [];
    for (let i = 0; i < dimension; i++){
        if (field[row][i] == player){
            combination.push([row, i]);
        }
        else return [];
    }
    return combination;
}

function colWinnerCombination(player, col) {
    combination = [];
    for (let i = 0; i < dimension; i++){
        if (field[i][col] == player){
            combination.push([i, col]);
        }
        else return [];
    }
    return combination;
}

function alertWinner(player) {
    switch(player) {
        case CROSS:
            alert('Победили крестики!');
            break;
        case ZERO:
            alert('Победили нолики!');
            break;
    }
    isGameOver = true;
    colorWinner(winCombination);
}

function colorWinner(winComb) {
    winComb.forEach(winCell => {
        const cell = findCell(winCell[0], winCell[1]);
        cell.style.backgroundColor = "red";
    });
}

function renderSymbolInCell (symbol, row, col, color = '#333') {
    const targetCell = findCell(row, col);
    field[row][col] = symbol;

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
}

function botTurn() {
    while(true){
        x = Math.floor(Math.random() * dimension);
        y = Math.floor(Math.random() * dimension);
        if (field[x][y] == EMPTY) {
            clickOnCell(x, y);
            break;
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
