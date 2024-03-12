import { NormalMove, AttackMove } from "./Movement.js";
import Utils from "./Utilities.js";

const PieceType = Object.freeze({
  PAWN: {
    name: 'Pawn',
    symbol: 'P',
    value: 100
  },
  KNIGHT: {
    name: 'Knight',
    symbol: 'N',
    value: 300,
    legals: [-Utils.ORDER - 2, -Utils.ORDER * 2 - 1, -Utils.ORDER * 2 + 1, -Utils.ORDER + 2, Utils.ORDER - 2, Utils.ORDER * 2 - 1, Utils.ORDER * 2 + 1, Utils.ORDER + 2]
  },
  BISHOP: {
    name: 'Bishop',
    symbol: 'B',
    value: 300,
    legals: [-Utils.ORDER - 1, 1 - Utils.ORDER, Utils.ORDER - 1, Utils.ORDER + 1]
  },
  ROOK: {
    name: 'Rook',
    symbol: 'R',
    value: 500,
    legals: [-Utils.ORDER, -1, 1, Utils.ORDER]
  },
  GUARDIAN: {
    name: 'Guardian',
    symbol: 'G',
    value: 400,
    legals: [-Utils.ORDER - 1, -Utils.ORDER, 1 - Utils.ORDER, -1, 1, Utils.ORDER - 1, Utils.ORDER, Utils.ORDER + 1]
  },
  QUEEN: {
    name: 'Queen',
    symbol: 'Q',
    value: 900,
    legals: [-Utils.ORDER - 1, -Utils.ORDER, 1 - Utils.ORDER, -1, 1, Utils.ORDER - 1, Utils.ORDER, Utils.ORDER + 1]
  },
  KING: {
    name: 'King',
    symbol: 'K',
    value: Infinity,
    legals: [-Utils.ORDER - 1, -Utils.ORDER, 1 - Utils.ORDER, -1, 1, Utils.ORDER - 1, Utils.ORDER, Utils.ORDER + 1]
  }
});

export default class Piece {
  constructor(position, alliance, pieceType) {
    this.position = position;
    this.alliance = alliance;
    this.pieceType = pieceType;
    this.isFirstMove = true;
  }

  calculateLegalMoves (board) {
    return vectorMoves(board, this);
  }

  movePiece (move) {
    const clonedPiece = Utils.clone(this);
    clonedPiece.position = move.destinationIndex;
    clonedPiece.alliance = move.movedPiece.alliance;
    return clonedPiece;
  }

  equals (other) {
    if (this == other) {
      return true;
    } else if (other instanceof Piece) {
      return this.position == other.position
        && this.alliance == other.alliance
        && this.pieceType == other.pieceType
        && this.isFirstMove == other.isFirstMove;
    }
    return false;
  }

  toString () {
    return (this.alliance.direction < 0 ? 'W' : 'B') + this.pieceType.symbol;
  }
}

export class Pawn extends Piece {
  constructor(position, alliance) {
    super(position, alliance, PieceType.PAWN);
  }

  calculateLegalMoves (board) {
    const legalMoves = [], candidateDestination = {};

    candidateDestination.index = this.position + Utils.ORDER * this.alliance.direction;

    for (const adjacentAttackIndex of [-1, 1]) {
      candidateDestination.square = board.getSquare(candidateDestination.index + adjacentAttackIndex);
      if (candidateDestination.square.isInvalid) continue;
      if (candidateDestination.square.isOccupied) {
        const pieceAtDestination = candidateDestination.square.piece;
        const pieceAlliance = pieceAtDestination.alliance;

        if (pieceAlliance != this.alliance) {
          legalMoves.push(new AttackMove(board, this, pieceAtDestination));
        }
      }
    }

    candidateDestination.square = board.getSquare(candidateDestination.index);
    if (!candidateDestination.square.isOccupied) {
      legalMoves.push(new NormalMove(board, this, candidateDestination.index));

      if (this.isFirstMove) {
        candidateDestination.index += Utils.ORDER * this.alliance.direction;
        candidateDestination.square = board.getSquare(candidateDestination.index);
        if (!candidateDestination.square.isOccupied) {
          legalMoves.push(new NormalMove(board, this, candidateDestination.index));
        }
      }
    }

    return legalMoves;
  }
}
export class Knight extends Piece {
  constructor(position, alliance) {
    super(position, alliance, PieceType.KNIGHT);
  }

  calculateLegalMoves (board) {
    const legalMoves = [], candidateDestination = {};
    const self = this;
    for (const currentCandidate of self.pieceType.legals) {
      candidateDestination.index = currentCandidate + self.position;
      if (candidateDestination.index <= Utils.ORDER || candidateDestination.index >= Utils.TOT_SQR) continue;
      candidateDestination.square = board.getSquare(candidateDestination.index);

      if (candidateDestination.square.isInvalid) continue;

      if (candidateDestination.square.isOccupied) {
        const pieceAtDestination = candidateDestination.square.piece;
        const pieceAlliance = pieceAtDestination.alliance;

        if (pieceAlliance != self.alliance) {
          legalMoves.push(new AttackMove(board, self, pieceAtDestination));
        }
      } else {
        legalMoves.push(new NormalMove(board, self, candidateDestination.index));
      }
    }
    return legalMoves;
  }
}
export class Bishop extends Piece {
  constructor(position, alliance) {
    super(position, alliance, PieceType.BISHOP);
  }
}
export class Rook extends Piece {
  constructor(position, alliance) {
    super(position, alliance, PieceType.ROOK);
  }
}
export class Queen extends Piece {
  constructor(position, alliance) {
    super(position, alliance, PieceType.QUEEN);
  }
}
export class King extends Piece {
  constructor(position, alliance) {
    super(position, alliance, PieceType.KING);
  }

  calculateLegalMoves (board) {
    const legalMoves = [], candidateDestination = {};

    for (const currentCandidate of this.pieceType.legals) {
      candidateDestination.index = currentCandidate + this.position;
      candidateDestination.square = board.getSquare(candidateDestination.index);

      if (candidateDestination.square.isInvalid) continue;

      if (candidateDestination.square.isOccupied) {
        const pieceAtDestination = candidateDestination.square.piece;
        const pieceAlliance = pieceAtDestination.alliance;

        if (pieceAlliance != this.alliance) {
          legalMoves.push(new AttackMove(board, this, pieceAtDestination));
        }
      } else {
        legalMoves.push(new NormalMove(board, this, candidateDestination.index));
      }
    }
    return legalMoves;
  }
}

function vectorMoves (board, self) {
  const legalMoves = [], candidateDestination = {};

  for (const currentCandidate of self.pieceType.legals) {
    candidateDestination.index = self.position;

    while (true) {
      candidateDestination.index += currentCandidate;
      candidateDestination.square = board.getSquare(candidateDestination.index);

      if (candidateDestination.square.isInvalid) break;

      if (candidateDestination.square.isOccupied) {
        const pieceAtDestination = candidateDestination.square.piece;
        const pieceAlliance = pieceAtDestination.alliance;

        if (pieceAlliance != self.alliance) {
          legalMoves.push(new AttackMove(board, self, pieceAtDestination));
        }
        break;
      } else {
        legalMoves.push(new NormalMove(board, self, candidateDestination.index));
      }
    }
  }
  return legalMoves;
}