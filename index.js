const CROSS = 'X';
const ZERO = 'O';
const EMPTY = ' ';

const container = document.getElementById('fieldWrapper');
const dimension = parseInt(prompt('Введите размерность поля'))

const game = {
    isOver: false,
    dimension: null,
    player: undefined,
    field: undefined,

    init: function(dimension = 3) {
        this.player = CROSS;
        this.isOver = false;
        this.dimension = dimension;
        this.field = new Array(dimension).fill(0).map( n => new Array(dimension).fill(EMPTY))
        console.log(this.field)
    },

    handleMove: function(y, x) {
        this.field[y][x] = this.player;
    },

    switchPlayer: function() {
        this.player = this.player === ZERO ? CROSS : ZERO;
    },

    getWinner: function() {
        const checkRows = () => {
            for (let i = 0; i < this.dimension; ++i) {
                if ( this.field[i].every( val => val === CROSS) || this.field[i].every( val => val === ZERO)) {
                    return this.field[i].map( (val, index) => {return {row: i, col: index}});
                }
            }
        }

        const checkColumns = () => {
            for (let i = 0, isWinner = true; i < this.dimension; ++i, isWinner = true) {
                const possibleWinner = this.field[0][i];
                if (possibleWinner === EMPTY) continue;
                const fields = [];

                for (let j = 0; j < this.dimension; ++j) {
                    isWinner = isWinner && (this.field[j][i] === possibleWinner)
                    fields.push({row: j, col: i})
                }
                if (isWinner) {
                    return fields;
                }
            }
        }

        const checkDiagonals = () => {
            const mainDiagonal = [];
            const secondaryDiagonal = [];
            for(let i = 0; i < this.dimension; ++i) {
                mainDiagonal.push({row: i, col: i, val: this.field[i][i]});
                secondaryDiagonal.push({row: i, col: this.dimension - i - 1, val: this.field[i][this.dimension - i - 1]});
            }

            if (mainDiagonal.every( val => val.val === CROSS) || mainDiagonal.every( val => val.val === ZERO)) {
                return mainDiagonal;
            }
            if (secondaryDiagonal.every( val => val.val === CROSS) || secondaryDiagonal.every( val => val.val === ZERO)) {
                return secondaryDiagonal;
            }
        }

        const rowWinner = checkRows();
        const diagonalWinner = checkDiagonals();
        const columnsWinner = checkColumns();
        if (rowWinner || diagonalWinner || columnsWinner) this.isOver = true;
        if (rowWinner) return rowWinner;
        if (diagonalWinner) return diagonalWinner;
        if (columnsWinner) return columnsWinner;
    },

    checkDraft: function() {
        for(let i = 0; i < this.dimension; ++i) {
            for(let j = 0; j < this.dimension; ++j) {
                if (this.field[i][j] === EMPTY) {
                    return false;
                }
            }
        }
        this.isOver = true;
        return true;
    }
}

startGame();
addResetListener();

function startGame () {
    game.init(dimension);
    renderGrid(dimension);
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

function cellClickHandler (row, col) {
    // Пиши код тут
    if (game.field[row][col] === EMPTY && !game.isOver) {
        console.log(row, col)
        renderSymbolInCell(game.player, row, col);

        game.handleMove(row, col);
        const winner = game.getWinner();
        if (winner) {

            for (let field of winner) {
                renderSymbolInCell(game.player, field.row, field.col, 'red');
            }

            setTimeout( () => alert(`Победили ${game.player === CROSS ? 'крестики' : 'нолики'}`), 10);
        } else if(game.checkDraft()) {
            setTimeout( () => alert('Победила дружба'), 10)
        } else {
            game.switchPlayer();
        }
    }
    /* Пользоваться методом для размещения символа в клетке так:
        renderSymbolInCell(ZERO, row, col);
     */
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
    resetButton.addEventListener('click', startGame);
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