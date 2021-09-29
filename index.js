const CROSS = 'X';
const ZERO = 'O';
const EMPTY = ' ';

const container = document.getElementById('fieldWrapper');

let fullGrid=[];
let switcherX = true;
let movesLeft;
let x;
let win = false;
startGame();
addResetListener();

function startGame () {
    x = prompt('Введите длинну стороны поля', 3)   
    renderGrid(x);
    movesLeft = x*x;
    for(let i=0; i<x; i++)
    {
        fullGrid[i]=[];
        for(let j=0; j<x; j++)                
            fullGrid[i][j]=EMPTY;        
    }
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
    if (win === true)
        return;
    console.log(`Clicked on cell: ${row}, ${col}`);     
    if (fullGrid[row][col]===EMPTY){
        Click(row, col);
        if ((movesLeft >0)&(!win)){
            let y = Math.floor(Math.random() * x);
            let z = Math.floor(Math.random() * x);
            while (fullGrid[y][z] != EMPTY)
            {   
                y = Math.floor(Math.random() * x);
                z = Math.floor(Math.random() * x);
            }         
                Click(y, z);
        }
    }
}

function Click (row, col){ 
    if (movesLeft<=0)
    {
        if (!win)
            alert('Победила дружба');
        return;
    }   
    if (switcherX){
        renderSymbolInCell(CROSS, row, col);
        switcherX = false;
        fullGrid[row][col] = CROSS;
        checkWin(row, col, CROSS)
    }
    else{
        renderSymbolInCell(ZERO, row, col);
        switcherX = true;
        fullGrid[row][col] = ZERO;
        checkWin(row, col, ZERO)
    }
    movesLeft=movesLeft-1;    
    if (movesLeft<=0)
    {
        if (!win)
            alert('Победила дружба');
        return;
    }
}

function checkWin(row, col, player){
    let amount = 0;
    for (i=0; i<x; i++)
      if(fullGrid[row][i]==player)
       amount=amount+1;
    if (amount==x)
        {
            win = true;
            alert('Победа игрока '+player);
            return;
        }
    else amount=0;

    for (i=0; i<x; i++)
      if(fullGrid[i][col]==player)
       amount=amount+1;
    if (amount==x)
        {
            win = true;
            alert('Победа игрока '+player);
            return;
        }
    else amount=0;
    if (row == col)
    {
        for (i=0; i<x; i++)
            if(fullGrid[i][i]==player)
                amount=amount+1;
        if (amount==x)
            {
                win = true;
                alert('Победа игрока '+player);
                return;
            }
        else amount=0;
    }
    if (row+col==x-1)
    {
        for (i=0; i<x; i++)
            if(fullGrid[i][x-1-i]==player)
                amount=amount+1;
        if (amount==x)
            {
                win = true;
                alert('Победа игрока '+player);
                return;
            }
        else amount=0;
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
    switcherX = true;
    win = false;
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
