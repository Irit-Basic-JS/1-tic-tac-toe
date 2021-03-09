const CROSS = 'X';
const ZERO = 'O';
const EMPTY = ' ';

const RED = '#FF0000';

const container = document.getElementById('fieldWrapper');

let dimension;
let field;
let gameStatus;
let emptyCells;
let currentSymbol;;

startGame();
addResetListener();

function startGame () {
    dimension = +prompt('Введи размер поля', 3);
    emptyCells = dimension ** 2;
    gameStatus = 'game';
    currentSymbol = CROSS;

    createField(dimension);
    renderGrid(dimension);
}

function renderGrid (dimension) {
    container.innerHTML = '';

    for (let i = 0; i < dimension; i++) {
        const row = document.createElement('tr');
        for (let j = 0; j < dimension; j++) {
            const cell = document.createElement('td');
            cell.textContent = field[i][j];
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
        for (let j = 0; j < dimension; j++) {
            field[i][j] = EMPTY;
        }
    }
}

function cellClickHandler (row, col) {
    if (field[row][col] == EMPTY) {
        if (gameStatus == 'game') {
            setCell(currentSymbol, row, col);
            gameStatus = GameStatus();
        }

        if (gameStatus == 'game') {
            goodAI();
            //sillyAI();

            if (emptyCells < parseInt(field.length ** 2 / 2)) {
                extendField();
            }

            gameStatus = GameStatus();
        }
    }

    console.log(`Clicked on cell: ${row}, ${col}`);
}

function setCell (symbol, row, col) {
    field[row][col] = symbol;
    renderSymbolInCell(symbol, row, col);
    emptyCells--;
    currentSymbol = currentSymbol === CROSS ? ZERO : CROSS;
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

function extendField () {
    dimension++;

    for (let i = 0; i < dimension - 1; i++) {
        field[i].push(EMPTY);
    }

    let row = [];
    for (let i = 0; i < dimension; i++) {
        row.push(EMPTY);
    }
    field.push(row);

    emptyCells += dimension * 2 - 1;
    renderGrid(dimension);
}

function sillyAI () {
    const randomCell = getRandomEmptyCell();
    const row = randomCell[0];
    const col = randomCell[1];

    setCell(currentSymbol, row, col);
}

function goodAI () {
    const lines = getLines();
    let cell = getRandomEmptyCell();

    for (let i = 0; i < lines.length; i++) {
        const crossCount = getCountSymbolInLine(lines[i], CROSS);
        const zeroCount = getCountSymbolInLine(lines[i], ZERO);
        const emptyCount = dimension - (crossCount + zeroCount);
        
        if (zeroCount === dimension - 1 && emptyCount) {
            cell = getEmptyCellInLine(lines[i]);
            break;
        }
        if (crossCount === dimension - 1 && emptyCount) {
            cell = getEmptyCellInLine(lines[i]);
        } 
    }

    const row = cell[0];
    const col = cell[1];
    setCell(currentSymbol, row, col);
}

function getCountSymbolInLine (line, symbol) {
    let count = 0;

    for (let i = 0; i < dimension; i++) {
        if (line.symbols[i] === symbol) {
            count++;
        }
    }

    return count;
}

function getEmptyCellInLine (line) {
    for (let i = 0; i < dimension; i++) {
        if (line.symbols[i] === EMPTY) {
            return line.cells[i];
        }
    }
}

function getRandomEmptyCell () {
    while (true) {
        let randomCell = Math.floor(Math.random() * dimension ** 2);
        let row = parseInt(randomCell / dimension);
        let col = randomCell % dimension;

        if (field[row][col] === EMPTY) return [row, col];
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

    for (let i = 0; i < dimension; i++) {
        row = {symbols: [], cells: []}
        for (let j = 0; j < dimension; j++) {
            row.symbols.push(field[i][j]);
            row.cells.push([i, j]);
        }
        rows.push(row);
    }

    return rows;
}

function getColumns () {
    let columns = [];

    for (let i = 0; i < dimension; i++) {
        let column = {symbols: [], cells: []};
        for (let j = 0; j < dimension; j++) {
            column.symbols.push(field[j][i]);
            column.cells.push([j, i]);
        }

        columns.push(column);
    }

    return columns;
}

function getDiagonals () {
    let diagonals = [ {symbols: [], cells: []}, {symbols: [], cells: []} ];

    for (let i = 0; i < dimension; i++) {
        diagonals[0].symbols.push(field[i][i]);
        diagonals[0].cells.push([i, i]);

        diagonals[1].symbols.push(field[dimension - 1 - i][i])
        diagonals[1].cells.push([dimension - 1 - i, i]);
    }

    return diagonals;
}

function highlightWinner (line) {
    const symbol = line.symbols[0];

    for (let i = 0; i < dimension; i++) {
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
