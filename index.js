const CROSS = 'X';
const ZERO = 'O';
const EMPTY = ' ';

const container = document.getElementById('fieldWrapper');

const size = 3;
let currentSymbol = ZERO;
let moveCount = size * size;
let hasWinner = false;

startGame();
addResetListener();

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

function cellClickHandler(row, col) {
    // Пиши код тут
    if (!hasWinner && findCell(row, col).textContent === EMPTY) {
        console.log(`Clicked on cell: ${row}, ${col}`);

        if (findCell(row, col).textContent === EMPTY) {
            moveCount -= 1;
            renderSymbolInCell(currentSymbol, row, col);
            currentSymbol = (currentSymbol === ZERO) ? CROSS : ZERO;//
            // if (currentSymbol === ZERO) {
            //     currentSymbol = CROSS;
            // } else {
            //     currentSymbol = ZERO;
            // }
        }
        whoWin(row, col);
        if (moveCount === 0 && !hasWinner) {

            alert("Победила дружба");
        }
    }
}

function paintRed(row, col) {
    findCell(row, col).style.color = "red";
}

function isBorder(row, col) {
    let a = row === 0;
    let b = row === size - 1;
    let c = col === 0;
    let d = col === size - 1;
    return (a && !b && !c && !d) || (!a && b && !c && !d) || (!a && !b && c && !d) || (!a && !b && !c && d);
}

function isAngle(row, col) {
    let a = row === 0;
    let b = row === size - 1;
    let c = col === 0;
    let d = col === size - 1;
    return (!a && b && !c && d) || (!a && b && c && !d) || (a && !b && !c && d) || (a && !b && c && !d);
}

function isMiddle(row, col) {
    let a = row === 0;
    let b = row === size - 1;
    let c = col === 0;
    let d = col === size - 1;
    return (!a && !b && !c && !d);
}

function middleRow(row, col) {
    let a = findCell(row, col - 1).textContent;
    let b = findCell(row, col).textContent;
    let c = findCell(row, col + 1).textContent;
    if (a === b && b === c) {
        paintRed(row, col - 1);
        paintRed(row, col + 1);
        return true;
    }
}

function borderBottom(row, col) {
    let a = findCell(row, col).textContent;
    let b = findCell(row + 1, col).textContent;
    let c = findCell(row + 2, col).textContent;
    if (a === b && b === c) {
        paintRed(row + 1, col);
        paintRed(row + 2, col);
        return true;
    }
}

function borderTop(row, col) {
    let a = findCell(row - 2, col).textContent;
    let b = findCell(row - 1, col).textContent;
    let c = findCell(row, col).textContent;
    if (a === b && b === c) {
        paintRed(row - 2, col);
        paintRed(row - 1, col);
        return true;
    }
}

function middleCol(row, col) {
    let a = findCell(row - 1, col).textContent;
    let b = findCell(row, col).textContent;
    let c = findCell(row + 1, col).textContent;
    if (a === b && b === c) {
        paintRed(row - 1, col);
        paintRed(row + 1, col);
        return true;
    }
}

function borderRight(row, col) {
    let a = findCell(row, col).textContent;
    let b = findCell(row, col + 1).textContent;
    let c = findCell(row, col + 2).textContent;
    if (a === b && b === c) {
        paintRed(row, col + 1);
        paintRed(row, col + 2);
        return true;
    }
}

function borderLeft(row, col) {
    let a = findCell(row, col - 2).textContent;
    let b = findCell(row, col - 1).textContent;
    let c = findCell(row, col).textContent;
    if (a === b && b === c) {
        paintRed(row, col - 2);
        paintRed(row, col - 1);
        return true;
    }
}

function diagonalBottomRight(row, col) {
    let a = findCell(row, col).textContent;
    let b = findCell(row + 1, col + 1).textContent;
    let c = findCell(row + 2, col + 2).textContent;
    if (a === b && b === c) {
        paintRed(row + 1, col + 1);
        paintRed(row + 2, col + 2);
        return true;
    }
}

