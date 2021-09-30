const CROSS = 'X';
const ZERO = 'O';
const EMPTY = ' ';
let isZero = false;
let GridArray = [ [], [], []];
let IsWin= false;

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

function isDraw(){
    let isFull=true;
    for(let i=0; i<GridArray.length;i++)
        for(let j=0; j<GridArray.length;j++){
            if (GridArray[i][j]==undefined)
            isFull=false;
            break;
        }
    
    if(!IsWin&&isFull)
        alert('Победила дружба')
}

function findWinner (){
    for (let i = 0; i <= 2; i = i + 2)
	{
	    if((GridArray[0][0 + i] == GridArray[1][1]) && (GridArray[1][1] == GridArray[2][2- i])
            && GridArray[0][0 + i]!=undefined && GridArray[1][1]!=undefined && GridArray[2][2- i]){ 
                renderSymbolInCell(GridArray[i][0], 0, i, '#f00');
                renderSymbolInCell(GridArray[i][0], 1, 1, '#f00');
                renderSymbolInCell(GridArray[i][0], 2, 2-i, '#f00');
                alert(`Выйграл игрок использующий ${GridArray[0][0+i]}`)
                IsWin= true;	
            }
	}

	for (let i = 0; i < 3; i++)
	{
	    if(GridArray[i][0] == GridArray[i][1] && GridArray[i][1] == GridArray[i][ 2]
            && GridArray[i][0]!=undefined && GridArray[i][1]!=undefined && GridArray[i][2]){
	            renderSymbolInCell(GridArray[i][0], i, 0, '#f00');
                renderSymbolInCell(GridArray[i][0], i, 1, '#f00');
                renderSymbolInCell(GridArray[i][0], i, 2, '#f00');
                IsWin= true;	
                alert(`Выйграл игрок использующий ${GridArray[i][0]}`)

            }
              
	    if(GridArray[0][i] == GridArray[1][i] && GridArray[1][i] == GridArray[2][i] 
            && GridArray[0][i]!=undefined &&GridArray[1][i]!=undefined && GridArray[2][ i]){
                renderSymbolInCell(GridArray[1][i], 1, i, '#f00');
                renderSymbolInCell(GridArray[i][0], 2, i, '#f00');
                renderSymbolInCell(GridArray[i][0], 0, i, '#f00');
                IsWin= true;	
                alert(`Выйграл игрок использующий ${GridArray[1][i]}`)
            }
	}


}

function resetClickHandler () {
    console.log('reset!');
    IsWin=false;
    GridArray =  [ [], [], []];
    for(i=0;i<3;i++)
        for(j=0;j<3;j++)
        renderSymbolInCell(EMPTY, i, j);

}




function cellClickHandler (row, col) {
    // Пиши код тут
    console.log(`Clicked on cell: ${row}, ${col}`);
    if(!IsWin){
    if(GridArray[row][col]==null){
        if (isZero){
            GridArray[row][col]=ZERO;
            renderSymbolInCell(ZERO, row, col);
            isZero=false;
        }
        else{
            GridArray[row][col]=CROSS;
            renderSymbolInCell(CROSS, row, col);
            isZero = true;
        }
        findWinner();
        isDraw();
    }
       

    }     
    /* Пользоваться методом для размещения символа в клетке так:
        renderSymbolInCell(ZERO, row, col);
     */
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
