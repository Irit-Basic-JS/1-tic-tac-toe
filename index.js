const CROSS = 'X';
const ZERO = 'O';
const EMPTY = ' ';

let count = 0;
let isCross = true;
let map = [];
let winLine = [];
let winLineCol = [];
let winLineRow = [];
let win = false;

sizeArray = 3;
let winSymbolCross = CROSS.repeat(sizeArray);
let winSymbolZero = ZERO.repeat(sizeArray);

const container = document.getElementById('fieldWrapper');

startGame();
addResetListener();
createMap();

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
    move(row, col);
    console.log(`Clicked on cell: ${row}, ${col}`);
}

function move(row, col){
    if(map[col][row] === " " && !win){
        if (isCross){
            renderSymbolInCell(CROSS, row, col);
            addSymbolInMap(CROSS, row, col);
            isCross=false;
            checked(CROSS, map);
        }
        else{
            renderSymbolInCell(ZERO, row, col);
            addSymbolInMap(ZERO, row, col);
            isCross = true;
            checked(ZERO, map)
        }
    }
}

function createMap(sizeArray = 3){
    for(let i = 0; i < sizeArray; i++){
        map[i] = []
    }
    for(let i = 0; i < sizeArray; i++){
        for(let j = 0; j < sizeArray; j++){
          map[i][j] = ' ';
        }
    }
}

function addSymbolInMap(symbol, row, col){
    map[col][row] = symbol;
}

function checked(symbol, map, sizeArray=3){
    count++;
    let diagonal = checkDiagonal(symbol, map, sizeArray = 3);
    let lines = checkLines(symbol, map, sizeArray = 3);
    if (diagonal || lines) {
        colorSymbolsWinLines(symbol, map, sizeArray=3)
        win = true; 
        alert(`Winning for ${symbol}`);
    }
    if(count === sizeArray**2 && win === false) alert('Победила дружба!');
}

function checkDiagonal(symbol, map, sizeArray=3){
    let toRight = true;
    let toLeft = true;
    for(let i=0; i<sizeArray; i++){
        toRight = toRight && (map[i][i] === symbol);
        toLeft = toLeft && (map[sizeArray-i-1][i] === symbol);

        if(toLeft && winLine.indexOf(i)===-1){
            winLine.push(i);
            if(winLine.length === 3) colorSymbolsWinDiag(symbol, winLine, direction = 'left');
        }

        if(toRight && winLine.indexOf(i)===-1){
            winLine.push(i);
            if(winLine.length === 3) colorSymbolsWinDiag(symbol, winLine, direction = 'left');
        }
    }
    if (toLeft || toRight) 
        return true;
    return false;
}

function checkLines(symbol, map, sizeArray=3){
    let cols = true;
    let rows = true;
    for(let i = 0; i < sizeArray; i++){
        cols = true;
        rows = true;
        for(let j = 0; j < sizeArray; j++){
            cols = cols && (map[i][j] === symbol);
            rows = rows && (map[j][i] === symbol);
        }
        if(cols || rows) 
            return true;
    }

    return false;
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
    for(i=0;i<sizeArray;i++)
        for(j=0;j<sizeArray;j++)
            renderSymbolInCell(EMPTY, i, j);
}

function colorSymbolsWin(symbol, winLine, direction, sizeArray=3){
    for(let item in winLine){
        if (direction === 'left') renderSymbolInCell (symbol, sizeArray-item-1, item, color = '#FF0000');
        if (direction === 'right') renderSymbolInCell (symbol, item, item, color = '#FF0000');
        if (direction === 'col') renderSymbolInCell (symbol, 0, item, color = '#FF0000');
        if (direction === 'row') renderSymbolInCell (symbol, 3-item-1, item, color = '#FF0000');
    }
}

function colorSymbolsWinLines(symbol, map, sizeArray=3){
    let testCol = [];
    let testRow = [];

    for(let s in map){
        testCol.push(map[s].join(''))
        let str =''
        for(let j=0; j<sizeArray; j++){
            str += map[j][s]
        }
        testRow.push(str)
    }

    if(testRow.indexOf(winSymbolCross) !== -1) {
        for(let i=0; i<sizeArray; i++) renderSymbolInCell (symbol, testRow.indexOf(winSymbolCross), i, color = '#f00');
    }
    if(testRow.indexOf(winSymbolZero) !== -1) {
        for(let i=0; i<sizeArray; i++) renderSymbolInCell (symbol, testRow.indexOf(winSymbolZero), i, color = '#f00');
    }
    if(testCol.indexOf(winSymbolCross) !== -1){
        for(let i=0; i<sizeArray; i++) renderSymbolInCell (symbol, i, testCol.indexOf(winSymbolCross), color = '#f00');
    }
    if(testCol.indexOf(winSymbolZero) !== -1){
        for(let i=0; i<sizeArray; i++) renderSymbolInCell (symbol, i, testCol.indexOf(winSymbolZero), color = '#f00');
    }

}

function colorSymbolsWinDiag(symbol, winLine, direction, sizeArray=3){
    for(let item in winLine){
        if (direction === 'left') renderSymbolInCell (symbol, sizeArray-item-1, item, color = '#f00');
        if (direction === 'right') renderSymbolInCell (symbol, item, item, color = '#f00');
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
