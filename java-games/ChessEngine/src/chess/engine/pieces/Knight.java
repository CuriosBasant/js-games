package chess.engine.pieces;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.List;

import chess.engine.Alliance;
import chess.engine.board.Board;
import chess.engine.board.Move;
import chess.engine.board.Move.NormalAttackMove;
import chess.engine.board.Move.NormalMove;
import chess.engine.board.Square;
import chess.engine.board.Utils;

/**
 * Knight
 */
public class Knight extends Piece {
  private final static int[] CANDIDATE_MOVE_INDICES = { -17, -15, -10, -6, 6, 10, 15, 17 };

  public Knight(final int piecePosition, final Alliance pieceAlliance) {
    super(PieceType.KNIGHT, piecePosition, pieceAlliance, true);
  }

  public Knight(final int piecePosition, final Alliance pieceAlliance, final boolean isFirstMove) {
    super(PieceType.KNIGHT, piecePosition, pieceAlliance, isFirstMove);
  }

  @Override
  public Collection<Move> calculateLegalMoves(final Board board) {
    int candidateDestinationIndex;
    final List<Move> legaMoves = new ArrayList<>();

    for (final int currentCandidateOffset : CANDIDATE_MOVE_INDICES) {
      candidateDestinationIndex = piecePosition + currentCandidateOffset;

      if (!Utils.isValidSquareIndex(candidateDestinationIndex)
          || isEdgeExclusion(piecePosition, currentCandidateOffset)) {
        continue;
      }

      final Square candidateDestinationSquare = board.getSquare(candidateDestinationIndex);

      if (!candidateDestinationSquare.isSquareOccupied()) {
        legaMoves.add(new NormalMove(board, this, candidateDestinationIndex));
      } else {
        final Piece pieceAtDestination = candidateDestinationSquare.getPiece();
        final Alliance pieceAlliance = pieceAtDestination.getPieceAlliance();

        if (this.pieceAlliance != pieceAlliance) {
          legaMoves.add(new NormalAttackMove(board, this, candidateDestinationIndex, pieceAtDestination));
        }
      }
    }

    return Collections.unmodifiableList(legaMoves);
  }

  private static boolean isEdgeExclusion(final int currentPosition, final int candidateOffset) {
    final int CO = Math.abs(candidateOffset);
    return (Utils.SECOND_COLUMN(currentPosition) || Utils.SEVENTH_COLUMN(currentPosition)) && (CO == 6 || CO == 10)
        || (Utils.FIRST_COLUMN(currentPosition) || Utils.EIGHTH_COLUMN(currentPosition))
            && (CO == 6 || CO == 10 || CO == 15 || CO == 17);
  }

  @Override
  public String toString() {
    return PieceType.KNIGHT.toString();
  }

  @Override
  public Knight movePiece(final Move move) {
    return new Knight(move.getDestinationIndex(), move.getMovedPiece().getPieceAlliance());
  }

}