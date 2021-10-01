const CROSS = 'X';
const ZERO = 'O';
const EMPTY = ' ';

const container = document.getElementById('fieldWrapper');

startGame();
addResetListener();

function startGame() {
    //запрос на размер поля
    let dimension = prompt("Задайте размер поля:", '3');

    //создание поля
    let field = [];
    for (let i = 0; i < dimension; i++) {
        let row = [];
        for (let j = 0; j < dimension; j++) {
            row.push(0);
        }
        field.push(row);
    }

    //создание объекта игры
    let game = {
        field,
        moveCount: dimension ** 2,
        end: false,
        playersMove: 1
    }

    //рендер сетки
    renderGrid(dimension, game);
}

function renderGrid(dimension, game) {
    container.innerHTML = '';

    for (let i = 0; i < dimension; i++) {
        const row = document.createElement('tr');
        for (let j = 0; j < dimension; j++) {
            const cell = document.createElement('td');
            cell.textContent = EMPTY;
            cell.addEventListener('click', () => cellClickHandler(game, i, j));
            row.appendChild(cell);
        }
        container.appendChild(row);
    }
}

function cellClickHandler(game, row, col) {
    console.log(`Clicked on cell: ${row}, ${col}`);

    //проверка на состояние игры и свободу клетки
    if (!game.end && game.field[row][col] === 0) {

        //ход игрока
        game.field[row][col] = game.playersMove;
        game.moveCount -= 1;
        renderSymbolInCell(game.playersMove === 1 ? CROSS : ZERO, row, col);
        //game.playersMove = -game.playersMove;

        //ход бота
        let [botRow, botCol] = smartBotMove(game);
        game.field[botRow][botCol] = -1;
        game.moveCount -= 1;
        renderSymbolInCell(ZERO, botRow, botCol);

        //проверка на конец игры
        checkEndgame(game);

        /*
        //увеличение поля в случае заполнения
        if (game.field.length ** 2 / 2 > game.moveCount){
            increaseTheField(game);
        }
        */
    }
}

function checkEndgame(game) {
    //анализ игрового поля
    let analysisResults = gameAnalysis(game.field);

    //в случае конца игры - вывод результата
    if (analysisResults.zeroWin || analysisResults.crossWin || game.moveCount === 0) {
        if (game.moveCount > 0) paintWinValues(analysisResults, game.field.length);
        game.end = true;
        alert(analysisResults.zeroWin ? 'Победил X' :
            analysisResults.crossWin ? 'Победил O' :
                'Победила дружба');
    }
}

function stupidBotMove(game) {
    let dimension = game.field.length;

    //номер случайной свободной клетки
    let randomEmpty = Math.round(Math.random() * (game.moveCount - 1))

    //перебор свободных клеток и возврат позиции необходимой
    for (let row = 0; row < dimension; row++) {
        for (let col = 0; col < dimension; col++) {
            if (game.field[row][col] === 0) {
                if (randomEmpty === 0) {
                    return [row, col];
                }
                randomEmpty -= 1;
            }
        }
    }
}

function smartBotMove(game) {
    return stupidBotMove(game);
}

function increaseTheField(game) {
    let dimension = game.field.length;

    //увеличение двумерного массива внутри объекта game
    for (let row of game.field) {
        row.push(0);
    }
    let newRow = []
    for (let i = 0; i <= dimension; i++) {
        newRow.push(0);
    }
    game.field.push(newRow);

    //нахождение количества оставшихся ходов
    let spentMoves = dimension ** 2 - game.moveCount;
    game.moveCount = (dimension + 1) ** 2 - spentMoves;

    //перерисовка и заполнение поля
    renderGrid(game.field.length, game)
    for (let i = 0; i < game.field.length; i++) {
        for (let j = 0; j < game.field.length; j++) {
            if (game.field[i][j] !== 0) {
                renderSymbolInCell(game.field[i][j] === 1 ? CROSS: ZERO, i, j);
            }
        }
    }
}