function diagonalBottomLeft(row, col) {
    let a = findCell(row, col).textContent;
    let b = findCell(row + 1, col - 1).textContent;
    let c = findCell(row + 2, col - 2).textContent;
    if (a === b && b === c) {
        paintRed(row + 1, col - 1);
        paintRed(row + 2, col - 2);
        return true;
    }
}

function diagonalTopLeft(row, col) {
    let a = findCell(row - 2, col - 2).textContent;
    let b = findCell(row - 1, col - 1).textContent;
    let c = findCell(row, col).textContent;
    if (a === b && b === c) {
        paintRed(row - 2, col - 2);
        paintRed(row - 1, col - 1);
        return true;
    }
}

function diagonalTopBottom(row, col) {
    let a = findCell(row - 2, col + 2).textContent;
    let b = findCell(row - 1, col + 1).textContent;
    let c = findCell(row, col).textContent;
    if (a === b && b === c) {
        paintRed(row - 2, col + 2);
        paintRed(row - 1, col + 1);
        return true;
    }
}

function middleDiameter1(row, col) {
    let a = findCell(row - 1, col - 1).textContent;
    let b = findCell(row, col).textContent;
    let c = findCell(row + 1, col + 1).textContent;
    if (a === b && b === c) {
        paintRed(row - 1, col - 1);
        paintRed(row + 1, col + 1);
        return true;
    }
}

function middleDiameter2(row, col) {
    let a = findCell(row - 1, col + 1).textContent;
    let b = findCell(row, col).textContent;
    let c = findCell(row + 1, col - 1).textContent;
    if (a === b && b === c) {
        paintRed(row - 1, col + 1);
        paintRed(row + 1, col - 1);
        return true;
    }
}

function whoWin(row, col) {
    if (isBorder(row, col)) {
        if (row === 0) {
            if (middleRow(row, col) || borderBottom(row, col)) {
                winner(row, col);
            }
        }
        if (row === size - 1) {
            if (middleRow(row, col) || borderTop(row, col)) {
                winner(row, col);
            }
        }
        if (col === 0) {
            if (middleCol(row, col) || borderRight(row, col)) {
                winner(row, col);
            }
        }
        if (col === size - 1) {
            if (middleCol(row, col) || borderLeft(row, col)) {
                winner(row, col);
            }
        }
    }
    if (isAngle(row, col)) {
        if (row === 0 && col === 0) {
            if (borderRight(row, col) || diagonalBottomRight(row, col) || borderBottom(row, col)) {
                winner(row, col);
            }
        }
        if (row === 0 && col === size - 1) {
            if (borderLeft(row, col) || diagonalBottomLeft(row, col) || borderBottom(row, col)) {
                winner(row, col);
            }
        }
        if (row === size - 1 && col === size - 1) {
            if (borderTop(row, col) || diagonalTopLeft(row, col) || borderLeft(row, col)) {
                winner(row, col);
            }
        }
        if (row === size - 1 && col === 0) {
            if (borderTop(row, col) || diagonalTopBottom(row, col) || borderRight(row, col)) {
                winner(row, col);
            }
        }
    }
    if (isMiddle(row, col)) {
        if (middleDiameter1(row, col) || middleCol(row, col) || middleDiameter2(row, col) || middleRow(row, col)) {
            winner(row, col);
        }
    }
}

function winner(row, col) {
    console.log("WIN", row, col);
    hasWinner = true;
    paintRed(row, col);
    alert("win " + findCell(row, col).textContent);
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
    console.log('reset!');
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            findCell(i, j).textContent = EMPTY;
        }
    }
    moveCount = size * size;
    hasWinner = false;
}

/* Test Function */

/* Победа первого игрока */
function testWin() {
    clickOnCell(0, 2);
    clickOnCell(0, 0);
    clickOnCell(2, 0);
    clickOnCell(1, 1);
    clickOnCell(2, 2);
    clickOnCell(1, 2);
    clickOnCell(2, 1);
}

/* Ничья */
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

function clickOnCell(row, col) {
    findCell(row, col).click();
}
