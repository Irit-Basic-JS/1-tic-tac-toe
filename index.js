const CROSS = 'X';
const ZERO = 'O';
const EMPTY = ' ';
const container = document.getElementById('fieldWrapper');
let field = {}; 
let fieldSize = 3;
let cellsRemaining = 9;
let gameIsOver = false;
startGame();
addResetListener();
function startGame() 
{
    let size = Number(prompt("Введите размер поля", 3));
    cellsRemaining = size ** 2;
    gameIsOver = false;
    renderGrid(size);
    createField(size);
    fieldSize = field[0].length;
}
function renderGrid(dimension) 
{
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
function createField(dimension) 
{
    field = Array.from(Array(dimension), () => new Array(dimension));
    for (let i = 0; i < dimension; i++)
        for (let j = 0; j < dimension; j++)
            field[i][j] = 0;
}
function checkWinConditions() 
{
    let rowsSum = new Array(fieldSize).fill(0);
    let diagonalsSum = new Array(2).fill(0);
    for (let i = 0; i < fieldSize; i++) 
    {
        let lineSum = 0;
        for (let j = 0; j < fieldSize; j++) 
        {
            lineSum += field[i][j];
            rowsSum[j] += field[i][j];

            if (i === j)
                diagonalsSum[0] += field[i][j];

            if (i === fieldSize - j - 1)
                diagonalsSum[1] += field[i][j];
        }

        gameIsOver = applyWinMessage(lineSum, [i, 0], [i, fieldSize - 1]);
  
        if (gameIsOver) break;
    }
    if (gameIsOver) return;
    for (let i = 0; i < fieldSize; i++) 
    {
        gameIsOver = applyWinMessage(rowsSum[i], [0, i], [fieldSize - 1, i]);
        if (gameIsOver) break;
    }
    if (gameIsOver) return;
    for (let i = 0; i < fieldSize; i++)
    {
        gameIsOver = applyWinMessage(diagonalsSum[i],
            [0, i === 0 ? 0 : fieldSize - 1], [fieldSize - 1, i === 1 ? 0 : fieldSize - 1], true);
        if (gameIsOver) break;
    }

    if (!gameIsOver && cellsRemaining === 0) {
        alert("Победила дружба")
        gameIsOver = true;
    }
}

function applyWinMessage(sum, firstPoint, secondPoint, isDiagonal = false) 
{
    if (Math.abs(sum) == fieldSize) 
    {
        if (sum > 0) 
        {
            makeWinnerRed('X', firstPoint, secondPoint, isDiagonal);
            alert(`Победили Крестики!`);
        }
        else 
        {
            makeWinnerRed('O', firstPoint, secondPoint, isDiagonal);
            alert(`Победили Нолики!`);
        }

        return true;
  
    }
    return false;
}

function makeWinnerRed(symbol, firstPoint, secondPoint, isDiagonal = false) 
{
    if (!isDiagonal) 
    {
        for (let i = firstPoint[0]; i <= secondPoint[0]; i++)
            for (let j = firstPoint[1]; j <= secondPoint[1]; j++)
                renderSymbolInCell(symbol, i, j, "red");
    }
    else for (let i = 0; i < fieldSize; i++) {
        renderSymbolInCell(symbol, i, firstPoint[1] === 0 ? i : fieldSize - i - 1, "red");
    }

}

function cellClickHandler(row, col) 
{
    if (!gameIsOver) 
    {
        if (field[row][col] === 0) 
        {
            renderSymbolInCell(CROSS, row, col);
            field[row][col] = 1;
            cellsRemaining--;

            console.log(`Clicked on cell: ${row}, ${col}`);

            checkWinConditions();

            if (!gameIsOver) 
            {
                makeBotMove();
                checkWinConditions();
            }
        }
    }
}

function makeBotMove() 
{
    let row = Math.floor(Math.random() * fieldSize);
    let col = Math.floor(Math.random() * fieldSize);

    while (field[row][col] != 0) 
    {
        row = Math.floor(Math.random() * fieldSize);
        col = Math.floor(Math.random() * fieldSize);
    }

    renderSymbolInCell(ZERO, row, col);
    field[row][col] = -1;
    cellsRemaining--;
    console.log(`Bot made move on cell: ${row}, ${col}`);
}

function renderSymbolInCell(symbol, row, col, color = '#333') 
{
    const targetCell = findCell(row, col);
    targetCell.textContent = symbol;
    targetCell.style.color = color;
}
function findCell(row, col) 
{
    const targetRow = container.querySelectorAll('tr')[row];
    return targetRow.querySelectorAll('td')[col];
}
function addResetListener() 
{
    const resetButton = document.getElementById('reset');
    resetButton.addEventListener('click', resetClickHandler);
}
function resetClickHandler() 
{
    startGame();
    console.log('reset!');
}
/* Test Function */
/* Победа первого игрока */
function testWin() 
{
    clickOnCell(0, 2);
    clickOnCell(0, 0);
    clickOnCell(2, 0);
    clickOnCell(1, 1);
    clickOnCell(2, 2);
    clickOnCell(1, 2);
    clickOnCell(2, 1);
}
/* Ничья */
function testDraw() 
{
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
function clickOnCell(row, col) 
{
    findCell(row, col).click();
}