const CROSS = "X";
const ZERO = "O";
const EMPTY = " ";
const names = {"X": "Navalny", "O": "Putin"};
const defaultDimension = 3;
let dimension = 3;

const container = document.getElementById("fieldWrapper");

let player = CROSS;
let isOver = false;
let field;
startGame();
addResetListener();

function startGame() {
	const dim = prompt("Enter field dimension");
	if (dim) {
		dimension = dim;
	} else {
		dimension = defaultDimension;
	}
	player = CROSS;
	renderGrid(dimension, () => EMPTY);
	field = createField(dimension);
	isOver = false;
}

function renderGrid(dimension, getCellValue) {
	container.innerHTML = "";
	
	for (let i = 0; i < dimension; i++) {
		const row = document.createElement("tr");
		for (let j = 0; j < dimension; j++) {
			const cell = document.createElement("td");
			cell.textContent = getCellValue(i, j);
			cell.addEventListener("click", () => cellClickHandler(i, j));
			row.appendChild(cell);
		}
		container.appendChild(row);
	}
}

function cellClickHandler(row, col) {
	let emptyCells = getEmptyCells();
	isOver ||= emptyCells.length === 0;
	if (isOver || field[row][col] !== EMPTY)
		return;
	field[row][col] = player;
	emptyCells = emptyCells.filter(cell => cell.x !== col || cell.y !== row);
	renderSymbolInCell(player, row, col);
	const lines = getLinesAndDiagonals();
	let coordinates = getWinCoordinates(lines);
	if (coordinates.length !== 0) {
		recolorWinCells(coordinates);
		isOver = true;
		alert(`${names[player]} is win!`);
		return;
	}
	if (emptyCells.length === 0) {
		isOver = true;
		alert("Победила дружба");
	}
	changePlayer();
	if (player === ZERO) {
		const cells = lines.find(line => line.some(x => x.value === EMPTY) && line.every(x => x.value !== CROSS));
		const cell = cells ? cells.find(x => x.value === EMPTY) : emptyCells[getRandomInt(emptyCells.length - 1)];
		cellClickHandler(cell.y, cell.x);
		return;
	}
	if (emptyCells.length <= dimension * dimension / 2) {
		addDimension();
	}
}


function renderSymbolInCell(symbol, row, col, color = "#333") {
	const targetCell = findCell(row, col);
	targetCell.textContent = symbol;
	targetCell.style.color = color;
}

function findCell(row, col) {
	const targetRow = container.querySelectorAll("tr")[row];
	return targetRow.querySelectorAll("td")[col];
}

function addResetListener() {
	const resetButton = document.getElementById("reset");
	resetButton.addEventListener("click", startGame);
}

function recolorWinCells(coordinates, color = "#ff0000") {
	for (let coordinate of coordinates) {
		renderSymbolInCell(coordinate.value, coordinate.y, coordinate.x, color);
	}
}

function createField(dimension) {
	let result = [];
	for (let i = 0; i < dimension; i++) {
		result[i] = [];
		for (let j = 0; j < dimension; j++) {
			result[i][j] = EMPTY;
		}
	}
	return result;
}

function changePlayer() {
	player = player === CROSS ? ZERO : CROSS;
}

function getWinCoordinates(lines) {
	for (const line of lines) {
		if (isWinSet(line))
			return line;
	}
	return [];
}

function isWinSet(arr) {
	return new Set(arr.map(x => x.value)).size === 1 && arr[0].value !== EMPTY;
}

function getRandomInt(max) {
	return Math.floor(Math.random() * Math.floor(max));
}

function getEmptyCells() {
	let result = [];
	for (let i = 0; i < dimension; i++) {
		for (let j = 0; j < dimension; j++) {
			if (field[i][j] === EMPTY)
				result.push({x: j, y: i, value: EMPTY});
		}
	}
	return result;
}

function addDimension() {
	dimension++;
	for (let row of field) {
		row.push(EMPTY);
	}
	let arr = new Array(dimension);
	field.push(arr);
	for (let i = 0; i < dimension; i++) {
		arr[i] = EMPTY;
	}
	renderGrid(dimension, (row, column) => field[row][column]);
}


function getLinesAndDiagonals() {
	let result = [];
	result = result.concat(getHorizontalLines());
	result = result.concat(getVerticalLines());
	result.push(getLeftSlash());
	result.push(getRightSlash());
	return result;
}

function getHorizontalLines() {
	let result = [];
	for (let i = 0; i < field.length; i++) {
		result.push(field[i].map((value, index) => {
			return {x: index, y: i, value: value};
		}));
	}
	return result;
}

function getVerticalLines() {
	let result = [];
	for (let i = 0; i < field.length; i++) {
		result.push(field.map((value, index) => {
			return {x: i, y: index, value: field[index][i]};
		}));
	}
	return result;
}

function getLeftSlash() {
	let result = [];
	for (let i = 0; i < field.length; i++) {
		result.push({x: i, y: i, value: field[i][i]});
	}
	return result;
}

function getRightSlash() {
	let result = [];
	for (let i = 0; i < field.length; i++) {
		result.push({x: i, y: field.length - i - 1, value: field[field.length - i - 1][i]});
	}
	return result;
}
