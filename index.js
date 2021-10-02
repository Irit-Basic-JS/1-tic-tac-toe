const CROSS = 'X';
const ZERO = 'O';
const EMPTY = ' ';

const player = [CROSS, ZERO];
let phase = 0;

const container = document.getElementById('fieldWrapper');
let field = {};
let size = () => field.length;

let journal = [];

function getGameField (dimension) {
    let field =  {gameOver: false,};
    field.lines = [];
    let lineD = [{x:0,y:1}, {x:1,y:0},
         {x:1,y:1}, {x:1,y:-1}];
    
    for (let i = 0; i < dimension; ++i) {
        for (let j = 0; j < dimension; ++j) {
            field[[i, j]] = {};
            field[[i, j]].symbol = EMPTY;
            field[[i, j]].lines = [];
        }
    }

    for (let i = 0; i < dimension; ++i) {
        for (let j = 0; j < dimension; ++j) {
            for (let d = 0; d < lineD.length; ++d) {
                if (i + lineD[d].x * (dimension - 1) < dimension
                    && j + lineD[d].y * (dimension - 1) < dimension
                    && j + lineD[d].y * (dimension - 1) >= 0) {
                    let line = {sum: 0,};
                    for (let k = 0; k < dimension; ++k) {
                        line[[i + lineD[d].x*k, j + lineD[d].y*k]] = EMPTY;
                        field[[i + lineD[d].x*k, j + lineD[d].y*k]].lines.push(line);
                    }
                    field.lines.push(line);
                }
            }
        }
    }

    return field;
}

startGame();
addResetListener();

function startGame () {
    let fieldSize = prompt("Введите размер поля", 3);
    let aiEnabled = prompt("Включить ИИ? (да/нет)", "да");
    let autoExtendEnabled = prompt("Включить авторасширение поля? (да/нет)", "да");

    field = getGameField(fieldSize);
    field.AI = false, field.autoExtend = false;

    if (aiEnabled.toLowerCase() == "да")
        field.AI = true;

    if (autoExtendEnabled.toLowerCase() == "да")
        field.autoExtend = true;

    console.log(field);
    renderGrid(fieldSize);
}

function renderGrid (dimension) {
    container.innerHTML = '';
    size = dimension;
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

function getValue(symbol) {
    switch (symbol) {
        case CROSS:
            return 1;
        case ZERO:
            return -1;
        default:
            return 0;
    }
}

function placeSymbol(row, col) {
    let symbol = player[phase % player.length];
    phase++;
    field[[row,col]].symbol = symbol;
    field[[row,col]].lines.forEach(line => {
        line[[row, col]] = symbol;
        line.sum += getValue(symbol);
        console.log(getValue(symbol));
    });
    renderSymbolInCell(symbol, row, col);
}

function checkLines (row, col) {
    field.forEach(element => {
        
    });
}

function checkWinner (row, col) {
    field[[row,col]].lines.forEach(line => {
        if (Math.abs(line.sum) == size)
        {
            if (line.sum > 0)
                alert(`Победил ${CROSS}!`)
            else
                alert(`Победил ${ZERO}!`)
            
            highlightLine(line);
            field.gameOver = true;
        }
    });

    if (phase >= size * size && !field.gameOver) {
        alert("Победила дружба")
        field.gameOver = true;
    }
}

function getEmptyPoints(line) {
    let result = []
    for (const key in line) {
        let point = parseKeyPoint(key);
        if (point != null
        && line[key] === EMPTY)
        {
            result.push(point);
        }
    }
    return result;
}

function makeAiMove () {
    let minSum = 100500;
    let minLines = [];
    for (let i = 0; i < field.lines.length; ++i) {
        if (getEmptyPoints(field.lines[i]).length >= 1) {
            if (field.lines[i].sum < minSum) {
                minSum = field.lines[i].sum;
                minLines = [field.lines[i],];    
            }
            else if (field.lines[i].sum == minSum) {
                minLines.push(field.lines[i]);
            }
        }
    }

    let lineI = Math.floor(Math.random()*minLines.length);
    let possiblePoints = getEmptyPoints(minLines[lineI]);
    let pointI = Math.floor(Math.random()
        * possiblePoints.length);

    let point = possiblePoints[pointI];

    clickOnCell(point.x, point.y);
    return;
}

function cellClickHandler (row, col) {
    // Пиши код тут
    console.log(`Clicked on cell: ${row}, ${col}`);
    /* Пользоваться методом для размещения символа в клетке так:
        renderSymbolInCell(ZERO, row, col);
     */
    if (field[[row,col]].symbol == EMPTY
        && !field.gameOver) {
        placeSymbol(row, col);
        checkWinner(row, col);
        journal.push({x:row, y:col});

        if (field.AI && player[phase % player.length] == ZERO) {
            makeAiMove();
        }

        if (phase > size * size / 2 && field.autoExtend && !field.gameOver)
        {
            extendField();
        }
    }
    
}

function renderSymbolInCell (symbol, row, col, color = '#333') {
    const targetCell = findCell(row, col);

    targetCell.textContent = symbol;
    targetCell.style.color = color;
}

function parseKeyPoint(key) {
    let data = key.split(',');
    if (data.length == 2)
        return {x:+data[0], y:+data[1]};
    return null;
}

function highlightLine(line)
{
    let points = [];
    Object.keys(line).forEach(key => {
        let point = parseKeyPoint(key);
        if (point != null)
            points.push(point);
    });

    points.forEach(point => {
        findCell(point.x, point.y)
        .style.background = "red";
    });
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
    let AITemp = field.AI; let AETemp = field.autoExtend;
    field = getGameField(size);
    field.AI = AITemp;
    field.autoExtend = AETemp;
    journal = [];
    console.log(field);
    renderGrid(size);
    phase = 0;
    console.log('reset!');
}

function extendField() {
    phase = 0;
    let newSize = +size + 2;
    let t = field.AI;
    let e = field.autoExtend;

    field = getGameField(newSize);
    field.AI = false;
    renderGrid(newSize);

    let history = [...journal];

    for (let i = 0; i < history.length - 1; ++i)
    {
        clickOnCell(history[i].x + 1, history[i].y + 1);
    }

    field.AI = t;
    field.autoExtend = e;

    clickOnCell(history[history.length - 1].x + 1,
        history[history.length - 1].y + 1);
    
    console.log(field);
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