function paintWinValues(analysis, dimension) {
    //находим способ перебора клеток исходя из данных анализа
    let findWinCell = analysis.winRow != null ? i => findCell(analysis.winRow, i) :
        analysis.winColumn != null ? i => findCell(i, analysis.winColumn) :
            analysis.winDiag === 0 ? i => findCell(i, i) :
                    i => findCell(i, dimension - 1 - i);

    //перебираем и красим в красный
    for (let i = 0; i < dimension; i++) {
        findWinCell(i).style.backgroundColor = "red";
    }
}

function gameAnalysis(field) {
    let dimension = field.length;

    //создаем объект для хранения результатов анализа
    let analysisResults = {
        crossWin: false,
        zeroWin: false,
        winRow: null,
        winColumn: null,
        winDiag: null
    }

    //цикл, бегущий по строкам (столбцам)
    for (let i = 0; i < dimension; i++) {

        //переменные для хранения информации, победил ли игрок в этой строке (столбце)
        //изначально считаем, что - да
        let crossRowWin = true;
        let crossColWin = true;
        let zeroRowWin = true;
        let zeroColWin = true;

        //цикл, бегущий по элементам строки (столбца)
        for (let j = 0; j < dimension; j++) {

            //если в элементе обнаруживается знак противника (или отсутствие знаков), то считается,
            //что игрок не победил в этой строке (столбце)
            if (crossRowWin && field[i][j] !== -1) {
                crossRowWin = false;
            }
            if (crossColWin && field[j][i] !== -1) {
                crossColWin = false
            }
            if (zeroRowWin && field[i][j] !== 1) {
                zeroRowWin = false;
            }
            if (zeroColWin && field[j][i] !== 1) {
                zeroColWin = false;
            }

            //если ни один игрок не побеждает ни в одной из строк (столбцов),
            // внешний цикл переходит к следующей строке (столбцу)
            if (!crossRowWin && !crossColWin && !zeroRowWin && !zeroColWin) {
                break;
            }
        }

        //в случае нахождения победителя, цикл прерывается, победитель записывается в результаты
        analysisResults.zeroWin = zeroRowWin || zeroColWin;
        analysisResults.crossWin = crossRowWin || crossColWin;
        if (analysisResults.zeroWin || analysisResults.crossWin) {
            analysisResults.winRow = crossRowWin || zeroRowWin ? i : null;
            analysisResults.winColumn = crossColWin || zeroColWin ? i : null;
            break;
        }
    }

    //если победитель не был найден ранее, поиск ведется по диагоналям
    if (!(analysisResults.zeroWin || analysisResults.crossWin)) {

        //переменные для хранения информации о победе в главной и побочной диагонали
        let crossMainDiagWin = true;
        let crossSideDiagWin = true;
        let zeroMainDiagWin = true;
        let zeroSideDiagWin = true;

        //цикл, бегущий по диагоналям
        for (let i = 0; i < dimension; i++) {
            if (crossMainDiagWin && field[i][i] !== -1) {
                crossMainDiagWin = false;
            }
            if (crossSideDiagWin && field[i][dimension - 1 - i] !== -1) {
                crossSideDiagWin = false;
            }
            if (zeroMainDiagWin && field[i][i] !== 1) {
                zeroMainDiagWin = false;
            }
            if (zeroSideDiagWin && field[i][dimension - 1 - i] !== 1) {
                zeroSideDiagWin = false;
            }
            if (!crossMainDiagWin && !crossSideDiagWin && !zeroMainDiagWin && !zeroSideDiagWin) {
                break;
            }
        }

        //результаты прохода записываются в созданный ранее объект
        analysisResults.crossWin = crossMainDiagWin || crossSideDiagWin;
        analysisResults.zeroWin = zeroMainDiagWin || zeroSideDiagWin;
        analysisResults.winDiag = crossMainDiagWin || zeroMainDiagWin ? 0 : crossSideDiagWin || zeroSideDiagWin ? 1 : null;
    }

    return analysisResults;
}

function renderSymbolInCell(symbol, row, col, color = '#333') {
    const targetCell = findCell(row, col);

    targetCell.textContent = symbol;
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
    console.log('reset!');
    startGame();
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
