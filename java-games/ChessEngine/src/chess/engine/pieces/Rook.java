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
public class Rook extends Piece {
  private final static int[] CANDIDATE_MOVE_VECTOR = { -8, -1, 1, 8 };

  public Rook(final int piecePosition, final Alliance pieceAlliance) {
    super(PieceType.ROOK, piecePosition, pieceAlliance, true);
  }

  public Rook(final int piecePosition, final Alliance pieceAlliance, final boolean isFirstMove) {
    super(PieceType.ROOK, piecePosition, pieceAlliance, isFirstMove);
  }

  @Override
  public Collection<Move> calculateLegalMoves(final Board board) {
    int candidateDestinationIndex;
    final List<Move> legaMoves = new ArrayList<>();

    for (final int currentCandidateOffset : CANDIDATE_MOVE_VECTOR) {
      candidateDestinationIndex = piecePosition;

      while (true) {
        candidateDestinationIndex += currentCandidateOffset;

        if (!Utils.isValidSquareIndex(candidateDestinationIndex)
            || isEdgeExclusion(piecePosition, currentCandidateOffset)) {
          break;
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
          break;
        }
      }
    }

    return Collections.unmodifiableList(legaMoves);
  }

  private static boolean isEdgeExclusion(final int currentPosition, final int candidateOffset) {
    return Utils.FIRST_COLUMN(currentPosition) && candidateOffset == -1
        || Utils.EIGHTH_COLUMN(currentPosition) && candidateOffset == 1;
  }

  @Override
  public String toString() {
    return PieceType.ROOK.toString();
  }

  @Override
  public Rook movePiece(final Move move) {
    return new Rook(move.getDestinationIndex(), move.getMovedPiece().getPieceAlliance());
  }

}