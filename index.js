const CROSS = 'X';
const ZERO = 'O';
const EMPTY = ' ';

const container = document.getElementById('fieldWrapper');

startGame();
addResetListener();
var field;
var amount;
let count=0;

function startGame () {
    let size = prompt('Задай размер поля:');
    amount = Number(size);
    renderGrid(size);
    renderField(amount);
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

// function increaseGrid (amount, bufer) {
//     renderGrid(amount);
//     renderField(amount)
//     // field = new Array();
//     for (let i=0; i<size-1; i++) {
//         // field[i] = new Array();
//         for (let j=0; j<size-1; j++) {
//             renderSymbolInCell(CROSS,i,j);
//             field[i][j] = bufer[i+1][j+1];
//         }
//     }  
// }

function renderField(size) {
    field = new Array();
    for (let i=0; i<size; i++) {
        field[i] = new Array();
        for (let j=0; j<size; j++) {
            field[i][j] = EMPTY;
        }
    }
}

function cellClickHandler (row, col) {
    let symbol = (count%2 == 0) ? CROSS: ZERO;
    
    if (field[row][col] === EMPTY && !hadWinner()) {
        renderSymbolInCell(symbol, row, col); 
        field[row][col] = symbol;
        ++count;  
        if (!hadWinner() && count != amount*amount) {
            moveZero();
            ++count;
            symbol = ZERO;
        }                            
        if (hadWinner()) {
            setTimeout(() => {
                alert(`${symbol} победил!`)
            }, 450);
        }         
        if (count == amount*amount && !hadWinner()) {           
            setTimeout(() => {
                alert ('Победила дружба ^__^');
            }, 450);
        } 
       
    }
    // if (count > amount*amount/2) {
    //     let bufer = field;
    //     increaseGrid(amount+2, bufer); 
    //     amount++;    
    // }
    console.log(`Clicked on cell: ${row}, ${col}`);
}

function randomize() {
    return Math.floor(Math.random() * amount);
} 

function moveZero() {
    if (!checkWin()) {
        let x = randomize();
        let y = randomize();
        if (field[x][y] === EMPTY) {
            renderSymbolInCell(ZERO, x, y);
            field[x][y] = ZERO;   
        }  
        else moveZero();
    }                                
}

function checkWin() {
    for (let i =0; i<amount; i++) {
        for (let j=0; j<amount; j++) {
            if (field[i][j] == EMPTY) {
                field[i][j] = ZERO;
                if (hadWinner()) {
                    renderSymbolInCell(ZERO, i, j);
                    return true;
                }
                else field[i][j] = EMPTY;
            }
        }
    } return false;
}

function hadWinner(){
    for (let i =0; i<amount; i++) {
        if (haveHorizontal(i, amount)) { 
            paintWay ='horizontal';
            doPaint(paintWay, field[i][0] == CROSS ? CROSS: ZERO, amount, i);
            return true;
        }

        if (haveVertical(i, amount)) { 
            paintWay ='vertical';
            doPaint(paintWay, field[0][i] == CROSS ? CROSS: ZERO, amount, i);
            return true;
        }
    }
    if (haveDiagonal(amount)) { 
        paintWay ='diagonal';
        doPaint(paintWay, field[0][0] == CROSS ? CROSS: ZERO, amount); 
        return true;
    }
    if (haveReverseDiagonal(amount)) {
        paintWay ='reverseDiagonal';
        doPaint(paintWay, field[0][amount-1] == CROSS ? CROSS: ZERO, amount); 
        return true;
    }
    return false;
}

let paintWay;
function doPaint(theWay,symbol, amount, i) {
    switch(theWay) {
        case 'horizontal':
            for (let j=0; j<amount; j++) {
                renderSymbolInCell(symbol, i, j, '#b81868');
            } break;
        case 'vertical':
            for (let j=0; j<amount; j++) {
                renderSymbolInCell(symbol, j, i, '#b81868');
            } break;          
        case 'diagonal':
            for (let j=0; j<amount; j++) {
                renderSymbolInCell(symbol, j, j, '#b81868');
            } break;
        case 'reverseDiagonal':
            for (let j=0; j<amount; j++) {
                renderSymbolInCell(symbol, j, amount-1-j, '#b81868');
            } break;
    }
}

function haveHorizontal(i, amount) {
    for (let j=0; j<amount-1; j++) {
        if (field[i][j] === CROSS && field[i][j+1] === CROSS ||
            field[i][j] === ZERO && field[i][j+1] === ZERO) {
                if (j+1 == amount-1) return true;        
        } 
        else return false;        
    }
}
function haveVertical(i, amount) {
    for (let j=0; j<amount-1; j++) {
        if (field[j][i] === CROSS && field[j+1][i] === CROSS ||
            field[j][i] === ZERO && field[j+1][i] === ZERO) {
                if (j+1 == amount-1) return true;                
        } 
        else return false;        
    }
}

function haveDiagonal(amount) {
    for (let i=0; i<amount-1; i++) {
            if (field[i][i] === CROSS && field[i+1][i+1] === CROSS ||
                field[i][i] === ZERO && field[i+1][i+1] === ZERO) {
                    if (i+1 == amount-1) return true;
            } else return false;
    } return false;  
}

function haveReverseDiagonal(amount) {
    for (let i=0; i<amount-1; i++) {
            if (field[i][amount-1-i] === CROSS && field[i+1][amount-2-i] === CROSS ||
                field[i][amount-1-i] === ZERO && field[i+1][amount-2-i] === ZERO) {
                    if (amount-2-i == 0) return true;                
            } else return false;
    } return false;   
}

function renderSymbolInCell (symbol, row, col, color = '#82a300  ') {
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
    for (let i =0; i<amount; i++)
    for (let j=0; j<amount; j++) {
        renderSymbolInCell(EMPTY,i,j);
        field[i][j] = EMPTY;
        count=0;
    }
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
