const CROSS = 'X';
const ZERO = 'O';
const EMPTY = ' ';

const container = document.getElementById('fieldWrapper');

let turnCheck = 0;

let board = new Array();

let dimension = 3;

let winner = EMPTY;

let hasWinSequence = false;

startGame();
addResetListener();

function startGame() {
    renderGrid(dimension);
}

function renderGrid (dimension) {
    container.innerHTML = '';

    BoardGenerator(dimension);
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
    if(board[row][col] === EMPTY && !hasWinSequence)
        (turnCheck % 2 === 0) ? TurnChecker(ZERO, row, col) : 
            TurnChecker(CROSS, row, col);
    console.log(`Clicked on cell: ${row}, ${col}`);
}

function TurnChecker(symbol, row, col){
    board[row][col] = symbol;
    renderSymbolInCell(symbol, row, col);
    turnCheck++;
    CheckWinner();
}

function BoardGenerator(dimension){
    for(let i = 0; i < dimension; i++){
      board[i] = new Array();
      for(let j = 0; j < dimension; j++)
        board[i][j] = EMPTY;
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

function addResetListener () {
    const resetButton = document.getElementById('reset');
    resetButton.addEventListener('click', resetClickHandler);
}

function resetClickHandler () {
    turnCheck = 0;
    for(let i = 0; i < dimension; i++)
        for(let j = 0; j < dimension; j++){
            let targetCell = findCell(i, j);
            targetCell.textContent = EMPTY;
            board[i][j] = EMPTY;
            hasWinSequence = false;
            winner = EMPTY;
        }
    console.log('reset!');
}

function CheckWinner(){
    CheckVertical();
    CheckHorizontal();
    CheckLeftDiag();
    CheckRightDiag();

    if(hasWinSequence)
        alert('Победитель ' + winner);
    if(turnCheck === 9 && !hasWinSequence)
        alert("Победила дружба");
}

function CheckVertical(){
    for(let j = 0; j < 3; j++){
        let checker = 0;
        let symbol = board[0][j];
        for(let i = 0; i < 3; i++){
            if(symbol != EMPTY && board[i][j] === symbol)
            checker++;
        }
        if(checker === 3){
            hasWinSequence = true;
            winner = symbol;
            for(let i = 0; i < 3; i++){
                let targetCell = findCell(i, j);
                targetCell.style.color = "red"; 
            }
            break;
        }
    }
}

function CheckHorizontal(){
    for(let i = 0; i < 3; i++){
        let checker = 0;
        let symbol = board[i][0];
        for(let j = 0; j < 3; j++){
            if(symbol != EMPTY && board[i][j] === symbol)
            checker++;
        }
        if(checker === 3){
            hasWinSequence = true;
            winner = symbol;
            for(let j = 0; j < 3; j++){
                let targetCell = findCell(i, j);
                targetCell.style.color = "red";
            }
            break;
        }
    }
}

function CheckLeftDiag(){
    let checker = 0;
    let symbol = board[0][0];
    for(let n = 0; n < 3; n++){
        if(symbol != EMPTY && board[n][n] === symbol)
            checker++;
    }
    if(checker === 3){
        hasWinSequence = true;
        winner = symbol;
        for(let n = 0; n < 3; n++){
            let targetCell = findCell(n, n);
            targetCell.style.color = "red";
        }
    }
}

function CheckRightDiag(){
    let checker = 0;
    let symbol = board[0][2];
    for(let i = 0; i < 3; i++){
        if(symbol != EMPTY && board[i][2 - i] === symbol)
        checker++;
    }
    if(checker === 3){
        hasWinSequence = true;
        winner = symbol;
        for(let i = 0; i < 3; i++){
            let targetCell = findCell(i, 2 - i);
            targetCell.style.color = "red";
        }
    }  
}