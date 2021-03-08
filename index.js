const CROSS = 'X';
const ZERO = 'O';
const EMPTY = ' ';

const RED = '#FF0000';

const container = document.getElementById('fieldWrapper');

let field;
let gameStatus;
let emptyCells;
let currentSymbol;;

startGame();
addResetListener();

function startGame () {
    const dimension = 3

    renderGrid(dimension);
    createField(dimension);
    emptyCells = dimension ** 2;
    gameStatus = 'game';
    currentSymbol = CROSS;
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

function createField(dimension) {
    field = [];
    for (let i = 0; i < dimension; i++) {
        field[i] = [];
        for (let j = 0; j < dimension; j++){
            field[i][j] = EMPTY;
        }
    }
}

function cellClickHandler (row, col) {
    if (gameStatus === 'game') {
        if (field[row][col] === EMPTY) {
            field[row][col] = currentSymbol;
            renderSymbolInCell(currentSymbol, row, col);
            currentSymbol = currentSymbol === CROSS ? ZERO : CROSS;
            emptyCells--;
        }

        gameStatus = GameStatus();
    }

    console.log(`Clicked on cell: ${row}, ${col}`);
}

function GameStatus () {
    const message = (str) => setTimeout( () => alert(str), 50 );

    let winner = hasWinner();
    switch (winner) {
        case CROSS:
            message(`Победа ${CROSS}`);
            return 'winner X';
        case ZERO:
            message(`Победа ${ZERO}`);
            return 'winner O';
        case 'draw':
            message('Победила дружба');
            return 'draw';
        default: return 'game';
    }
}

function hasWinner () {
    const lines = getLines();

    for (let i = 0; i < lines.length; i++) {
        if (lines[i].symbols.includes(EMPTY)) continue;

        let encounteredSymbols = new Set(lines[i].symbols);
        if (encounteredSymbols.size === 1) {
            highlightWinner(lines[i]);

            if (lines[i].symbols[0] === CROSS) {
                return CROSS;
            } else return ZERO;
        }
    }

    if (emptyCells === 0) return 'draw';
}

function getLines () {
    const rows = getRows();
    const columns = getColumns();
    const diagonals = getDiagonals();

    let lines = [];
    lines.push(...rows);
    lines.push(...columns);
    lines.push(...diagonals);

    return lines;
}

function getRows () {
    let rows = [];

    for (let i = 0; i < field.length; i++) {
        row = {symbols: [], cells: []}
        for (let j = 0; j < field.length; j++) {
            row.symbols.push(field[i][j]);
            row.cells.push([i, j]);
        }
        rows.push(row);
    }

    return rows;
}

function getColumns () {
    let columns = [];

    for (let i = 0; i < field.length; i++) {
        let column = {symbols: [], cells: []};
        for (let j = 0; j < field.length; j++) {
            column.symbols.push(field[j][i]);
            column.cells.push([j, i]);
        }

        columns.push(column);
    }

    return columns;
}

function getDiagonals () {
    let diagonals = [ {symbols: [], cells: []}, {symbols: [], cells: []} ];

    for (let i = 0; i < field.length; i++) {
        diagonals[0].symbols.push(field[i][i]);
        diagonals[0].cells.push([i, i]);

        diagonals[1].symbols.push(field[field.length - 1 - i][i])
        diagonals[1].cells.push([field.length - 1 - i, i]);
    }

    return diagonals;
}

function highlightWinner (line) {
    const symbol = line.symbols[0];

    for (let i = 0; i < line.cells.length; i++) {
        let row = line.cells[i][0];
        let col = line.cells[i][1];
        renderSymbolInCell(symbol, row, col, RED);
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
