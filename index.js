const CROSS = 'X';
const ZERO = 'O';
const EMPTY = ' ';

const container = document.getElementById('fieldWrapper');

let size;
let gameMap;

startGame();

function startGame() {
	size = +prompt('Размер поля');
	gameMap = new GameMap(size);
	renderGrid(size);
	addResetListener();
}

function cellClickHandler(row, col) {
	move(CROSS, row, col);
	console.log(`User clicked on cell: ${row}, ${col}`);
	if (!gameMap.winner) moveAI();
}

function resetClickHandler() {
	console.log('reset!');
	startGame();
}

function move(symbol, row, col) {
	 {
		gameMap.add(symbol, row, col);
		renderSymbolInCell(symbol, row, col);
	}

	if (gameMap.winner) {
		colorInRed(gameMap.winningCombination, gameMap.winner);
		setTimeout(alertWinner, 300);
	}

	else if (gameMap.map.size * 2 > gameMap.size * gameMap.size) {
		gameMap.expand();
		renderGrid(gameMap.size);
		for (let [line, symbol] of gameMap.map) {
			let [row, col] = line.split(' ');
			renderSymbolInCell(symbol, row, col);
		}
	}
}

function moveAI() {
	if (gameMap.AICanWin()) {
		let [row, col] = gameMap.getAIWinCell();
		move(ZERO, row, col);
	}

	let emptyCellCount = gameMap.size * gameMap.size - gameMap.map.size;
	let randomEmptyCell = getRandomInteger(emptyCellCount);
	for (let row = 0; row < gameMap.size; row++) {
		for (let col = 0; col < gameMap.size; col++) {
			if (!gameMap.map.has(`${row} ${col}`)) {
				randomEmptyCell--;
				if (randomEmptyCell === 0) move(ZERO, row, col);
			}
		}
	}
}

function getRandomInteger(integer) {
	return Math.floor(Math.random() * (integer + 1));
}

function GameMap(size) {
	this.size = size;
	this.winner = null;
	this.winningCombination = [];
	this.map = new Map;

	let result = {}
	result.rows = new Array(size).fill(0);
	result.columns = new Array(size).fill(0);
	result.diagonals = [0, 0];

	this.expand = function () {
		this.size++;
		result.rows.push(0);
		result.columns.push(0);
	}

	this.add = function (symbol, row, col) {
		this.map.set(`${row} ${col}`, symbol);
		this.updateResult(symbol, row, col);
		this.updateWinner(symbol);
	}

	this.updateResult = function (symbol, row, col) {
		let value = symbol === CROSS ? 1 : -1;
		result.rows[row] += value;
		result.columns[col] += value;
		if (row === col) result.diagonals[0] += value;
		if (row === this.size - 1 - col) result.diagonals[1] += value;
	}

	this.updateWinner = function (symbol) {
		let value = symbol === CROSS ? this.size : -this.size;
		if (result.rows.includes(value)
			|| result.columns.includes(value)
			|| result.diagonals.includes(value)) {
			this.winner = symbol;
			this.updateWinningCombination(symbol);
		} else if (this.map.size === this.size * this.size) this.winner = EMPTY;
	}

	this.updateWinningCombination = function (symbol) {
		let value = symbol === CROSS ? this.size : -this.size;
		if (result.rows.includes(value)) {
			let row = result.rows.indexOf(value);
			for (let i = 0; i < this.size; i++) {
				this.winningCombination.push([row, i]);
			}
		}
		if (result.columns.includes(value)) {
			let col = result.columns.indexOf(value);
			for (let i = 0; i < this.size; i++) {
				this.winningCombination.push([i, col]);
			}
		}
		if (result.diagonals[0] === value) {
			for (let i = 0; i < this.size; i++) {
				this.winningCombination.push([i, i]);
			}
		}
		if (result.diagonals[1] === value) {
			for (let i = 0; i < this.size; i++) {
				this.winningCombination.push([i, this.size - 1 - i]);
			}
		}
	}

	this.AICanWin = function () {
		let value = -this.size + 1;
		return (result.rows.includes(value)
			|| result.columns.includes(value)
			|| result.diagonals.includes(value))
	}

	this.getAIWinCell = function () {
		let value = -this.size + 1;
		if (result.rows.includes(value)) {
			let row = result.rows.indexOf(value);
			for (let col = 0; col < this.size; col++) {
				if (!this.map.has(`${row} ${col}`))
					return [row, col];
			}
		}
		if (result.columns.includes(value)) {
			let col = result.columns.indexOf(value);
			for (let row = 0; row < this.size; row++) {
				if (!this.map.has(`${row} ${col}`))
					return [row, col];
			}
		}
		if (result.diagonals[0] === value) {
			for (let i = 0; i < this.size; i++) {
				if (!this.map.has(`${i} ${i}`))
					return [i, i];
			}
		}
		if (result.diagonals[1] === value) {
			for (let i = 0; i < this.size; i++) {
				if (!this.map.has(`${i} ${this.size - 1 - i}`))
					return [i, this.size - 1 - i];
			}
		}
	}
}

function colorInRed(winningCombination, symbol) {
	for (let [row, col] of winningCombination) {
		renderSymbolInCell(symbol, row, col, '#FF0000');
	}
}

function alertWinner() {
	if (gameMap.winner === CROSS) alert("Победили крестики!");
	else if (gameMap.winner === ZERO) alert("Победили нолики!");
	else alert("Победила дружба!")
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
