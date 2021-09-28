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
        return this.dimensionInput.value;
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

class Game {
    MAX_DIMENSION = 100;

    grid = [];
    freeCells = new Map();
    isGameEnd = false;
    dimension = 3;
    turn = CROSS;
    validators = [];

    controller;
    view;

    constructor(controller, view) {
        this.controller = controller;
        this.view = view;
        controller.onCellClick = (i, j) => this.handleCellClick(i, j);
        controller.onReset = () => this.startGame();

        this.validators = [
            new IterWinnerChecker(this, rowSelector),
            new IterWinnerChecker(this, columnSelector),
            new StaticWinnerChecker(this, upDownDiagonalSelector),
            new StaticWinnerChecker(this, createDownUpDiagonalSelector(this.dimension))
        ];
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
        if (!this.canMakeTurn(row, col))
            return;
        this.makeTurn(row, col);
        if (this.controller.isUseBot())
            this.makeBotTurn();
    }

    makeTurn(row, col) {
        this.setTurn(row, col);
        this.checkWinner();
        this.checkDraw();
        this.swapTurn();
    }

    canMakeTurn(row, col) {
        return this.grid[row][col] === EMPTY && !this.isGameEnd;
    }

    setTurn(row, col) {
        this.grid[row][col] = this.turn;
        this.freeCells.delete(new Point(row, col).hashCode());
        view.renderSymbolInCell(this.turn, row, col);
    }

    checkWinner() {
        for (let i in this.validators) {
            const winner = this.validators[i].check();
            if (winner) {
                this.announceWinner(...winner);
                break;
            }
        }
    }


    checkDraw() {
        if (this.freeCells.size === 0 && !this.isGameEnd) {
            view.alert("Победила дружба");
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
        const turnKeys = Array.from(this.freeCells.keys());
        if (turnKeys.length === 0)
            return;
        const turnKey = turnKeys[getRandomInt(turnKeys.length)];
        const turn = this.freeCells.get(turnKey);
        this.makeTurn(turn.x, turn.y);
    }

    announceWinner(index, selector) {
        this.view.paintLine(index, selector, this.turn);
        this.isGameEnd = true;
        this.view.alert(`Победил ${this.turn}`);
    }
}

class WinnerChecker {
    game;

    constructor(game) {
        this.game = game;
    }

    isLineWon(index, selector) {
        let firstTurn;
        for (let i = 0; i < this.game.dimension; i++) {
            const [row, col] = selector(index, i);
            let cell = this.game.grid[row][col];
            if (cell === EMPTY)
                return false;
            if (firstTurn === undefined)
                firstTurn = cell;
            if (firstTurn !== cell)
                return false;
        }
        return true;
    }

    check() {
    }
}

class IterWinnerChecker extends WinnerChecker {
    selector;

    constructor(game, selector) {
        super(game);
        this.selector = selector;
    }

    check() {
        for (let i = 0; i < this.game.grid.length; i++) {
            if (this.isLineWon(i, this.selector)) {
                return [i, this.selector];
            }
        }
    }
}

class StaticWinnerChecker extends WinnerChecker {
    constructor(game, selector) {
        super(game);
        this.selector = selector;
    }

    check() {
        if (this.isLineWon(0, this.selector))
            return [0, this.selector];
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


function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

const controller = new Controller();
const view = new View(controller);
const game = new Game(controller, view);
game.startGame();
