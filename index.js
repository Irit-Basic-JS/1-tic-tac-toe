const CROSS = 'X';
const ZERO = 'O';
const EMPTY = ' ';

const container = document.getElementById('fieldWrapper');
let field = new Field(3);

startGame();
addResetListener();

function cellClickHandler(row, col) {
	const symbol = (field.count % 2 === 0) ? CROSS : ZERO;
	let count = field.count;

	field.add(symbol, row, col);
	if (field.count !== count) renderSymbolInCell(symbol, row, col);
	if (field.winner) alert(field.winner);
	console.log(field.grid);
	console.log(`Clicked on cell: ${row}, ${col}`);
}

function startGame() {
	renderGrid(3);
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

function clickOnCell(row, col) {
	findCell(row, col).click();
}

function addResetListener() {
	const resetButton = document.getElementById('reset');
	resetButton.addEventListener('click', resetClickHandler);
}

function resetClickHandler() {
	console.log('reset!');
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

function Field(size) {

	this.count = 0;
	this.size = size;
	this.winner = null;

	this.grid = [];
	for (let i = 0; i < size; i++) {
		this.grid.push([]);
		for (let j = 0; j < size; j++) {
			this.grid[i].push(null);
		}
	}

	this.add = function (symbol, row, col) {
		if (!(this.grid[row][col] === null)) return;
		this.grid[row][col] = symbol;
		this.updateWinner(row, col);
		if (this.gameIsEnd()) alert(this.winner);
		this.count++;
	}

	this.gameIsEnd = function () {
		return (this.count === size * size);
	}

	this.updateWinner = function (row, col) {
		let counters = [0, 0, 0, 0];
		for (let i = 0; i < this.size; i++) {
			if (this.grid[i][col] !== null) {
				counters[0] += (this.grid[i][col] === CROSS) ? 1 : -1;
			}
			if (this.grid[row][i] !== null) {
				counters[1] += (this.grid[row][i] === CROSS) ? 1 : -1;
			}
			if (this.grid[i][i] !== null) {
				counters[2] += (this.grid[i][i] === CROSS) ? 1 : -1;
			}
			if (this.grid[i][this.size - 1 - i] !== null) {
				counters[3] += (this.grid[i][this.size - 1 - i] === CROSS) ? 1 : -1;
			}
		}

		if (counters.includes(3)) this.winner = CROSS;
		if (counters.includes(-3)) this.winner = ZERO;
	}
}
