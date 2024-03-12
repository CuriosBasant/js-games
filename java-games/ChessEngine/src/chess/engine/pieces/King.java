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
public class King extends Piece {
  private final static int[] CANDIDATE_MOVE_INDICES = { -9, -8 - 7, -1, 1, 7, -8, 9 };

  public King(final int piecePosition, final Alliance pieceAlliance) {
    super(PieceType.KING, piecePosition, pieceAlliance, true);
  }

  public King(final int piecePosition, final Alliance pieceAlliance, final boolean isFirstMove) {
    super(PieceType.KING, piecePosition, pieceAlliance, isFirstMove);
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
    return Utils.FIRST_COLUMN(currentPosition)
        && (candidateOffset == -9 || candidateOffset == -1 || candidateOffset == 7)
        || Utils.EIGHTH_COLUMN(currentPosition)
            && (candidateOffset == -7 || candidateOffset == 1 || candidateOffset == 9);
  }

  @Override
  public String toString() {
    return PieceType.KING.toString();
  }

  @Override
  public King movePiece(final Move move) {
    return new King(move.getDestinationIndex(), move.getMovedPiece().getPieceAlliance());
  }

}