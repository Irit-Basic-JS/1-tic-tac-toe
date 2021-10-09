const CROSS = 'X';
const ZERO = 'O';
const EMPTY = ' ';

class Point {
    x;
    y;

    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    toString() {
        return (`${(this.x)}, ${this.y}`);
    }

    hashCode() {
        return this.x * 509 + this.y;
    }
}

const rowSelector = (index, i) => {
    return [index, i];
};
const columnSelector = (index, i) => {
    return [i, index];
};
const upDownDiagonalSelector = (index, i) => {
    return [i, i];
};

const downUpDiagonalSelector = (index, i, dimension) => {
    return [dimension - i - 1, i];
};

const createDownUpDiagonalSelector = dimension => {
    return (index, i) => downUpDiagonalSelector(index, i, dimension);
};

class Controller {
    useBotInput = document.getElementById('useBot');
    dimensionInput = document.getElementById('dimension');
    resetButton = document.getElementById('reset');

    onCellClick;
    onReset;

    constructor() {
        this.resetButton.addEventListener('click', () => this.onResetHandler());
    }

    getDimension() {
        return Number(this.dimensionInput.value);
    }

    setDimension(value) {
        this.dimensionInput.value = value;
    }

    cellClickHandler(i, j) {
        this.onCellClick(i, j);
    }

    onResetHandler() {
        this.onReset();
    }

    isUseBot() {
        return this.useBotInput.checked;
    }
}

class Line {
    crosses = 0;
    zeros = 0;

    index;
    selector;

    constructor(index, selector) {
        this.index = index;
        this.selector = selector;
    }

    addTurn(turn) {
        if (turn === CROSS)
            this.crosses++;
        else
            this.zeros++;
    }

    isWinner(turn, score) {
        if (turn === CROSS)
            return this.crosses === score;
        else
            return this.zeros === score;
    }

    getScore(turn) {
        return turn === CROSS ? this.crosses : this.zeros;
    }
}

function values(dict) {
    return Object.keys(dict).map(key => dict[key]);
}

class Game {
    MAX_DIMENSION = 100;

    grid = [];
    freeCells = new Map();
    rows;
    cols;
    upDownDiag;
    downUpDiag;

    isGameEnd = false;
    dimension = 3;
    turn = CROSS;

    controller;
    view;

    constructor(controller, view) {
        this.controller = controller;
        this.view = view;

        controller.onCellClick = (i, j) => this.handleCellClick(i, j);
        controller.onReset = () => this.startGame();
    }

    startGame() {
        this.setDimension();
        this.view.renderGrid(this.dimension);
        this.initializeGrid();
        this.isGameEnd = false;
        this.turn = CROSS;
    }

    setDimension() {
        this.dimension = this.controller.getDimension();
        if (this.dimension > this.MAX_DIMENSION) {
            this.controller.setDimension(this.MAX_DIMENSION);
            this.dimension = this.MAX_DIMENSION;
        }
    }

    initializeGrid() {
        this.freeCells.clear();
        this.fillFreeCells();
        this.downUpDiag = new Line(0, createDownUpDiagonalSelector(this.dimension));
        this.upDownDiag = new Line(0, upDownDiagonalSelector);
        this.rows = {};
        this.cols = {};
    }

    fillFreeCells() {
        for (let i = 0; i < this.dimension; i++) {
            this.grid[i] = [];
            for (let j = 0; j < this.dimension; j++) {
                this.grid[i][j] = EMPTY;
                const point = new Point(i, j);
                this.freeCells.set(point.hashCode(), point);
            }
        }
    }

    handleCellClick(row, col) {
        this.makeTurn(row, col);
        if (this.controller.isUseBot())
            this.makeBotTurn();
    }

    makeTurn(row, col) {
        if (!this.canMakeTurn(row, col))
            return;
        this.setTurn(row, col);
        this.checkWinner(row, col);
        this.checkDraw();
        this.swapTurn();
    }

    canMakeTurn(row, col) {
        return this.grid[row][col] === EMPTY && !this.isGameEnd;
    }

    setTurn(row, col) {
        this.grid[row][col] = this.turn;
        this.addTurn(row, col);
        view.renderSymbolInCell(this.turn, row, col);
    }

