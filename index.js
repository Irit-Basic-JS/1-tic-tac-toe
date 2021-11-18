const CROSS = 'X';
const ZERO = 'O';
const EMPTY = ' ';

const container = document.getElementById('fieldWrapper');

let field = {}; // -1 = ZERO; 0 = EMPTY; 1 = CROSS
let fieldSize = 3;
let cellsRemaining = 9;
let gameIsOver = false;
let botPreset = [null, null]

startGame();
addResetListener();

function startGame() {
    let size = Number(prompt("Введите размер поля", 3));
    cellsRemaining = size ** 2;
    gameIsOver = false;

    renderGrid(size);
    createField(size);
    fieldSize = field[0].length;
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

function createField(dimension) {
    field = Array.from(Array(dimension), () => new Array(dimension));

    for (let i = 0; i < dimension; i++)
        for (let j = 0; j < dimension; j++)
            field[i][j] = 0;
}

function createLargerField() {
    fieldSize += 2;
    newField = Array.from(Array(fieldSize), () => new Array(fieldSize));

    for (let i = 0; i < fieldSize; i++)
        for (let j = 0; j < fieldSize; j++)
            newField[i][j] = 0;

    for (let i = 1; i < fieldSize - 1; i++)
        for (let j = 1; j < fieldSize - 1; j++)
            newField[i][j] = field[i - 1][j - 1];

    field = newField;
    cellsRemaining += fieldSize ** 2 - (fieldSize - 2) ** 2;
    renderGrid(fieldSize);
    renderCells();
}

function renderCells() {
    for (let i = 1; i < fieldSize - 1; i++)
        for (let j = 1; j < fieldSize - 1; j++)
            if (field[i][j] === -1)
                renderSymbolInCell(ZERO, i, j);
            else if (field[i][j] === 1)
                renderSymbolInCell(CROSS, i, j);
}

function cellClickHandler(row, col) {
    if (!gameIsOver) {
        if (field[row][col] === 0) {
            renderSymbolInCell(CROSS, row, col);
            field[row][col] = 1;
            cellsRemaining--;

            //comment this to disable field enlargement
            if (cellsRemaining < fieldSize ** 2 / 2)
                createLargerField();    
            //end of comment

            console.log(`Clicked on cell: ${row}, ${col}`);

            checkWinConditions();

            if (!gameIsOver) {
                makeBotMove();
                checkWinConditions(true);
            }
        }
    }
}

function checkWinConditions(isBotMove = false) {
    let rowsSum = new Array(fieldSize).fill(0);
    let diagonalsSum = new Array(2).fill(0);

    for (let i = 0; i < fieldSize; i++) {
        let lineSum = 0;

        for (let j = 0; j < fieldSize; j++) {
            lineSum += field[i][j];
            rowsSum[j] += field[i][j];

            if (i === j)
                diagonalsSum[0] += field[i][j];

            if (i === fieldSize - j - 1)
                diagonalsSum[1] += field[i][j];
        }

        gameIsOver = displayWinMessage(lineSum, [i, 0], [i, fieldSize - 1], isBotMove);
        if (gameIsOver) break;
    }
    if (gameIsOver) return;

    for (let i = 0; i < fieldSize; i++) {
        gameIsOver = displayWinMessage(rowsSum[i], [0, i], [fieldSize - 1, i], isBotMove);
        if (gameIsOver) break;
    }
    if (gameIsOver) return;

    for (let i = 0; i < fieldSize; i++) {
        gameIsOver = displayWinMessage(diagonalsSum[i],
            [0, i === 0 ? 0 : fieldSize - 1], [fieldSize - 1, i === 1 ? 0 : fieldSize - 1], isBotMove, true);
        if (gameIsOver) break;
    }

    if (!gameIsOver && cellsRemaining === 0) {
        alert("Победила дружба")
        gameIsOver = true;
    }
}

function displayWinMessage(sum, firstPoint, secondPoint, isBotMove = false, isDiagonal = false) {
    if (Math.abs(sum) === fieldSize) {
        if (sum > 0) {
            makeWinnerRed('X', firstPoint, secondPoint, isDiagonal);
            alert(`Победили Крестики! \nXXXXXXXXXXXXXXXX`);
        }
        else {
            makeWinnerRed('O', firstPoint, secondPoint, isDiagonal);
            alert(`Победили Нолики!   \n0000000000000000`);
        }

        return true;
    }
    else if (!isBotMove && Math.abs(sum) === fieldSize - 1) {
        if (sum > 0 && botPreset[0] === null
            || sum < 0) {
            findEmptyCell(firstPoint, secondPoint, isDiagonal);
            console.log(`Bot preset = ${botPreset}`);
        }
    }

    return false;
}

function makeWinnerRed(symbol, firstPoint, secondPoint, isDiagonal = false) {
    if (!isDiagonal) {
        for (let i = firstPoint[0]; i <= secondPoint[0]; i++)
            for (let j = firstPoint[1]; j <= secondPoint[1]; j++)
                renderSymbolInCell(symbol, i, j, "red");
    }
    else for (let i = 0; i < fieldSize; i++) {
        renderSymbolInCell(symbol, i, firstPoint[1] === 0 ? i : fieldSize - i - 1, "red");
    }
}

function findEmptyCell(firstPoint, secondPoint, isDiagonal = false) {
    if (!isDiagonal) {
        for (let i = firstPoint[0]; i <= secondPoint[0]; i++)
            for (let j = firstPoint[1]; j <= secondPoint[1]; j++)
                if (field[i][j] === 0) {
                    botPreset = [i, j];
                    return;
                }
    }
    else for (let i = 0; i < fieldSize; i++) {
        j = firstPoint[1] === 0 ? i : fieldSize - i - 1;
        if (field[i][j] === 0) {
            botPreset = [i, j];
            return;
        }
    }
}

function makeBotMove() {
    row = botPreset[0];
    col = botPreset[1];

    if (botPreset[0] === null) {
        row = Math.floor(Math.random() * fieldSize);
        col = Math.floor(Math.random() * fieldSize);

        while (field[row][col] != 0) {
            row = Math.floor(Math.random() * fieldSize);
            col = Math.floor(Math.random() * fieldSize);
        }
    }
    else botPreset = [null, null];

    renderSymbolInCell(ZERO, row, col);
    field[row][col] = -1;
    cellsRemaining--;
    console.log(`Bot made move on cell: ${row}, ${col}`);
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

function resetClickHandler() {
    startGame();
    console.log('reset!');
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
