const CROSS = 'X';
const ZERO = 'O';
const EMPTY = ' ';

const container = document.getElementById('fieldWrapper');
let dimension = parseInt(prompt("Укажите размерность поля"));
let moveCounts = dimension * dimension;

startGame();
addResetListener();

function startGame() {
    renderGrid(dimension);
}


let field = getField(dimension);
let currentPlayer = CROSS;
let hasWinner = false;

function getField() {
    let field = [];
    for (let row = 0; row < dimension; row++) {
        field[row] = [];
        for (let col = 0; col < dimension; col++) {
            field[row][col] = EMPTY;
        }
    }
    return field;
}

function checkRows(){
    let winner = EMPTY;
    let winRow = []
    for(let row = 0; row < dimension; row++) {
        winRow = []
        let index = 0;
        for(;index < dimension; index++) {
            if(field[row][index] == EMPTY || field[row][0] != field[row][index]) {
                break;
            } else {
                winRow.push([row, index])
            }

        }
        if(index  == dimension) {
            winner = field[row][0];
            break;
        }
    }
    return [winner, winRow];
}

function checkColumns(){
    let winner = EMPTY;
    let winColumn = [];
    for(let col = 0; col < dimension; col++) {
        winColumn = [];
        let index = 0;
        for(;index < dimension; index++) {
            if(field[index][col] == EMPTY || field[0][col] != field[index][col]) {
                break;
            } else {
                winColumn.push([index, col])
            }
        }
        if(index  == dimension) {
            winner = field[0][col];
            break;
        }
    }
    return [winner, winColumn];
}

function checkDiagnals(){
    let winner = EMPTY;
    let winDiagonal = [];
    let checkedCellsCount = 0
    for(let index = 0; index < dimension; index++) {
        if(field[index][index]  == field[0][0] && field[index][index] != EMPTY){
            checkedCellsCount++;
            winDiagonal.push([index, index])
        } else {
            break;
        }
    }

    if(checkedCellsCount == dimension){
        winner = field[winDiagonal[0][0]][winDiagonal[0][1]]
        return [winner, winDiagonal]
    }

    winner = EMPTY;
    winDiagonal = [];
    checkedCellsCount = 0
    row = 0;
    col = dimension - 1;
    for(; row < dimension; row++) {
        if(field[row][col]  == field[0][dimension - 1] && field[row][col] != EMPTY){
            checkedCellsCount++;
            winDiagonal.push([row, col])
        } else {
            break;
        }
        col--;
    }
    if(checkedCellsCount == dimension){
        winner = field[winDiagonal[0][0]][winDiagonal[0][1]]
        return [winner, winDiagonal]
    }
    return [winner, winDiagonal];
}

function checkWinner() {
    let rows = checkRows();
    if(rows[0] !== EMPTY) {
        paintCells(rows[1]);
        alert(rows[0] + ' победил');
        hasWinner = true;
    }
    let columns = checkColumns()
    if(columns[0] !== EMPTY) {
        paintCells(columns[1]);
        alert(columns[0] + ' победил');
        hasWinner = true;
    }
    let diagonals = checkDiagnals()
    if(diagonals[0] !== EMPTY) {
        paintCells(diagonals[1])
        alert(diagonals[0] + ' победил');
        hasWinner = true;
    }
}

function renderGrid(dimension) {
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

function isEmptyCell(row, col) {
    if (field[row][col] === CROSS || field[row][col] === ZERO)
        return false;
    return true;
}

function paintCells(indexesArr) {
    for (let indexPair of indexesArr) {
        let [row, col] = indexPair;
        renderSymbolInCell(field[row][col], row, col, color = '#ff0000');
    }
}

function cellClickHandler(row, col) {
    if (isEmptyCell(row, col) && !hasWinner) {
        field[row][col] = currentPlayer;
        renderSymbolInCell(currentPlayer, row, col);
        checkWinner();
        currentPlayer = currentPlayer === CROSS ? ZERO : CROSS;
        moveCounts--;
        console.log(`Clicked on cell: ${row}, ${col}`);
    } else {
        console.log("Нельзя!");
    }
    if (moveCounts <= 0 && !hasWinner) {
        alert("Победила дружба!");
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

function deleteAll() {
    for (let row = 0; row < dimension; row++) {
        for (let col = 0; col < dimension; col++) {
            field[row][col] = EMPTY;
            renderSymbolInCell(EMPTY, row, col);
        }
    }
    hasWinner = false;
    moveCounts = dimension * dimension;
}

function resetClickHandler() {
    console.log('reset!');
    deleteAll();
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