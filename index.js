const CROSS = 'X';
const ZERO = 'O';
const EMPTY = ' ';


let field = [];
let dimension = 3;
let countMoves = 9;
let endGame = false;

const container = document.getElementById('fieldWrapper');

startGame();
addResetListener();

function startGame () {
    renderGrid(dimension);
}

function renderGrid (dimension) {
    container.innerHTML = '';
    createField(dimension);
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
    for (let i = 0; i < dimension; i++) {
        field[i] = new Array();
        for (let j = 0; j < dimension; j++) {
            field[i][j] = EMPTY;
        }
    }
}

function moveCheck(row, col) {
    if (countMoves % 2 === 0) {
        field[row][col] = ZERO;
        renderSymbolInCell(ZERO, row, col);
        countMoves--;
    }
    else {
        field[row][col] = CROSS;
        renderSymbolInCell(CROSS, row, col);
        countMoves--;
    }
    checkWinner();
}

function cellClickHandler (row, col) {
    
    if (field[row][col] === EMPTY && !endGame) {
        moveCheck(row, col);
    }
    console.log(`Clicked on cell: ${row}, ${col}`);
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
    countMoves = 9;
    endGame = false;
    startGame();
    console.log('reset!');
}

function checkWinner() {
    checkHorizontalWinner();
    checkVerticalWinner();
    checkDiagonalWinner();
    if (countMoves === 0 && !endGame) {
        endGame = true;
        alert("Победила дружба!");
    }
}

function checkHorizontalWinner() {
    for (let i = 0; i < 3; i++) {
        if (
            field[i][0] === CROSS &&
            field[i][1] === CROSS &&
            field[i][2] === CROSS) {
                endGame = true;
                alert("Победили крестики!");
                for (let j = 0; j < 3; j++) {
                    let targetCell = findCell(i, j);
                    targetCell.style.color = "red";
                }
            }
        else if (
            field[i][0] === ZERO &&
            field[i][1] === ZERO &&
            field[i][2] === ZERO) {
                endGame = true;
                alert("Победили нолики!");
                for (let j = 0; j < 3; j++) {
                    let targetCell = findCell(i, j);
                    targetCell.style.color = "red";
                }
        }
    }
}

function checkVerticalWinner() {
    for (let i = 0; i < 3; i++) {
        if (
            field[0][i] === CROSS &&
            field[1][i] === CROSS &&
            field[2][i] === CROSS) {
                endGame = true;
                alert("Победили крестики!");
                for (let j = 0; j < 3; j++) {
                    let targetCell = findCell(j, i);
                    targetCell.style.color = "red";
                }
            }
        else if (
            field[0][i] === ZERO &&
            field[1][i] === ZERO &&
            field[2][i] === ZERO) {
                endGame = true;
                alert("Победили нолики!");
                for (let j = 0; j < 3; j++) {
                    let targetCell = findCell(j, i);
                    targetCell.style.color = "red";
                }
        }
    }
}

function checkDiagonalWinner() {
    if ( field[0][0] == CROSS && field[1][1] == CROSS && field[2][2] == CROSS) {
        endGame = true;
        alert("Победили крестики!");
        for (let i = 0; i < 3; i++) {
            let targetCell = findCell(i, i);
            targetCell.style.color = "red";
        }
    } else if (field[0][2] == CROSS && field[1][1] == CROSS && field[2][0] == CROSS) {
        endGame = true;
        alert("Победили крестики!");
        for (let i = 0; i < 3; i++) {
            for (let j = 2; j >= 0; j--) {
                let targetCell = findCell(i, 2 - i);
                targetCell.style.color = "red";
            }
        }
    } else if (field[0][0] == ZERO && field[1][1] == ZERO && field[2][2] == ZERO) {
        endGame = true;
        alert("Победили нолики!");
        for (let i = 0; i < 3; i++) {
            let targetCell = findCell(i, i);
            targetCell.style.color = "red";
        }
    } else if (field[0][2] == ZERO && field[1][1] == ZERO && field[2][0] == ZERO) {
        endGame = true;
        alert("Победили нолики!");
        for (let i = 0; i < 3; i++) {
            let targetCell = findCell(i, 2 - i);
            targetCell.style.color = "red";
        }
    }
}

function clickOnCell (row, col) {
    findCell(row, col).click();
}
