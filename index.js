const CROSS = 'X';
const ZERO = 'O';
const EMPTY = ' ';

const container = document.getElementById('fieldWrapper');

let field = {
    map: [],
    size: 3,
    isCrossTurn: true,
    winCombination:[],
    changeValue(row, col) {
        if (this.map[row][col] === " ") {
            if (this.isCrossTurn) {
                this.map[row][col] = CROSS;
                this.isCrossTurn = false;
            } else {
                this.map[row][col] = ZERO;
                this.isCrossTurn = true;
            }
        }
    },
    clearField() {
        this.map = [];
        this.winCombination = [];
        this.isCrossTurn = true;
    },
    getWinner() {
        return this.checkRows() || this.checkColumns() || this.checkDiag(1) || this.checkDiag(-1) ||
            this.IsTie() || undefined;
    },
    checkRows() {
        for(let row = 0; row < this.size; row++) {
            let firstValue = this.map[row][0];
            if (firstValue === EMPTY)
                continue;
            if (this.map[row].every(x => x === firstValue)) {
                for (let col = 0; col < this.size; col++) {
                    this.winCombination.push([row,col]);
                }

                return firstValue;
            }
        }
    },
    checkColumns() {
        for (let col = 0; col < this.size; col++) {
            let firstValue = this.map[0][col];
            let row = 1;
            if (firstValue === EMPTY)
                continue;
            while (firstValue !== EMPTY && firstValue === this.map[row][col]) {
                if (row === this.size - 1) {
                    for (row = 0; row < this.size; row++) {
                        this.winCombination.push([row,col]);
                    }

                    return firstValue;
                }

                row++;
            }
        }
    },
    checkDiag(type = 1) {
        let firstValue = type === 1 ? this.map[0][0] : this.map[0][this.size - 1];
        if (firstValue === EMPTY)
            return;
        let row = 1;
        let col = type === 1 ? 1 : this.size - 2;
        while (firstValue === this.map[row][col] && row < this.size) {
            if (row === this.size - 1) {
                row = 0;
                for (col = type === 1 ? 0 : this.size - 1; row < this.size; col = col + type, row++) {
                    this.winCombination.push([row,col]);
                    //renderSymbolInCell(firstValue, row, col, "#db0606");
                }

                return firstValue;
            }

            col = col + type;
            row++;
        }
    },
    IsTie() {
        if (this.map.every(line => line.every(x => x !== EMPTY)))
            return "Ничья";
    }
};

startGame();
addResetListener();

function startGame () {
    let size = 3;
    field.size = size;
    renderGrid(size);
    for (let i = 0; i < size; i++){
        field.map.push([]);
        for (let j = 0; j < size; j++){
            field.map[i].push(EMPTY);
        }
    }
    console.log(field.map);

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
    console.log(field.map);
    let winner = field.getWinner();
    console.log(this.winCombination);
    if (winner) {
        if (winner === CROSS || winner === ZERO) {
            for (let i of field.winCombination){
                renderSymbolInCell(winner, i[0], i[1], "#db0606");
            }

            alert(`Победил ${winner}!`);
        } else {
            alert(winner);
        }

        return;
    }

    field.changeValue(row,col);
    renderSymbolInCell(field.map[row][col], row, col);
    console.log(`Clicked on cell: ${row}, ${col}`);
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
    field.clearField();
    startGame();
    console.log('reset!');
}

function testWin () {
    clickOnCell(0, 2);
    clickOnCell(0, 0);
    clickOnCell(2, 0);
    clickOnCell(1, 1);
    clickOnCell(2, 2);
    clickOnCell(1, 2);
    clickOnCell(2, 1);
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
}
