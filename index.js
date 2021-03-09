const CROSS = 'X';
const ZERO = 'O';
const EMPTY = ' ';

const container = document.getElementById('fieldWrapper');
const size = +prompt("Введите размер поля");
let field = new GameField(size);

startGame();
addResetListener();

function GameField(size) {
	this.count = 0;
	this.size = size;
	this.winner = null;
	this.winningCombination = [];
	this.artificialIntelligenceMoves = [];

	this.grid = [];
	for (let i = 0; i < this.size; i++) {
		this.grid.push([]);
		for (let j = 0; j < this.size; j++) {
			this.grid[i][j] = null;
		}
	}

	this.gridExpansion = function () {
		this.grid.push([]);
		for (let i = 0; i < this.grid.length - 1; i++) {
			this.grid[this.grid.length - 1].push(null);
		}
		for (let i = 0; i < this.grid.length; i++) {
			this.grid[i].push(null);
		}
	}

	this.add = function (symbol, row, col) {
		if (this.grid[row][col] !== null) return;
		this.grid[row][col] = symbol;
		this.count++;
		this.updateWinnerAndWinningCombinations(row, col);
	}

	this.gameIsEnd = function () {
		return (this.winner || this.count === this.size * this.size);
	}

	this.updateWinnerAndWinningCombinations = function (row, col) {
		if (this.count < this.size * 2 - 1) return;
		let counters = [0, 0, 0, 0];
		for (let i = 0; i < this.size; i++) {
			const coordinates = [this.grid[i][col], this.grid[row][i], this.grid[i][i], this.grid[i][this.size - 1 - i]]
			for (let j = 0; j < 4; j++) {
				if (coordinates[j] !== null) {
					counters[j] += (coordinates[j] === CROSS) ? 1 : -1;
				}
			}
		}

		if (counters.includes(this.size)) this.winner = CROSS;
		if (counters.includes(-this.size)) this.winner = ZERO;
		if (this.winner) {
			let winType = counters.indexOf(this.winner === CROSS ? this.size : -this.size);
			this.updateWinningCombination(winType, row, col);
		}
	}

	this.updateWinningCombination = function (winType, row, col) {
		{
			for (let i = 0; i < this.size; i++) {
				if (winType === 0) this.winningCombination.push([i, col]);
				if (winType === 1) this.winningCombination.push([row, i]);
				if (winType === 2) this.winningCombination.push([i, i]);
				if (winType === 3) this.winningCombination.push([i, this.size - 1 - i]);
			}
		}
	}
}

function artificialIntelligenceMove() {
	let randomEmptyCell = getRandomEmptyCell(field);
	let count = 0;
	for (let i = 0; i < field.size; i++) {
		for (let j = 0; j < field.size; j++) {
			if (field.grid[i][j] === null) {
				count++;
				if (count === randomEmptyCell) {
					moveOnCell(ZERO, i, j);
					field.artificialIntelligenceMoves.push([i, j]);
					console.log(`AI clicked on cell: ${i}, ${j}`);
					return;
				}
			}
		}
	}
}

function getRandomEmptyCell(field) {
	let maxNumber = field.size * field.size - field.count;
	return Math.floor(Math.random() * (maxNumber + 1));
}

function cellClickHandler(row, col) {
	moveOnCell(CROSS, row, col);
	console.log(`User clicked on cell: ${row}, ${col}`);
	if (!field.winner) artificialIntelligenceMove();
}

function resetClickHandler() {
	field = new GameField(size);
	renderGrid(size);
	for (let i = 0; i < field.size; i++) {
		for (let j = 0; j < field.size; j++) {
			renderSymbolInCell(EMPTY, i, j);
		}
	}
}

function moveOnCell(symbol, row, col) {
	if (field.grid[row][col] === null) {
		field.add(symbol, row, col);
		renderSymbolInCell(symbol, row, col);

	}

	if (field.gameIsEnd()) {
		colorWinningCombination();
		displayGameResult();
	} else if (field.count * 2 > field.size * field.size) {
		field.size++;
		field.gridExpansion();
		renderGrid(field.size);
		for (let i = 0; i < field.grid.length - 1; i++) {
			for (let j = 0; j < field.grid.length - 1; j++) {
				renderSymbolInCell(field.grid[i][j], i, j);
			}
		}
	}

	console.log(field.grid);
}

function colorWinningCombination() {
	for (const pair of field.winningCombination) {
		renderSymbolInCell(field.winner, pair[0], pair[1], '#FF0000');
	}
}

function displayGameResult() {
	if (field.winner === ZERO) {
		alert("Победили нолики");
	} else if (field.winner === CROSS) {
		alert("Победили крестики");
	} else {
		alert("Победила дружба");
	}
}

function testWin() {
	clickOnCell(0, 2);
	clickOnCell(0, 0);
	clickOnCell(2, 0);
	clickOnCell(1, 1);
	clickOnCell(2, 2);
	clickOnCell(1, 2);
	clickOnCell(2, 1);
}

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

function startGame() {
	renderGrid(size);
}

function renderSymbolInCell(symbol, row, col, color = '#333') {
	const targetCell = findCell(row, col);
	targetCell.textContent = symbol;
	targetCell.style.color = color;
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

function findCell(row, col) {
	const targetRow = container.querySelectorAll('tr')[row];
	return targetRow.querySelectorAll('td')[col];
}

function clickOnCell(row, col) {
	findCell(row, col).click();
}

function addResetListener() {
	const resetButton = document.getElementById('reset');
	resetButton.addEventListener('click', resetClickHandler);
}
