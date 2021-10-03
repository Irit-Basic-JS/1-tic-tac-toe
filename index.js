const CROSS = 'X';
const ZERO = 'O';
const EMPTY = ' ';

const container = document.getElementById('fieldWrapper');

let tableSize;
let table ;
let totalPlaced;
let inGame = false;
startGame();
addResetListener();

function startGame () { // обновление поля
    inGame = true;
    tableSize = prompt('Задайте сторону поля',3);
    table = new Array(tableSize);
    totalPlaced = 0;
    renderGrid(tableSize);
}

function renderGrid (dimension) {//создаёт поле
    container.innerHTML = '';

    for (let i = 0; i < dimension; i++) {
        const row = document.createElement('tr');
        table[i] = new Array(tableSize);
        for (let j = 0; j < dimension; j++) {
            const cell = document.createElement('td');
            table[i][j] = EMPTY;
            cell.textContent = EMPTY;
            cell.addEventListener('click', () => cellClickHandler(i, j));
            row.appendChild(cell);
        }
        container.appendChild(row);
    }
}

function cellClickHandler (row, col) {   // срабатывает по клику на поле
    if(!inGame)
        return;
    let cell = findCell(row, col);
    if(cell.textContent == EMPTY){
        placeSymbolInCell(CROSS, row, col);
        console.log(`Clicked on cell: ${row}, ${col}`);
        if(inGame)
            stupidIntelligence();
    }
    else
        console.log(`Clicked on not empty cell: ${row}, ${col}`);
}

function placeSymbolInCell (symbol, row, col) { //записывает символ
    drawSymbol (symbol, row, col, color = '#333')
    table[row][col] = symbol;
    totalPlaced+=1;
    findReasonToEndGame(row, col);
}

function drawSymbol (symbol, row, col, color) {
    const targetCell = findCell(row, col);
    targetCell.textContent = symbol;
    targetCell.style.color = color;
}

function findCell (row, col) {// возвращает клетку
    const targetRow = container.querySelectorAll('tr')[row];
    return targetRow.querySelectorAll('td')[col];
}

function addResetListener () { //привязка кнопки перезапуска
    const resetButton = document.getElementById('reset');
    resetButton.addEventListener('click', resetClickHandler);
}

function resetClickHandler () { // работа кнопки перезапуска
    startGame();
    console.log('reset!');
}

function stupidIntelligence(){ //интеллект из пункта 10
    while(true){
        let row = Math.floor((Math.random()*tableSize))%tableSize;
        let col = Math.floor((Math.random()*tableSize))%tableSize;
        let cell = findCell(row, col)
        if (cell.textContent == EMPTY){
            placeSymbolInCell(ZERO, row, col);
            break;
        }
    }
}

function findReasonToEndGame(lastRow, lastCol){ // обработка возможных окончаний игры
    if(totalPlaced == tableSize*tableSize){
        inGame = false;
        alert('победила дружба');
        return;
    }
    let sym = findCell(lastRow, lastCol).textContent;
    let win = true;

    for(let i =0; i<tableSize; i++){
        if(table[lastRow][i]!=sym){
            win = false;
            break;
        }
    }
    if(win){
        for(let i =0; i<tableSize; i++)
            drawSymbol (sym, lastRow, i, color = '#f50000')
        alert(`победила команда ${sym}`);
        inGame = false;
        console.log('победа по вертикали');
        return;
    }

    win = true;
    for(let i =0; i<tableSize; i++){
        if(table[i][lastCol]!=sym){
            win = false;
            break;
        }
    }
    if(win){
        for(let i =0; i<tableSize; i++)
            drawSymbol (sym, i, lastCol, color = '#f50000')
        alert(`победила команда ${sym}`);
        inGame = false;
        console.log('победа по горизонтали');
        return;
    }
    if(lastCol == lastRow){
        win = true;
        for(let i =0; i<tableSize; i++){
            if(table[i][i]!=sym){
                 win = false;
                break;
            }
        }
        if(win){
            for(let i =0; i<tableSize; i++)
            drawSymbol (sym, i, i, color = '#f50000')
            alert(`победила команда ${sym}`);
            inGame = false;
            console.log('победа \\');
            return;
        }
    }

    if((tableSize -1-lastCol) == lastRow){
        win = true;
        for(let i =0; i<tableSize; i++){
            if(table[i][tableSize -1-i]!=sym){
                 win = false;
                break;
            }
        }
        if(win){
            for(let i =0; i<tableSize; i++)
            drawSymbol (sym, i, tableSize -1-i, color = '#f50000')
            alert(`победила команда ${sym}`);
            inGame = false;
            console.log('победа /');
            return;
        }
    }
    if(Number(totalPlaced)*2>=Number(tableSize)*Number(tableSize)){
        console.log('checking largness enter if');
        EnlargeField()
    }
}

function EnlargeField() {
 let newField = new Array(Number(tableSize)+2);
console.log('enlarging');
 for(let i=0;i<Number(tableSize)+2;i++){
    newField[i] = new Array(Number(tableSize)+2);
    newField[i][0]=EMPTY;
    newField[i][Number(tableSize)+1]=EMPTY;
    if(i===0 || i===Number(tableSize)+1){
        for(let i1 =0;i1<Number(tableSize)+2;i1++)
        newField[i][i1]=EMPTY;
    }
}
console.log('created table');
 for(let i =0; i<tableSize;i++){
     for(let i1=0;i1<tableSize;i1++){
        newField[i+1][i1+1] = table[i][i1];
     }
 }
 table = newField;
 tableSize= Number(tableSize)+2;
 console.log('filled');
 RenderEnlargedField();
}
function RenderEnlargedField() {
    container.innerHTML = '';
    for (let i = 0; i < tableSize; i++) {
        const row = document.createElement('tr');
        for (let j = 0; j < tableSize; j++) {
            const cell = document.createElement('td');
            cell.textContent = table[i][j];
            cell.addEventListener('click', () => cellClickHandler(i, j));
            row.appendChild(cell);
        }
        container.appendChild(row);
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
