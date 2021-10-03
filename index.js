const CROSS = 'X';
const ZERO = 'O';
const EMPTY = ' ';

const container = document.getElementById('fieldWrapper');

class Field {
    arr = [];
    gameEnded = false;
    winCombo = []
    whoWon = 0;
    markCount = 0;
    dimension = 3;

    constructor(dimension){
        this.dimension = dimension;
        for (let i = 0; i < dimension; i++) {
            this.arr[i] = [];
            for (let j = 0; j < dimension; j++)
                this.arr[i][j] = EMPTY;
        }
    }

    add(mark, i, j){
        this.arr[i][j] = mark;
        this.markCount++;
        if (this.checkWin(mark, i, j)){
            this.gameEnded = true;
            if (mark === CROSS){
                this.whoWon = 1;
            }
            else {
                this.whoWon = 2;
            }
            return;
        }
        if (this.markCount === this.dimension * this.dimension){
            this.gameEnded = true;
        }
    }

    checkWin(mark, row, col){
        for (let i = -1; i <= 1; i++)
        {
            for (let j = -1; j <= 1; j++)
            {
                if (i === 0 && j === 0){
                    continue;
                }
                let comb = [[row, col]];
                for (let n = 1; n < 3; n++)
                {
                    let nextRow = row + n * i;
                    let nextCol = col + n * j;
                    if (nextRow >= 0 && nextCol >= 0 
                        && nextRow < this.dimension && nextCol < this.dimension
                        && this.arr[nextRow][nextCol] === mark){
                            comb.push([nextRow, nextCol]);
                        }
                }
                
                if (comb.length === 3){
                    this.winCombo = comb;
                    return true;
                }
            }
        }

        for (let i = -1; i <= 1; i++)
        {
            for (let j = -1; j <= 1; j++)
            {
                if (i === 0 && j === 0){
                    continue;
                }
                let comb = [[row, col]];
                for (let n = -1; n <= 1; n += 2)
                {
                    let nextRow = row + n * i;
                    let nextCol = col + n * j;
                    if (nextRow >= 0 && nextCol >= 0 
                        && nextRow < this.dimension && nextCol < this.dimension
                        && this.arr[nextRow][nextCol] === mark){
                            comb.push([nextRow, nextCol]);
                        }
                }
                
                if (comb.length === 3){
                    this.winCombo = comb;
                    return true;
                }
            }
        }  

        return false;
    }             
}

let field = new Field(3);
let isCross = true;
startGame();
addResetListener();

function startGame () {
    size = prompt("Введите размер поля");
    field = new Field(size);
    isCross = true;
    renderGrid(size);
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

function cellClickHandler (row, col, isBot = false) {
    if (field.gameEnded){
        return;
    }

    if (findCell(row, col).textContent === EMPTY){
        if (isCross){
            renderSymbolInCell(CROSS, row, col);
            field.add(CROSS, row, col);
        }
        else {
            renderSymbolInCell(ZERO, row, col);
            field.add(ZERO, row, col);
        }
        isCross = !isCross;
    }
    console.log(`Clicked on cell: ${row}, ${col}`);

    if (field.gameEnded){
        for (let cell of field.winCombo){
            findCell(cell[0], cell[1]).style.color = "red";
        }

        if (field.whoWon === 1){
            alert("CROSS");
        }
        else if (field.whoWon === 2){
            alert("ZERO");
        }
        else {
            alert("Победила дружба");
        }

        console.log(field.winCombo);
    }

    if (field.dimension * field.dimension / 2 <= field.markCount) {
        enlargeMap();
    }

    if (isBot){
        return;
    }

    let botTurn = getNextCell();
    cellClickHandler(botTurn[0], botTurn[1], true);
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

function addResetListener () {
    const resetButton = document.getElementById('reset');
    resetButton.addEventListener('click', resetClickHandler);
}

function resetClickHandler () {  
    console.log('reset!');
    startGame();
}

function clickOnCell (row, col) {
    findCell(row, col).click();
}

function enlargeMap() {
        field.dimension++; 
        for (let row of field.arr){
            row.push(EMPTY);
        }
        field.arr.push([]);
        for (let i = 0; i <= field.dimension; i++){
            field.arr[field.dimension - 1].push(EMPTY);
        }

        let n = field.dimension - 1;

        for (let i = 0; i < container.childNodes.length; i++){
            const row = container.childNodes[i];
            const cell = document.createElement('td');
            cell.textContent = EMPTY;
            cell.addEventListener('click', () => cellClickHandler(i, n));
            row.appendChild(cell);
        }

        const row = document.createElement('tr');
        for (let j = 0; j < field.dimension; j++) {
            const cell = document.createElement('td');
            cell.textContent = EMPTY;
            cell.addEventListener('click', () => cellClickHandler(n, j));
            row.appendChild(cell);
        }
        container.appendChild(row);
}

function getNextCell(){
    let emptyCells = [];
    for (let i = 0; i < field.dimension; i++){
        for (let j = 0; j < field.dimension; j++){
            if (field.arr[i][j] === EMPTY){
                emptyCells.push([i, j]);
            }
        }
    }  

    for (let i = 0; i < emptyCells.length; i++){
        let combo = [];
        if (checkWinTurn(ZERO, emptyCells[i][0], emptyCells[i][1], combo)){
            return emptyCells[i];
        }
    }

    return emptyCells[Math.floor(Math.random() * Math.floor(emptyCells.length - 1))];
}

function checkWinTurn(mark, row, col, winCombo){
    for (let i = -1; i <= 1; i++)
    {
        for (let j = -1; j <= 1; j++)
        {
            if (i === 0 && j === 0){
                continue;
            }
            let comb = [[row, col]];
            for (let n = 1; n < 3; n++)
            {
                let nextRow = row + n * i;
                let nextCol = col + n * j;
                if (nextRow >= 0 && nextCol >= 0 
                    && nextRow < field.dimension && nextCol < field.dimension
                    && field.arr[nextRow][nextCol] === mark){
                        comb.push([nextRow, nextCol]);
                    }
            }
            
            if (comb.length === 3){
                winCombo = comb;
                return true;
            }
        }
    }

    for (let i = -1; i <= 1; i++)
    {
        for (let j = -1; j <= 1; j++)
        {
            if (i === 0 && j === 0){
                continue;
            }
            let comb = [[row, col]];
            for (let n = -1; n <= 1; n += 2)
            {
                let nextRow = row + n * i;
                let nextCol = col + n * j;
                if (nextRow >= 0 && nextCol >= 0 
                    && nextRow < field.dimension && nextCol < field.dimension
                    && field.arr[nextRow][nextCol] === mark){
                        comb.push([nextRow, nextCol]);
                    }
            }
            
            if (comb.length === 3){
                winCombo = comb;
                return true;
            }
        }
    }  

    return false;
}