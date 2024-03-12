package chess.engine.player;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.List;

import chess.engine.Alliance;
import chess.engine.board.Board;
import chess.engine.board.Move;
import chess.engine.board.Move.KingSideCastleMove;
import chess.engine.board.Move.QueenSideCastleMove;
import chess.engine.board.Square;
import chess.engine.pieces.Piece;
import chess.engine.pieces.Rook;

/**
 * BlackPlayer
 */
public class BlackPlayer extends Player {

  public BlackPlayer(final Board board, final Collection<Move> selfLegalMoves,
      final Collection<Move> opponentLegalMoves) {
    super(board, selfLegalMoves, opponentLegalMoves);
  }

  public Collection<Piece> getActivePieces() {
    return this.board.getBlackPieces();
  }

  public Alliance getAlliance() {
    return Alliance.BLACK;
  }

  public Player getOpponent() {
    return this.board.whitePlayer();
  }

  @Override
  protected Collection<Move> calculateKingCastles(final Collection<Move> playerLegals,
      final Collection<Move> opponentsLegals) {
    final List<Move> kingCastles = new ArrayList<>();
    if (this.playerKing.isFirstMove() && !this.isInCheck()) {
      // Queen Side
      if (!this.board.getSquare(1).isSquareOccupied() && !this.board.getSquare(2).isSquareOccupied()
          && !this.board.getSquare(3).isSquareOccupied()) {
        final Square rookSquare = this.board.getSquare(0);

        if (rookSquare.isSquareOccupied() && rookSquare.getPiece().isFirstMove()
            && Player.calculateAttacksOnSquare(1, opponentsLegals).isEmpty()
            && Player.calculateAttacksOnSquare(2, opponentsLegals).isEmpty()
            && Player.calculateAttacksOnSquare(3, opponentsLegals).isEmpty()
            && rookSquare.getPiece().getPieceType().isRook()) {
          kingCastles.add(new QueenSideCastleMove(this.board, this.playerKing, 2, (Rook) rookSquare.getPiece(),
              rookSquare.getSquareIndex(), 3));
        }
      }
      // King Side
      if (!this.board.getSquare(5).isSquareOccupied() && !this.board.getSquare(6).isSquareOccupied()) {
        final Square rookSquare = this.board.getSquare(7);

        if (rookSquare.isSquareOccupied() && rookSquare.getPiece().isFirstMove()
            && Player.calculateAttacksOnSquare(5, opponentsLegals).isEmpty()
            && Player.calculateAttacksOnSquare(6, opponentsLegals).isEmpty()
            && rookSquare.getPiece().getPieceType().isRook()) {
          kingCastles.add(new KingSideCastleMove(this.board, this.playerKing, 6, (Rook) rookSquare.getPiece(),
              rookSquare.getSquareIndex(), 5));
        }
      }
    }
    return Collections.unmodifiableList(kingCastles);
  }

}