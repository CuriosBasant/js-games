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

public class WhitePlayer extends Player {

  public WhitePlayer(final Board board, final Collection<Move> selfLegalMoves,
      final Collection<Move> opponentLegalMoves) {
    super(board, selfLegalMoves, opponentLegalMoves);
  }

  public Collection<Piece> getActivePieces() {
    return this.board.getWhitePieces();
  }

  public Alliance getAlliance() {
    return Alliance.WHITE;
  }

  public Player getOpponent() {
    return this.board.blackPlayer();
  }

  @Override
  protected Collection<Move> calculateKingCastles(final Collection<Move> playerLegals,
      final Collection<Move> opponentsLegals) {
    final List<Move> kingCastles = new ArrayList<>();
    if (this.playerKing.isFirstMove() && !this.isInCheck()) {
      // Queen Side
      if (!this.board.getSquare(57).isSquareOccupied() && !this.board.getSquare(58).isSquareOccupied()
          && !this.board.getSquare(59).isSquareOccupied()) {
        final Square rookSquare = this.board.getSquare(56);

        if (rookSquare.isSquareOccupied() && rookSquare.getPiece().isFirstMove()
            && Player.calculateAttacksOnSquare(57, opponentsLegals).isEmpty()
            && Player.calculateAttacksOnSquare(58, opponentsLegals).isEmpty()
            && Player.calculateAttacksOnSquare(59, opponentsLegals).isEmpty()
            && rookSquare.getPiece().getPieceType().isRook()) {
          kingCastles.add(new QueenSideCastleMove(this.board, this.playerKing, 58, (Rook) rookSquare.getPiece(),
              rookSquare.getSquareIndex(), 59));
        }
      }
      // King Side
      if (!this.board.getSquare(61).isSquareOccupied() && !this.board.getSquare(62).isSquareOccupied()) {
        final Square rookSquare = this.board.getSquare(63);

        if (rookSquare.isSquareOccupied() && rookSquare.getPiece().isFirstMove()
            && Player.calculateAttacksOnSquare(61, opponentsLegals).isEmpty()
            && Player.calculateAttacksOnSquare(62, opponentsLegals).isEmpty()
            && rookSquare.getPiece().getPieceType().isRook()) {
          kingCastles.add(new KingSideCastleMove(this.board, this.playerKing, 62, (Rook) rookSquare.getPiece(),
              rookSquare.getSquareIndex(), 61));
        }
      }
    }
    return Collections.unmodifiableList(kingCastles);
  }

}