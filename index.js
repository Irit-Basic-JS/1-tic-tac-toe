const CROSS = 'X';
const ZERO = 'O';
const EMPTY = ' ';

const container = document.getElementById('fieldWrapper');
let fieldData;
let count;
let isPlayable;
let dimension;

startGame();
addResetListener();

function startGame () {
    dimension = prompt("Введите размер поля");
    count = dimension**2;
    fieldData = [];
    isPlayable = true;
    renderGrid(dimension);
}

function renderGrid (dimension) {
    container.innerHTML = '';

    for (let i = 0; i < dimension; i++) {
        const row = document.createElement('tr');
        fieldData.push([]);
        for (let j = 0; j < dimension; j++) {
            const cell = document.createElement('td');
            cell.textContent = EMPTY;
            fieldData[i][j] = EMPTY;
            cell.addEventListener('click', () => cellClickHandler(i, j));
            row.appendChild(cell);
        }
        container.appendChild(row);
    }
}

function cellClickHandler (row, col) {
    // Пиши код тут
    console.log(`Clicked on cell: ${row}, ${col}`);

    if (findCell(row,col).textContent === EMPTY && isPlayable)
        if(count % 2 === 0)
            processClick (ZERO, row, col)
        else
            processClick (CROSS, row, col)
    console.log(`This cell is: ${fieldData[row][col]}`);
}

function processClick (symbol, row, col) {
    renderSymbolInCell(symbol, row, col);
    fieldData[row][col] = symbol;
    if (checkWinner(symbol, row, col)) {
        alert(`${symbol === CROSS ? "Крестики" : "Нолики"} победили!`)
        isPlayable = false;
    }
    if (--count === 0 && isPlayable)
        alert("Победила дружба!");
}

function checkWinner (symbol, row, col) {

    let isLined = true;
    let winType;
    {
        for (let i = 0; i < fieldData.length; i++) {
            if (fieldData[row][i] !== symbol) {
                isLined = false;
                break;
            }
            isLined = true;
        }
        winType = "ver";
    }
    if (!isLined) {
        for (let i = 0; i < fieldData.length; i++) {
            if (fieldData[i][col] !== symbol) {
                isLined = false;
                break;
            }
            isLined = true;
        }
        winType = "hor";
    }
    if (!isLined) {
        for (let i = 0; i < fieldData.length; i++) {
            if (fieldData[i][i] !== symbol) {
                isLined = false;
                break;
            }
            isLined = true;
        }
        winType = "diagL";
    }
    if (!isLined) {
        for (let i = 0; i < fieldData.length; i++) {
            if (fieldData[i][fieldData.length - 1 - i] !== symbol) {
                isLined = false;
                break;
            }
            isLined = true;
        }
        winType = "diagR";
    }

    if (isLined)
        changeColor(winType, row, col);
    return isLined;
}

function changeColor(way, row, col)
{
    for (let i = 0; i < fieldData.length; i++) {
        switch (way) {
            case "hor":
                findCell(i, col).style.color = '#ff4040';
                break;

            case "ver":
                findCell(row, i).style.color = '#ff4040';
                break;

            case "diagL":
                findCell(i, i).style.color = '#ff4040';
                break;

            case "diagR":
                findCell(i, fieldData.length - 1 - i).style.color = '#ff4040'
                break;
        }
    }
}

function computerMove () {

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
    console.log('reset!');
    startGame();
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
