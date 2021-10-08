const CROSS = 'X';
const ZERO = 'O';
const EMPTY = ' ';
let countClick = 0; 

let isCross = true;  //для чередования
let arrayClick = []
createArray();
let winLine = []
let winLineCol = []
let winLineRow = []




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
    // Пиши код тут
    
    move(CROSS, row, col)

    console.log(`Clicked on cell: ${row}, ${col}`);


    /* Пользоваться методом для размещения символа в клетке так:
        renderSymbolInCell(ZERO, row, col);
     */
}


function move(symbol, row, col){
    if(arrayClick[col][row] === " "){
        if (isCross){
            renderSymbolInCell(CROSS, row, col);
            addSimbolInArray(CROSS, row, col);
            isCross=false;
            checked(CROSS, arrayClick);
        }
        else{
            renderSymbolInCell(ZERO, row, col);
            addSimbolInArray(ZERO, row, col);
            isCross = true;
            checked(ZERO, arrayClick)
        }
    }
}


function createArray(sizeArray = 3){
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

function checked(symbol, arrayClick, sizeArray=3){
    countClick++;
    let diagonal = checkDiagonal(symbol, arrayClick, sizeArray=3);
    let lines = checkLanes(symbol, arrayClick, sizeArray=3);
    
    if (diagonal || lines) alert(`Winning for ${symbol}`);
    if(countClick === sizeArray**2) alert('Победила дружба!');
}

function checkDiagonal(symbol, arrayClick, sizeArray=3){
    let toRight = true;
    let toLeft = true;
    for(let i=0; i<sizeArray; i++){
        toRight = toRight && (arrayClick[i][i] === symbol);
        toLeft = toLeft && (arrayClick[sizeArray-i-1][i] === symbol);
        
        if(toLeft && winLine.indexOf(i)===-1){
            winLine.push(i);
            if(winLine.length === 3) colorSymbolsWin(symbol, winLine, direction = 'left');
        }

        if(toRight && winLine.indexOf(i)===-1){
            winLine.push(i);
            if(winLine.length === 3) colorSymbolsWin(symbol, winLine, direction = 'right');
        }
    }
    if (toLeft || toRight) return true;
    return false;
}

function checkLanes(symbol, arrayClick, sizeArray=3){
    for(let i=0; i<sizeArray; i++){
        cols = true;
        rows = true;
        for(let j=0; j<sizeArray; j++){
            cols = cols && (arrayClick[i][j] === symbol);
            rows = rows && (arrayClick[j][i] === symbol);
            if(cols && winLine.indexOf(i + ' ' + j) ===-1){
                winLineCol.push(i + ' ' + j);
                //console.log(winLineCol);
                //colorSymbolsWin(symbol, winLine, direction = 'col');
            }

            if(rows && winLineRow.indexOf(j + ' ' + i) ===-1 && ){
                winLineRow.push(j + ' ' + i);
                console.log(winLineRow);
                //colorSymbolsWin(symbol, winLine, direction = 'col');
            }
        }
        
        if(cols || rows) {return true}
    }

    return false;
}

function colorSymbolsWin(symbol, winLine, direction, sizeArray=3){
    for(let item in winLine){
        if (direction === 'left') renderSymbolInCell (symbol, sizeArray-item-1, item, color = '#FF0000');
        if (direction === 'right') renderSymbolInCell (symbol, item, item, color = '#FF0000');
        if (direction === 'col') renderSymbolInCell (symbol, 0, item, color = '#FF0000');
        if (direction === 'row') renderSymbolInCell (symbol, 3-item-1, item, color = '#FF0000');
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
