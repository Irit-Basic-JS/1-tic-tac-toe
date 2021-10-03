const CROSS = 'X';
const ZERO = 'O';
const EMPTY = ' ';
let i = 0;

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

function cellClickHandler (row, col,) {
    const targetInCell = findCell(row, col);

    console.log(`Clicked on cell: ${row}, ${col}`);
    if (i == 8){
        i % 2 == 0 ? renderSymbolInCell(CROSS, row, col) : renderSymbolInCell(ZERO, row, col);
        alert("Победила дружба");
    }   else{
            if (targetInCell.textContent == EMPTY){
                if (checkWinner())
                    return;
                i % 2 == 0 ? renderSymbolInCell(CROSS, row, col) : renderSymbolInCell(ZERO, row, col);
                i += 1;
                checkWinner();                
            }
    } 
}

function checkWinner () {
    let arrG = [];
    let arrV = [];
    for (let a = 0; a < 3; a++){
        for (let b = 0; b < 3; b++){
            const targetG = findCell(a, b);
            const targetV = findCell(b, a);
            arrG.push(targetG.textContent);
            arrV.push(targetV.textContent);
        }
    }
    for (let n = 0; n <= 6; n += 3){
        if (arrG[n] == arrG[n + 1] && arrG[n] == arrG[n + 2] && arrG[n] != EMPTY){
            if (n == 0)
                for (a = 0; a < 3; a++){
                    let target = findCell(0, a);
                    target.style.color = "red";}
            if (n == 3)
                for (a = 0; a < 3; a++){
                    let target = findCell(1, a);
                    target.style.color = "red";}
            if (n == 6)
                for (a = 0; a < 3; a++){
                    let target = findCell(2, a);
                    target.style.color = "red";}                          
            alert(`Победили ${arrG[n]}`);
            return 1;
        }
        if (arrV[n] == arrV[n + 1] && arrV[n] == arrV[n + 2] && arrV[n] != EMPTY){
            if (n == 0)
                for (a = 0; a < 3; a++){
                    let target = findCell(a, 0);
                    target.style.color = "red";}
            if (n == 3)
                for (a = 0; a < 3; a++){
                    let target = findCell(a, 1);
                    target.style.color = "red";}
            if (n == 6)
                for (a = 0; a < 3; a++){
                    let target = findCell(a, 2);
                    target.style.color = "red";}
            alert(`Победили ${arrV[n]}`);
            return 1;
        }
    }
        if (arrG[0] == arrG[4] && arrG[0] == arrG[8] && arrG[0] != EMPTY){
            for (a = 0; a <= 2; a++){
                let target = findCell(a, a);
                target.style.color = "red";}
            alert(`Победили ${arrV[0]}`);
        return 1;}
        if (arrG[2] == arrG[4] && arrG[2] == arrG[6] && arrG[2] != EMPTY){
            b = 2;
            for (a = 0; a < 3; a++){
                let target = findCell(a, b);
                target.style.color = "red";
                b--;}
            alert(`Победили ${arrV[2]}`);
        return 1;}
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
    let arr = [];
    for (let a = 0; a < 3; a++){
        for (let b = 0; b < 3; b++){
            let target = findCell(a, b);
            target.textContent = EMPTY;
            i = 0;
        }
    }
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