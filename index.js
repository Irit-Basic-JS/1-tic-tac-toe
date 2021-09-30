const CROSS = 'X';
const ZERO = 'O';
const EMPTY = ' ';

const container = document.getElementById('fieldWrapper');

let field = [];
let count = 0;
let isWin = false;

startGame();
addResetListener();

function startGame () {
    let dem = prompt("Размер поля:", 3);
    renderGrid(dem);
    count = dem*dem;
}

function renderGrid (dimension) {
    container.innerHTML = '';

    for (let i = 0; i < dimension; i++) {
        field[i] = [];
        const row = document.createElement('tr');
        for (let j = 0; j < dimension; j++) {
            const cell = document.createElement('td');
            cell.textContent = EMPTY;
            field[i][j] = EMPTY;
            cell.addEventListener('click', () => cellClickHandler(i, j));
            row.appendChild(cell);
        }
        container.appendChild(row);
    }
}

function cellClickHandler (row, col) {
    // Пиши код тут
    if(count%2 == 0)
        getSymbol(row, col, CROSS);
    else 
        getSymbol(row, col, ZERO);
    console.log(`Clicked on cell: ${row}, ${col}`);
}

function getSymbol (row, col, sym){
    if(findCell(row, col).textContent == EMPTY && !isWin)
    {
        renderSymbolInCell(sym, row, col);
        field[row][col] = sym;
        count-=1;
        if(checkWinner (row, col, sym)){
            alert(`Победитель: ${sym === CROSS ? "крестики" : "нолики"}`);
            isWin = true;
        }
        if(count == 0 && !checkWinner (row, col, sym))
            alert("Ничья");
    }
}

function checkWinner (row, col, sym){
    let flag = true;
    let winWay = '';
    for(let i = 0; i<field.length; i++){
        if(field[row][i] !== sym){
             flag = false;
             break;
            }
            winWay= "gor";
    }
    if(!flag)
        for(let i = 0; i<field.length; i++){
            if(field[i][col] !== sym){
                flag = false;
                break;
            }
        flag = true;
        winWay= "ver";
        }
    if(!flag)
        for(let i = 0; i<field.length; i++){
            if(field[i][i] !== sym){
                flag = false;
                break;
            }
        flag = true;
        winWay="diagUp";
        }
    if(!flag)
        for(let i = 0; i<field.length; i++){
            if(field[i][field.length -1 - i] !== sym){
                flag = false;
                break;
            }
        flag = true;
        winWay= "diagDown";
        }
    if(flag)
        changeColor(winWay, row, col);
    return flag;
}


function renderSymbolInCell (symbol, row, col, color = '#333') {
    const targetCell = findCell(row, col);

    targetCell.textContent = symbol;
    targetCell.style.color = color;
}

function changeColor(way, row, col){
    switch(way){
        case "gor":
            for(let i = 0; i<field.length; i++)
                findCell(row, i).style.color = "#ff2605";
            break;
        case "ver":
            for(let i = 0; i<field.length; i++)
                findCell(i, col).style.color = "#ff2605";
            break;
        case "diagUp":
            for(let i = 0; i<field.length; i++)
                findCell(i, i).style.color = "#ff2605";
            break;

        case "diagDown":
            for(let i = 0; i<field.length; i++)
                findCell(i, field.length -1 - i).style.color = "#ff2605";
            break;
    }
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
