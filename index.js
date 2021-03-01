const CROSS = 'X';
const ZERO = 'O';
const EMPTY = ' ';

const container = document.getElementById('fieldWrapper');

class Field {
    arr = [];
    gameEnded = false;
    whoWon = 0;
    markCount = 0;

    constructor(){
        for (let i = 0; i < 3; i++) {
            this.arr[i] = [];
            for (let j = 0; j < 3; j++)
                this.arr[i][j] = EMPTY;
        }
    }

    add(mark, i, j){
        this.arr[i][j] = mark;
        this.markCount++;
        if (this.checkWin(mark)){
            this.gameEnded = true;
            if (mark === CROSS){
                this.whoWon = 1;
            }
            else {
                this.whoWon = 2;
            }
            return;
        }
        if (this.markCount === 9){
            this.gameEnded = true;
        }
    }

    checkWin(mark){
        if (this.arr[0].every(e => e === mark) 
        || this.arr[1].every(e => e === mark)
        || this.arr[2].every(e => e === mark)){
            return true;
        }
            
        for (let i = 0; i < 3; i++){
            let win = true;
            for (let j = 0; j < 3; j++){
                if (this.arr[j][i] !== mark){
                    win = false;
                    break;
                }
            }
            if (win){
                return true;
            }
        }

        return ((this.arr[0][0] === mark
            && this.arr[1][1] === mark
            && this.arr[2][2] === mark)
            || (this.arr[2][0] === mark
                && this.arr[1][1] === mark
                && this.arr[0][2] === mark));
    }
}

let field = new Field();
let isCross = true;
startGame();
addResetListener();

function startGame () {
    field = new Field();
    isCross = true;
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
    if (field.gameEnded){
        return;
    }

    

    if (findCell(row, col).textContent === EMPTY){
        if (isCross){
            renderSymbolInCell(CROSS, row, col);
            field.add(CROSS, row, col);
        }
        else {
            renderSymbolInCell(ZERO, row, col);
            field.add(ZERO, row, col);
        }
        isCross = !isCross;
    }
    console.log(`Clicked on cell: ${row}, ${col}`);

    if (field.gameEnded){
        findCell(row, col).style.color = "red";
        if (field.whoWon === 1){
            alert("CROSS");
        }
        else if (field.whoWon === 2){
            alert("ZERO");
        }
        else {
            alert("Победила дружба");
        }
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
