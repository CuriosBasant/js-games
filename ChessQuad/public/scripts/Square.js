import Utils from './Utilities.js';

const EMPTY_SQUARES = [];

export default class Square {
  constructor(index) {
    this.index = index;
  }

  static createSquare (index, piece) {
    return piece == null ? EMPTY_SQUARES[index] : new OccupiedSquare(index, piece);
  }

  get isInvalid () {
    return false;
  }

  get isOccupied () {
    return false;
  }
}

class EmptySquare extends Square {
  constructor(index) {
    super(index);
  }
}

class OccupiedSquare extends Square {
  constructor(index, piece) {
    super(index);
    this.piece = piece;
  }

  get isOccupied () {
    return true;
  }
}

class InvalidSquare extends Square {
  constructor(index) {
    super(index);
  }

  get isInvalid () {
    return true;
  }
}

for (let i = 0; i < Utils.TOT_SQR; i++) {
  EMPTY_SQUARES.push(
    (i / Utils.ORDER | 0) % (Utils.ORDER - 1) == 0 || (i % Utils.ORDER) % (Utils.ORDER - 1) == 0
      ? new InvalidSquare(i)
      : new EmptySquare(i)
  );
}