const CROSS = 'X';
const ZERO = 'O';
const EMPTY = ' ';

const container = document.getElementById('fieldWrapper');

let count = 0; // Количество совершенных ходов
let dim = 3; // Размерность поля
let arr = new Array(); // Массив, хранящий информацию о состоянии игрового поля

startGame();
addResetListener();

function startGame ()
{
    dim = Number(prompt('Размер поля:', dim)) || dim; // Запрос размера поля
    count = 0;
    // Игровое поле пустое, соответственно заполняем массив 
    for (let row = 0; row < dim; row++)
    {
        arr[row] = new Array(dim);
        for (let col = 0; col < dim; col++)
            arr[row][col] = EMPTY;
    }
    renderGrid(dim);
}

function renderGrid (dimension)
{
    container.innerHTML = '';
    for (let i = 0; i < dimension; i++)
    {
        const row = document.createElement('tr');
        for (let j = 0; j < dimension; j++)
        {
            const cell = document.createElement('td');
            cell.textContent = EMPTY;
            cell.addEventListener('click', () => cellClickHandler(i, j));
            row.appendChild(cell);
        }
        container.appendChild(row);
    }
}

// Ход крестика
function cellClickHandler (row, col)
{
    // Если ячейка не пустая или есть победитель, то прерываем выполнение функции
    if ((findCell(row, col).textContent !== EMPTY) || (count == -1)) return;
    count++;
    renderSymbolInCell(CROSS, row, col); // Ставим символ
    if (findWin(CROSS, row, col)) // Если побеждают крестики
    {
        setTimeout(() => alert('Победили крестики!', 500));
        count = -1;
        return;
    }
    if (count === dim * dim)
    {
        setTimeout(() => alert('Победила дружба!'), 500);
        return;
    }
    setTimeout(() => setZero(), 200);
    console.log(`Clicked on cell: ${row}, ${col}`);
}

// Ход нолика
function setZero ()
{
    count++;
    //Случайным образом генерируем строку и столбец
    let row = Math.floor(Math.random() * dim);
    let col = Math.floor(Math.random() * dim);
    while (findCell(row, col).textContent != EMPTY)
    {
        row = Math.floor(Math.random() * dim);
        col = Math.floor(Math.random() * dim);
    }
    renderSymbolInCell(ZERO, row, col);
    if (findWin(ZERO, row, col))
    {
        setTimeout(() => alert('Победили нолики!', 500));
        count = -1;
        return;
    }
    if (count === dim * dim)
    {
        setTimeout(() => alert('Победила дружба!'), 500);
        return;
    }
    console.log(`Clicked on cell: ${row}, ${col}`);
}

// Определяем, есть ли победа после текущего хода
function findWin (symbol, row, col)
{
    // Проверяем строку
    for (let i = 0; i < dim; i++)
    {
        if (arr[row][i] !== symbol)
            break;
        // В случае победы, перекрашиваем символы
        if (i == dim - 1)
        {
            for (i = 0; i < dim; i++)
                renderSymbolInCell(symbol, row, i, '#FF0000');
            return true;
        }
    }
    // Проверяем столбец
    for (let i = 0; i < dim; i++)
    {
        if (arr[i][col] !== symbol)
            break;
        if (i == dim - 1)
        {
            for (i = 0; i < dim; i++)
                renderSymbolInCell(symbol, i, col, '#FF0000');
            return true;
        }
    }
    // Проверяем главную диагональ
    if (row == col)
        for (let i = 0; i < dim; i++)
        {
            if(arr[i][i] !== symbol)
                break;
            if (i == dim - 1)
            {
                for (i = 0; i < dim; i++)
                    renderSymbolInCell(symbol, i, i, '#FF0000');
                return true;
            }
        }
    // Проверяем побочную диагональ
    if (row == dim - col - 1)
        for (let i = 0; i < dim; i++)
        {
            if(arr[i][dim - i - 1] !== symbol)
                break;
            if (i == dim - 1)
            {
                for (i = 0; i < dim; i++)
                    renderSymbolInCell(symbol, i, dim - i - 1, '#FF0000');
                return true;
            }
        }
}

function renderSymbolInCell (symbol, row, col, color = '#333')
{
    const targetCell = findCell(row, col);

    targetCell.textContent = symbol;
    targetCell.style.color = color;
    arr[row][col] = symbol;
}

function findCell (row, col)
{
    const targetRow = container.querySelectorAll('tr')[row];
    return targetRow.querySelectorAll('td')[col];
}

function addResetListener ()
{
    const resetButton = document.getElementById('reset');
    resetButton.addEventListener('click', resetClickHandler);
}

// Нажатие кнопки "Сначала"
function resetClickHandler ()
{
    startGame();
    console.log('reset!');
}


/* Test Function */
/* Победа первого игрока */
function testWin ()
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
function testDraw ()
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

function clickOnCell (row, col)
{
    findCell(row, col).click();
}