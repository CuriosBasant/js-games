import Square from "./Square.js";

export default class Player {
  static turn = 1;
  static nextTurn () {
    return ++Player.turn % 2;
  }

  constructor(board, alliance) {
    this.board = board;
    this.alliance = alliance;
    this.king = null;
    this.activePieces = [];
    this.opponentPieces = [];
    this.legalMoves = [];
    this.opponentLegalMoves = [];
    this.calculateLegalMoves();
    this.inInCheck = this.opponentLegalMoves.filter(move => move.destinationIndex == this.king.position).length > 0;
    if (this.isInCheck) {
      console.log('You in Check!');
    }
  }

  calculateLegalMoves () {
    let allLegalMoves = [], opponentLegalMoves = [];

    for (const square of this.board.gameBoard) {
      if (!square.isOccupied) continue;
      const piece = square.piece;
      const moves = piece.calculateLegalMoves(this.board);

      if (piece.alliance == this.alliance) {
        this.activePieces.push(piece);

        if (piece.pieceType.name == 'King') {
          this.king = piece;
          console.log(piece);
        }
        allLegalMoves = allLegalMoves.concat(moves);
      } else {
        this.opponentPieces.push(piece);
        opponentLegalMoves = opponentLegalMoves.concat(moves);
      }
    }

    this.legalMoves = [...new Set(allLegalMoves)];
    this.opponentLegalMoves = [...new Set(opponentLegalMoves)]
  }

  calculateCastle () {
    if (!this.king.isFirstMove || this.inInCheck) return;

    for (const LoR of [-1, 1]) {
      const castleSquare = 50 - this.alliance.direction * 35 - LoR * 2;
      let rookFound = false;

      const searchBack = offset => {
        const square = this.board.getSquare(castleSquare - offset);

        if (square.isOccupied) {
          if (square.piece.pieceType.name == 'rook') {
            rookFound = castleSquare - LoR;
          }
        } else {

        }
      };

    }
  }

  makeMove (move) {
    const transitionBoard = move.execute();

  }
}