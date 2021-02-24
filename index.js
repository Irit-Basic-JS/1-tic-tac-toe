const CROSS = 'X';
const ZERO = 'O';
const EMPTY = ' ';

const container = document.getElementById('fieldWrapper');

let field = {
    map: [[' ', ' ', ' '],[' ', ' ', ' '],[' ', ' ', ' ']],
    isCross: true,
    changeValue(row, col) {
        if (this.map[row][col] === " ") {
            if (this.isCross) {
                this.map[row][col] = CROSS;
                this.isCross = false;
            } else {
                this.map[row][col] = ZERO;
                this.isCross = true;
            }
        }
    },
    clearField() {
        for (let row = 0; row < 3; row++){
            for (let col = 0; col < 3; col++){
                this.map[row][col] = EMPTY;
            }
        }

        this.isCross = true;
    },

    getWinner() {
        if (this.map[0][0] === CROSS && this.map[0][0] === this.map[0][1] &&  this.map[0][1] === this.map[0][2] ||
            this.map[0][0] === CROSS && this.map[0][0] === this.map[1][1] &&  this.map[1][1] === this.map[2][2] ||
            this.map[0][0] === CROSS && this.map[0][0] === this.map[0][1] && this.map[0][1] === this.map[0][2] ||
            this.map[0][1] === CROSS && this.map[0][1] === this.map[1][1] && this.map[1][1] === this.map[2][1] ||
            this.map[0][2] === CROSS && this.map[0][2] === this.map[1][1] && this.map[1][1] === this.map[2][0] ||
            this.map[0][2] === CROSS && this.map[0][2] === this.map[1][2] && this.map[1][2] === this.map[2][2] ||
            this.map[1][0] === CROSS && this.map[1][0] === this.map[1][1] && this.map[1][1] === this.map[1][2] ||
            this.map[2][0] === CROSS && this.map[2][0] === this.map[2][1] && this.map[2][1] === this.map[2][2])
            return CROSS;
        else if (this.map[0][0] === ZERO && this.map[0][0] === this.map[0][1] &&  this.map[0][1] === this.map[0][2] ||
            this.map[0][0] === ZERO && this.map[0][0] === this.map[1][1] &&  this.map[1][1] === this.map[2][2] ||
            this.map[0][0] === ZERO && this.map[0][0] === this.map[0][1] && this.map[0][1] === this.map[0][2] ||
            this.map[0][1] === ZERO && this.map[0][1] === this.map[1][1] && this.map[1][1] === this.map[2][1] ||
            this.map[0][2] === ZERO && this.map[0][2] === this.map[1][1] && this.map[1][1] === this.map[2][0] ||
            this.map[0][2] === ZERO && this.map[0][2] === this.map[1][2] && this.map[1][2] === this.map[2][2] ||
            this.map[1][0] === ZERO && this.map[1][0] === this.map[1][1] && this.map[1][1] === this.map[1][2] ||
            this.map[2][0] === ZERO && this.map[2][0] === this.map[2][1] && this.map[2][1] === this.map[2][2])
            return ZERO;
        else{
            for (let i of this.map){
                for (let j of i){
                    if (j === EMPTY)
                        return undefined;
                }
            }

            return "Ничья";
        }
    }
};

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
    // Пиши код тут
    let winner = field.getWinner();
    if (winner) {
        alert(winner);
        if (winner !== "Ничья") {
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    if (field.map[i][j] === winner)
                        renderSymbolInCell(winner, i, j, "#db0606");
                }
            }
        }

        return;
    }

    console.log(`Clicked on cell: ${row}, ${col}`);
    field.changeValue(row,col);
    renderSymbolInCell(field.map[row][col], row, col);
    /* Пользоваться методом для размещения символа в клетке так:
        renderSymbolInCell(ZERO, row, col);
     */
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
    field.clearField();

    for (let row = 0; row < 3; row++){
        for (let col = 0; col < 3; col++){
            renderSymbolInCell(field.map[row][col], row, col);
        }
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
