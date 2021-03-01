const CROSS = 'X';
const ZERO = 'O';
const EMPTY = ' ';
const RED = '#ff0000';

let winner = false;

let field = [[EMPTY, EMPTY, EMPTY], [EMPTY, EMPTY, EMPTY], [EMPTY, EMPTY, EMPTY]];

let curSymbol = CROSS;

let countTurn = 0;

let symbol;

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
    if(!winner && field[row][col] === EMPTY && curSymbol === CROSS){
            renderSymbolInCell(CROSS, row, col);
            field[row][col] = CROSS;
            curSymbol = ZERO;
            countTurn += 1;
    }
    else if(!winner && field[row][col] === EMPTY && curSymbol === ZERO){
            renderSymbolInCell(ZERO, row, col);
            field[row][col] = ZERO;
            curSymbol = CROSS;
            countTurn += 1;
    }   
    if (countTurn === 9){
      findWinner();
        endGame();  
    }
    
}

function findWinner(){
    
        symbol = field[0][0];
        if(field[0][0] === symbol && field[0][1] === symbol && field[0][2] === symbol){
            renderSymbolInCell (symbol, 0, 0, RED);
            renderSymbolInCell (symbol, 0, 1, RED);
            renderSymbolInCell (symbol, 0, 2, RED);
            winner = true;
            return symbol;
        };
        symbol = field[1][0];
        if(field[1][0] === symbol && field[1][1] === symbol && field[1][2] === symbol){
            renderSymbolInCell (symbol, 1, 0, RED);
            renderSymbolInCell (symbol, 1, 1, RED);
            renderSymbolInCell (symbol, 1, 2, RED);
            return symbol;
        };
        symbol = field[2][0];
        if(field[2][0] === symbol && field[2][1] === symbol && field[2][2] === symbol ){
            renderSymbolInCell (symbol, 2, 0, RED);
            renderSymbolInCell (symbol, 2, 1, RED);
            renderSymbolInCell (symbol, 2, 2, RED);
            return symbol;
        };
        symbol = field[0][0];
        if(field[0][0] === symbol && field[1][0] === symbol && field[2][0] === symbol){
            renderSymbolInCell (symbol, 0, 0, RED);
            renderSymbolInCell (symbol, 2, 0, RED);
            renderSymbolInCell (symbol, 1, 0, RED);
            return symbol;
        };
        symbol = field[0][1];
        if(field[0][1] === symbol && field[1][1] === symbol && field[2][1] === symbol){
            renderSymbolInCell (symbol, 0, 1, RED);
            renderSymbolInCell (symbol, 1, 1, RED);
            renderSymbolInCell (symbol, 2, 1, RED);
            return symbol;
        };
        symbol = field[0][2];
        if(field[0][2] === symbol && field[1][2] === symbol && field[2][2] === symbol){
            renderSymbolInCell (symbol, 0, 2, RED);
            renderSymbolInCell (symbol, 1, 2, RED);
            renderSymbolInCell (symbol, 2, 2, RED);
            return symbol;
        };
        symbol = field[0][0];
        if(field[0][0] === symbol && field[1][1] === symbol && field[2][2] === symbol){
            renderSymbolInCell (symbol, 0, 0, RED);
            renderSymbolInCell (symbol, 1, 1, RED);
            renderSymbolInCell (symbol, 2, 2, RED);
            return symbol;
        };
        symbol = field[2][0];
        if(field[2][0] === symbol && field[1][1] === symbol && field[0][2] === symbol){
            renderSymbolInCell (symbol, 2, 0, RED);
            renderSymbolInCell (symbol, 1, 1, RED);
            renderSymbolInCell (symbol, 0, 2, RED);
            return symbol;
        };
        if(countTurn === 9){
            symbol = undefined;
        };
}

function endGame(){
    winner = true;
    if (symbol === CROSS){
        alert('Победили крестики');
    }
    else if (symbol === ZERO){
        alert('Победили нолики');
    }
    else{
        alert('Ничья');
    }
}

    /* Пользоваться методом для размещения символа в клетке так:
        renderSymbolInCell(ZERO, row, col);
     */


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

    field = [[EMPTY, EMPTY, EMPTY], [EMPTY, EMPTY, EMPTY], [EMPTY, EMPTY, EMPTY]];
    winner = false;
    curSymbol = CROSS;
    countTurn = 0;
    for (let i = 0; i < field.length; i++){
        for(let j = 0; j < field.length; j++){
            renderSymbolInCell(EMPTY, i, j);
        }
    }

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
