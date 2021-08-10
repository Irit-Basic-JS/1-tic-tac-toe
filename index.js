const CROSS = 'X';
const ZERO = 'O';
const EMPTY = ' ';

const container = document.getElementById('fieldWrapper');

let count = 0; // Количество совершенных ходов, при наличие победителя равен -1
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
        arr[row] = new Array();
        for (let col = 0; col < dim; col++)
        {
            arr[row][col] = EMPTY;
        }
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
    // Если ячейка не пустая или уже есть победитель, то прерываем выполнение функции
    if ((findCell(row, col).textContent !== EMPTY) || (count === -1)) return;
    count++; // Увеличиваем кол-во шагов на 1
    renderSymbolInCell(CROSS, row, col); // Ставим крестик
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
    // Ход нолика
    let EmpCl = new Array();    
    count++;
    // Проверяем, могут ли этим ходом выиграть нолики. Если могут - ставим выигрышный нолик
    // Проверяем диагонали
    EmpCl = CheckLine(CROSS, 0, 'dg');
            if (EmpCl[0] > -1)  // Красим победную в красный и ставим признак победы
            {
                for (let j = 0; j < dim; j++) 
                     renderSymbolInCell(ZERO, j, j, '#FF0000');   
                     setTimeout(() => alert('Победили нолики!', 500));
                count = -1;
                return;
            }
    EmpCl = CheckLine(CROSS, 0, 'dgp');
            if (EmpCl[0] > -1)  // Красим победную в красный и ставим признак победы
            {
                for (let j = 0; j < dim; j++) 
                     renderSymbolInCell(ZERO, j, dim - j - 1, '#FF0000'); 
                     setTimeout(() => alert('Победили нолики!', 500));  
                count = -1;
                return;
            }
    
    for (let i = 0; i < dim; i++)
        {   // Проверяем строку
            EmpCl = CheckLine(CROSS, i, 'row');
            if (EmpCl[0] > -1)  
            {
                for (let j = 0; j < dim; j++) 
                     renderSymbolInCell(ZERO, i, j, '#FF0000');   
                     setTimeout(() => alert('Победили нолики!', 500));
                count = -1;
                return;
            }
            // Проверяем столбец
            EmpCl = CheckLine(CROSS, i, 'col');
            if (EmpCl[0] > -1)  
            {
                for (let j = 0; j < dim; j++) 
                     renderSymbolInCell(ZERO, j, i, '#FF0000');   
                     setTimeout(() => alert('Победили нолики!', 500));
                count = -1;
                return;
            }

        }
    
    // Проверяем, могут ли этим ходом выиграть крестики. Если могут - ставим "противный" нолик
    EmpCl = CheckLine(ZERO, 0, 'dg'); // проверяем главную диагональ
        if (EmpCl[0] > -1)  
        {
            renderSymbolInCell(ZERO, EmpCl[0], EmpCl[1]); 
            return;  
        }
    EmpCl = CheckLine(ZERO, 0, 'dgp'); // проверяем побочную диагональ
        if (EmpCl[0] > -1)  
        {
            renderSymbolInCell(ZERO, EmpCl[0], EmpCl[1]); 
            return;  
        }
    for (let i = 0; i < dim; i++)
    {   // Проверяем строку
            EmpCl = CheckLine(ZERO, i, 'row');
            if (EmpCl[0] > -1)  
            
            {   renderSymbolInCell(ZERO, EmpCl[0], EmpCl[1]); 
                return;  
            }
            // Проверяем столбец
            EmpCl = CheckLine(ZERO, i, 'col');
            if (EmpCl[0] > -1)  
            {
                renderSymbolInCell(ZERO, EmpCl[0], EmpCl[1]); 
                return;  
            }
    }       
   // Если победных линий нет, ставим нолик случайным образом
   setTimeout(() => setZero(), 200);
   
}
// Определяем выигрышность линии - только одная ячейка пустая, а остальное заполнено, 
// symbol - знак, который не должен встретиться на линии
function CheckLine(symbol, i, line)
{   let m = 0; 
    let row; let col;
    let EmptyCell = new Array(); // координаты пустой клетки
    for (let j = 0; j < dim; j++)
    {   if (line === 'row') {row = i; col = j;} // строка
        if (line === 'col') {row = j; col = i;} // столбец
        if (line === 'dg') {row = j; col = j;}  // диагональ главная
        if (line === 'dgp') {row = j; col = dim - j -1;} // диагональ побочная
        if (arr[row][col] === EMPTY) 
           {
               m++;
               EmptyCell[0] = row; EmptyCell[1] = col;
            }
        if ((arr[row][col] === symbol) || (m > 1)) return EmptyCell[0] = -2;
    }
    return EmptyCell; 
}

// Случайный нолик
function setZero ()
{   // Случайным образом генерируем строку и столбец
    let row; let col;
    do
    {
        row = Math.floor(Math.random() * dim);
        col = Math.floor(Math.random() * dim);
    }
    while ((findCell(row, col).textContent !== EMPTY));
    renderSymbolInCell(ZERO, row, col);
    if (count === dim * dim)
    {
        setTimeout(() => alert('Победила дружба!'), 500);
        return;
    }
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
    console.log(`${symbol} on cell: ${row}, ${col}. Цвет: ${color}`);
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