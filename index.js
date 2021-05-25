const CROSS = 'X';
const ZERO = 'O';
const EMPTY = ' ';

let count = 0;

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
    console.log(`Clicked on cell: ${row}, ${col}`);
    let inCell = findCell(row, col);
    if (count === 8) {
        alternation(count);
        if (!winner()) {
            alert("Победила дружба");
        }
    } else {
        if (inCell.textContent === EMPTY) {
            if (winner())
                return;
            alternation(count);
            count++;
            winner();
        }
    }

    function alternation (count) {
        return count % 2 ? renderSymbolInCell(CROSS, row, col) : renderSymbolInCell(ZERO, row, col);
    }
}

function winner () {
    let blockX = [];
    let blockY = [];
    for (let i = 0; i < 3; i++){
        for (let j = 0; j < 3; j++){
            const rows = findCell(i, j);
            const cols = findCell(j, i);
            blockX.push(rows.textContent);
            blockY.push(cols.textContent);
        }
    }
    for (let n = 0; n <= 6; n += 3){
        if (blockX[n] !== EMPTY && blockX[n] === blockX[n + 1] && blockX[n] === blockX[n + 2]){
            if (n === 0)
                for (let i = 0; i < 3; i++){
                    let blocks = findCell(0, i);
                    blocks.style.color = "red";}
            if (n === 3)
                for (let i = 0; i < 3; i++){
                    let blocks = findCell(1, i);
                    blocks.style.color = "red";}
            if (n === 6)
                for (let i = 0; i < 3; i++){
                    let blocks = findCell(2, i);
                    blocks.style.color = "red";}
            alert(`Победили ${blockX[n]}`);
            return true;
        }
        if (blockX[2] !== EMPTY && blockX[2] === blockX[4] && blockX[2] === blockX[6]){
            let c = 2;
            for (let i = 0; i < 3; i++) {
                let blocks = findCell(i, c);
                blocks.style.color = "red";
                c--;
            }
            alert(`Победили ${blockY[2]}`);
            return true;
        }
        if (blockX[0] !== EMPTY && blockX[0] === blockX[4] && blockX[0] === blockX[8]){
            for (let i = 0; i <= 2; i++) {
                let blocks = findCell(i, i);
                blocks.style.color = "red";
            }
            alert(`Победили ${blockY[0]}`);
            return true;
        }
        if (blockY[n] !== EMPTY && blockY[n] === blockY[n + 1] && blockY[n] === blockY[n + 2]){
            if (n === 0)
                for (let i = 0; i < 3; i++){
                    let blocks = findCell(i, 0);
                    blocks.style.color = "red";}
            if (n === 3)
                for (let i = 0; i < 3; i++){
                    let blocks = findCell(i, 1);
                    blocks.style.color = "red";}
            if (n === 6)
                for (let i = 0; i < 3; i++){
                    let blocks = findCell(i, 2);
                    blocks.style.color = "red";}
            alert(`Победили ${blockY[n]}`);
            return true;
        }
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
    for (let i = 0; i < 3; i++){
        for (let j = 0; j < 3; j++){
            let blocks = findCell(i, j);
            count = 0;
            blocks.textContent = EMPTY;
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