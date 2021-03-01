const CROSS = 'X';
const ZERO = 'O';
const EMPTY = ' ';

let currentSymbol = CROSS;
let countEMPTY = 9;
let field = [new Array(3), new Array(3), new Array(3)];
let winner = false;

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
    // Пиши код тут
if (!winner) {
    if (field[row][col] === undefined) {
        if (currentSymbol === CROSS) {
            renderSymbolInCell(CROSS, row, col);
            currentSymbol = ZERO;
            field[row][col] = CROSS;
            countEMPTY -= 1;
        }
        else {
            renderSymbolInCell(ZERO, row, col);
            currentSymbol = CROSS;
            field[row][col] = ZERO;
            countEMPTY -= 1;
        }
    }
}
    if (winnerCheck(field) === 'Победили крестики') {
        alert('Победили крестики');
        winner = true;
    }
    else if (winnerCheck(field) === 'Победили нолики') {
        alert('Победили нолики');
        winner = true;
    }
    else if (countEMPTY === 0) alert('Победила дружба');


    console.log(`Clicked on cell: ${row}, ${col}`);


    /* Пользоваться методом для размещения символа в клетке так:
        renderSymbolInCell(ZERO, row, col);
     */
     
}

function winnerCheck (field) {
    if ((field[0][0] === CROSS) && (field[0][1] === CROSS) && (field[0][2] === CROSS)) {
        renderSymbolInCell(CROSS, 0, 0, color='#ff0000');
        renderSymbolInCell(CROSS, 0, 1, color='#ff0000');
        renderSymbolInCell(CROSS, 0, 2, color='#ff0000');
        return 'Победили крестики';
    }
    if ((field[1][0] === CROSS) && (field[1][1] === CROSS) && (field[1][2] === CROSS)) {
        renderSymbolInCell(CROSS, 1, 0, color='#ff0000');
        renderSymbolInCell(CROSS, 1, 1, color='#ff0000');
        renderSymbolInCell(CROSS, 1, 2, color='#ff0000');
        return 'Победили крестики';
    }
    if ((field[2][0] === CROSS) && (field[2][1] === CROSS) && (field[2][2] === CROSS)) {
        renderSymbolInCell(CROSS, 2, 0, color='#ff0000');
        renderSymbolInCell(CROSS, 2, 1, color='#ff0000');
        renderSymbolInCell(CROSS, 2, 2, color='#ff0000');
        return 'Победили крестики';
    }
    if ((field[0][0] === CROSS) && (field[1][0] === CROSS) && (field[2][0] === CROSS)) {
        renderSymbolInCell(CROSS, 0, 0, color='#ff0000');
        renderSymbolInCell(CROSS, 1, 0, color='#ff0000');
        renderSymbolInCell(CROSS, 2, 0, color='#ff0000');
        return 'Победили крестики';
    }
    if ((field[0][1] === CROSS) && (field[1][1] === CROSS) && (field[2][1] === CROSS)) {
        renderSymbolInCell(CROSS, 0, 1, color='#ff0000');
        renderSymbolInCell(CROSS, 1, 1, color='#ff0000');
        renderSymbolInCell(CROSS, 2, 1, color='#ff0000');
        return 'Победили крестики';
    }
    if ((field[0][2] === CROSS) && (field[1][2] === CROSS) && (field[2][2] === CROSS)) {
        renderSymbolInCell(CROSS, 0, 2, color='#ff0000');
        renderSymbolInCell(CROSS, 1, 2, color='#ff0000');
        renderSymbolInCell(CROSS, 2, 2, color='#ff0000');
        return 'Победили крестики';
    }
    if ((field[0][0] === CROSS) && (field[1][1] === CROSS) && (field[2][2] === CROSS)) {
        renderSymbolInCell(CROSS, 0, 0, color='#ff0000');
        renderSymbolInCell(CROSS, 1, 1, color='#ff0000');
        renderSymbolInCell(CROSS, 2, 2, color='#ff0000');
        return 'Победили крестики';
    }
    if ((field[2][0] === CROSS) && (field[1][1] === CROSS) && (field[0][2] === CROSS)) {
        renderSymbolInCell(CROSS, 2, 0, color='#ff0000');
        renderSymbolInCell(CROSS, 1, 1, color='#ff0000');
        renderSymbolInCell(CROSS, 0, 2, color='#ff0000');
        return 'Победили крестики';
    }


    if ((field[0][0] === ZERO) && (field[0][1] === ZERO) && (field[0][2] === ZERO)) {
        renderSymbolInCell(ZERO, 0, 0, color='#ff0000');
        renderSymbolInCell(ZERO, 0, 1, color='#ff0000');
        renderSymbolInCell(ZERO, 0, 2, color='#ff0000');
        return 'Победили нолики';
    }
    if ((field[1][0] === ZERO) && (field[1][1] === ZERO) && (field[1][2] === ZERO)) {
        renderSymbolInCell(ZERO, 1, 0, color='#ff0000');
        renderSymbolInCell(ZERO, 1, 1, color='#ff0000');
        renderSymbolInCell(ZERO, 1, 2, color='#ff0000');
        return 'Победили нолики';
    }
    if ((field[2][0] === ZERO) && (field[2][1] === ZERO) && (field[2][2] === ZERO)) {
        renderSymbolInCell(ZERO, 2, 0, color='#ff0000');
        renderSymbolInCell(ZERO, 2, 1, color='#ff0000');
        renderSymbolInCell(ZERO, 2, 2, color='#ff0000');
        return 'Победили нолики';
    }
    if ((field[0][0] === ZERO) && (field[1][0] === ZERO) && (field[2][0] === ZERO)) {
        renderSymbolInCell(ZERO, 0, 0, color='#ff0000');
        renderSymbolInCell(ZERO, 1, 0, color='#ff0000');
        renderSymbolInCell(ZERO, 2, 0, color='#ff0000');
        return 'Победили нолики';
    }
    if ((field[0][1] === ZERO) && (field[1][1] === ZERO) && (field[2][1] === ZERO)) {
        renderSymbolInCell(ZERO, 0, 1, color='#ff0000');
        renderSymbolInCell(ZERO, 1, 1, color='#ff0000');
        renderSymbolInCell(ZERO, 2, 1, color='#ff0000');
        return 'Победили нолики';
    }
    if ((field[0][2] === ZERO) && (field[1][2] === ZERO) && (field[2][2] === ZERO)) {
        renderSymbolInCell(ZERO, 0, 2, color='#ff0000');
        renderSymbolInCell(ZERO, 1, 2, color='#ff0000');
        renderSymbolInCell(ZERO, 2, 2, color='#ff0000');
        return 'Победили нолики';
    }
    if ((field[0][0] === ZERO) && (field[1][1] === ZERO) && (field[2][2] === ZERO)) {
        renderSymbolInCell(ZERO, 0, 0, color='#ff0000');
        renderSymbolInCell(ZERO, 1, 1, color='#ff0000');
        renderSymbolInCell(ZERO, 2, 2, color='#ff0000');
        return 'Победили нолики';
    }
    if ((field[2][0] === ZERO) && (field[1][1] === ZERO) && (field[0][2] === ZERO)) {
        renderSymbolInCell(ZERO, 2, 0, color='#ff0000');
        renderSymbolInCell(ZERO, 1, 1, color='#ff0000');
        renderSymbolInCell(ZERO, 0, 2, color='#ff0000');
        return 'Победили нолики';
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

function addResetListener () {
    const resetButton = document.getElementById('reset');
    resetButton.addEventListener('click', resetClickHandler);
}

function resetClickHandler () {
    currentSymbol = CROSS;
    countEMPTY = 9;
    field = [new Array(3), new Array(3), new Array(3)];

    for (let i = 0; i < field.length; i++) {
        for(let j = 0; j < field.length; j++) {
            renderSymbolInCell(EMPTY, i, j);
        }
    }
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
