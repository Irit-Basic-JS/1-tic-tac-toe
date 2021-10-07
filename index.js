const CROSS = 'X';
const ZERO = 'O';
const EMPTY = ' ';

let currentSymbol = CROSS;

let field  = [
    [EMPTY, EMPTY, EMPTY],
    [EMPTY, EMPTY, EMPTY],
    [EMPTY, EMPTY, EMPTY]
];

let countEMPTY = 9;

let hasWinner = false;

const container = document.getElementById('fieldWrapper');

startGame();
@@ -27,13 +39,92 @@ function renderGrid (dimension) {
}

function cellClickHandler (row, col) {
    // Пиши код тут
    if(!hasWinner) {
        if (field[row][col] === EMPTY) {
            if(currentSymbol == CROSS) {
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
    if(findWinner() == CROSS) {
         alert('Победили крестики');
         hasWinner = true;
    }
    else if(findWinner() == ZERO) {
         alert('Победили нолики');
         hasWinner = true;
    }
    else if(countEMPTY === 0) alert('Победила дружба! :)');
    console.log(`Clicked on cell: ${row}, ${col}`);
}

function findWinner() {
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

    /* Пользоваться методом для размещения символа в клетке так:
        renderSymbolInCell(ZERO, row, col);
     */
    sym = field[1][0];
    if ((sym !== EMPTY) && (field[1][0] === sym) && (field[1][1] === sym) && (field[1][2] === sym)) {
        renderSymbolInCell (sym, 1, 0, color = '#ff0000');
        renderSymbolInCell (sym, 1, 1, color = '#ff0000');
        renderSymbolInCell (sym, 1, 2, color = '#ff0000');
        return sym;
    }

    sym = field[2][0];
    if ((sym !== EMPTY) && (field[2][0] === sym) && (field[2][1] === sym) && (field[2][2] === sym)) {
        renderSymbolInCell (sym, 2, 0, color = '#ff0000');
        renderSymbolInCell (sym, 2, 1, color = '#ff0000');
        renderSymbolInCell (sym, 2, 2, color = '#ff0000');
        return sym;
    }
    if ((sym !== EMPTY) && (field[2][0] === sym) && (field[1][1] === sym) && (field[0][2] === sym)) {
        renderSymbolInCell (sym, 2, 0, color = '#ff0000');
        renderSymbolInCell (sym, 1, 1, color = '#ff0000');
        renderSymbolInCell (sym, 0, 2, color = '#ff0000');
        return sym;
    }

    sym = field[0][1];
    if ((sym !== EMPTY) && (field[0][1] === sym) && (field[1][1] === sym) && (field[2][1] === sym)) {
        renderSymbolInCell (sym, 0, 1, color = '#ff0000');
        renderSymbolInCell (sym, 1, 1, color = '#ff0000');
        renderSymbolInCell (sym, 2, 1, color = '#ff0000');
        return sym;
    }

    sym = field[0][2];
    if ((sym !== EMPTY) && (field[0][2] === sym) && (field[1][2] === sym) && (field[2][2] === sym)) {
        renderSymbolInCell (sym, 0, 2, color = '#ff0000');
        renderSymbolInCell (sym, 1, 2, color = '#ff0000');
        renderSymbolInCell (sym, 2, 2, color = '#ff0000');
        return sym;
    }
}

function renderSymbolInCell (symbol, row, col, color = '#333') {
@@ -54,6 +145,19 @@ function addResetListener () {
}

function resetClickHandler () {
    currentSymbol = CROSS;

    field  = [
    [EMPTY, EMPTY, EMPTY],
    [EMPTY, EMPTY, EMPTY],
    [EMPTY, EMPTY, EMPTY]
];

    countEMPTY = 9;
    for(let i = 0; i < field.length; i++)
        for(let j = 0; j < field.length; j++)
            renderSymbolInCell (EMPTY, i, j);

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