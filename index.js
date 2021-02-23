const CROSS = 'X';
const ZERO = 'O';
const EMPTY = ' ';
const names = {'X': "Navalny", 'O': "Putin"}

const container = document.getElementById('fieldWrapper');

let player = CROSS;
let isOver = false;
startGame();
addResetListener();
let field = createField(3);

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

function cellClickHandler(row, col) {
    isOver ||= isAllFieldFill();
    if (isOver || field[row][col] !== EMPTY)
        return;
    field[row][col] = player;
    renderSymbolInCell(player, row, col);
    let coordinates = getWinCoordinates();
    if (coordinates.length !== 0) {
        recolorWinCells(coordinates);
        isOver = true;
        alert(`${names[player]} is win!`);
        return;
    }
    if (isAllFieldFill()) {
        isOver = true;
        alert("Победила дружба");
    }
    changePlayer();
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

function resetClickHandler() {
    field = createField(3);
    renderGrid(3);
    isOver = false;
}

function recolorWinCells(coordinates, color = '#ff0000') {
    for (let coordinate of coordinates) {
        renderSymbolInCell(player, coordinate.y, coordinate.x, color)
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

function isAllFieldFill() {
    for (let row of field) {
        if (row.some(x => x === EMPTY))
            return false;
    }
    return true;
}

function getWinCoordinates() {
    for (let i = 0; i < field.length; i++) {
        if (isWinSet(field[i])) {
            return field[i].map((value, index) => {
                return {x: index, y: i};
            })
        }
    }

    for (let i = 0; i < field.length; i++) {
        let column = field.map(value => value[i]);
        if (isWinSet(column))
            return field.map((value, index) => {
                return {x: i, y: index};
            })
    }

    let first = [];
    for (let i = 0; i < field.length; i++) {
        first[i] = field[i][i];
    }
    if (isWinSet(first)) {
        return field.map((value, index) => {
            return {x: index, y: index};
        });
    }
    let second = [];
    for (let i = 0; i < field.length; i++) {
        second[i] = field[field.length - i - 1][i];
    }

    if (isWinSet(second)) {
        return field.map((value, index) => {
            return {x: field.length - index - 1, y: index};
        })
    }

    return [];
}

function isWinSet(arr) {
    let set = new Set(arr)
    return set.size === 1 && !set.has(EMPTY);
}


