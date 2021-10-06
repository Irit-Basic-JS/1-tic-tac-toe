const CROSS = 'X';
const ZERO = 'O';
const EMPTY = ' ';
const grid = [[' ', ' ', ' '], [' ', ' ', ' '], [' ', ' ', ' ']];
console.log(grid);

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

function cellClickHandler (row, col) {
    if (!isGameFinished() && grid[row][col] === ' ') {
        if (!isTheMostCrosses()) renderSymbolInCell(CROSS, row, col);
        else renderSymbolInCell(ZERO, row, col);
    }
}

function renderSymbolInCell (symbol, row, col, color = '#333') {
    const targetCell = findCell(row, col);
    grid[row][col] = symbol;
    targetCell.textContent = symbol;
    targetCell.style.color = color;
    sayWinner();
    sayDraw();
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

function isTheMostCrosses() {
    const symbols = grid.flat();
    const crossFilter = element => element === CROSS;
    const zeroFilter = element => element === ZERO;
    return symbols.filter(crossFilter).length > symbols.filter(zeroFilter).length;
}

function isGameFinished() {
    return hasWinner() || !grid.flat().filter(element => element === EMPTY).length;
}

function hasWinner() {
    return whoIsWinner()
}

function whoIsWinner() {
    const verticalChecker = []
    const diagonalChecker1 = []
    const diagonalChecker2 = []
    for(let i = 0; i < grid.length; i++) {
        if (grid[i].filter(item => item === CROSS).length === grid.length) {
            return CROSS;
        } else if (grid[i].filter(item => item === ZERO).length === grid.length) {
            return ZERO;
        }
        diagonalChecker1.push(grid[i][i]);
        diagonalChecker2.push(grid[grid.length - 1 - i][grid.length - 1 - i]);
        for(let j = 0; j < grid.length; j++) {
            verticalChecker.push(grid[j][i]);
        }
        if (verticalChecker.filter(item => item === CROSS).length === grid.length) return CROSS;
        else if (verticalChecker.fill(item => item === ZERO).length === grid.length) return ZERO;
        verticalChecker = []
    }
    if (diagonalChecker1.filter(item => item === CROSS).length === grid.length) return CROSS;
    else if (diagonalChecker1.filter(item => item === CROSS).length === grid.length) return ZERO;
    if (diagonalChecker2.filter(item => item === CROSS).length === grid.length) return CROSS;
    else if (diagonalChecker2.filter(item => item === ZERO).length === grid.length) return ZERO;
}

function sayDraw() {
    if (isGameFinished()) alert('Победила дружба');
}

function sayWinner() {
    if(hasWinner()) alert(whoIsWinner());
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
