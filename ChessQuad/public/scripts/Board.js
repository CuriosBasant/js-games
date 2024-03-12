import Alliance from './Alliance.js';
import { Pawn, Bishop, Knight, Rook, Queen, King } from './Piece.js';
import Player from './Player.js';
import Square from './Square.js';
import Utils, { convertForEngine } from './Utilities.js';
import Chess from './chess.js';

const chess = new Chess();

export default class Board {
  constructor(builder) {
    this.gameBoard = Board.createGameBoard(builder);
    this.players = [
      new Player(this, Alliance.WHITE),
      new Player(this, Alliance.BLACK)
    ];
    this.activePlayer = this.players.filter(p => p.alliance == builder.moveMaker)[0];
    this.enPassantPawn = null;
  }

  static createGameBoard (builder) {
    const squares = [];
    for (let i = 0; i < Utils.TOT_SQR; i++) {
      squares.push(Square.createSquare(i, builder.boardPieces.get(i)));
    }
    return squares;
  }

  static createStandardBoard () {
    const builder = new Builder();
    const boardPosition = chess.variants.standard;

    const getPiece = (symbol, sqrId, alliance) => {
      sqrId = convertForEngine(sqrId);
      switch (symbol) {
        case 'P': return new Pawn(sqrId, alliance);
        case 'N': return new Knight(sqrId, alliance);
        case 'B': return new Bishop(sqrId, alliance);
        case 'R': return new Rook(sqrId, alliance);
        case 'Q': return new Queen(sqrId, alliance);
        case 'K': return new King(sqrId, alliance);
      }
      return null;
    };

    let sqr = 0;
    for (const rank of boardPosition) {
      for (const symbol of rank) {
        const alliance = Alliance[symbol[1] == '1' ? 'WHITE' : 'BLACK'];
        const piece = getPiece(symbol[0], sqr++, alliance);
        if (piece != null) {
          builder.setPiece = piece;
        }
      }
    }

    builder.moveMaker = Alliance.WHITE;
    return builder.build();
    // return new Board(builder)
  }

  getSquare (index) {
    return this.gameBoard[index];
  }
}

export class Builder {
  constructor() {
    this.boardPieces = new Map();
    this.moveMaker = null;
  }

  /**
   * @param {{ position: number }} piece
   */
  set setPiece (piece) {
    this.boardPieces.set(piece.position, piece);
  }

  build () {
    return new Board(this)
  }
}