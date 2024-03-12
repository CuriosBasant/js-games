package chess.engine.pieces;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.List;

import chess.engine.Alliance;
import chess.engine.board.Board;
import chess.engine.board.Move;
import chess.engine.board.Move.PawnAttackMove;
import chess.engine.board.Move.PawnEnPassantAttackMove;
import chess.engine.board.Move.PawnJump;
import chess.engine.board.Move.PawnMove;
import chess.engine.board.Move.PawnPromotion;
import chess.engine.board.Square;
import chess.engine.board.Utils;

/**
 * Pawn
 */
public class Pawn extends Piece {
  // private boolean isFirstMove = true;
  final private int direction;

  public Pawn(final int piecePosition, final Alliance pieceAlliance) {
    super(PieceType.PAWN, piecePosition, pieceAlliance, true);
    direction = pieceAlliance.getDirection() * Utils.PER_ROW;
  }

  public Pawn(final int piecePosition, final Alliance pieceAlliance, final boolean isFirstMove) {
    super(PieceType.PAWN, piecePosition, pieceAlliance, isFirstMove);
    direction = pieceAlliance.getDirection() * Utils.PER_ROW;
  }

  @Override
  public Collection<Move> calculateLegalMoves(final Board board) {
    final List<Move> legalMoves = new ArrayList<>();

    Square candidateDestinationSquare;
    int candidateDestinationIndex = piecePosition + direction;

    // Checking if can Attack
    for (final int adjacentAttackIndex : new int[] { -1, 1 }) { // to Left and Right
      if (Utils.FIRST_COLUMN(piecePosition) && adjacentAttackIndex == -1
          || Utils.EIGHTH_COLUMN(piecePosition) && adjacentAttackIndex == 1) {
        continue;
      }
      candidateDestinationSquare = board.getSquare(candidateDestinationIndex + adjacentAttackIndex);

      if (candidateDestinationSquare.isSquareOccupied()) {
        final Piece pieceAtDestination = candidateDestinationSquare.getPiece();
        final Alliance pieceAlliance = pieceAtDestination.getPieceAlliance();

        if (this.pieceAlliance != pieceAlliance) {
          if (this.pieceAlliance.isPawnPromotionSquare(candidateDestinationIndex)) {
            legalMoves
                .add(new PawnPromotion(new PawnAttackMove(board, this, candidateDestinationIndex, pieceAtDestination)));
          } else {
            legalMoves.add(new PawnAttackMove(board, this, candidateDestinationIndex, pieceAtDestination));
          }
        }
      } else if (board.getEnPassantPawn() != null) {
        if (board.getEnPassantPawn().getPiecePosition() == this.piecePosition + adjacentAttackIndex) {
          final Piece pieceOnCandidate = board.getEnPassantPawn();
          if (this.pieceAlliance != pieceOnCandidate.getPieceAlliance()) {
            legalMoves.add(new PawnEnPassantAttackMove(board, this, candidateDestinationIndex, pieceOnCandidate));
          }
        }
      }
    }

    candidateDestinationSquare = board.getSquare(candidateDestinationIndex);
    if (!candidateDestinationSquare.isSquareOccupied()) {
      if (this.pieceAlliance.isPawnPromotionSquare(candidateDestinationIndex)) {
        legalMoves.add(new PawnPromotion(new PawnMove(board, this, candidateDestinationIndex)));
      } else {
        legalMoves.add(new PawnMove(board, this, candidateDestinationIndex));
      }

      if (isFirstMove()) {
        candidateDestinationIndex += direction;
        candidateDestinationSquare = board.getSquare(candidateDestinationIndex);
        if (!candidateDestinationSquare.isSquareOccupied()) {
          legalMoves.add(new PawnJump(board, this, candidateDestinationIndex));
        }
      }
    }

    return Collections.unmodifiableList(legalMoves);
  }

  @Override
  public String toString() {
    return PieceType.PAWN.toString();
  }

  @Override
  public Pawn movePiece(final Move move) {
    return new Pawn(move.getDestinationIndex(), move.getMovedPiece().getPieceAlliance());
  }

  public Piece getPromotionPiece() {
    return new Queen(this.piecePosition, this.pieceAlliance, false);
  }

}