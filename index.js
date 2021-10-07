const CROSS = 'X';
const ZERO = 'O';
const EMPTY = ' ';
const size = +prompt("Размер поля")
let gField = new gameField(3)

const container = document.getElementById('fieldWrapper');

startGame();
addResetListener();

function startGame () {
    renderGrid(size);
}

function gameField (size) {
    this.count = 0;
    this.size = size;
    this.winner = null;
    this.getWinCombination = [];
    this.grid = [];
    this.artIntSteps = [];
    for (let i = 0; i < this.size; i++) {
        this.grid.push([]);
        for (let j = 0; j < this.size; j++) {
            this.grid[i][j] = null;
        }
    }

    this.add = function (symbol, row, col) {
        if (!(this.grid[row][col] === null)) return;
        this.grid[row][col] = symbol;
        if (this.gameOver()) alert(this.winner);
        this.count++;
        this.updateWinner(row, col);
    }

    this.gameOver = function () {
        return (this.winner || this.count === (this.size * this.size))
    }

    this.gridExpansion = function () {
        this.grid.push([]);
        for (let i = 0; i < this.grid.length - 1; i++) {
            this.grid[this.grid.length - 1].push(null)
        }

        for (let j = 0; j < this.grid.length; j++) {
            this.grid[j].push(null)
        }
    }

    this.updateWinner = function (row, col) {
        if (this.count < this.size * 2 - 1)
            return;
        let counters = [0, 0, 0, 0];
        for (let i = 0; i < this.size; i++) {
            const coordinates = [this.grid[i][col], this.grid[row][i],
                this.grid[i][i], this.grid[i][this.size - 1 - i]]
            for (let j = 0; j < 4; j++) {
                if (coordinates[j] !== null) {
                    counters[j] += (coordinates[j] === CROSS) ? 1 : -1;
                }
            }
        }

        console.log(counters);
        if (counters.includes(this.size)) {
            this.winner = CROSS;
        }

        if (counters.includes(-this.size)) {
            this.winner = ZERO;
        }

        if (this.winner) {
            let winType = counters.indexOf(this.winner === CROSS ? this.size : -this.size);
            this.updateWinCombination(winType, row, col);
        }
    }

    this.updateWinCombination = function (winType, row, col) {
        for (let i = 0; i < this.size; i++) {
            if (winType === 0) this.getWinCombination.push([i, col]);
            if (winType === 1) this.getWinCombination.push([row, i]);
            if (winType === 2) this.getWinCombination.push([i, i]);
            if (winType === 3) this.getWinCombination.push([i, this.size - 1 - i]);
        }
    }
}

function getEmptyCell(field) {
    let maxNumber = field.size * field.size - field.count;
    return Math.floor(Math.random() * (maxNumber + 1));
}

function winColor() {
    for (const pair of gField.getWinCombination) {
        renderSymbolInCell(gField.winner, pair[0], pair[1], '#FF0000');
    }
}

function gameResult() {
    if (gField.winner === ZERO) {
        alert("Победили нолики");
    } else if (gField.winner === CROSS) {
        alert("Победили крестики");
    } else {
        alert("Победила дружба");
    }
}

function moveOnCell(symbol, row, col) {
    if (gField.grid[row][col] === null) {
        gField.add(symbol, row, col);
        renderSymbolInCell(symbol, row, col);
    }
    if (gField.gameOver()) {
        winColor();
        gameResult();
    } else if (gField.count * 2 > gField.size ** 2) {
        gField.size += 1;
        gField.gridExpansion();
        renderGrid(gField.size);
        for (let i = 0; i < gField.grid.length - 1; i++) {
            for (let j = 0; j < gField.grid.length; j++) {
                renderSymbolInCell(gField.grid[i][j], i, j);
            }
        }
    }
    console.log(gField.grid);
}

function artIntSteps () {
    let emptyCell = getEmptyCell(gField);
    let count = 0;
    for (let i = 0; i < gField.size; i++) {
        for (let j = 0; j < gField.size; j++) {
            if (gField.grid[i][j] === null) {
                count += 1;
                if (count === emptyCell) {
                    moveOnCell(ZERO, i, j);
                    gField.artIntSteps.push([i,j]);
                    console.log('AI step on cell: ${i}, ${j}');
                    return;
                }
            }
        }
    }
}

function cellClickHandler (row, col) {
    if(gField.count % 2 === 0) {
        moveOnCell(CROSS, row, col);
        console.log('U step on cell: ${row}, ${col}')
    } else {
        artIntSteps();
    }
}
function renderGrid(dimension) {
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
    gField = new gameField(size);
    for (let i = 0; i < gField.size; i++) {
        for (let j = 0; j < gField.size; j++) {
            renderSymbolInCell(EMPTY, i, j);
        }
    }
    renderGrid(size);
}
