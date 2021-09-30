const CROSS = 'X';
const ZERO = 'O';
const EMPTY = ' ';

let isGameOver;
let maxCounOfTurns;
let lastSymbol = "";
let counOfTurns;
let winner;
let dim = 3;
let winCombination;

const winTypes = {
    horizontal: 'horizontal',
    vertical: 'vertical',
    diagonalLeft: 'diagonalLeft',
    diagonalRight: 'diagonalRight'
}

const container = document.getElementById('fieldWrapper');

startGame();
addResetListener();

function startGame () {
    //dim = prompt("Задайте размер поля:", 3);
    lastSymbol = "";
    winCombination = [];
    counOfTurns = 0;
    maxCounOfTurns = dim**2;
    isGameOver = false;
    renderGrid(dim);
}

function renderGrid (dimension) {
    container.innerHTML = '';
    dim = dimension;
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

    if (isGameOver || findCell(row, col).textContent !== EMPTY) return;

    //console.log(`Clicked on cell: ${row}, ${col}`);
    //console.log(`maxCounOfTurns = ${maxCounOfTurns}`);
    //console.log(`dim = ${dim}`);
    //console.log(`winner = ${winner}`);
    //console.log(`isGameOver =  ${isGameOver}`);
    //console.log(`winCombination =  ${winCombination}`);

    let symbol = "";

    if(lastSymbol != ZERO)
        symbol = ZERO;
    else
        symbol = CROSS;

    lastSymbol = symbol;

    if(findCell(row, col).textContent === EMPTY)
        renderSymbolInCell(symbol, row, col);

    checkWinner(symbol, row, col);  

    counOfTurns++;  

    if (counOfTurns === maxCounOfTurns && !winner) 
        isGameOver = true;

    else if (!winner) return;

    colorWinningLine();
    winnerAlert();
}

function colorWinningLine() {
    for (let i = 0; i < winCombination.length; i++) {
        let row = winCombination[i][0];
        let col = winCombination[i][1];
        const targetCell = findCell(row, col);
        targetCell.style.backgroundColor = "red";
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
    startGame();
    console.log('reset!');
}

function checkWinner(symbol, row, col) {
    if ((col === 0 || findCell(row, col - 1).textContent === symbol) &&
        (col === dim - 1 || findCell(row, col + 1).textContent === symbol))
        winCombination = getWinningCombo(winTypes.horizontal, symbol, row, col);

    if ((row === 0 || findCell(row - 1, col).textContent === symbol) &&
        (row === dim - 1 || findCell(row + 1, col).textContent === symbol))
        winCombination = getWinningCombo(winTypes.vertical, symbol, row, col);

    if (row === col &&
        (row === 0 || findCell(row - 1, col - 1).textContent === symbol) &&
        (row === dim - 1 || findCell(row + 1, col + 1).textContent === symbol))
        winCombination = getWinningCombo(winTypes.diagonalLeft, symbol, row, col);

    if (dim - 1 - row === col &&
        (row === 0 || findCell(row - 1, col + 1).textContent === symbol) &&
        (col === 0 || findCell(row + 1, col - 1).textContent === symbol))
        winCombination = getWinningCombo(winTypes.diagonalRight, symbol, row, col);

    if (winCombination.length === dim) {
        isGameOver = true;
        winner = symbol;
    }
}

function winnerAlert() {
    if (!isGameOver) return;
    switch (winner) {
        case CROSS:
            alert('Победили крестики!');
            break;
        case ZERO:
            alert('Победили нолики!');
            break;
        default:
            alert('Победила дружба!');
            break;
    }
}

function getWinningCombo(winType, symbol, row, col) {
    let combination = []
    for (let i = 0; i < dim; i++) {
        switch (winType) {
            case winTypes.vertical:
                if (findCell(i, col).textContent === symbol)
                    combination.push([i, col]);
                break;
            case winTypes.horizontal:
                if (findCell(row, i).textContent === symbol)
                    combination.push([row, i]);
                break;
            case winTypes.diagonalLeft:
                if (findCell(i, i).textContent === symbol)
                    combination.push([i, i]);
                break;
            case winTypes.diagonalRight:
                if (findCell(dim - 1 - i, i).textContent === symbol)
                    combination.push([dim - 1 - i, i])
                break;
        }
    }
    if (combination.length === dim)
        return combination;
    return [];
}

function clickOnCell (row, col) {
    findCell(row, col).click();
}
