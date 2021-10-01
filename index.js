const CROSS = 'X';
const ZERO = 'O';
const EMPTY = ' ';

let currentSymbol = CROSS;

let field = 
    [new Array(3), 
    new Array(3), 
    new Array(3)
];

let countEMPTY = 9;
let hasWinner = false;

const container = document.getElementById('fieldWrapper');

startGame();
addResetListener();

function startGame () {
    renderGrid(3);
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
    
        if (field[row][col] === undefined) {
            if (currentSymbol === CROSS) {
                renderSymbolInCell (CROSS, row, col);
                currentSymbol = ZERO;
                field[row][col] = CROSS;
                countEMPTY -= 1;
            }
            else {
                renderSymbolInCell (ZERO, row, col);
                currentSymbol = CROSS;
                field[row][col] = ZERO;
                countEMPTY -= 1;
            }
        }

    if (checkWinner() == CROSS) {
         alert('Победили крестики');
         
    }
    else if (checkWinner() == ZERO) {
         alert('Победили нолики');
         
    }
    else if (countEMPTY === 0) alert('Победила дружба!');
    console.log(`Clicked on cell: ${row}, ${col}`);

}

function checkWinner() {
    let element = field[0][0];
    if ((element !== EMPTY) && (field[0][0] === element) && (field[0][1] === element) && (field[0][2] === element)) {
        renderSymbolInCell (element, 0, 0, color = '#ff0000');
        renderSymbolInCell (element, 0, 1, color = '#ff0000');
        renderSymbolInCell (element, 0, 2, color = '#ff0000');
        return element;
    }
    if ((element !== EMPTY) && (field[0][0] === element) && (field[1][0] === element) && (field[2][0] === element)) {
        renderSymbolInCell (sym, 0, 0, color = '#ff0000');
        renderSymbolInCell (sym, 1, 0, color = '#ff0000');
        renderSymbolInCell (sym, 2, 0, color = '#ff0000');
        return element;
    }
    if ((element !== EMPTY) && (field[0][0] === element) && (field[1][1] === element) && (field[2][2] === element)) {
        renderSymbolInCell (sym, 0, 0, color = '#ff0000');
        renderSymbolInCell (sym, 1, 1, color = '#ff0000');
        renderSymbolInCell (sym, 2, 2, color = '#ff0000');
        return element;
    }
    element = field[1][1];
    if ((element !== EMPTY) && (field[1][0] === element) && (field[1][1] === element) && (field[1][2] === element)) {
        renderSymbolInCell (element, 1, 0, color = '#ff0000');
        renderSymbolInCell (element, 1, 1, color = '#ff0000');
        renderSymbolInCell (element, 1, 2, color = '#ff0000');
        return element;
    }
    if ((element !== EMPTY) && (field[0][1] === element) && (field[1][1] === element) && (field[2][1] === element)) {
        renderSymbolInCell (element, 0, 1, color = '#ff0000');
        renderSymbolInCell (element, 1, 1, color = '#ff0000');
        renderSymbolInCell (element, 2, 1, color = '#ff0000');
        return element;
    }
    element = field[2][2];
    if ((element !== EMPTY) && (field[2][0] === element) && (field[2][1] === element) && (field[2][2] === element)) {
        renderSymbolInCell (element, 2, 0, color = '#ff0000');
        renderSymbolInCell (element, 2, 1, color = '#ff0000');
        renderSymbolInCell (element, 2, 2, color = '#ff0000');
        return element;
    }
    if ((element !== EMPTY) && (field[0][2] === element) && (field[1][2] === element) && (field[2][2] === element)) {
        renderSymbolInCell (element, 0, 2, color = '#ff0000');
        renderSymbolInCell (element, 1, 2, color = '#ff0000');
        renderSymbolInCell (element, 2, 2, color = '#ff0000');
        return element;
    }
    element = field[2][0];
    if ((element !== EMPTY) && (field[2][0] === element) && (field[1][1] === element) && (field[0][2] === element)) {
        renderSymbolInCell (element, 2, 0, color = '#ff0000');
        renderSymbolInCell (element, 1, 1, color = '#ff0000');
        renderSymbolInCell (element, 0, 2, color = '#ff0000');
        return element;
    }
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
c
function addResetListener () {
    const resetButton = document.getElementById('reset');
    resetButton.addEventListener('click', resetClickHandler);
}

function resetClickHandler () {
    currentSymbol = CROSS;

    field = 
        [new Array(3), 
        new Array(3), 
        new Array(3)
    ];
    countEMPTY = 9;

    for(let i = 0; i < field.length; i++)
        for(let j = 0; j < field.length; j++)
            renderSymbolInCell (EMPTY, i, j);
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
