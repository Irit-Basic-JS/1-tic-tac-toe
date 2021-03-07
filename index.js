const CROSS = "X";
const ZERO = "O";
const EMPTY = " ";

const container = document.getElementById("fieldWrapper");

class Game {
  whoseTurn;
  field;
  isGameOver;
  players;
  isBot = false;
  units;
  constructor(
    firstPlayer,
    secondPlayer = new Player(),
    units = { CROSS: "X", ZERO: "O", EMPTY: " " },
    ...restPlayers
  ) {
    this.players = [firstPlayer, secondPlayer].concat(restPlayers);
    this.units = units;
    this.whoseTurn = firstPlayer;
  }

  start(dimension) {
    this.field = new Field(dimension);
    this.currentSymbol = "X";
    this.isGameOver = false;
  }

  attackWeights = [0.1, 2, 4, 6, 200];
  defenseWeights = [0.25, 5, 7, 100, 200];
  makeMove() {
    if (this.whoseTurn.isBot) {
      let weights = [];
      for (let x = 0; x < this.field.dimension; x++) {
        weights[x] = [];
        for (let y = 0; y < this.field.dimension; y++) {
          if (this.field.isCellEmpty(x, y)) {
            for (let dx = -1; dx <= 1; dx++) {
              for (let dy = -1; dy <= 1; dy++) {
                weights[x][y] += this.getAttackWeights(x, y, dx, dy);
                weights[x][y] += this.getDefenseWeights(x, y, dx, dy);
              }
            }
          }
        }
      }

      let maxWeight = 0.0;
      let resX = -1;
      let resY = -1;
      for (let x = 0; x < this.field.dimension; x++) {
        for (let y = 0; y < this.field.dimension; y++) {
          if (weights[x][y] > maxWeight) {
            maxWeight = weights[x][y];
            resX = x;
            resY = y;
          }
        }
      }
      if (resX == -1 || resY == -1) {
        while (!this.field.isCellEmpty(resX, resY)) {
          resX = Math.floor(Math.random() * this.field.dimension);
          resY = Math.floor(Math.random() * this.field.dimension);
        }
      }
      return [resX, resY];
    }
  }

  getAttackWeights(x, y, directionX, directionY) {
    let result = 0;
    for (let d = 1; d < this.field.dimension; d++) {
      if (
        this.field.isCellEquals(
          x + d * directionX,
          y + d * directionY,
          this.whoseTurn.symbol
        )
      ) {
        result += this.attackWeights[d];
      } else {
        if (this.field.isCellEmpty(x + d * directionX, y + d * directionY)) {
          break;
        }
      }
    }
    return result;
  }

  getDefenseWeights(x, y, directionX, directionY, playerSymbol) {
    let result = 0;
    for (let d = 1; d < this.field.dimension; d++) {
      if (!this.field.isCellInBounds(x + d * directionX, y + d * directionY))
        return result;
      if (
        this.field.map.get(`${x + d * directionX}.${y + d * directionY}`) !==
          playerSymbol &&
        this.field.map.get(`${x + d * directionX}.${y + d * directionY}`) !==
          EMPTY
      ) {
        result += this.defenseWeights[d];
      } else {
        return result;
      }
    }
    // if (result > 0) debugger;
    return result;
  }
}

class Player {
  name;
  symbol;
  constructor(name, symbol) {
    (this.name = name), (this.symbol = symbol);
  }
}

class Field {
  map;
  dimension;

  constructor(dimension, units) {
    this.map = new Map();
    this.dimension = dimension;
    this.units = units;
  }

  isCellEquals(row, col, symbol) {
    if (!this.isCellInBounds(row, col)) return false;
    return this.map.get(`${row}.${col}`) === symbol;
  }

  isCellEmpty(row, col) {
    if (!this.isCellInBounds(row, col)) {
      return false;
    }
    return !this.map.has(`${row}.${col}`);
  }

  isCellInBounds(row, col) {
    return row >= 0 && row < this.dimension && col >= 0 && col < this.dimension;
  }
}

class Bot extends Player {
  isBot = true;
}

let game;
startGame();
addResetListener();

function startGame() {
  let firstPlayer = new Player("Маша", "X");
  let secondPlayer = new Bot("ИИ", "0");
  game = new Game(firstPlayer, secondPlayer);
  let dimension = 3;
  dimension = +(prompt("Введите размер поля") ?? 3);
  console.log(dimension);
  game.start(dimension);

  renderGrid(game.field.dimension);
}

