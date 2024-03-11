const cellSize = 35;
const ROW = 15, COL = 10;
const nodes = [];
const center = Math.floor(COL / 2);

const canvas = document.getElementById('game-panel');
for (let i = 0; i < ROW * COL; i++) {
  const span = document.createElement('span');
  canvas.appendChild(span);
  nodes.push(span);
}

const currentTetroPosition = [];
const arena = Array.from({ length: ROW }).map(_ => Array(COL).fill(0));
class Tetromino {
  constructor(orientation, color) {
    this.shape = orientation;
    this.color = color;
  }

  rotate () {
    const array = [];
    console.log(this.shape);

    for (let i = 0; i < this.width; i++) {
      array.push([]);
      for (let j = 0; j < this.height; j++) {
        array[i][j] = this.shape[Math.abs(this.height - j) - 1][i];
      }
    }
    this.shape = array;
    return array;
  }

  get height () {
    return this.shape.length;
  }

  get width () {
    return this.shape[0].length;
  }
}

const tetrominoes = [
  new Tetromino([
    [1, 1, 0],
    [0, 1, 1]
  ], 'red'),
  new Tetromino([
    [0, 1, 1],
    [1, 1, 0]
  ], 'lightgreen'),
  new Tetromino([
    [0, 1, 0],
    [1, 1, 1]
  ], 'purple'),
  new Tetromino([
    [1, 0, 0],
    [1, 1, 1]
  ], 'blue'),
  new Tetromino([
    [0, 0, 1],
    [1, 1, 1]
  ], 'orange'),
  new Tetromino([
    [1, 1],
    [1, 1]
  ], 'yellow'),
  new Tetromino([
    [1, 1, 1, 1]
  ], 'skyblue')
];

class Tetris {
  spawnTetro () {
    const tetro = tetrominoes[Math.random() * 7 | 0];
    pen.fillStyle = tetro.color;

    for (const rw of tetro.shape) {
      for (const cell of rw) {
        if (cell == 1) {
          pen.fillRect();

        }
      }
    }
  }
}

function name (params) {

}