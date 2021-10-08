const CROSS = 'X';
const ZERO = 'O';
const EMPTY = ' ';
let countClick = 0;
let sizeArray = prompt("Введите размерность масссива", 3);
let winSymbolCross = CROSS.repeat(sizeArray);
let winSymbolZero = ZERO.repeat(sizeArray);

let isCross = true;  //для чередования
let win = false;
let arrayClick = [];
createArray(sizeArray);
let winLine = [];

const container = document.getElementById('fieldWrapper');

startGame();
addResetListener();

function startGame () {
    renderGrid(sizeArray);
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
    move(CROSS, row, col, sizeArray)
    console.log(`Clicked on cell: ${row}, ${col}`);


    /* Пользоваться методом для размещения символа в клетке так:
        renderSymbolInCell(ZERO, row, col);
     */
}


function move(symbol, row, col, sizeArray){
    if(arrayClick[col][row] === " " && !win){
        if (isCross){
            renderSymbolInCell(CROSS, row, col);
            addSimbolInArray(CROSS, row, col);
            isCross=false;
            checked(CROSS, arrayClick, sizeArray);
        }
        else{
            renderSymbolInCell(ZERO, row, col);
            addSimbolInArray(ZERO, row, col);
            isCross = true;
            checked(ZERO, arrayClick, sizeArray)
        }
    }
}


function createArray(sizeArray){
    for(let i = 0; i < sizeArray; i++){
        arrayClick[i] = []
    }
    for(let i = 0; i < sizeArray; i++){
        for(let j = 0; j < sizeArray; j++){
          arrayClick[i][j] = ' ';
        }
    }
}

function addSimbolInArray(symbol, row, col){
    arrayClick[col][row] = symbol;
}

function checked(symbol, arrayClick, sizeArray){
    countClick++;
    let diagonal = checkDiagonal(symbol, arrayClick, sizeArray);
    let lines = checkLines(symbol, arrayClick, sizeArray);
    
    if (diagonal || lines) {
        colorSymbolsWinLines(symbol, arrayClick, sizeArray)
        win = true; 
        alert(`Winning for ${symbol}`);
    }
    if(countClick === sizeArray**2 && win === false) alert('Победила дружба!');
}

function checkDiagonal(symbol, arrayClick, sizeArray){
    let toRight = true;
    let toLeft = true;
    for(let i=0; i<sizeArray; i++){
        toRight = toRight && (arrayClick[i][i] === symbol);
        toLeft = toLeft && (arrayClick[sizeArray-i-1][i] === symbol);
        
        if(toLeft && winLine.indexOf(i)===-1){
            winLine.push(i);
            if(winLine.length === 3) colorSymbolsWinDiag(symbol, winLine, direction = 'left', sizeArray);
        }

        if(toRight && winLine.indexOf(i)===-1){
            winLine.push(i);
            if(winLine.length === 3) colorSymbolsWinDiag(symbol, winLine, direction = 'right', sizeArray);
        }
    }
    if (toLeft || toRight) return true;
    return false;
}

function checkLines(symbol, arrayClick, sizeArray){
    for(let i=0; i<sizeArray; i++){
        cols = true;
        rows = true;
        for(let j=0; j<sizeArray; j++){
            cols = cols && (arrayClick[i][j] === symbol);
            rows = rows && (arrayClick[j][i] === symbol);
        }
        if(cols || rows) {return true}
    }
    return false;
}

//покрас победных значений в линиях в красный
function colorSymbolsWinLines(symbol, arrayClick, sizeArray){
    let testCol = [];
    let testRow = [];

    for(let s in arrayClick){
        testCol.push(arrayClick[s].join(''));
        let str ='';
        for(let j=0; j<sizeArray; j++){str += arrayClick[j][s]};
        testRow.push(str);
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
//покрас победных значений в диагоналях в красный
function colorSymbolsWinDiag(symbol, winLine, direction, sizeArray){
    for(let item in winLine){
        if (direction === 'left') renderSymbolInCell (symbol, sizeArray-item-1, item, color = '#f00');
        if (direction === 'right') renderSymbolInCell (symbol, item, item, color = '#f00');
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
    win = false;
    sizeArray = prompt("Введите размерность масссива", 3);
    startGame();
    createArray(sizeArray)
    for(i=0;i<sizeArray;i++)
        for(j=0;j<sizeArray;j++)
            renderSymbolInCell(EMPTY, i, j);
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
