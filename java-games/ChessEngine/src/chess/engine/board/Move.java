package chess.engine.board;

import chess.engine.board.Board.Builder;
import chess.engine.pieces.Pawn;
import chess.engine.pieces.Piece;
import chess.engine.pieces.Rook;

/**
 * Move
 */
public abstract class Move {
  protected final Board board;
  protected final Piece movedPiece;
  protected final int destinationIndex;
  protected final boolean isFirstMove;

  public static final Move INVALID_MOVE = new InvalidMove();

  private Move(final Board board, final Piece movedPiece, final int destinationIndex) {
    this.board = board;
    this.movedPiece = movedPiece;
    this.destinationIndex = destinationIndex;
    this.isFirstMove = movedPiece.isFirstMove();
  }

  private Move(final Board board, final int destinationIndex) {
    this.board = board;
    this.destinationIndex = destinationIndex;
    this.movedPiece = null;
    this.isFirstMove = false;
  }

  @Override
  public boolean equals(final Object other) {
    if (this == other) {
      return true;
    } else if (other instanceof Move) {
      final Move otherMove = (Move) other;
      return destinationIndex == otherMove.getDestinationIndex() && movedPiece.equals(otherMove.getMovedPiece())
          && getCurrentIndex() == otherMove.getCurrentIndex();
    }
    return false;
  }

  public int hashCode() {
    final int prime = 31;
    int result = 1;
    result = prime * result + this.destinationIndex;
    result = prime * result + this.movedPiece.hashCode();
    result = prime * result + this.movedPiece.getPiecePosition();
    return result;
  }

  public Board execute() {
    final Builder builder = new Builder();

    for (final Piece piece : this.board.currentPlayer().getActivePieces()) {
      if (!this.movedPiece.equals(piece)) {
        builder.setPiece(piece);
      }
    }
    for (final Piece piece : this.board.currentPlayer().getOpponent().getActivePieces()) {
      builder.setPiece(piece);
    }
    builder.setPiece(this.movedPiece.movePiece(this));
    builder.setMoveMaker(this.board.currentPlayer().getOpponent().getAlliance());

    return builder.build();
  }

  public Board getBoard() {
    return this.board;
  }

  public int getCurrentIndex() {
    return this.movedPiece.getPiecePosition();
  }

  public int getDestinationIndex() {
    return this.destinationIndex;
  }

  public Piece getMovedPiece() {
    return movedPiece;
  }

  public boolean isAttack() {
    return false;
  }

  public boolean isCastlingMove() {
    return false;
  }

  public Piece getAttackedPiece() {
    return null;
  }

  public static final class InvalidMove extends Move {
    public InvalidMove() {
      super(null, Utils.TOT_SQUARES);
    }

    @Override
    public Board execute() {
      throw new RuntimeException("Can't execute an Invalid Move!");
    }

    @Override
    public int getCurrentIndex() {
      return -1;
    }
  }

  public static final class NormalMove extends Move {

    public NormalMove(final Board board, final Piece movedPiece, final int destinationIndex) {
      super(board, movedPiece, destinationIndex);
    }

    @Override
    public boolean equals(final Object other) {
      return this == other || other instanceof NormalMove && super.equals(other);
    }

    @Override
    public String toString() {
      return movedPiece.getPieceType().toString() + Utils.getPositionAtIndex(this.destinationIndex);
    }
  }

  public static class AttackMove extends Move {
    final Piece attackedPiece;

    public AttackMove(final Board board, final Piece movedPiece, final int destinationIndex,
        final Piece attackedPiece) {
      super(board, movedPiece, destinationIndex);
      this.attackedPiece = attackedPiece;
    }

    @Override
    public boolean equals(final Object other) {
      if (this == other) {
        return true;
      } else if (other instanceof NormalAttackMove) {
        final NormalAttackMove otherAttackMove = (NormalAttackMove) other;
        return super.equals(otherAttackMove) && getAttackedPiece().equals(otherAttackMove.getAttackedPiece());
      }
      return false;
    }

    @Override
    public int hashCode() {
      return this.attackedPiece.hashCode() + super.hashCode();
    }

    @Override
    public boolean isAttack() {
      return true;
    }

    @Override
    public Piece getAttackedPiece() {
      return this.attackedPiece;
    }
  }

