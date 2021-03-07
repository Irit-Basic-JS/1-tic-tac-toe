const CROSS = 'X';
const ZERO = 'O';
const EMPTY = ' ';

const container = document.getElementById('fieldWrapper');
let DIMENSION;
let field = {
    map: [],
    nowTurn: CROSS,
    winLine: [],
    symCnt: 0,
    size: 3,

    makeMove(symbol, row, col) {
        this.map[row][col] = symbol;
        this.symCnt++;
    },

    checkRows() {
        for(let i = 0; i < this.size; i++) {
            let firstSymbol = this.map[i][0];
            if(firstSymbol === EMPTY) {
                continue;
            }
            if(this.map[i].every(sym => sym === firstSymbol)){
                for(let j = 0; j < this.size; j++) {
                    this.winLine.push([i, j]);
                }
                return firstSymbol;
            }
        }
    },

    checkColumns() {
        for(let j = 0; j < this.size; j++) {
            let firstSymbol = this.map[0][j];
            let i = 1;
            if(firstSymbol === EMPTY) {
                continue;
            }
            while(firstSymbol !== EMPTY && firstSymbol === this.map[i][j]) {
                if(i === this.size - 1) {
                    for(i = 0; i < this.size; i++) {
                        this.winLine.push([i, j]);
                    }
                    return firstSymbol;
                }
                i++;
            }
        }
    },

    checkDiagonals(){
        //Первая диагональ
        let firstValue = this.map[0][0];
        if (firstValue === EMPTY)
            return;
        let i = 1;
        let j =  1;
        while (firstValue === this.map[i][j] && i < this.size) {
            if (i === this.size - 1) {
                i = 0;
                for (j = 0; i < this.size; j++, i++) {
                    this.winLine.push([i, j]);
                }
                return firstValue;
            }
            j++;
            i++;
        }

        //Вторая диагональ
        firstValue = this.map[0][this.size - 1];
        if (firstValue === EMPTY)
            return;
        i = 1;
        j = this.size - 2;
        while (firstValue === this.map[i][j] && i < this.size) {
            if (i === this.size - 1) {
                i = 0;
                for (j = this.size - 1; i < this.size; j--, i++) {
                    this.winLine.push([i, j]);
                }
                return firstValue;
            }
            j--;
            i++;
        }
    },

    checkWinner() {
        return this.checkColumns() || this.checkRows() || this.checkDiagonals();
    },

    checkMap() {
        let flag = false;
        e: for(let i = 0; i < this.size; i++) {
            for(let j = 0; j < this.size; j++) {
                if(this.map[i][j] === EMPTY) {
                    flag = true;
                    break e;
                }
            }
        }
        return flag;
    },

    clearMap() {
        this.map = [];
        this.nowTurn = CROSS;
        this.winLine = [];
    },

    fillEmpty() {
        for (let i = 0; i < this.size; i++) {
            field.map.push([]);
            for (let j = 0; j < this.size; j++) {
                field.map[i].push(EMPTY);
            }
        }
    }
}

startGame();
addResetListener();

function startGame () {
    let size = prompt("Размер поля", 3);
    field.size = size;
    renderGrid(size);
    field.fillEmpty();
}

function renderGrid (dimension) {
    DIMENSION = Number(dimension);
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
    let winner = field.checkWinner();
    checkWinner(winner);
    if(!field.checkMap() && !winner) {
        alert('Победила дружба');
    }
    if(field.map[row][col] === EMPTY) {
        renderSymbolInCell(field.nowTurn, row, col);
        field.makeMove(field.nowTurn, row, col);
        field.nowTurn = field.nowTurn === CROSS ? ZERO : CROSS;
        console.log(`Clicked on cell: ${row}, ${col}`);
    }
    machineIntelligence();
    // Все, что смог :)
    if(field.symCnt >= DIMENSION * DIMENSION / 2) {
        renderGrid(DIMENSION + 2);
        let oldField = field.map;
        field.map = [];
        field.size += 2;
        field.symCnt = 0;
        field.fillEmpty();
        for (let i = 1; i < this.size - 1; i++) {
            for (let j = 1; j < this.size - 1; j++) {
                field.makeMove(oldField[i - 1][j - 1], i, j);
            }
        }
        for (let i = 0; i < this.size ; i++) {
            for (let j = 0; j < this.size; j++) {
                renderSymbolInCell(field.map[i][j], i, j);
            }
        }
        DIMENSION += 2;
        machineIntelligence();
    }
    winner = field.checkWinner();
    checkWinner(winner);
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
    field.clearMap();
    for(let i = 0; i < field.size; i++) {
        for(let j = 0; j < field.size; j++) {
            renderSymbolInCell(EMPTY, i, j);
        }
    }
    startGame();
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

function checkWinner(winner) {
    if(winner) {
        for (let i of field.winLine){
            renderSymbolInCell(winner, i[0], i[1], "red");
        }
        alert(`Победил ${winner}!`);
        return;
    }
}

function randomNumber(maxNumber) {
    return Math.floor(Math.random() * Math.floor(maxNumber));
}

function machineIntelligence() {
    let row = randomNumber(field.size);
    let col = randomNumber(field.size);
    if(field.map[row][col] === EMPTY) {
        field.makeMove(ZERO, row, col);
        renderSymbolInCell(ZERO, row, col);
        field.nowTurn = CROSS;
        return;
    }
    machineIntelligence();
}

// function expandField() {
//     container.innerHTML = '';

//     for (let i = 0; i < dimension + 2; i++) {
//         const row = document.createElement('tr');
//         for (let j = 0; j < dimension + 2; j++) {
//             const cell = document.createElement('td');
//             cell.textContent = EMPTY;
//             cell.addEventListener('click', () => cellClickHandler(i, j));
//             row.appendChild(cell);
//         }
//         container.appendChild(row);
//     }

// }