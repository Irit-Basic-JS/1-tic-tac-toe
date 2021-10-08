const CROSS = 'X';
const ZERO = 'O';
const EMPTY = ' ';

const container = document.getElementById('fieldWrapper');

let arrayOfCells=[];

let isWinnerExists = false;
let sym = EMPTY;
let count = 0;

startGame();
addResetListener();

function startGame () {
    let dimension = prompt("Размер поля: ", 3);
    renderGrid(dimension);
    count = dimension**2;
    isWinnerExists = false;
}


function renderGrid (dimension) {
    container.innerHTML = '';

    for (let i = 0; i < dimension; i++) {
        arrayOfCells[i] = [];
        const row = document.createElement('tr');
        for (let j = 0; j < dimension; j++) {
            const cell = document.createElement('td');
            cell.textContent = EMPTY;
            arrayOfCells[i][j] = EMPTY;
            cell.addEventListener('click', () => cellClickHandler(i, j));
            row.appendChild(cell);
        }
        container.appendChild(row);
    }
}


function cellClickHandler (row, col) {
    if (count % 2 === 0){
        getCurrentSymbol(row, col, CROSS);
    }
    else {
        getCurrentSymbol(row, col, ZERO);
    }
    console.log(`Clicked on cell: ${row}, ${col}`);
}

function getCurrentSymbol (row, col, sym) {
    if (findCell(row, col).textContent === EMPTY && !isWinnerExists) {
        renderSymbolInCell(sym, row, col);
        arrayOfCells[row][col] = sym;
        count--;
        if (checkWin(row, col, sym)) {
            alert(`Победитель: ${sym === ZERO ? "нолики" : "крестики"}`);
            isWinnerExists = true;
        }
        if (count === 0 && !checkWin(row, col, sym))
        alert("Ничья");
    }
}

function checkWin(row, col, sym) {
    let f = true;
    let winnersWay = '';
    for(let i = 0; i < arrayOfCells.length; i++) {
        if(arrayOfCells[row][i] !== sym) {
                f = false;
                break;
        }
        winnersWay = 'horizontal';
    }

    if(!f)
        for (let i = 0; i < arrayOfCells.length; i++) {
            if (arrayOfCells[i][col] !== sym) {
                f = false;
                break;
            }
            f = true;
            winnersWay = 'vertical';
        }
    if(!f)
        for (let i = 0; i < arrayOfCells.length; i++) {
            if (arrayOfCells[i][i] !== sym) {
                f = false;
                break;
            }
            f = true;
            winnersWay = 'diagToUp';
        }
    if (!f)
        for (let i = 0; i < arrayOfCells.length; i++) {
            if (arrayOfCells[i][arrayOfCells.length - 1 - i] !== sym) {
                f = false;
                break;
            }
            f = true;
            winnersWay = 'diagToDown';
        }
    if (f)
        changeColour(winnersWay, row, col);
    return f;
}

function changeColour(way, row, col) {
    switch(way) {
        case 'horizontal':
            for (let i = 0; i < arrayOfCells.length; i++)
                findCell(row, i).style.color = "#ff2605";
            break;
        case 'vertical':
            for (let i = 0; i < arrayOfCells.length; i++)
                findCell(i, col).style.color = "#ff2605";
            break;
        case 'diagToUp':
            for (let i = 0; i < arrayOfCells.length; i++)
                findCell(i,i).style.color = "#ff2605";
            break;
        case 'diagToDown':
            for (let i = 0; i < arrayOfCells.length; i++)
                findCell(i, arrayOfCells.length - 1 - i).style.color = "#ff2605";
            break;
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
    console.log('reset!');
    ifTurnsAreOver = false;
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
