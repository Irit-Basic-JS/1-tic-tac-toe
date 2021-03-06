const CROSS = 'X';
const ZERO = 'O'; 
const EMPTY = ' ';
let symbolNumber;
let map;
let dimension;
let startDimension;
let gameOver;
let countEnlarge;
const container = document.getElementById('fieldWrapper');

startGame();
addResetListener();

function startGame () {
    dimension = prompt("Введите размер поля");
    startDimension = 0;
    renderGrid();
    countEnlarge = 0;
}

function renderGrid () {
    container.innerHTML = '';
    map = new Map();
    gameOver = false;
    symbolNumber = 0;
    renderMap();
}

function cellClickHandler (row, col) {
    if (!(map.has(`${row}.${col}`) || gameOver)) {
        symbolNumber = (symbolNumber + 1) % 2;
        let symbol = symbolNumber === 0 ? ZERO : CROSS;
        map.set(`${row}.${col}`, symbol);
        countEnlarge++;
        renderSymbolInCell(symbol, row, col);
        gameOver = map.size === (dimension - startDimension) * (dimension - startDimension);
        console.log(`Clicked on cell: ${row}, ${col}`);
        checkGameOver(symbol, row, col);
        checkEnlargeMap();
        if (symbolNumber === 1 && !gameOver) {
            console.log(`ход ии`);
            const cell = getRandomCell(getEmptyCell());
            console.log(`${cell[0]}, ${cell[1]}`);
            cellClickHandler(cell[0], cell[1]);
        }
    }
}

function renderMap() {
    container.innerHTML = '';
    for (let i = startDimension; i < dimension; i++) {
        const row = document.createElement('tr');
        for (let j = startDimension; j < dimension; j++) {
            const cell = document.createElement('td');
            cell.textContent = EMPTY;
            cell.addEventListener('click', () => cellClickHandler(i, j));
            row.appendChild(cell);
        }
        container.appendChild(row);
    }
}

function checkGameOver(symbol, row, col) {
    if (checkWin(symbol, row, col)) {
        alert(`${symbol} WIN`);
        gameOver = true;
    } else if (gameOver){
        alert("Победила дружба");
    }
}

function checkEnlargeMap() {
    if ((dimension - startDimension) * (dimension - startDimension) / 2 <= countEnlarge && !gameOver) {
        startDimension--;
        dimension++;
        renderMap();
        for (let cell of map) {
            const cellKey = cell[0].split('.');
            renderSymbolInCell(cell[1], cellKey[0], cellKey[1]);
        }
    }
}

function checkWin (symbol, row, col) {
    for (let i = startDimension; i < dimension; i++) {
        if (map.get(`${i}.${col}`) !== symbol) break;
        if (i === dimension - 1) {
            for (let x = startDimension; x < dimension; x++) renderSymbolInCell(symbol, x, col, '#FF0000');
            return true;
        }
    }
    for (let j = startDimension; j < dimension; j++) {
        if (map.get(`${row}.${j}`) !== symbol) break;
        if (j === dimension - 1) {
            for (let x = startDimension; x < dimension; x++) renderSymbolInCell(symbol, row, x, '#FF0000');
            return true;
        }
    }
    for (let ij = startDimension; ij < dimension; ij++) {
        if (map.get(`${ij}.${ij}`) !== symbol) break;
        if (ij === dimension - 1) {
            for (let x = startDimension; x < dimension; x++) renderSymbolInCell(symbol, x, x, '#FF0000');
            return true;
        }
    }
    for (let ij = startDimension; ij < dimension; ij++) {
        if (map.get(`${dimension - ij - 1}.${ij}`) !== symbol) break;
        if (ij === dimension - 1) {
            for (let x = startDimension; x < dimension; x++) renderSymbolInCell(symbol, dimension - 1 - x, x, '#FF0000');
            return true;
        }
    }
    return false;
}

function getEmptyCell () {
    let mapEmptyCell = new Map();
    for (let i = startDimension; i < dimension; i++) {
        for (let j = startDimension; j < dimension; j++) {
            if (!(map.has(`${i}.${j}`))) mapEmptyCell.set(`${i}.${j}`, '');
        }
    }
    for (let t of mapEmptyCell.keys()) console.log(`Пустые клетки: ${t}`);
    return mapEmptyCell;
}

function getRandomCell (mapEmptyCell) {
    const winZeroCell = getWinCell(CROSS);
    if (!isNaN(winZeroCell)) return winZeroCell.split('.');
    const winCrossCell = getWinCell(ZERO);
    if (!isNaN(winCrossCell)) return winCrossCell.split('.');
    const randomInt = getRandomInt(mapEmptyCell.size);
    let i = 0;
    console.log(`число: ${randomInt}`);
    for (let cell of mapEmptyCell.keys()) {
        if (i === randomInt) {
            return cell.split('.');
        }
        i++;
    }
}

function getWinCell(symbol) {
    let count = 0;
    let result = ``;
    for (let i = startDimension; i < dimension; i++) {
        count = 0;
        for (let j = startDimension; j < dimension; j++) {
            if (map.get(`${i}.${j}`) === symbol) break;
            if (map.get(`${i}.${j}`) === undefined) {
                result = `${i}.${j}`;
                count++;
                console.log(`Число пустых клеток ${count}`);
            }
            if (j === dimension - 1 && count === 1) {
                console.log(`Выигрышное место ии ${result}`);
                return result;
            }
        }
        count = 0;
        for (let j = startDimension; j < dimension; j++) {
            if (map.get(`${j}.${i}`) === symbol) break;
            if (map.get(`${j}.${i}`) === undefined) {
                result = `${j}.${i}`;
                count++;
                console.log(`Число пустых клеток ${count}`);
            }
            if (j === dimension - 1 && count === 1) {
                console.log(`Выигрышное место ии ${result}`);
                return result;
            }
        }
    }
    count = 0;
    for (let ij = startDimension; ij < dimension; ij++) {
        if (map.get(`${ij}.${ij}`) === symbol) break;
        if (map.get(`${ij}.${ij}`) === undefined) {
            result = `${ij}.${ij}`;
            count++;
            console.log(`Число пустых клеток ${count}`);
        }
        if (ij === dimension - 1 && count === 1) {
            console.log(`Выигрышное место ии ${result}`);
            return result;
        }
    }
    for (let ij = startDimension; ij < dimension; ij++) {
        if (map.get(`${dimension - ij - 1}.${ij}`) === symbol) break;
        if (map.get(`${dimension - ij - 1}.${ij}`) === undefined) {
            result = `${dimension - ij - 1}.${ij}`;
            count++;
            console.log(`Число пустых клеток ${count}`);
        }
        if (ij === dimension - 1 && count === 1) {
            console.log(`Выигрышное место ии ${result}`);
            return result;
        }
    }
    return NaN;
}

function renderSymbolInCell (symbol, row, col, color = '#000000') {
    const targetCell = findCell(row - startDimension, col - startDimension);

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

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}