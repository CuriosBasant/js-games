import { Builder } from './Board.js';
import { objectEquality, cloneObject } from './Utilities.js';

class Move {
  constructor(board, movedPiece, destinationIndex) {
    this.board = board;
    this.destinationIndex = destinationIndex;
    this.movedPiece = movedPiece;

  }

  get isAttack () {
    return false;
  }

  execute () {
    const builder = new Builder();
    this.movedPiece.isFirstMove = false;

    for (const piece of this.board.activePlayer.activePieces) {
      if (objectEquality(this.movedPiece, piece)) {
        const copiedMoved = cloneObject(this.movedPiece);
        copiedMoved.position = this.destinationIndex;
        builder.setPiece = copiedMoved;
      } else {
        builder.setPiece = piece;
      }
    }
    for (const piece of this.board.activePlayer.opponentPieces) {
      builder.setPiece = piece;
    }
    builder.moveMaker = this.board.activePlayer.alliance.next;
    // console.log(builder.moveMaker);

    return builder.build();
  }
}

export class NormalMove extends Move {
  constructor(board, movedPiece, destinationIndex) {
    super(board, movedPiece, destinationIndex);
  }
}

export class AttackMove extends Move {
  constructor(board, movedPiece, attackedPiece) {
    super(board, movedPiece, attackedPiece.position);
    this.attackedPiece = attackedPiece;
  }

  get isAttack () {
    return true;
  }
}