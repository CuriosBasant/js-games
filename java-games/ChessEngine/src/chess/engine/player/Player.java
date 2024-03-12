package chess.engine.player;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.List;

import chess.engine.Alliance;
import chess.engine.board.Board;
import chess.engine.board.Move;
import chess.engine.pieces.King;
import chess.engine.pieces.Piece;

/**
 * Player
 */
public abstract class Player {

  protected final Board board;
  protected final King playerKing;
  protected final Collection<Move> legalMoves;
  private final boolean isInCheck;

  Player(final Board board, final Collection<Move> selfLegalMoves, final Collection<Move> opponentMoves) {
    this.board = board;
    this.playerKing = establishKing();
    this.isInCheck = !Player.calculateAttacksOnSquare(this.getPlayerKing().getPiecePosition(), opponentMoves).isEmpty();

    final Collection<Move> tempMove = new ArrayList<>(calculateKingCastles(selfLegalMoves, opponentMoves));
    tempMove.addAll(selfLegalMoves);
    this.legalMoves = Collections.unmodifiableCollection(tempMove);
  }

  private Piece getPlayerKing() {
    return playerKing;
  }

  public Collection<Move> getLegalMoves() {
    return this.legalMoves;
  }

  public boolean isMoveLegal(final Move move) {
    return this.legalMoves.contains(move);
  }

  public boolean isInCheck() {
    return this.isInCheck;
  }

  public boolean isInCheckMate() {
    return this.isInCheck && !hasEscapeMoves();
  }

  protected boolean hasEscapeMoves() {
    for (final Move move : legalMoves) {
      final MoveTransition transition = makeMove(move);
      if (transition.getMoveStatus().isDone()) {
        return true;
      }
    }
    return false;
  }

  public boolean isInStaleMate() {
    return !this.isInCheck && !hasEscapeMoves();
  }

  public boolean isCastled() {
    return false;
  }

  public MoveTransition makeMove(final Move move) {
    if (!isMoveLegal(move)) {
      return new MoveTransition(this.board, move, MoveStatus.ILLEGAL_MOVE);
    }
    final Board transitionBoard = move.execute();
    final Collection<Move> kingAttacks = Player.calculateAttacksOnSquare(
        transitionBoard.currentPlayer().getOpponent().getPlayerKing().getPiecePosition(),
        transitionBoard.currentPlayer().getLegalMoves());

    if (!kingAttacks.isEmpty()) {
      return new MoveTransition(this.board, move, MoveStatus.LEAVE_PLAYER_IN_CHECK);
    }
    return new MoveTransition(transitionBoard, move, MoveStatus.DONE);
  }

  private King establishKing() {
    for (final Piece piece : getActivePieces()) {
      if (piece.getPieceType().isKing()) {
        return (King) piece;
      }
    }
    throw new RuntimeException("King Missing! Not a Valid Board.");
  }

  protected static Collection<Move> calculateAttacksOnSquare(final int piecePosition,
      final Collection<Move> opponentMoves) {
    final List<Move> attackMoves = new ArrayList<>();

    for (final Move move : opponentMoves) {
      if (piecePosition == move.getDestinationIndex()) {
        attackMoves.add(move);

      }
    }
    return Collections.unmodifiableList(attackMoves);
  }

  public abstract Collection<Piece> getActivePieces();

  public abstract Alliance getAlliance();

  public abstract Player getOpponent();

  protected abstract Collection<Move> calculateKingCastles(Collection<Move> playerLegals,
      Collection<Move> opponentsLegals);
}