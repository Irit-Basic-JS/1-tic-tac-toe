const CROSS = 'X';
const ZERO = 'O';
const EMPTY = ' ';
let currentSymbol = ZERO;
let isEnd = false

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
            cell.addEventListener('click', () => cellClickHandler(i, j), {once: true});
            row.appendChild(cell);
        }
        container.appendChild(row);
    }
}

function cellClickHandler (row, col) {
    if (isEnd) return
    currentSymbol === CROSS ? currentSymbol = ZERO : currentSymbol = CROSS
    renderSymbolInCell(currentSymbol, row, col)
    checkEnd()
    console.log(`Clicked on cell: ${row}, ${col}`);


    /* Пользоваться методом для размещения символа в клетке так:
        renderSymbolInCell(ZERO, row, col);
     */
}

function checkEnd () {
    const field = document.getElementsByTagName('td')
    console.log(field)
    let combinations = [
        [0,1,2],
        [3,4,5],
        [6,7,8],
        [0,3,6],
        [1,4,7],
        [2,5,8],
        [0,4,8],
        [2,4,6]
    ]
    for (let i = 0; i < 8; i++) {
        if (
          field[[combinations[i][0]]].innerHTML === CROSS &&
          field[[combinations[i][1]]].innerHTML === CROSS &&
          field[[combinations[i][2]]].innerHTML === CROSS
        ) {
            field[[combinations[i][0]]].bgColor='red'
            field[[combinations[i][1]]].bgColor='red'
            field[[combinations[i][2]]].bgColor='red'
            alert('Победили крестики')
            isEnd = true
            return
        } else if (
          field[[combinations[i][0]]].innerHTML === ZERO &&
          field[[combinations[i][1]]].innerHTML === ZERO &&
          field[[combinations[i][2]]].innerHTML === ZERO
        ) {
            field[[combinations[i][0]]].bgColor='red'
            field[[combinations[i][1]]].bgColor='red'
            field[[combinations[i][2]]].bgColor='red'
            alert('Победили нолики')
            isEnd = true
            return
        }
    }
    for (let i = 0; i < 9; i++) {
        if (field[i].innerHTML === EMPTY) {
            return
        }
    }
    alert('Победила дружба')
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
    isEnd = false
    startGame()
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