  public static final class NormalAttackMove extends AttackMove {
    public NormalAttackMove(final Board board, final Piece movedPiece, final int destinationIndex,
        final Piece attackedPiece) {
      super(board, movedPiece, destinationIndex, attackedPiece);
    }

    @Override
    public boolean equals(final Object other) {
      return this == other || other instanceof NormalAttackMove && super.equals(other);
    }

    @Override
    public String toString() {
      return movedPiece.getPieceType() + Utils.getPositionAtIndex(this.destinationIndex);
    }
  }

  public static final class PawnMove extends Move {
    public PawnMove(final Board board, final Piece movedPiece, final int destinationIndex) {
      super(board, movedPiece, destinationIndex);
    }

    @Override
    public boolean equals(final Object other) {
      return this == other || other instanceof PawnMove && super.equals(other);
    }

    @Override
    public String toString() {
      return Utils.getPositionAtIndex(this.destinationIndex);
    }
  }

  public static class PawnAttackMove extends AttackMove {
    public PawnAttackMove(final Board board, final Piece movedPiece, final int destinationIndex,
        final Piece attackedPiece) {
      super(board, movedPiece, destinationIndex, attackedPiece);
    }

    @Override
    public boolean equals(final Object other) {
      return this == other || other instanceof PawnAttackMove && super.equals(other);
    }

    @Override
    public String toString() {
      return Utils.getPositionAtIndex(this.movedPiece.getPiecePosition()).substring(0, 1) + "x"
          + Utils.getPositionAtIndex(this.destinationIndex);
    }
  }

  public static final class PawnJump extends Move {
    public PawnJump(final Board board, final Piece movedPiece, final int destinationIndex) {
      super(board, movedPiece, destinationIndex);
    }

    @Override
    public Board execute() {
      final Builder builder = new Builder();
      for (final Piece piece : this.board.currentPlayer().getActivePieces()) {
        if (!this.movedPiece.equals(piece)) {
          builder.setPiece(piece);
        }
      }
      for (final Piece piece : this.board.currentPlayer().getOpponent().getActivePieces()) {
        builder.setPiece(piece);
      }
      final Pawn movedPawn = (Pawn) this.movedPiece.movePiece(this);
      builder.setPiece(movedPawn);
      builder.setEnPassantPawn(movedPawn);
      builder.setMoveMaker(this.board.currentPlayer().getOpponent().getAlliance());
      return builder.build();
    }

    @Override
    public String toString() {
      return Utils.getPositionAtIndex(destinationIndex);
    }
  }

  public static final class PawnPromotion extends Move {
    private final Move decoratedMove;
    private final Pawn promotedPawn;

    public PawnPromotion(final Move decoratedMove) {
      super(decoratedMove.getBoard(), decoratedMove.getMovedPiece(), decoratedMove.getDestinationIndex());
      this.decoratedMove = decoratedMove;
      this.promotedPawn = (Pawn) decoratedMove.getMovedPiece();
    }

    @Override
    public Board execute() {
      final Board pawnMovedBoard = decoratedMove.execute();
      final Builder builder = new Builder();
      for (final Piece piece : pawnMovedBoard.currentPlayer().getActivePieces()) {
        if (!promotedPawn.equals(piece)) {
          builder.setPiece(piece);
        }
      }
      for (final Piece piece : pawnMovedBoard.currentPlayer().getOpponent().getActivePieces()) {
        if (!promotedPawn.equals(piece)) {
          builder.setPiece(piece);
        }
      }
      builder.setPiece(promotedPawn.getPromotionPiece().movePiece(this));
      builder.setMoveMaker(pawnMovedBoard.currentPlayer().getAlliance());
      return builder.build();
    }

    @Override
    public boolean equals(final Object other) {
      return this == other || other instanceof PawnPromotion && super.equals(other);
    }

    @Override
    public int hashCode() {
      return decoratedMove.hashCode() + promotedPawn.hashCode();
    }

    @Override
    public String toString() {
      return movedPiece.getPieceType() + Utils.getPositionAtIndex(this.destinationIndex);
    }

    @Override
    public boolean isAttack() {
      return decoratedMove.isAttack();
    }

    @Override
    public Piece getAttackedPiece() {
      return decoratedMove.getAttackedPiece();
    }
  }

  public static final class PawnEnPassantAttackMove extends PawnAttackMove {
    public PawnEnPassantAttackMove(final Board board, final Piece movedPiece, final int destinationIndex,
        final Piece attackedPiece) {
      super(board, movedPiece, destinationIndex, attackedPiece);
    }

