const ORDER = 3;
const SIZE = ORDER * ORDER;
const SPANS = [];
const gameArena = Array.from({ length: SIZE }).fill(null);

const player = {
  X: 1, O: 2,
  current: 1,
  get opponent () {
    return this.current == this.X ? this.O : this.X;
  },
  get cssClass () {
    return this.current == this.X ? "cross" : "nought";
  }
}

const mouseEnter = function () {
  this.classList.add(player.cssClass, "fake-one");
};
const mouseLeave = function () {
  // this.classList.remove(player.cssClass, "fake-one");
  this.className = "";
};
window.onload = () => {
  const gamePanel = document.getElementById("game-panel");
  gamePanel.style.gridTemplateColumns = `repeat(3, 1fr)`;
  for (let i = 0; i < SIZE; i++) {
    const span = document.createElement("span");
    gamePanel.appendChild(span);
    SPANS.push(span);

    span.addEventListener('click', onClick);
    span.addEventListener('mouseenter', mouseEnter);
    span.addEventListener('mouseleave', mouseLeave);
  }
}

function onClick (ev) {
  const index = SPANS.indexOf(ev.target);
  console.log(index);

  if (gameArena[index] == null) {
    this.removeEventListener('mouseenter', mouseEnter);
    this.removeEventListener('mouseleave', mouseLeave);

    ev.target.classList.remove("fake-one");
    placeMarkAt(gameArena, index, player.current)

    if (checkIfWin(gameArena, player.current)) {
      console.log("Won!");
    }
    player.current = player.opponent;

  } else {

  }

}

class Best {
  constructor(tile, score) {
    this.tile = tile;
    this.score = score;
  }
}

function minimax (arena, depth, alpha, beta, isMaximizingPlayer) {
  const validLocations = arena.map((n, i) => n == null ? i : false).filter(Number);
  const TOT_AVAILABLE_SQUARES = validLocations.length;
  const best = {
    tile: validLocations[Math.random() * TOT_AVAILABLE_SQUARES | 0],
    score: null
  };

  if (depth == 0) {
    best.score = getScore(arena, player.current);
  } else if (TOT_AVAILABLE_SQUARES == 0) {
    best.score = 0;
  } else if (checkIfWin(arena, player.opponent)) {
    best.score = -Infinity;
  } else if (checkIfWin(arena, player.current)) {
    best.score = Infinity;
  } else if (isMaximizingPlayer) {
    best.score = -Infinity;

    for (const tile of validLocations) {
      const arenaCopy = arena.slice();
      placeMarkAt(arenaCopy, tile, player.current);
      const score = minimax(arenaCopy, depth - 1, alpha, beta, !isMaximizingPlayer).score;

      if (score > best.score) {
        best.tile = tile;
        best.score = score;
      }
      alpha = Math.max(alpha, best.score);
      if (alpha >= beta) break;
    }
  } else {
    best.score = Infinity;

    for (const tile of validLocations) {
      const arenaCopy = arena.slice();
      placeMarkAt(arenaCopy, tile, player.opponent);
      const score = minimax(arenaCopy, depth - 1, alpha, beta, !isMaximizingPlayer).score;

      if (score < best.score) {
        best.tile = tile;
        best.score = score;
      }
      beta = Math.min(beta, best.score);
      if (alpha >= beta) break;
    }
  }

  return best;
}

function placeMarkAt (arena, index, mark) {
  arena[index] = mark;
}

function checkIfWin (arena, mark) {
  // Check all Rows
  for (let i = 0; i < SIZE; i += ORDER) {
    const gen = getRow(i);
    if ([...gen].every(n => arena[n] == mark)) {
      return true;
    }
  }
  // Check all Columns
  for (let i = 0; i < ORDER; i++) {
    const gen = getCol(i);
    if ([...gen].every(n => arena[n] == mark)) {
      return true;
    }
  }
  // Check both Diagnols
  for (const sign of [-1, 1]) {
    const gen = getCol(sign);
    if ([...gen].every(n => arena[n] == mark)) {
      return true;
    }
  }
  return false;
}

function* getRow (i) {
  for (let j = 0; j < ORDER; j++) {
    yield i + j;
  }
}
function* getCol (i) {
  for (let j = 0; j < SIZE; j += ORDER) {
    yield i + j;
  }
}
function* getDiag (s) {
  for (let j = 0.5; j < ORDER; j++) {
    yield (j + s / 2) * (ORDER - s);
  }
}