const CROSS = 'X';
const ZERO = 'O';
const EMPTY = ' ';

const container = document.getElementById('fieldWrapper');

let fullGrid=[];
let switcherX = true;
let movesLeft;
let x;
let win = false;
let coolPosition = [0, 0];
startGame();
addResetListener();

function startGame () {
    x = prompt('Введите длинну стороны поля', 3)
    movesLeft = x*x;
    coolPosition = [Math.floor(Math.random() * x), Math.floor(Math.random() * x)];
    for(let i=0; i<x; i++)
    {
        fullGrid[i]=[];
        for(let j=0; j<x; j++)                
            fullGrid[i][j]=EMPTY;        
    }
    renderGrid(x);       
}

function renderGrid (dimension) {
    container.innerHTML = '';
    
    for (let i = 0; i < dimension; i++) {
        const row = document.createElement('tr');
        for (let j = 0; j < dimension; j++) {
            const cell = document.createElement('td');
            cell.textContent = fullGrid[i][j];
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
        if (win != true)        
            if ((+(movesLeft*2)) <= (+x*x))
                enlageGrid();
        if ((movesLeft >0)&(!win)){
            let y = coolPosition[0];
            let z = coolPosition[1];
            //console.log(y+' '+z);
            while (fullGrid[y][z] != EMPTY)
            {   
                y = Math.floor(Math.random() * x);
                z = Math.floor(Math.random() * x);
            }         
                Click(y, z);
        }
    }
    //Увеличение поля
    if (win != true)        
        if ((+(movesLeft*2)) <= (+x*x))
            enlageGrid();
}

function Click (row, col){ 
    if (movesLeft<=0)
    {
        if (!win)
            alert('Победила дружба');
        return;
    }   
    if (switcherX){
        renderSymbolInCell(CROSS, row, col, '#333');
        switcherX = false;
        fullGrid[row][col] = CROSS;
        checkWin(row, col, CROSS)
    }
    else{
        renderSymbolInCell(ZERO, row, col), '#333';
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
    let potentialPosition =[]
    //Проверка на полную горизонталь
    for (i=0; i<x; i++)
        {
            if (fullGrid[row][i]==EMPTY)
                potentialPosition = [row, i]
            if(fullGrid[row][i]==player)
                amount=amount+1;            
            //else break;
        }
    if (amount==x)
        {
            win = true;
            addColor(row, 'horizontal', player);
            alert('Победа игрока '+player);
            return;
        }
    if ((player == ZERO)&(amount==x-1))
    {
        console.log(potentialPosition);
        coolPosition = [potentialPosition[0], potentialPosition[1]];
    }
    amount=0;

    //Проверка на полную вертикаль
    for (i=0; i<x; i++)
    {
        if (fullGrid[i][col]==EMPTY)
            potentialPosition = [i, col]
        if(fullGrid[i][col]==player)
            amount=amount+1;
        //else break;
    }
    if (amount==x)
        {
            win = true;
            addColor(col, 'vertical', player);
            alert('Победа игрока '+player);
            return;
        }
    if ((player == ZERO)&(amount==x-1))
    {
        console.log(potentialPosition);
        coolPosition = [potentialPosition[0], potentialPosition[1]];
    }
    amount=0;
    //Проверка на полную главную диагональ
    if (row == col)
    {
        for (i=0; i<x; i++)
        {
            if (fullGrid[i][i]==EMPTY)
                potentialPosition = [i, i]
            if(fullGrid[i][i]==player)
                amount=amount+1;
            //else break;
        }
        if (amount==x)
            {
                win = true;
                addColor(row, 'mainDiagonal', player);
                alert('Победа игрока '+player);
                return;
            }
        if ((player == ZERO)&(amount==x-1))
        {
            console.log(potentialPosition);
            coolPosition = [potentialPosition[0], potentialPosition[1]];
        }
        amount=0;
    }
    //Проверка на полную побочную диагональ
    if (row+col==x-1)
    {
        for (i=0; i<x; i++)
        {
            if (fullGrid[i][x-1-i]==EMPTY)
                potentialPosition = [i, x-1-i]
            if(fullGrid[i][x-1-i]==player)
                amount=amount+1;
            //else break;
        }
        if (amount==x)
            {
                win = true;
                addColor(row, 'secondDiagonal', player);
                alert('Победа игрока '+player);
                return;
            }
        if ((player == ZERO)&(amount==x-1))
        {
            console.log(potentialPosition);
            coolPosition = [potentialPosition[0], potentialPosition[1]];
        }
        amount=0;
    }
}
function addColor(number, type, player)
{
    switch (type){
        case 'horizontal':
            for (let i=0; i<x; i++)
                renderSymbolInCell(player, number, i, 'red')
            break;
        case 'vertical':
            for (let i=0; i<x; i++)
                renderSymbolInCell(player, i, number, 'red')
            break;
        case 'mainDiagonal':
            for (let i=0; i<x; i++)
            renderSymbolInCell(player, i, i, 'red')
            break;
        case 'secondDiagonal':
            for (let i=0; i<x; i++)
            renderSymbolInCell(player, i, x-1-i, 'red')
            break;
    }
}

function enlageGrid() {
    console.log('ENLARGE!!!')
    let newFullGrid = [];
    x = (+x)+2;    
    movesLeft = x*x - (x-2)*(x-2)/2;

    for(let i=0; i<x; i++)
    {
        newFullGrid[i]=[];
        for(let j=0; j<x; j++)                
            newFullGrid[i][j]=EMPTY;        
    }   

    for(let i=0; i<x-2; i++)
    {        
        for(let j=0; j<x-2; j++)                
            newFullGrid[i+1][j+1]=fullGrid[i][j]; 
    }   
    
    for(let i=0; i<x; i++)
    {
        fullGrid[i]=[];
        for(let j=0; j<x; j++){
            fullGrid[i][j]=newFullGrid[i][j];            
        }
    }
    renderGrid(x);    
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
