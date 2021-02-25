const CROSS = 'X';
const ZERO = 'O';
const EMPTY = ' ';
let symbolNumber = 1;
let map;
let dimension = 3;
let gameOver;

const container = document.getElementById('fieldWrapper');

startGame();
addResetListener();

function startGame () {
    renderGrid();
}

function renderGrid () {
    container.innerHTML = '';
    map = new Map();
    gameOver = false;
    symbolNumber = 1;
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
    if (!(map.has(`${row}${col}`) || gameOver)) {
        symbolNumber = (symbolNumber + 1) % 2;
        let symbol = symbolNumber === 0 ? CROSS : ZERO;
        map.set(`${row}${col}`, symbol);
        renderSymbolInCell(symbol, row, col);
        gameOver = map.size === dimension ** 2;
        if (checkWin(symbol, row, col)) {
            alert(`${symbol} WIN`);
            gameOver = true;
        } else if (gameOver){
            alert("Победила дружба");
        }
        console.log(`Clicked on cell: ${row}, ${col}`);
    }
}

function checkWin (symbol, row, col) {
    for (let i = 0; i < dimension; i++) {
        if (map.get(`${i}${col}`) !== symbol) break;
        if (i === dimension - 1) {
            for (let x = 0; x < dimension; x++) renderSymbolInCell(symbol, x, col, '#FF0000');
            return true;
        }
    }
    for (let j = 0; j < dimension; j++) {
        if (map.get(`${row}${j}`) !== symbol) break;
        if (j === dimension - 1) {
            for (let x = 0; x < dimension; x++) renderSymbolInCell(symbol, row, x, '#FF0000');
            return true;
        }
    }
    for (let ij = 0; ij < dimension; ij++) {
        if (map.get(`${ij}${ij}`) !== symbol) break;
        if (ij === dimension - 1) {
            for (let x = 0; x < dimension; x++) renderSymbolInCell(symbol, x, x, '#FF0000');
            return true;
        }
    }
    for (let ij = 0; ij < dimension; ij++) {
        if (map.get(`${dimension - ij - 1}${ij}`) !== symbol) break;
        if (ij === dimension - 1) {
            for (let x = 0; x < dimension; x++) renderSymbolInCell(symbol, dimension - 1 - x, x, '#FF0000');
            return true;
        }
    }
    return false
}

function renderSymbolInCell (symbol, row, col, color = '#000000') {
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
    startGame();
    console.log('reset!');
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
