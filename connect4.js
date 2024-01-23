/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */



// const WIDTH = 7;
// const HEIGHT = 6;

// let currPlayer = 1; // active player: 1 or 2
// let board = []; // array of rows, each row is array of cells  (board[y][x])




/** makeBoard: create in-JS board structure:
 *   board = array of rows, each row is array of cells  (board[y][x])
 */


// function makeBoard() {
//   for (let y = 0; y < HEIGHT; y++) {
//     board.push(Array.from({ length: WIDTH }));
//   }
// }

let isGameOver = false;
const startGameBtn = document.querySelector("#startGame");


class Player {
  constructor(color) {
    this.color = color; 
  }
}


class Game {
  constructor(height = 6, width = 7, player1Color, player2Color) {
    this.player1 = new Player(player1Color);
    this.player2 = new Player(player2Color);
    console.log("This is >>", this.player1);
    console.log("This is >>", this.player2);
    this.height = height;
    this.width = width;
    this.board = [];
    this.currPlayer = this.player1; // Start with player 1
    this.makeBoard();
    this.makeHtmlBoard();
  }

  makeBoard() {
    for (let y = 0; y < this.height; y++) {
      this.board.push(Array.from({ length: this.width }));
    }
  }

  makeHtmlBoard() {
    const board = document.getElementById('board');
    board.innerHTML = ''; // Clear the board

    // make column tops (clickable area for adding a piece to that column)
    const top = document.createElement('tr');
    top.setAttribute('id', 'column-top');

    top.addEventListener('click', this.handleClick.bind(this));

    for (let x = 0; x < this.width; x++) {
      const headCell = document.createElement('td');
      headCell.setAttribute('id', x);
      top.append(headCell);
    }

    board.append(top);

    // make main part of board
    for (let y = 0; y < this.height; y++) {
      const row = document.createElement('tr');
      for (let x = 0; x < this.width; x++) {
        const cell = document.createElement('td');
        cell.setAttribute('id', `${y}-${x}`);
        row.append(cell);
      }
      board.append(row);
    }
  }

  findSpotForCol(x) {
    for (let y = this.height - 1; y >= 0; y--) {
      if (!this.board[y][x]) {
        return y;
      }
    }
    return null;
  }

  placeInTable(y, x) {
    const piece = document.createElement('div');
    piece.classList.add('piece');
    piece.style.backgroundColor = this.currPlayer.color;
    piece.style.top = -50 * (y + 2);

    const spot = document.getElementById(`${y}-${x}`);
    spot.append(piece);
  }

  endGame(msg) {
    isGameOver = true;
    alert(msg);
  }

  handleClick(evt) {
    const x = +evt.target.id;
    const y = this.findSpotForCol(x);
    if (isGameOver) {
      alert("Game is over. If you want to play again, click on restart");
      return; 
    }
    if (y === null) {
      return;
    }

    this.board[y][x] = this.currPlayer;
    this.placeInTable(y, x);

    if (this.checkForWin()) {
      return this.endGame(`Player ${this.currPlayer} won!`);
    }

    if (this.board.every(row => row.every(cell => cell))) {
      return this.endGame('Tie!');
    }

    this.currPlayer = this.currPlayer === this.player1 ? this.player2 : this.player1;
  }

  checkForWin() {
    const _win = cells =>
      cells.every(
        ([y, x]) =>
          y >= 0 &&
          y < this.height &&
          x >= 0 &&
          x < this.width &&
          this.board[y][x] === this.currPlayer
      );

    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
        const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
        const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
        const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

        if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
          return true;
        }
      }
    }
  }
}




document.getElementById('colorForm').addEventListener('submit', event => {
  event.preventDefault();
  const player1Color = document.getElementById('player1Color').value;
  const player2Color = document.getElementById('player2Color').value;
  new Game(6, 7, player1Color, player2Color);
  isGameOver = false;
  startGameBtn.innerHTML = "Restart Game";
});

