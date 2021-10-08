const CROSS = 'X';
const ZERO = 'O';
const EMPTY = ' ';

const container = document.getElementById('fieldWrapper');

startGame();
addResetListener();

function getRandom(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function startGame() {
    //запрос на размер поля
    let dimension = prompt("Задайте размер поля:", '3');
    let botOn = confirm("Игра с ботом?")
    let smartBotOn = false;
    if (botOn) {
        smartBotOn = confirm("Умный бот?")
    }
    let growingFieldOn = confirm("Увеличивающееся поле?")

    //создание поля
    let field = [];
    for (let i = 0; i < dimension; i++) {
        let row = [];
        for (let j = 0; j < dimension; j++) {
            row.push(EMPTY);
        }
        field.push(row);
    }

    //создание объекта игры
    let game = {
        field,
        botOn,
        smartBotOn,
        growingFieldOn,
        moveCount: dimension ** 2,
        end: false,
        playersMove: CROSS,
        tryMakeAMove(player, row, col) {
            console.log(!game.end && this.moveCount > 0 && player === this.playersMove && this.field[row][col] === EMPTY)
            if (!game.end && this.moveCount > 0 && player === this.playersMove && this.field[row][col] === EMPTY) {
                this.moveCount -= 1;
                this.field[row][col] = player;
                renderSymbolInCell(this.playersMove === CROSS ? CROSS : ZERO, row, col);
                this.playersMove = player === CROSS ? ZERO : CROSS;
                return true;
            }
            return false;
        }
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

    if (game.botOn) {
        if (game.tryMakeAMove(CROSS, row, col)) {
            checkEndgame(game);
            if (!game.end) {
                if (game.smartBotOn) {
                    let [botRow, botCol] = smartBotMove(game);
                    game.tryMakeAMove(ZERO, botRow, botCol)
                } else {
                    let [botRow, botCol] = stupidBotMove(game);
                    game.tryMakeAMove(ZERO, botRow, botCol)
                }
            }
        }
    } else {
        game.tryMakeAMove(game.playersMove, row, col);
    }

    //проверка на конец игры
    checkEndgame(game);

    //увеличение поля в случае заполнения
    if (game.growingFieldOn && game.field.length ** 2 / 2 > game.moveCount) {
        increaseTheField(game);
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
            if (game.field[row][col] === EMPTY) {
                if (randomEmpty === 0) {
                    return [row, col];
                }
                randomEmpty -= 1;
            }
        }
    }
}

let AI = {
    possibleMoves: [],
    getSmartMove(field) {
        this.possibleMoves = [];
        for (let row = 0; row < field.length; row++) {
            for (let col = 0; col < field.length; col++) {
                if (field[row][col] === CROSS) {
                    this.getBestMoves(row, col, field)
                }
            }
        }

        if (this.possibleMoves.length > 0)
            return this.possibleMoves[0];
        for (let row = 0; row < field.length; row++) {
            for (let col = 0; col < field.length; col++) {
                if (field[row][col] === CROSS)
                    this.getGoodMoves(row, col, field);
            }
        }
        if (this.possibleMoves.length > 0)
            return this.possibleMoves[getRandom(0, this.possibleMoves.length - 1)];
        for (let row = 0; row < field.length; row++) {
            for (let col = 0; col < field.length; col++) {
                if (field[row][col] === EMPTY)
                    this.possibleMoves.push([row, col]);
            }
        }

        return this.possibleMoves[getRandom(0, this.possibleMoves.length - 1)];
    },
    getBestMoves(row, col, field) {
        for (let dy = -1; dy <= 1; dy++)
            for (let dx = -1; dx <= 1; dx++)
                if (dx + row >= 0 && dx + row < field.length &&
                    dy + col >= 0 && dy + col < field.length && field[row + dx][col + dy] === CROSS) {
                    if (2 * dx + row >= 0 && 2 * dx + row < field.length &&
                        2 * dy + col >= 0 && 2 * dy + col < field.length && field[2 * dx + row][2 * dy + col] === EMPTY)
                        this.possibleMoves.push([row + 2 * dx, col + 2 * dy]);
                    else if (-dx + row >= 0 && -dx + row < field.length &&
                        -dy + col >= 0 && -dy + col < field.length && field[row - dx][col - dy] === EMPTY) {
                        this.possibleMoves.push([row - dx, col - dy]);
                    }
                }
    },
    getGoodMoves(row, col, field) {
        for (let dy = -1; dy <= 1; dy++)
            for (let dx = -1; dx <= 1; dx++) {
                if (dx + row >= 0 && dx + row < field.length &&
                    dy + col >= 0 && dy + col < field.length && field[row + dx][col + dy] === 0)
                    this.possibleMoves.push([row + dx, col + dy]);
            }
    }
}

function smartBotMove(game) {
    return AI.getSmartMove(game.field);
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
            if (game.field[i][j] !== EMPTY) {
                renderSymbolInCell(game.field[i][j] === CROSS ? CROSS : ZERO, i, j);
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
            if (crossRowWin && field[i][j] !== ZERO) {
                crossRowWin = false;
            }
            if (crossColWin && field[j][i] !== ZERO) {
                crossColWin = false
            }
            if (zeroRowWin && field[i][j] !== CROSS) {
                zeroRowWin = false;
            }
            if (zeroColWin && field[j][i] !== CROSS) {
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
            if (crossMainDiagWin && field[i][i] !== ZERO) {
                crossMainDiagWin = false;
            }
            if (crossSideDiagWin && field[i][dimension - 1 - i] !== ZERO) {
                crossSideDiagWin = false;
            }
            if (zeroMainDiagWin && field[i][i] !== CROSS) {
                zeroMainDiagWin = false;
            }
            if (zeroSideDiagWin && field[i][dimension - 1 - i] !== CROSS) {
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
