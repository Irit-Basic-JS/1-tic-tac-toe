const CROSS = 'X';
const ZERO = 'O';
const EMPTY = ' ';
let gField = new gameField(3)

const container = document.getElementById('fieldWrapper');

startGame();
addResetListener();

function startGame () {
    renderGrid(3);
}

function gameField (size) {
    this.count = 0;
    this.size = size;
    this.winner = null;
    this.grid = [];
    this.fillGrid = function () {
        for (let i = 0; i < this.size; i++) {
            this.grid.push([]);
            for (let j = 0; j < this.size; j++) {
                this.grid[i].push(null);
            }
        }
    }
    this.fillGrid();

    this.add = function (symbol, row, col) {
        if (!(this.grid[row][col] === null)) return;
        this.grid[row][col] = symbol;
        this.updateWinner(row, col);
        if (this.gameOver()) alert(this.winner);
        this.count++;
    }

    this.gameOver = function () {
        return (this.winner || this.count === (this.size * this.size))
    }

    this.updateWinner = function (row, col) {
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

        if (counters.includes(this.size)) {
            this.winner = CROSS;
        }

        if (counters.includes(-this.size)) {
            this.winner = ZERO;
        }
    }

    this.getWinCombination = function () {
        let res = [];
        if (this.grid[0][0] === this.grid[this.size - 1][this.size - 1] &&
            this.grid[0][0] === this.winner) {
            for (let i = 0; i < this.size; i++) {
                res.push([i, i]);
            }
        }
        if (this.grid[0][this.size - 1] === this.grid[this.size - 1][0] &&
            this.grid[0][this.size - 1] === this.winner) {
            for (let i = 0; i < this.size; i++) {
                res.push([i, this.size - 1 - i]);
            }
        }
        for (let i = 0; i < this.size; i++) {
            if (this.grid[0][i] === this.grid[this.size - 1][i] && this.grid[0][i] === this.winner) {
                for (let j = 0; j < this.size; j++) {
                    res.push([j, i]);
                }
            }
        }
        for (let i = 0; i < this.size; i++) {
            if (this.grid[i][0] === this.grid[i][this.size - 1] && this.grid[i][0] === this.winner) {
                for (let j = 0; j < this.size; j++) {
                    res.push([i, j]);
                }
            }
        }
        return res;
    }
}

function cellClickHandler (row, col) {
    console.log(gField.count)
    const sym = (gField.count % 2 === 0) ? CROSS : ZERO;

    if (!gField.gameOver()) {
        gField.add(sym, row, col);
        renderSymbolInCell(sym, row, col);
    }

    if (gField.gameOver()) {
        if (gField.winner === ZERO) {
            alert("Победили нолики");
        } else if (gField.winner === CROSS) {
            alert("Победили крестики");
        } else {
            alert("Победила дружба");
        }
        let winCombination = gField.getWinCombination();
        for (const pair of winCombination) {
            renderSymbolInCell(gField.winner, pair[0], pair[1], '#FF0000');
        }
    }
    console.log(`Clicked on cell: ${row}, ${col}`);
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
    gField = new gameField(3);
    for (let i = 0; i < gField.size; i++) {
        for (let j = 0; j < gField.size; j++) {
            renderSymbolInCell(EMPTY, i, j);
        }
    }
}

/* Test Function
function testWin () {
    clickOnCell(2, 2);
}

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
}*/
