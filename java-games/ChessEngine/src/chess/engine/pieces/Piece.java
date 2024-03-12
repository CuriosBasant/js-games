package chess.engine.pieces;

import java.util.Collection;

import chess.engine.Alliance;
import chess.engine.board.Board;
import chess.engine.board.Move;

public abstract class Piece {
  protected final PieceType pieceType;
  protected final int piecePosition;
  protected final Alliance pieceAlliance;
  protected final boolean isFirstMove;
  private final int cachedHashCode;

  public Piece(final PieceType pieceType, final int piecePosition, final Alliance pieceAlliance,
      final boolean isFirstMove) {
    this.pieceType = pieceType;
    this.piecePosition = piecePosition;
    this.pieceAlliance = pieceAlliance;
    this.isFirstMove = isFirstMove;
    this.cachedHashCode = computeHashCode();
  }

  private int computeHashCode() {
    return this.cachedHashCode;
  }

  @Override
  public boolean equals(final Object other) {
    if (this == other) {
      return true;
    } else if (other instanceof Piece) {
      final Piece otherPiece = (Piece) other;
      return piecePosition == otherPiece.getPiecePosition() && pieceType == otherPiece.getPieceType()
          && pieceAlliance == otherPiece.getPieceAlliance() && isFirstMove == otherPiece.isFirstMove();
    }
    return false;
  }

  public int hashCode() {
    int result = pieceType.hashCode();
    result = 31 * result + pieceAlliance.hashCode();
    result = 31 * result + piecePosition;
    result = 31 * result + (isFirstMove ? 1 : 0);
    return result;
  }

  public Alliance getPieceAlliance() {
    return pieceAlliance;
  }

  public int getPiecePosition() {
    return piecePosition;
  }

  public PieceType getPieceType() {
    return pieceType;
  }

  public int getPieceValue() {
    return this.pieceType.getPieceValue();
  }

  public boolean isFirstMove() {
    return isFirstMove;
  }

  public abstract Collection<Move> calculateLegalMoves(final Board board);

  public abstract String toString();

  public abstract Piece movePiece(final Move move);

  public enum PieceType {
    PAWN("P", 100) {
      @Override
      public boolean isKing() {
        return false;
      }

      @Override
      public boolean isRook() {
        return false;
      }
    },
    KNIGHT("N", 300) {
      @Override
      public boolean isKing() {
        return false;
      }

      @Override
      public boolean isRook() {
        return false;
      }
    },
    BISHOP("B", 300) {
      @Override
      public boolean isKing() {
        return false;
      }

      @Override
      public boolean isRook() {
        return false;
      }
    },
    ROOK("R", 500) {
      @Override
      public boolean isKing() {
        return false;
      }

      @Override
      public boolean isRook() {
        return true;
      }
    },
    QUEEN("Q", 900) {
      @Override
      public boolean isKing() {
        return false;
      }

      @Override
      public boolean isRook() {
        return false;
      }
    },
    KING("K", 9999) {
      @Override
      public boolean isKing() {
        return true;
      }

      @Override
      public boolean isRook() {
        return false;
      }
    };

    private String pieceName;
    private int pieceValue;

    PieceType(final String pieceName, final int pieceValue) {
      this.pieceName = pieceName;
      this.pieceValue = pieceValue;
    }

    public int getPieceValue() {
      return this.pieceValue;
    }

    @Override
    public String toString() {
      return this.pieceName;
    }

    public abstract boolean isKing();

    public abstract boolean isRook();
  }
}
