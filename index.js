const CROSS = 'X';
const ZERO = 'O';
const EMPTY = ' ';

const container = document.getElementById('fieldWrapper');

let fieldArr = [];
let gameOver = false;
let sizeField = 3;


let inputSize = document.querySelector('.input-size');
let buttonSize = document.querySelector('.input-button');

buttonSize.addEventListener('click', () => {
    sizeField = inputSize.value;
    startGame();
    addResetListener();
    resetClickHandler();
})

startGame();
addResetListener();

function startGame () {
    renderGrid(sizeField);
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
    
    createDataArr();
}

function createDataArr() {
    fieldArr = [];
    let rows = container.getElementsByTagName('tr');
    for(let i = 0; i < rows.length; i++) {
        let col = rows[i].getElementsByTagName('td');
        let temporary = [];
        for(let j = 0; j < rows.length; j++) {
            temporary.push(col[j]);
        }
        fieldArr.push(temporary);
    }
}

let lastMove = EMPTY;
let move = 1;

function cellClickHandler(row, col) {
    if(gameOver || findCell(row, col).textContent != EMPTY) 
        return;

    console.log(`Clicked on cell: ${row}, ${col}`);    

    if(lastMove == CROSS) {
        renderSymbolInCell(ZERO, row, col);
        fieldArr[row][col].textContent = ZERO;
    } else {
        renderSymbolInCell(CROSS, row, col);
        fieldArr[row][col].textContent = CROSS;
    }
    lastMove = lastMove == CROSS ? ZERO : CROSS;

    findWinner();
    if(!gameOver){
        checkMove();
    }

    if(lastMove == CROSS) {        
        setTimeout(() => {
            botRandom();    
        }, 30);        
    }
}

function botRandom() {

    let interval = setInterval(() => {
        let row = Math.floor(Math.random() * sizeField);
        let col = Math.floor(Math.random() * sizeField);

        if(findCell(row, col).textContent == EMPTY) {
            cellClickHandler(row, col);
            clearInterval(interval);
        }
    }, 10);
}

function findWinner() {
    let winner = "";

    let resRows = '';
    let resColumns = '';
    let resDiagonalRigth = '';
    let resDiagonalLeft = '';
    let resDataRows = [];
    let resDataColumns = [];
    let resDataDiagonalRigth = [];
    let resDataDiagonalLeft = [];

    for(let i = 0; i < fieldArr.length; i++) {
        resRows = '';
        resColumns = '';
        resDataRows = [];
        resDataColumns = [];

        resDiagonalRigth += fieldArr[i][i].textContent;
        resDataDiagonalRigth.push(fieldArr[i][i]);

        resDiagonalLeft += fieldArr[fieldArr.length - 1 - i][i].textContent;
        resDataDiagonalLeft.push(fieldArr[fieldArr.length - 1 - i][i]);

        for(let j = 0; j < fieldArr.length; j++) {
            resRows += fieldArr[i][j].textContent;
            resDataRows.push(fieldArr[i][j]);

            resColumns += fieldArr[j][i].textContent;
            resDataColumns.push(fieldArr[j][i]);
        }

        winner = chooseWinner(resRows);
        if(winner == '') {
            winner = chooseWinner(resColumns);
            if(winner != '') {
                writeWinner(winner, resDataColumns);
                return;
            } else {
                winner = chooseWinner(resDiagonalRigth);
                if(winner != '') {
                    writeWinner(winner, resDataDiagonalRigth);
                    return;
                } else {
                    winner = chooseWinner(resDiagonalLeft);
                    if(winner != '') {
                        writeWinner(winner, resDataDiagonalLeft);
                        return;
                    }
                }
            }
        } else {
            writeWinner(winner, resDataRows);
            return;
        }
    }
}

function writeWinner(winner, resData) {
    for(let e of resData) {
        e.style.color = '#f00';
    }
    setTimeout(() => {
        alert(`Победил ${winner}`);    
    }, 10);
    gameOver = true;
}

function chooseWinner(name) {
    let winner = '';
    if(name == CROSS.repeat(sizeField)) {
        winner = CROSS;            
    }
    else if(name == ZERO.repeat(sizeField)) {
        winner = ZERO;
    }
    return winner;
}

function checkMove() {
    for(let i = 0; i < fieldArr.length; i++) {
        for(let j = 0; j < fieldArr.length; j++) {
            if(fieldArr[i][j].textContent == EMPTY) {
                return;
            }
        }
    }

    setTimeout(() => {
        alert('Победила дружба');
        gameOver = true;   
    }, 10);
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
    let rows = container.querySelectorAll('tr');
    for(let elementRow of rows)
        for(let cell of elementRow.getElementsByTagName('td')){
            cell.textContent = EMPTY;
        }
    gameOver = false;
    lastMove = EMPTY;
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
