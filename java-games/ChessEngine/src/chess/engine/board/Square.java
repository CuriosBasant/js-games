package chess.engine.board;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

import chess.engine.pieces.Piece;

/**
 * Square
 */
public abstract class Square {

  protected final int index;

  public int getSquareIndex() {
    return this.index;
  }

  private static final Map<Integer, EmptySquare> EMPTY_SQUARES_CACHE = createAllPossibleEmptySquares();

  private static Map<Integer, EmptySquare> createAllPossibleEmptySquares() {
    final Map<Integer, EmptySquare> emptySquareMap = new HashMap<>();

    for (int i = 0; i < Utils.TOT_SQUARES; i++) {
      emptySquareMap.put(i, new EmptySquare(i));
    }

    return Collections.unmodifiableMap(emptySquareMap);
  }

  public static Square createSquare(final int index, final Piece piece) {
    return piece == null ? EMPTY_SQUARES_CACHE.get(index) : new OccupiedSquare(index, piece);
  }

  private Square(final int index) {
    this.index = index;
  }

  public abstract boolean isSquareOccupied();

  public abstract Piece getPiece();

  public abstract String toString();

  public static final class EmptySquare extends Square {
    private EmptySquare(final int index) {
      super(index);
    }

    @Override
    public boolean isSquareOccupied() {
      return false;
    }

    @Override
    public Piece getPiece() {
      return null;
    }

    @Override
    public String toString() {
      return "-";
    }
  }

  public static final class OccupiedSquare extends Square {
    private final Piece pieceOnSquare;

    private OccupiedSquare(final int index, final Piece pieceOnSquare) {
      super(index);
      this.pieceOnSquare = pieceOnSquare;
    }

    @Override
    public boolean isSquareOccupied() {
      return true;
    }

    @Override
    public Piece getPiece() {
      return this.pieceOnSquare;
    }

    @Override
    public String toString() {
      return getPiece().getPieceAlliance().isBlack() ? getPiece().toString().toLowerCase() : getPiece().toString();
    }
  }
}