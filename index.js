const CROSS = 'X';
const ZERO = 'O';
const EMPTY = ' ';

let currentSymbol = CROSS;

let field  = [
    [EMPTY, EMPTY, EMPTY],
    [EMPTY, EMPTY, EMPTY],
    [EMPTY, EMPTY, EMPTY]];
    let countEMPTY = 9;

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
    if (!winner) {
        if (field[row][col] === EMPTY) {
            if (currentSymbol == CROSS) {
                renderSymbolInCell (CROSS, row, col);
                currentSymbol = ZERO;
                field[row][col] = CROSS;
                countEMPTY -= 1;
            }
            else {
                renderSymbolInCell (ZERO, row, col);
                currentSymbol = CROSS;
                field[row][col] = ZERO;
                countEMPTY -= 1;
            }
        }
    }

    if (checkWinner() == CROSS) {
         alert('Победили крестики');
         winner = true;
    }
    else if (checkWinner() == ZERO) {
         alert('Победили нолики');
         winner = true;
    }
    else if (countEMPTY === 0) alert('Победила дружба!');
    console.log(`Clicked on cell: ${row}, ${col}`);

}

function checkWinner() {
    let sym = field[0][0];
    if ((sym !== EMPTY) && (field[0][0] === sym) && (field[0][1] === sym) && (field[0][2] === sym)) {
        renderSymbolInCell (sym, 0, 0, color = '#ff0000');
        renderSymbolInCell (sym, 0, 1, color = '#ff0000');
        renderSymbolInCell (sym, 0, 2, color = '#ff0000');
        return sym;
    }
    if ((sym !== EMPTY) && (field[0][0] === sym) && (field[1][0] === sym) && (field[2][0] === sym)) {
        renderSymbolInCell (sym, 0, 0, color = '#ff0000');
        renderSymbolInCell (sym, 1, 0, color = '#ff0000');
        renderSymbolInCell (sym, 2, 0, color = '#ff0000');
        return sym;
    }
    if ((sym !== EMPTY) && (field[0][0] === sym) && (field[1][1] === sym) && (field[2][2] === sym)) {
        renderSymbolInCell (sym, 0, 0, color = '#ff0000');
        renderSymbolInCell (sym, 1, 1, color = '#ff0000');
        renderSymbolInCell (sym, 2, 2, color = '#ff0000');
        return sym;
    }
    sym = field[1][1];
    if ((sym !== EMPTY) && (field[1][0] === sym) && (field[1][1] === sym) && (field[1][2] === sym)) {
        renderSymbolInCell (sym, 1, 0, color = '#ff0000');
        renderSymbolInCell (sym, 1, 1, color = '#ff0000');
        renderSymbolInCell (sym, 1, 2, color = '#ff0000');
        return sym;
    }
    if ((sym !== EMPTY) && (field[2][0] === sym) && (field[1][1] === sym) && (field[0][2] === sym)) {
        renderSymbolInCell (sym, 2, 0, color = '#ff0000');
        renderSymbolInCell (sym, 1, 1, color = '#ff0000');
        renderSymbolInCell (sym, 0, 2, color = '#ff0000');
        return sym;
    }
    if ((sym !== EMPTY) && (field[0][1] === sym) && (field[1][1] === sym) && (field[2][1] === sym)) {
        renderSymbolInCell (sym, 0, 1, color = '#ff0000');
        renderSymbolInCell (sym, 1, 1, color = '#ff0000');
        renderSymbolInCell (sym, 2, 1, color = '#ff0000');
        return sym;
    }
    sym = field[2][2];
    if ((sym !== EMPTY) && (field[2][0] === sym) && (field[2][1] === sym) && (field[2][2] === sym)) {
        renderSymbolInCell (sym, 2, 0, color = '#ff0000');
        renderSymbolInCell (sym, 2, 1, color = '#ff0000');
        renderSymbolInCell (sym, 2, 2, color = '#ff0000');
        return sym;
    }
    if ((sym !== EMPTY) && (field[0][2] === sym) && (field[1][2] === sym) && (field[2][2] === sym)) {
        renderSymbolInCell (sym, 0, 2, color = '#ff0000');
        renderSymbolInCell (sym, 1, 2, color = '#ff0000');
        renderSymbolInCell (sym, 2, 2, color = '#ff0000');
        return sym;
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
    let currentSymbol = CROSS;

    let field  = [
        [EMPTY, EMPTY, EMPTY],
        [EMPTY, EMPTY, EMPTY],
        [EMPTY, EMPTY, EMPTY]
    ];
    let countEMPTY = 9;

    for (let i = 0; i < field.length; i++)
        for (let j = 0; j < field.length; j++)
            renderSymbolInCell (EMPTY, i, j);
    console.log('reset!');
}

function testWin () {
    clickOnCell(0, 2);
    clickOnCell(0, 0);
    clickOnCell(2, 0);
    clickOnCell(1, 1);
    clickOnCell(2, 2);
    clickOnCell(1, 2);
    clickOnCell(2, 1);
}

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
