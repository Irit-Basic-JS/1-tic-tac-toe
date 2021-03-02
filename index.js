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

// const CROSS = 'X';
// const ZERO = 'O'; 
// const EMPTY = ' ';
// let symbolNumber = 1;
// let map;
// let dimension = 3;
// let gameOver;
// let count = 0;
// const container = document.getElementById('fieldWrapper');

// startGame();
// addResetListener();

// function startGame () {
//     dimension = prompt("Введите размер поля");
//     renderGrid();
//     count = 0;
// }

// function renderGrid () {
//     container.innerHTML = '';
//     map = new Map();
//     gameOver = false;
//     symbolNumber = 1;
//     for (let i = 0; i < dimension; i++) {
//         const row = document.createElement('tr');
//         for (let j = 0; j < dimension; j++) {
//             const cell = document.createElement('td');
//             cell.textContent = EMPTY;
//             cell.addEventListener('click', () => cellClickHandler(i, j));
//             row.appendChild(cell);
//         }
//         container.appendChild(row);
//     }
// }

// function cellClickHandler (row, col) {
//     if (!(map.has(`${row}${col}`) || gameOver)) {
//         symbolNumber = (symbolNumber + 1) % 2;
//         let symbol = symbolNumber === 0 ? CROSS : ZERO;
//         map.set(`${row}${col}`, symbol);
//         count++;
//         renderSymbolInCell(symbol, row, col);
//         gameOver = map.size === dimension ** 2;
        
//         if (checkWin(symbol, row, col)) {
//             alert(`${symbol} WIN`);
//             gameOver = true;
//         } else if (gameOver){
//             alert("Победила дружба");
//         }

//         console.log(`Clicked on cell: ${row}, ${col}`);
//         //cellClickHandler(getRandomInt(dimension - 1), getRandomInt(dimension - 1));
//         if (dimension * dimension / 2 <= count) {
//             enlargeMap();
//         }
//     }
// }

// function checkWin (symbol, row, col) {
//     for (let i = 0; i < dimension; i++) {
//         if (map.get(`${i}${col}`) !== symbol) break;
//         if (i === dimension - 1) {
//             for (let x = 0; x < dimension; x++) renderSymbolInCell(symbol, x, col, '#FF0000');
//             return true;
//         }
//     }
//     for (let j = 0; j < dimension; j++) {
//         if (map.get(`${row}${j}`) !== symbol) break;
//         if (j === dimension - 1) {
//             for (let x = 0; x < dimension; x++) renderSymbolInCell(symbol, row, x, '#FF0000');
//             return true;
//         }
//     }
//     for (let ij = 0; ij < dimension; ij++) {
//         if (map.get(`${ij}${ij}`) !== symbol) break;
//         if (ij === dimension - 1) {
//             for (let x = 0; x < dimension; x++) renderSymbolInCell(symbol, x, x, '#FF0000');
//             return true;
//         }
//     }
//     for (let ij = 0; ij < dimension; ij++) {
//         if (map.get(`${dimension - ij - 1}${ij}`) !== symbol) break;
//         if (ij === dimension - 1) {
//             for (let x = 0; x < dimension; x++) renderSymbolInCell(symbol, dimension - 1 - x, x, '#FF0000');
//             return true;
//         }
//     }
//     return false;
// }

// function renderSymbolInCell (symbol, row, col, color = '#000000') {
//     const targetCell = findCell(row, col);

//     targetCell.textContent = symbol;
//     targetCell.style.color = color;
// }

// function findCell (row, col) {
//     const targetRow = container.querySelectorAll('tr')[row];
//     return targetRow.querySelectorAll('td')[col];
// }

// function addResetListener () {
//     const resetButton = document.getElementById('reset');
//     resetButton.addEventListener('click', resetClickHandler);
// }

// function resetClickHandler () {
//     startGame();
//     console.log('reset!');
// }


// /* Test Function */
// /* Победа первого игрока */
// function testWin () {
//     clickOnCell(0, 2);
//     clickOnCell(0, 0);
//     clickOnCell(2, 0);
//     clickOnCell(1, 1);
//     clickOnCell(2, 2);
//     clickOnCell(1, 2);
//     clickOnCell(2, 1);
// }

// /* Ничья */
// function testDraw () {
//     clickOnCell(2, 0);
//     clickOnCell(1, 0);
//     clickOnCell(1, 1);
//     clickOnCell(0, 0);
//     clickOnCell(1, 2);
//     clickOnCell(1, 2);
//     clickOnCell(0, 2);
//     clickOnCell(0, 1);
//     clickOnCell(2, 1);
//     clickOnCell(2, 2);
// }

// function clickOnCell (row, col) {
//     findCell(row, col).click();
// }

// function enlargeMap() {
//     //for (let i = 0; i <= dimension; i++) {
//     //    map.set(`${i}${dimension}`, EMPTY);
//     //    map.set(`${dimension}${i}`, EMPTY);
//     //}
//     dimension++;

//     let n = 0;

//     for (const row of container.childNodes){
//         const cell = document.createElement('td');
//             cell.textContent = EMPTY;
//             cell.addEventListener('click', () => cellClickHandler(dimension, n));
//             row.appendChild(cell);
//             n++;
//     }

//     const row = document.createElement('tr');
//     for (let j = 0; j <= dimension; j++) {
//         const cell = document.createElement('td');
//         cell.textContent = EMPTY;
//         cell.addEventListener('click', () => cellClickHandler(dimension, j));
//         row.appendChild(cell);
//     }
//     container.appendChild(row);


//     // for (let i = 0; i < dimension; i++) {
//     //     const row = document.createElement('tr');
//     //     for (let j = 0; j < dimension; j++) {
//     //         const cell = document.createElement('td');
//     //         cell.textContent = EMPTY;
//     //         //cell.addEventListener('click', () => cellClickHandler(i, j));
//     //         row.appendChild(cell);
//     //     }
//     //     container.appendChild(row);
//     // }
// }

// function getRandomInt(max) {
//     return Math.floor(Math.random() * Math.floor(max));
//   }
