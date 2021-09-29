const CROSS = 'X';
const ZERO = 'O';
const EMPTY = ' ';

let field;
let maxTurns;
let turn;
let winCombination;
let isGameOver;
let winner;

const winTypes = {
    horizontal: 'horiz',
    vertical: 'vert',
    diagonalLeft: 'diagL',
    diagonalRight: 'diagR'
}

const container = document.getElementById('fieldWrapper');

startGame();
addResetListener();

function startGame() {
    field = [];
    turn = 0;
    winCombination = [];
    isGameOver = false;
    winner = "";
    renderGrid(prompt("Задайте размер поля:", 3));
}

function renderGrid(dimension) {
    container.innerHTML = '';
    maxTurns = dimension ** 2;
    for (let i = 0; i < dimension; i++) {
        field[i] = [];
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

function cellClickHandler(row, col) {
    if (isGameOver) return;
    console.log(`Clicked on cell: ${row}, ${col}`);
    if (field[row][col] !== undefined)
        return;
    field[row][col] = CROSS;
    processClick(field[row][col], row, col);
    if (!isGameOver) botClick();
}

function botClick() {
    if (isGameOver) return;
    let freeCellCount = field.length ** 2 - turn;
    let randomFreeCell = Math.floor(Math.random() * freeCellCount);
    let row, col;
    let symbol = ZERO;
    [row, col] = getCellCoords(randomFreeCell, symbol);
    console.log(`Bot clicked on cell: ${row}, ${col}`);
    field[row][col] = symbol;
    processClick(field[row][col], row, col);
}

function getCellCoords(randomFreeCell, symbol) {
    let counter = 0;
    let winRow, winCol, randRow, randCol;
    cellSearch: for (let y = 0; y < field.length; y++)
        for (let x = 0; x < field.length; x++) {
            if (field[y][x] === undefined) {
                if (counter === randomFreeCell) 
                    [randRow, randCol] = [y, x];
                field[y][x] = symbol;
                winner = checkWinner(symbol, y, x);
                if (winner !== symbol) field[y][x] = undefined;
                else {
                    [winRow, winCol] = [y, x];
                    break cellSearch;
                }
                counter++;
            }
        }
    if (winner !== symbol)
        return [randRow, randCol];
    return [winRow, winCol];
}

function processClick(symbol, row, col) {
    renderSymbolInCell(symbol, row, col);
    winner = checkWinner(symbol, row, col);  
    turn++;  
    if (turn === maxTurns && !winner) isGameOver = true;
    else if (!winner) return;
    //console.log(isGameOver);
    colorWinningLine();
    announceWinner();
}

function checkWinner(symbol, row, col) {
    winCombination = checkForWinCombination(symbol, row, col);
    //console.log(winCombination);
    if (winCombination.length === field.length) {
        isGameOver = true;
        return symbol;
    }
    return "";
}

function checkForWinCombination(symbol, row, col) {
    if ((col === 0 || field[row][col - 1] === symbol) &&
        (col === field.length - 1 || field[row][col + 1] === symbol))
        return getWinCombination(winTypes.horizontal, symbol, row, col);

    if ((row === 0 || field[row - 1][col] === symbol) &&
        (row === field.length - 1 || field[row + 1][col] === symbol))
        return getWinCombination(winTypes.vertical, symbol, row, col);

    if (row === col &&
        (row === 0 || field[row - 1][col - 1] === symbol) &&
        (row === field.length - 1 || field[row + 1][col + 1] === symbol))
        return getWinCombination(winTypes.diagonalLeft, symbol, row, col);

    if (field.length - 1 - row === col &&
        (row === 0 || field[row - 1][col + 1] === symbol) &&
        (col === 0 || field[row + 1][col - 1] === symbol))
        return getWinCombination(winTypes.diagonalRight, symbol, row, col);
    return [];
}

function getWinCombination(winType, symbol, row, col) {
    let combination = []
    combAssembly: for (let i = 0; i < field.length; i++) {
        switch (winType) {
            case winTypes.vertical:
                if (field[i][col] !== symbol)
                    break combAssembly;
                combination.push([i, col]);
                break;
            case winTypes.horizontal:
                if (field[row][i] !== symbol)
                    break combAssembly;
                combination.push([row, i]);
                break;
            case winTypes.diagonalLeft:
                if (field[i][i] !== symbol)
                    break combAssembly;
                combination.push([i, i]);
                break;
            case winTypes.diagonalRight:
                if (field[field.length - 1 - i][i] !== symbol)
                    break combAssembly;
                combination.push([field.length - 1 - i, i])
                break;
        }
    }
    if (combination.length === field.length)
        return combination;
    return [];
}

function announceWinner() {
    if (!isGameOver) return;
    switch (winner) {
        case CROSS:
            alert('Победили крестики!');
            break;
        case ZERO:
            alert('Победили нолики!');
            break;
        default:
            alert('Победила дружба!');
            break;
    }
}

function colorWinningLine() {
    for (let i = 0; i < winCombination.length; i++) {
        let row = winCombination[i][0];
        let col = winCombination[i][1];
        const targetCell = findCell(row, col);
        targetCell.style.backgroundColor = "red";
    }
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
    console.log('reset!');
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