    @Override
    public Board execute() {
      final Builder builder = new Builder();
      for (final Piece piece : this.board.currentPlayer().getActivePieces()) {
        if (!this.movedPiece.equals(piece)) {
          builder.setPiece(piece);
        }
      }
      for (final Piece piece : this.board.currentPlayer().getOpponent().getActivePieces()) {
        if (!piece.equals(this.attackedPiece)) {
          builder.setPiece(piece);
        }
      }
      builder.setPiece(this.movedPiece.movePiece(this));
      builder.setMoveMaker(this.board.currentPlayer().getOpponent().getAlliance());
      return builder.build();
    }

    @Override
    public boolean equals(final Object other) {
      return this == other || other instanceof PawnEnPassantAttackMove && super.equals(other);
    }

    // @Override
    // public String toString() {
    // return movedPiece.getPieceType() +
    // Utils.getPositionAtIndex(this.destinationIndex);
    // }
  }

  static abstract class CastleMove extends Move {
    protected final Rook castleRook;
    protected final int castleRookStart;
    protected final int castleRookDestination;

    public CastleMove(final Board board, final Piece movedPiece, final int destinationIndex, final Rook castleRook,
        final int castleRookStart, final int castleRookDestination) {
      super(board, movedPiece, destinationIndex);
      this.castleRook = castleRook;
      this.castleRookStart = castleRookStart;
      this.castleRookDestination = castleRookDestination;
    }

    public Rook getCastleRook() {
      return castleRook;
    }

    @Override
    public boolean isCastlingMove() {
      return true;
    }

    @Override
    public Board execute() {
      final Builder builder = new Builder();
      for (final Piece piece : this.board.currentPlayer().getActivePieces()) {
        if (!this.movedPiece.equals(piece) && !this.castleRook.equals(piece)) {
          builder.setPiece(piece);
        }
      }
      for (final Piece piece : this.board.currentPlayer().getOpponent().getActivePieces()) {
        builder.setPiece(piece);
      }

      builder.setPiece(this.movedPiece.movePiece(this));
      builder.setPiece(new Rook(this.castleRookDestination, this.castleRook.getPieceAlliance()));
      builder.setMoveMaker(this.board.currentPlayer().getOpponent().getAlliance());
      return builder.build();
    }

    @Override
    public int hashCode() {
      final int prime = 31;
      int result = super.hashCode();
      result = prime * result + this.castleRook.hashCode();
      result = prime * result + this.castleRookDestination;
      return result;
    }

    @Override
    public boolean equals(final Object other) {
      if (this == other) {
        return true;
      } else if (other instanceof CastleMove) {
        final CastleMove otherCastleMove = (CastleMove) other;
        return super.equals(otherCastleMove) && this.castleRook.equals(otherCastleMove.getCastleRook());
      }
      return false;
    }
  }

  public static final class KingSideCastleMove extends CastleMove {
    public KingSideCastleMove(final Board board, final Piece movedPiece, final int destinationIndex,
        final Rook castleRook, final int castleRookStart, final int castleRookDestination) {
      super(board, movedPiece, destinationIndex, castleRook, castleRookStart, castleRookDestination);
    }

    @Override
    public boolean equals(final Object other) {
      return this == other || other instanceof KingSideCastleMove && super.equals(other);
    }

    @Override
    public String toString() {
      return "O-O";
    }
  }

  public static final class QueenSideCastleMove extends CastleMove {
    public QueenSideCastleMove(final Board board, final Piece movedPiece, final int destinationIndex,
        final Rook castleRook, final int castleRookStart, final int castleRookDestination) {
      super(board, movedPiece, destinationIndex, castleRook, castleRookStart, castleRookDestination);
    }

    @Override
    public boolean equals(final Object other) {
      return this == other || other instanceof QueenSideCastleMove && super.equals(other);
    }

    @Override
    public String toString() {
      return "O-O-O";
    }
  }

  public static class MoveFactory {
    private MoveFactory() {
      throw new RuntimeException("Not Instantiable!");
    }

    public static Move createMove(final Board board, final int currentIndex, final int destinationIndex) {
      for (final Move move : board.getAllLegalMoves()) {
        if (move.getCurrentIndex() == currentIndex && move.getDestinationIndex() == destinationIndex) {
          return move;
        }
      }
      return INVALID_MOVE;
    }
  }

}