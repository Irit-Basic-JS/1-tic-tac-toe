"use strict";


const CROSS = 'X';
const ZERO = 'O';
const EMPTY = ' ';

const container = document.getElementById('fieldWrapper');

startGame();
addResetListener();

function startGame () {
    renderGrid(3);
}

function renderGrid (dimension) {
    container.innerHTML = '';
    //size = dimension;
    for (let i = 0; i < dimension; i++) {
        const row = document.createElement('tr');
        for (let j = 0; j < dimension; j++) {
            const cell = document.createElement('td');
            cell.textContent = EMPTY;
            cell.addEventListener('click', () => cellClickHandler(i, j, dimension));
            row.appendChild(cell);
        }
        container.appendChild(row);
    }
}

let i = 0;
let clickedCells = [];
let clickedCellsCross = [];
let clickedCellsZero = [];
let size = 0;

const gameData = {
    isWin : false,
    methods : 
    {
        checkWinner(clickedCellsCross, clickedCellsZero) 
        {
            // if (gameData.methods.getAllWinsArr(3).includes(clickedCellsCross) || gameData.methods.getAllWinsArr(3).includes(clickedCellsZero)) 
            var allWinsArr = gameData.methods.getAllWinsArr(3);
            allWinsArr.forEach(item => {
                if (item.toString() == clickedCellsCross.toString()) {
                    alert("WINNER X");
                    gameData.methods.paintCells("X", clickedCellsCross);
                    this.isWin = true;
                }
                if (item.toString() == clickedCellsZero.toString()) {
                    alert("WINNER 0");
                    gameData.methods.paintCells("0", clickedCellsZero);
                    this.isWin = true;
                }
            });
        },

        getAllWinsArr(size) 
        {
            let e = [];
            for (let i = 0; i < size; i++) 
            {
                let s = [], 
                    h = [];
                for (let e = 0; e < size; e++)
                    s.push([i, e]),
                    h.push([e, i]);
                e.push(s);
                e.push(h);
            }
            let tempArr = [];
            for (let i = 0; i < size; i++) {
                tempArr.push([i,i]);
            }
            e.push(tempArr);
            tempArr = [];
            for (let i = size - 1; i >= 0; i--) {
                tempArr.push([size - i - 1, i]);
            }
            e.push(tempArr);
            //console.log(e);
            return e;
        },

        getNumbersBefore(number) {
            let numbersArr = [];
            for (let i = 0; i < number; i++) {
                numbersArr.push(i);
            }
            console.log(numbersArr);
        },

        paintCells(symbol, clickedCells) {
            clickedCells.forEach( item => {
                renderSymbolInCell(symbol, item[0], item[1], "#FF0000");
            });
        }
    }
};

function cellClickHandler (row, col, size) {  
    if (!clickedCells.includes(`${row} ${col}`) && !gameData.isWin) {
        if (i % 2 == 0) {
            renderSymbolInCell(CROSS, row, col, "#333"); // X
            clickedCellsCross.push([row, col]);
        }
        else {
            renderSymbolInCell(ZERO, row, col, "#333"); // 0
            clickedCellsZero.push([row, col]);
        }
        i++; 
        clickedCells.push(`${row} ${col}`);
        console.log(`Clicked on cell: ${row}, ${col}`);
        if ((clickedCellsZero.length + clickedCellsCross.length) == size * size) 
            alert("Победила дружба");
    }
    gameData.methods.checkWinner(clickedCellsCross, clickedCellsZero);
}



function renderSymbolInCell (symbol, row, col, color) {
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
    renderGrid(3);
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