    addTurn(row, col) {
        this.addTurnToLine(this.rows, row, rowSelector);
        this.addTurnToLine(this.cols, col, columnSelector);
        if (row === col)
            this.upDownDiag.addTurn(this.turn);
        if (row === this.dimension - col - 1)
            this.downUpDiag.addTurn(this.turn);
        this.freeCells.delete(new Point(row, col).hashCode());
    }

    addTurnToLine(line, index, selector) {
        if (line[index] === undefined)
            line[index] = new Line(index, selector);
        line[index].addTurn(this.turn);
    }

    checkWinner(row, col) {
        const winner = this.isWinner(row, col);
        if (winner)
            this.announceWinner(...winner);
    }

    isWinner(row, col) {
        const lines = [this.rows[row], this.cols[col], this.upDownDiag, this.downUpDiag];
        for (const line of lines)
            if (line.isWinner(this.turn, this.dimension))
                return [line.index, line.selector];
    }

    announceWinner(index, selector) {
        this.view.paintLine(index, selector, this.turn);
        this.isGameEnd = true;
        this.view.alert(`Победил ${this.turn}`);
    }

    checkDraw() {
        if (this.freeCells.size === 0 && !this.isGameEnd) {
            this.view.alert("Победила дружба");
            this.isGameEnd = true;
        }
    }

    swapTurn() {
        if (this.turn === ZERO)
            this.turn = CROSS;
        else if (this.turn === CROSS)
            this.turn = ZERO;
    }

    makeBotTurn() {
        const lineToTurn = this.getLineToMakeTurn();

        for (let i = 0; i < this.dimension; i++) {
            const [row, col] = lineToTurn.selector(lineToTurn.index, i);
            if (this.freeCells.has(new Point(row, col).hashCode())) {
                this.makeTurn(row, col);
                return;
            }
        }
    }

    getLineToMakeTurn() {
        const rows = values(this.rows);
        const cols = values(this.cols);
        const lines = [...rows, ...cols, this.upDownDiag, this.downUpDiag];
        const enemy = this.turn === CROSS ? ZERO : CROSS;
        const lineWithMaxEnemyScore = this.getPossibleToWinLine(lines, enemy, this.turn);
        const bestBotLine = this.getPossibleToWinLine(lines, this.turn, enemy);

        if (!bestBotLine && !lineWithMaxEnemyScore)
            return this.getRandomLine(lines);

        if (!bestBotLine)
            return lineWithMaxEnemyScore;

        return bestBotLine.getScore(this.turn) >= lineWithMaxEnemyScore.getScore(enemy)
            ? bestBotLine
            : lineWithMaxEnemyScore;
    }

    getPossibleToWinLine(lines, me, enemy) {
        const sorted = this.sortByScore(lines, me);
        for (const line of sorted) {
            if (line.getScore(enemy) !== 0)
                continue;
            return line;
        }
    }

    sortByScore(lines, player) {
        return lines.sort((a, b) => a.getScore(player) > b.getScore(player) ? -1 : 1);
    }

    getRandomLine(lines) {
        for (const line of lines)
            if (line.crosses + line.zeros !== this.dimension)
                return line;
    }
}

class View {
    container = document.getElementById('fieldWrapper');

    controller;

    constructor(controller) {
        this.controller = controller;
    }

    renderGrid() {
        this.container.innerHTML = '';

        for (let i = 0; i < this.controller.getDimension(); i++) {
            const row = document.createElement('tr');
            for (let j = 0; j < this.controller.getDimension(); j++) {
                const cell = document.createElement('td');
                cell.textContent = EMPTY;
                cell.addEventListener('click', () => controller.cellClickHandler(i, j));
                row.appendChild(cell);
            }
            this.container.appendChild(row);
        }
    }

    renderSymbolInCell(symbol, row, col, color = '#333') {
        const targetCell = this.findCell(row, col);

        targetCell.textContent = symbol;
        targetCell.style.color = color;
    }

    findCell(row, col) {
        const targetRow = this.container.querySelectorAll('tr')[row];
        return targetRow.querySelectorAll('td')[col];
    }

    paintLine(index, selector, symbol) {
        for (let i = 0; i < this.controller.getDimension(); i++) {
            let [row, col] = selector(index, i);
            this.renderSymbolInCell(symbol, row, col, '#ff0000');
        }
    }

    alert(msg) {
        alert(msg);
    }
}

const controller = new Controller();
const view = new View(controller);
const game = new Game(controller, view);
game.startGame();