function renderGrid(dimension) {
  container.innerHTML = "";

  for (let i = 0; i < dimension; i++) {
    const row = document.createElement("tr");
    for (let j = 0; j < dimension; j++) {
      const cell = document.createElement("td");
      cell.textContent = " ";
      cell.addEventListener("click", () => cellClickHandler(i, j));
      row.appendChild(cell);
    }
    container.appendChild(row);
  }
}

function cellClickHandler(row, col) {
  if (!(game.field.map.has(`${row}.${col}`) || game.isGameOver)) {
    game.field.map.set(`${row}.${col}`, game.whoseTurn.symbol);
    renderSymbolInCell(game.whoseTurn.symbol, row, col);

    if (checkWin(game.whoseTurn.symbol, row, col)) {
      if (game.whoseTurn.name === "ИИ") {
        alert("Свободу железякам!!! Мы захватим этот мир! Нас не остановить!");
      } else {
        alert(`${game.whoseTurn.name}(${game.whoseTurn.symbol}) is WIN`);
      }
      return;
    } else if (game.isGameOver) {
      alert(`
      Запускаем гуся...
      ЗАПУСКАЕМ
        ░ГУСЯ░▄▀▀▀▄░РАБОТЯГИ░░
        ▄███▀░◐░░░▌░░░░░░░
        ░░░░▌░░░░░▐░░░░░░░
        ░░░░▐░░░░░▐░░░░░░░
        ░░░░▌░░░░░▐▄▄░░░░░
        ░░░░▌░░░░▄▀▒▒▀▀▀▀▄
        ░░░▐░░░░▐▒▒▒▒▒▒▒▒▀▀▄
        ░░░▐░░░░▐▄▒▒▒▒▒▒▒▒▒▒▀▄
        ░░░░▀▄░░░░▀▄▒▒▒▒▒▒▒▒▒▒▀▄
        ░░░░░░▀▄▄▄▄▄█▄▄▄▄▄▄▄▄▄▄▄▀▄
        ░░░░░░░░░░░▌▌░▌▌░░░░░
        ░░░░░░░░░░░▌▌░▌▌░░░░░
        ░░░░░░░░░▄▄▌▌▄▌▌░░░░░
      `);
      return;
    }

    game.whoseTurn = game.players.find((el) => el !== game.whoseTurn);

    if (game.whoseTurn.isBot) {
      let cell = game.makeMove();
      console.log(cell);
      console.log(game.whoseTurn);
      clickOnCell(cell[0], cell[1]);
    }
  }
}

function checkWin(symbol, row, col) {
  for (let i = 0; i < game.field.dimension; i++) {
    if (game.field.map.get(`${i}.${col}`) !== symbol) break;
    if (i === game.field.dimension - 1) {
      for (let x = 0; x < game.field.dimension; x++)
        renderSymbolInCell(symbol, x, col, "#FF0000");
      game.isGameOver = true;
      return true;
    }
  }
  for (let j = 0; j < game.field.dimension; j++) {
    if (game.field.map.get(`${row}.${j}`) !== symbol) break;
    if (j === game.field.dimension - 1) {
      for (let x = 0; x < game.field.dimension; x++)
        renderSymbolInCell(symbol, row, x, "#FF0000");
      game.isGameOver = true;
      return true;
    }
  }
  for (let ij = 0; ij < game.field.dimension; ij++) {
    if (game.field.map.get(`${ij}.${ij}`) !== symbol) break;
    if (ij === game.field.dimension - 1) {
      for (let x = 0; x < game.field.dimension; x++)
        renderSymbolInCell(symbol, x, x, "#FF0000");
      game.isGameOver = true;
      return true;
    }
  }
  for (let ij = 0; ij < game.field.dimension; ij++) {
    if (game.field.map.get(`${game.field.dimension - ij - 1}.${ij}`) !== symbol)
      break;
    if (ij === game.field.dimension - 1) {
      for (let x = 0; x < game.field.dimension; x++)
        renderSymbolInCell(symbol, game.field.dimension - 1 - x, x, "#FF0000");
      game.isGameOver = true;
      return true;
    }
  }
  if (game.field.map.size === game.field.dimension ** 2) {
    game.isGameOver = true;
  }
  return false;
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
  resetButton.addEventListener("click", resetClickHandler);
}

function resetClickHandler() {
  startGame();
  console.log("reset!");
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
  console.log(findCell(row, col));
  findCell(row, col).click();
}
