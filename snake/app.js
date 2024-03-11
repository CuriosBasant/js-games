const canvas = document.getElementById('game-panel');
const panel = {
  row: 60, col: 90,
  get width () { return this.col * cellSize; },
  get height () { return this.row * cellSize; }
};
const cellSize = 10;


canvas.width = panel.width;
canvas.height = panel.height;

const pen = canvas.getContext('2d');
pen.fillStyle = 'white';

class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class Snake {
  constructor(x, y) {
    this.position = new Vector(x, y);
    this.direction = new Vector(1, 0);
    this.speed = 100;
    this.size = 0;
    this.tail = [{ ...this.position }];
    this.hasJustEatenFood = false;
    this.draw();
  }

  move () {
    let tailEnd;
    if (this.hasJustEatenFood) {
      this.hasJustEatenFood = false;
    } else {
      tailEnd = this.tail.pop();
      pen.clearRect(tailEnd.x * cellSize - 1, tailEnd.y * cellSize - 1, cellSize, cellSize)
    }
    this.tail.unshift({ ...this.position });
    // this.draw();
    pen.fillRect(this.position.x * cellSize, this.position.y * cellSize, cellSize - 1, cellSize - 1);
    // console.log('hi');
    this.position.x = (this.position.x + this.direction.x + panel.col) % panel.col;
    this.position.y = (this.position.y + this.direction.y + panel.row) % panel.row;


  }

  eatFood () {
    this.size++;
    this.hasJustEatenFood = true;
  }

  draw () {
    for (const body of this.tail) {
      pen.fillRect(body.x * cellSize, body.y * cellSize, cellSize - 1, cellSize - 1);
    }

  }

  setDirection (x, y) {
    this.direction = new Vector(x, y);
  }
}

const snake = new Snake(1, 1)
let counter = 0;

function animate () {
  requestAnimationFrame(animate);
  if ((++counter % 8)) return;

  // pen.clearRect(0, 0, panel.width, panel.height);
  // pen.save();
  snake.move();
}
animate();

function random (min, max = null) {
  if (max == null) {
    max = min;
    min = 0;
  }
  return Math.random() * (max - min) + min | 0;
}

canvas.onclick = () => snake.eatFood();

/*
const gameArena = {
  row: 30, col: 50,
  score: 0,
  get LENGTH () {
    return this.row * this.col;
  }
}
const SPANS = [];

// snake.position[0] -> head
const snake = {
  speed: 100,
  length: 3,
  food: gameArena.col + 6,
  position: [gameArena.col + 5, gameArena.col + 4, gameArena.col + 3],
  direction: 1,
  isMovingVertically: function (direction) {
    if (direction == undefined) {
      direction = this.direction;
    }
    return Math.abs(direction) > 1;
  },
  headPosition: gameArena.col + 5,
  move: function () {
    SPANS[this.headPosition].classList.remove("snake-head");
    SPANS[this.headPosition].classList.add("snake-body");
    this.headPosition += this.direction;

    if (this.isMovingVertically()) {
      if (this.headPosition < 0) {
        this.headPosition += gameArena.LENGTH;
      } else if (this.headPosition >= gameArena.LENGTH) {
        this.headPosition %= gameArena.col;
      }
    } else {
      const col = this.headPosition % gameArena.col;

      if (col == 0 && this.direction > 0) {
        this.headPosition -= gameArena.col;
      } else if (col == gameArena.col - 1 && this.direction < 0) {
        this.headPosition += gameArena.col;
      }
    }

    if (this.position.includes(this.headPosition)) {
      console.log("Game Over");
    } else if (this.headPosition == this.food) {
      SPANS[this.food].classList.remove("snake-food");
      this.food = -1;
      gameArena.score += 10;
      setTimeout(spawnFood, 4000);
    } else {
      const tale = this.position.pop();
      SPANS[tale].classList.remove("snake-body");
    }

    SPANS[this.headPosition].classList.add("snake-head");
    this.position.unshift(this.headPosition);
  }
}

function spawnFood () {
  snake.food = Math.random() * gameArena.LENGTH | 0;
  SPANS[snake.food].classList.add('snake-food');
}

window.onload = () => {
  const gamePanel = document.getElementById("game-panel");
  gamePanel.style.gridTemplateColumns = `repeat(${gameArena.col}, 1fr)`;
  for (let i = 0; i < gameArena.LENGTH; i++) {
    const span = document.createElement("span");
    gamePanel.appendChild(span);
    SPANS.push(span);
  }

  for (let i = 1; i < snake.position.length; i++)
    SPANS[snake.position[i]].classList.add("snake-body");
  SPANS[snake.headPosition].classList.add("snake-head");
  setInterval(() => snake.move(), snake.speed);
}

*/

document.addEventListener('keydown', ev => {
  if (ev.repeat) return;

  switch (ev.code) {
    case "KeyW": case "ArrowUp": return snake.direction.y == 0 ? snake.setDirection(0, -1) : null;
    case "KeyS": case "ArrowDown": return snake.direction.y == 0 ? snake.setDirection(0, 1) : null;
    case "KeyA": case "ArrowLeft": return snake.direction.x == 0 ? snake.setDirection(-1, 0) : null;
    case "KeyD": case "ArrowRight": return snake.direction.x == 0 ? snake.setDirection(1, 0) : null;

    default: return null;
  }
});