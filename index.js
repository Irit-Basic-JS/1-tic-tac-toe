const CROSS = 'X';
const ZERO = 'O';
const EMPTY = ' ';

const container = document.getElementById('fieldWrapper');

let field = {
    map: [],
    size: 3,
    countTurns: 0,
    isCrossTurn: true,
    winCombination:[],
    changeValue(row, col) {
        if (this.map[row][col] === " ") {
            this.countTurns++;
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
        this.countTurns = 0;
    },
    getWinner() {
        return this.checkRows() || this.checkColumns() || this.checkDiag(1) || this.checkDiag(-1) ||
            this.isTie() || undefined;
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
                }

                return firstValue;
            }

            col = col + type;
            row++;
        }
    },
    isTie() {
        if (this.map.every(line => line.every(x => x !== EMPTY)))
            return "Ничья";
    },
    enlarge() {
        this.size++;
        this.size++;
        let array = [];
        console.log(this.size);
        for (let i = 0; i < this.size; i++){
            array.push([]);
            for (let j = 0; j < this.size; j++){
                array[i].push(EMPTY);
            }
        }

        for (let i = 1; i < this.size - 1; i++){
            for (let j = 1; j < this.size - 1; j++){
                array[i][j] = this.map[i - 1][j - 1];
            }
        }

        this.map = array;
    }
};
let AI = {
    possibleTurns: [],
    getTurn() {
        this.possibleTurns = [];
        for(let row = 0; row < field.size; row++) {
            for (let col = 0; col < field.size; col++) {
                if (field.map[row][col] === ZERO) {
                    this.getBestTurns(row,col)
                }
            }
        }

        if (this.possibleTurns.length > 0)
            return this.possibleTurns[0];
        for(let row = 0; row < field.size; row++) {
            for (let col = 0; col < field.size; col++){
                if(field.map[row][col] === ZERO)
                    this.getGoodTurns(row,col);
            }
        }
        if (this.possibleTurns.length > 0)
            return this.possibleTurns[getRandom(0, this.possibleTurns.length - 1)];
        for(let row = 0; row < field.size; row++) {
            for (let col = 0; col < field.size; col++){
                if(field.map[row][col] === EMPTY)
                    this.possibleTurns.push([row, col]);
            }
        }

        return this.possibleTurns[getRandom(0, this.possibleTurns.length - 1)];
    },
    getBestTurns(row, col){
        for (let dy = -1; dy <= 1; dy++)
            for (let dx = -1; dx <= 1; dx++)
                if (dx + row >= 0 && dx + row < field.size &&
                    dy + col >= 0 && dy + col < field.size && field.map[row + dx][col + dy] === ZERO) {
                    if (2*dx + row >= 0 && 2*dx + row < field.size &&
                        2*dy + col >= 0 && 2*dy + col < field.size && field.map[2*dx + row][2*dy + col] === EMPTY)
                        this.possibleTurns.push([row + 2*dx, col + 2*dy]);
                    else if (-dx + row >= 0 && -dx + row < field.size &&
                            -dy + col >= 0 && -dy + col < field.size && field.map[row -dx][col -dy] === EMPTY) {
                            this.possibleTurns.push([row - dx, col - dy]);
                    }
                }
    },
    getGoodTurns(row, col){
        for (let dy = -1; dy <= 1; dy++)
            for (let dx = -1; dx <= 1; dx++) {
                if (dx + row >= 0 && dx + row < field.size &&
                    dy + col >= 0 && dy + col < field.size && field.map[row + dx][col + dy] === EMPTY)
                    this.possibleTurns.push([row + dx, col + dy]);
            }
    }
}

startGame();
addResetListener();

function startGame () {
    let size = prompt("Введите размер доски");
    field.size = size;
    renderGrid(size);
    for (let i = 0; i < size; i++){
        field.map.push([]);
        for (let j = 0; j < size; j++){
            field.map[i].push(EMPTY);
        }
    }
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
    field.changeValue(row,col);
    renderSymbolInCell(field.map[row][col], row, col);
    let winner = field.getWinner();
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

    if (field.countTurns - 1  > (field.size ** 2) / 2)
        enlargeField();
    console.log(`Clicked on cell: ${row}, ${col}`);
    console.log(`Count Turns ${field.countTurns}`);
    if(!field.isCrossTurn) {
        let turnII = AI.getTurn();
        console.log("Ходы ИИ")
        console.log(AI.possibleTurns);
        cellClickHandler(turnII[0], turnII[1]);
    }
}

function renderSymbolInCell (symbol, row, col, color = '#333333') {
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

function enlargeField() {
    field.enlarge();
    renderGrid (field.size);
    for (let i = 0; i < field.size; i++){
        for (let j = 0; j < field.size ; j++){
            renderSymbolInCell(field.map[i][j], i, j);
        }
    }
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

function getRandom(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}