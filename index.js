const CROSS = 'X';
const ZERO = 'O';
const EMPTY = ' ';
const container = document.getElementById('fieldWrapper');
let grid = [];
let gridT = [];

let ai;
let size;
let move = [CROSS, 1];
let isWin = false;
let toChangeMove = () => move = move[0] === CROSS ? [ZERO, -1] : [CROSS, 1];  
startGame(); addResetListener();
function startGame () {
    size = +prompt('Введите размер поля', 3);
    ai = useAI(prompt('Включить искуственный интелект? (Да/Нет)', 'Да'));
    if (ai === undefined) return;
    renderGrid(size);
    for (let i = 0; i < size; i++){
        grid.push([]); gridT.push([]);
        for (let j = 0; j < size; j++){
            grid[i].push(0); gridT[i].push(0);
        }
    }    
}

function useAI(s){
    s = s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()
    if (s === 'Да' || s === 'Yes') return true
    else if (s === 'Нет' || s === 'No') return false;
    else alert('Неверный ввод');
}

function checkWin (row, col) {
    let sum = grid[row].map(i=>x+=i, x=0).reverse()[0];
    let sumT = gridT[col].map(i=>x+=i, x=0).reverse()[0];
    if (sum === size) 
        haveWin('CROSS', row, 'r');
    else if (sumT === size)
        haveWin('CROSS', col, 'c');
    else if (sum === -size)
        haveWin('ZERO', row, 'r');
    else if (sumT === -size)
        haveWin('ZERO', col, 'c');
    else if (row === col || row + col === size - 1) 
        winDiag(row, col);
    else if (!checkMove()) setTimeout(() => {alert('Победила дружба');}, 100);
}

function haveWin(winner, i, s){
    isWin = true;
    for (let j = 0; j < size; j++) {
        if (s === 'r'){
            let symbol = grid[i][j] === 1 ? CROSS: ZERO;
            renderSymbolInCell(symbol, i, j, '#f00');
        } else if (s === 'c'){
            let symbol = gridT[i][j] === 1 ? CROSS: ZERO;
            renderSymbolInCell(symbol, j, i, '#f00');     
        }
    }
    if (s === 'd1'){
        while (i < size){
            let symbol = grid[i][i] === 1 ? CROSS : ZERO;
            renderSymbolInCell(symbol, i, i, '#f00');
            i++;
        }
    }
    else if (s === 'd2'){
        while (i < size){
            let symbol = grid[i][size-1-i] === 1 ? CROSS : ZERO;
            renderSymbolInCell(symbol, i, size-1-i, '#f00');
            i++;
        }
    }            
    setTimeout(() => {alert(`Победил ${winner}`);}, 100);    
}

function winDiag(row, col){  
    let arr = [];
    let i = 0;
    let d;
    while (i < size){
        if (row === col){
            arr.push(grid[i][i]);
            d = 'd1';
        }
        else {
            arr.push(grid[i][size-1-i]);
            d = 'd2';
        } 
        i++;
    }
    sum = arr.map(i=>x+=i, x=0).reverse()[0];
    if (sum === size) 
        haveWin('CROSS', 0, d);
    else if (sum === -size)
        haveWin('ZERO', 0, d);
    else if (!checkMove()) setTimeout(() => {alert('Победила дружба');}, 100);
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

function checkMove(){
    for (arr of grid) 
        if (arr.includes(0)) return true;
    return false;
}
    

function cellClickHandler (row, col) {
    if (grid[row][col] !== 0 || isWin) return;
    grid[row][col] = move[1];
    gridT[col][row] = move[1];
    renderSymbolInCell(move[0], row, col, '#333');
    console.log(`Clicked on cell: ${row}, ${col}`);
    toChangeMove(move);
    checkWin(row, col);
    if (ai) clickRandom();
}

function clickRandom(){
   let i = 0; let j = 0;
   if (isWin || !checkMove()) return;
    while (grid[i][j] !== 0 ){
        i = Math.floor(Math.random() * size);
        j = Math.floor(Math.random() * size);
    }    
    renderSymbolInCell(move[0], i, j, '#333');
    grid[i][j] = move[1];
    gridT[j][i] = move[1];
    toChangeMove(move);
    checkWin(i, j);
}

function renderSymbolInCell (symbol, row, col, color){
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
    grid = []; gridT = [];
    move = [CROSS, 1];
    isWin = false;
    container.innerHTML = "";
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
