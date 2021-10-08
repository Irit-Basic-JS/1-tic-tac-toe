const CROSS = 'X';
const ZERO = 'O';
const EMPTY = ' ';
let field = [
    [null,null,null],
    [null,null,null],
    [null,null,null]
];
let move = 0; 
let isWin = false;

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
    if (!isWin) {
        if (field[row][col] === null) {
        move % 2 === 0 ? (renderSymbolInCell(CROSS, row, col), field[row][col] = CROSS) : (renderSymbolInCell(ZERO, row, col), field[row][col] = ZERO);
        move++;;
        }

        checkWinner();

        if (move == 9 && !isWin) {
            alert('Победила дружба');
        }
    }
    
    //console.log(field);
    console.log(`Clicked on cell: ${row}, ${col}`);
}

function checkWinner () {
    for (let i = 0; i <= 3; i = i + 2) {
        if (field[0][i] == field[1][1] && field[1][1] == field[2][2-i] && field[0][i] != null) {
            renderSymbolInCell(field[i][0], 0, i, 'rgb(240, 17, 17)');
            renderSymbolInCell(field[i][0], 1, 1, 'rgb(240, 17, 17)');
            renderSymbolInCell(field[i][0], 2, 2-i, 'rgb(240, 17, 17)');
            isWin = true;
            alert(`Выиграл игрок использующий ${field[0][i]}`);
            
        }
    }

    for (let i = 0; i < 3; i++) {
        if (field[i][0] == field[i][1] && field[i][1] == field[i][2] && field[i][0] != null) {
            renderSymbolInCell(field[i][0], i, 0, 'rgb(240, 17, 17)');
            renderSymbolInCell(field[i][0], i, 1, 'rgb(240, 17, 17)');
            renderSymbolInCell(field[i][0], i, 2, 'rgb(240, 17, 17)');
            isWin = true;
            alert(`Выиграл игрок использующий ${field[i][0]}`);
        }

        if (field[0][i] == field[1][i] && field[1][i] == field[2][i] && field[0][i] != null) {
            renderSymbolInCell(field[1][i], 0, i, 'rgb(240, 17, 17)');
            renderSymbolInCell(field[1][i], 1, i, 'rgb(240, 17, 17)');
            renderSymbolInCell(field[1][i], 2, i, 'rgb(240, 17, 17)');
            isWin = true;
            alert(`Выиграл игрок использующий ${field[1][i]}`);
        }
    }
}

function renderSymbolInCell (symbol, row, col, color = 'rgb(255, 252, 57)') {
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
    startGame(3);
    move = 0;
    isWin = false;
    field = [
        [null,null,null],
        [null,null,null],
        [null,null,null]
    ];
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

