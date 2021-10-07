const CROSS = 'X';
const ZERO = 'O';
const EMPTY = ' ';

let count;
let dimension;
let startPosition;
let map;
let flag;

const container = document.getElementById('fieldWrapper');

startGame();
addResetListener();

function startGame () {
    renderGrid(3);
}

function renderGrid (dimension) {
    function renderGrid() {
        dimension = prompt('Введите размер поля:');
        map = new Map();
        flag = false;
        startPosition = 1;
        count = 0;
        container.innerHTML = '';
        renderMap();
    }

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
    // Пиши код тут
    if (!(map.has(`${row}${col}`) || flag)) {
        startPosition = (startPosition + 1) % 2;
        let symbol = startPosition === 0 ? CROSS : ZERO;
        map.set(`${row}${col}`, symbol);
        renderSymbolInCell(symbol, row, col);
        flag = map.size === dimension ** 2;

        if (checkWin(symbol, row, col)) {
            alert(`${symbol} победа`);
            flag = true;
        } 

        else if (flag) {
            alert('Победила дружба');
        }
    console.log(`Clicked on cell: ${row}, ${col}`);
    }
    /* Пользоваться методом для размещения символа в клетке так:
        renderSymbolInCell(ZERO, row, col);
     */
}

function checkWin(symbol, row, col) {
    for (let i = 0; i < dimension; i++) {
        if (map.get(`${i}${col}`) !== symbol) break;
        if (i === dimension - 1) {
            for (let x = 0; x < dimension; x++) renderSymbolInCell(symbol, x, col, '#d40b0b');
            return true;
        }
    }

    for (let j = 0; j < dimension; j++) {
        if (map.get(`${row}${j}`) !== symbol) break;

        if (j === dimension - 1) {
            for (let y = 0; y < dimension; y++) renderSymbolInCell(symbol, row, y, '#d40b0b');
            return true;
        }
    }

    for (let ij = 0; ij < dimension; ij++) {
        if (map.get(`${dimension - ij - 1}${ij}`) !== symbol) break;

        if (ij === dimension - 1) {
            for (let x = 0; x < dimension; x++) renderSymbolInCell(symbol, dimension - 1 - x, x, '#d40b0b');
            return true;
        }
    }

    for (let ij = 0; ij < dimension; ij++) {
        if (map.get(`${ij}${ij}`) !== symbol) break;

        if (ij === dimension - 1) {
            for (let x = 0; x < dimension; x++) renderSymbolInCell(symbol, x, x, '#d40b0b');
            return true;
        }
    }

    return false
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
