const CROSS = 'X';
const ZERO = 'O';
const EMPTY = ' ';
let dimension = prompt('Введите размер поля', '');
let currentSymbol = '';
let isGameEnd = false;
let turnCounter = 0;

const container = document.getElementById('fieldWrapper');

startGame();
addResetListener();
function startGame() {
    renderGrid(dimension);
}
function renderGrid(dimension) {
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
function cellClickHandler(row, col) {
    if(isGameEnd == true){
        alert(`игра окончена, нажмите "сначала", чтобы начать новую игру`);
    }
    else{
        if (currentSymbol == '' || currentSymbol == ZERO) {
            if (findCell(row, col).textContent == ZERO || findCell(row, col).textContent == CROSS) {
                alert('занято!');
            }
            else {
                renderSymbolInCell(CROSS, row, col);
                turnCounter++;
                checkWin();
            }
        }
        else {
            if (findCell(row, col).textContent == ZERO || findCell(row, col).textContent == CROSS) {
                alert('занято!');
            }
            else {
                renderSymbolInCell(ZERO, row, col);
                turnCounter++;
                checkWin();
            }
        }
        console.log(`Clicked on cell: ${row}, ${col}`);
    }
    
}
function renderSymbolInCell(symbol, row, col, color = '#333') {
    const targetCell = findCell(row, col);

    targetCell.textContent = symbol;
    currentSymbol = symbol;
    targetCell.style.color = color;
}
function findCell(row, col) {
    const targetRow = container.querySelectorAll('tr')[row];
    return targetRow.querySelectorAll('td')[col];
}
function addResetListener() {
    const resetButton = document.getElementById('reset');
    resetButton.addEventListener('click', resetClickHandler);
}
function resetClickHandler() {
    turnCounter = 0;
    isGameEnd = false;
    startGame();
    console.log('reset!');
}
function checkWin() {
    if ((findCell(0, 0).textContent == CROSS && findCell(1, 1).textContent == CROSS &&
         findCell(2, 2).textContent == CROSS) || (findCell(0, 2).textContent == CROSS &&
         findCell(1, 1).textContent == CROSS && findCell(2, 0).textContent == CROSS) ||
         (findCell(0, 0).textContent == CROSS && findCell(0, 1).textContent == CROSS &&
         findCell(0, 2).textContent == CROSS) || (findCell(1, 0).textContent == CROSS &&
         findCell(1, 1).textContent == CROSS && findCell(1, 2).textContent == CROSS) ||
         (findCell(2, 0).textContent == CROSS && findCell(2, 1).textContent == CROSS &&
         findCell(2, 2).textContent == CROSS || (findCell(0, 0).textContent == CROSS &&
         findCell(1, 0).textContent == CROSS && findCell(2, 0).textContent == CROSS) ||
         (findCell(0, 1).textContent == CROSS && findCell(1, 1).textContent == CROSS &&
         findCell(2, 1).textContent == CROSS) || (findCell(0, 2).textContent == CROSS &&
         findCell(1, 2).textContent == CROSS && findCell(2, 2).textContent == CROSS))){
                    isGameEnd = true;
                    alert('X wons!');
} else if ((findCell(0, 0).textContent == ZERO && findCell(1, 1).textContent == ZERO &&
            findCell(2, 2).textContent == ZERO) || (findCell(0, 2).textContent == ZERO &&
            findCell(1, 1).textContent == ZERO && findCell(2, 0).textContent == ZERO) ||
            (findCell(0, 0).textContent == ZERO && findCell(0, 1).textContent == ZERO &&
            findCell(0, 2).textContent == ZERO) || (findCell(1, 0).textContent == ZERO &&
            findCell(1, 1).textContent == ZERO && findCell(1, 2).textContent == ZERO) ||
            (findCell(2, 0).textContent == ZERO && findCell(2, 1).textContent == ZERO &&
            findCell(2, 2).textContent == ZERO || (findCell(0, 0).textContent == ZERO &&
            findCell(1, 0).textContent == ZERO && findCell(2, 0).textContent == ZERO) ||
            (findCell(0, 1).textContent == ZERO && findCell(1, 1).textContent == ZERO &&
            findCell(2, 1).textContent == ZERO) || (findCell(0, 2).textContent == ZERO &&
            findCell(1, 2).textContent == ZERO && findCell(2, 2).textContent == ZERO))){
                    isGameEnd = true;
                    alert('O wons!');
    }else if(turnCounter == dimension * dimension) {
        alert('победила дружба!');
    } else{
        return 0;
    }  
}
/* Test Function */
/* Победа первого игрока */
function testWin() {
    clickOnCell(0, 2);
    clickOnCell(0, 0);
    clickOnCell(2, 0);
    clickOnCell(1, 1);
    clickOnCell(2, 2);
    clickOnCell(1, 2);
    clickOnCell(2, 1);
}
/* Ничья */
function testDraw() {
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
function clickOnCell(row, col) {
    findCell(row, col).click();
}