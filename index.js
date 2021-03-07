const CROSS = 'X';
const ZERO = 'O';
const EMPTY = ' ';

const container = document.getElementById('fieldWrapper');
const size = 3;
let field = new GameField(size);

startGame();
addResetListener();

function GameField(size) {
	this.count = 0;
	this.size = size;
	this.winner = null;

	this.grid = [];
	for (let i = 0; i < this.size; i++) {
		this.grid.push([]);
		for ( let j = 0; j < this.size; j++) {
			this.grid[i][j] = null;
		}
	}

	this.add = function (symbol, row, col) {
		if (this.grid[row][col] !== null) return;
		this.grid[row][col] = symbol;
		this.count++;
		this.updateWinner(row, col);
	}

	this.gameIsEnd = function () {
		return (this.winner || this.count === this.size * this.size);
	}

	this.updateWinner = function (row, col) {
		if (this.count < 5) return;
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
	}

	this.getWinnerCombination = function () {
		let result = [];
		if (this.grid[0][0] === this.grid[this.size - 1][this.size - 1] && this.grid[0][0] === this.winner) {
			for (let i = 0; i < this.size; i++) {
				result.push([i, i]);
			}
		}
		if (this.grid[0][this.size - 1] === this.grid[this.size - 1][0] && this.grid[0][this.size - 1] === this.winner) {
			for (let i = 0; i < this.size; i++) {
				result.push([i, this.size - 1 - i]);
			}
		}
		for (let i = 0; i < this.size; i++) {
			if (this.grid[0][i] === this.grid[this.size - 1][i] && this.grid[0][i] === this.winner) {
				for (let j = 0; j < this.size; j++) {
					result.push([j, i]);
				}
			}
		}
		for (let i = 0; i < this.size; i++) {
			if (this.grid[i][0] === this.grid[i][this.size - 1] && this.grid[i][0] === this.winner) {
				for (let j = 0; j < this.size; j++) {
					result.push([i, j]);
				}
			}
		}
		return result;
	}
}

function cellClickHandler(row, col) {
	const symbol = (field.count % 2 === 0) ? CROSS : ZERO;

	if (!field.gameIsEnd()) {
		field.add(symbol, row, col);
		renderSymbolInCell(symbol, row, col);
	}

	console.log(field.grid);

	if (field.gameIsEnd()) {
		if (field.winner === ZERO) {
			alert("Победили нолики");
		} else if (field.winner === CROSS) {
			alert("Победили крестики");
		} else {
			alert("Победила дружба");
		}
		let winnerCombination = field.getWinnerCombination();
		for (const pair of winnerCombination) {
			renderSymbolInCell(field.winner, pair[0], pair[1], '#FF0000');
		}
	}

	console.log(`Clicked on cell: ${row}, ${col}`);
}

function resetClickHandler() {
	field = new GameField(size);
	for (let i = 0; i < field.size; i++) {
		for (let j = 0; j < field.size; j++) {
			renderSymbolInCell(EMPTY, i, j);
		}
	}
}

function renderSymbolInCell(symbol, row, col, color = '#333') {
	const targetCell = findCell(row, col);
	targetCell.textContent = symbol;
	targetCell.style.color = color;
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