const CROSS = 'X';
const ZERO = 'O';
const EMPTY = ' ';
let countClick = 0; 

let isCross = true;  //для чередования
let arrayClick = []
createArray();


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


function move(simbol, row, col){
    if(arrayClick[col][row] === " "){
        if (isCross){
            renderSymbolInCell(CROSS, row, col);
            addSimbolInArray(CROSS, row, col);
            isCross=false;
            //check
            checked(CROSS, arrayClick);

        }
        else{
            renderSymbolInCell(ZERO, row, col);
            addSimbolInArray(ZERO, row, col);
            isCross = true;
            //check
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

function addSimbolInArray(simbol, row, col){
    arrayClick[col][row] = simbol;
}

function checked(simbol, arrayClick, sizeArray=3){
    countClick++;
    let diagonal = checkDiagonal(simbol, arrayClick, sizeArray=3);
    let lines = checkLanes(simbol, arrayClick, sizeArray=3);
    
    if (diagonal || lines) alert(`Winning for ${simbol}`);
    if(countClick === sizeArray**2) alert('Победила дружба!');
}

function checkDiagonal(simbol, arrayClick, sizeArray=3){
    let toRight = true;
    let toLeft = true;
    for(let i=0; i<sizeArray; i++){
        toRight = toRight && (arrayClick[i][i] === simbol);
        toLeft = toLeft && (arrayClick[i][i] === simbol);
    }

    if (toLeft || toRight) return true;
    return false;
}

function checkLanes(simbol, arrayClick, sizeArray=3){
    let cols = true;
    let rows = true;
    for(let i=0; i<sizeArray; i++){
        cols = true;
        rows = true;
        for(let j=0; j<sizeArray; j++){
            cols = cols && (arrayClick[i][j] === simbol);
            rows = rows && (arrayClick[j][i] === simbol);
        }
        if(cols || rows) return true
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
