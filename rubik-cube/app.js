const DIMENSION = 3;

const sceneNode = document.getElementById('scene');
const cubeNode = sceneNode.firstElementChild;

const tempCubieNode = document.createElement('div');
tempCubieNode.classList.add('cubie');
const tempCubieFace = document.createElement('span');
tempCubieFace.classList.add('cubie-face');

for (let i = 0; i < 6; i++) {
  tempCubieNode.appendChild(tempCubieFace.cloneNode());
}

class Cubie {
  static SIZE = 100;

  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.id = x * 9 + y * 3 + z + 13;
    this.qbNode = tempCubieNode.cloneNode(true);
    this.rotation = { x: 0, y: 0, z: 0 };
    this.translation = `translate3d(${x * Cubie.SIZE}px, ${y * Cubie.SIZE}px, ${z * Cubie.SIZE}px) `;
    this.turn('x', 0);  // parameters makes no sense.

    const tot = Math.abs(x) + Math.abs(y) + Math.abs(z);
    this.qbNode.classList.add(tot == 3 ? 'corner' : tot == 2 ? 'side' : 'center');

    cubeNode.appendChild(this.qbNode);

    // console.log(this.qb);
  }

  turn (axis, direction) {
    this.rotation[axis] = 90 * direction;
    this.qbNode.style.transform = `rotateX(${this.rotation.x}deg) rotateY(${this.rotation.y}deg) rotateZ(${this.rotation.z}deg)` + this.translation;
  }
}

const matrix = //new Cubie(1, -1, 1);
  Array.from({ length: DIMENSION }).map((_, i) =>
    Array.from({ length: DIMENSION }).map((_, j) =>
      Array.from({ length: DIMENSION }).map((_, k) => new Cubie(i - 1, j - 1, k - 1))
    )
  );

console.log(matrix);

function printMatrix () {
  for (let i = 0; i < DIMENSION; i++) {
    const hehe = [];
    for (let j = 0; j < DIMENSION; j++) {
      const hehe2 = [];
      for (let k = 0; k < DIMENSION; k++) {
        hehe2.push(matrix[i][j][k].id);
      }
      hehe.push(hehe2);
    }
    console.log(hehe);
  }
}
printMatrix();

let isRotating = false, threshold = 0;
const rotate = {
  x: -20, y: -30
};


sceneNode.addEventListener('mouseup', ev => isRotating = false);
sceneNode.addEventListener('mousedown', ev => {
  isRotating = ev.currentTarget == ev.target;
});
sceneNode.addEventListener('mousemove', startRotation);

function startRotation (ev) {
  if (!isRotating) return;
  if (++threshold % 3) return;

  // console.log('m');
  rotate.x = (rotate.x - ev.movementY / 2) % 360;
  rotate.y = (rotate.y + ev.movementX / 2) % 360;
  cubeNode.style.transform = `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`;
}

function turnX (side, sign) {
  let transpose = Array.from({ length: DIMENSION }).map(() => []);
  let temp = Array.from({ length: DIMENSION }).map(() => []);
  for (let y = 0; y < DIMENSION; y++) {
    for (let z = 0; z < DIMENSION; z++) {
      // matrix[side][y][z].rotation.x += 90 * sign;
      // matrix[side][y][z].turn();
      // temp[y][z] = matrix[side][y][z];
      transpose[y][z] = matrix[side][z][y];
    }
  }


  if (sign == 1) { // Clockwise
    transpose = transpose.map(row => row.reverse());
  } else { // Counter-Clockwise
    transpose.reverse();
  }
  /* console.log(transpose);
  transpose.forEach((_, i) =>
    _.forEach((qb, j) => {
      matrix[side][i][j] = qb;
      // console.log(matrix[side][i][j]);
    })
  ); */
  for (let i = 0; i < DIMENSION; i++) {
    const hehe = [];
    for (let j = 0; j < DIMENSION; j++) {
      matrix[side][i][j] = transpose[i][j];
      transpose[i][j].turn('x', sign);
      hehe.push(transpose[i][j].id);
      // hehe.push(transpose[i][j].x * 9 + transpose[i][j].y * 3 + transpose[i][j].z)
    }
    console.log(hehe);
  }
}

function applyRotation (mat, axis) {

}

function turnY (side, sign) {
  const transpose = Array.from({ length: DIMENSION }).map(() => []);

  for (let x = 0; x < DIMENSION; x++) {
    for (let z = 0; z < DIMENSION; z++) {
      matrix[x][side][z].rotation.y += 90 * sign;
      matrix[x][side][z].turn();
      transpose[x][z] = matrix[z][side][x];
    }
    transpose[x].reverse();
  }
  transpose.forEach((_, i) => _.forEach((qb, j) => matrix[i][side][j] = qb));
}

function turnZ (side, sign) {
  const transpose = Array.from({ length: DIMENSION }).map(() => []);
  for (let x = 0; x < DIMENSION; x++) {
    for (let y = 0; y < DIMENSION; y++) {
      matrix[x][y][side].rotation.z += 90 * sign;
      matrix[x][y][side].turn();
      transpose[x][y] = matrix[y][x][side];
    }
    transpose[x].reverse();
  }
  // transpose.forEach((_, i) => _.forEach((qb, j) => matrix[i][j][side] = qb));
}

function transpose () {
  const arr = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8]
  ];
  const transposed = Array.from({ length: DIMENSION }).map(a => []);

  for (let x = 0; x < DIMENSION; x++) {
    for (let y = 0; y < DIMENSION; y++) {
      transposed[x][y] = arr[y][x];
    }
    transposed[x].reverse();
  }
  return transposed;
}