package chess.engine.board;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import chess.engine.Alliance;
import chess.engine.pieces.Bishop;
import chess.engine.pieces.King;
import chess.engine.pieces.Knight;
import chess.engine.pieces.Pawn;
import chess.engine.pieces.Piece;
import chess.engine.pieces.Queen;
import chess.engine.pieces.Rook;
import chess.engine.player.BlackPlayer;
import chess.engine.player.Player;
import chess.engine.player.WhitePlayer;

/**
 * Board
 */
public class Board {
  private final List<Square> gameBoard;
  private final Collection<Piece> whitePieces;
  private final Collection<Piece> blackPieces;

  private final WhitePlayer whitePlayer;
  private final BlackPlayer blackPlayer;
  private final Player currentPlayer;

  private final Pawn enPassantPawn;

  private Board(final Builder builder) {
    this.gameBoard = createGameBoard(builder);
    this.whitePieces = calculateActivePieces(this.gameBoard, Alliance.WHITE);
    this.blackPieces = calculateActivePieces(this.gameBoard, Alliance.BLACK);

    final Collection<Move> whiteLegalMoves = calculateLegalMoves(this.whitePieces);
    final Collection<Move> blackLegalMoves = calculateLegalMoves(this.blackPieces);
    this.whitePlayer = new WhitePlayer(this, whiteLegalMoves, blackLegalMoves);
    this.blackPlayer = new BlackPlayer(this, blackLegalMoves, whiteLegalMoves);
    this.currentPlayer = builder.nextMoveMaker.choosePlayer(this.whitePlayer, this.blackPlayer);
    this.enPassantPawn = builder.enPassantPawn;
  }

  private Collection<Move> calculateLegalMoves(final Collection<Piece> pieces) {
    final List<Move> legalMoves = new ArrayList<>();

    for (final Piece piece : pieces) {
      legalMoves.addAll(piece.calculateLegalMoves(this));
    }
    return Collections.unmodifiableList(legalMoves);
  }

  @Override
  public String toString() {
    final StringBuilder builder = new StringBuilder();

    for (int i = 0; i < Utils.TOT_SQUARES; i++) {
      final String squareText = this.gameBoard.get(i).toString();

      builder.append(String.format("%3s", squareText));
      if ((i + 1) % Utils.PER_ROW == 0) {
        builder.append("\n");
      }
    }
    return builder.toString();
  }

  public Player whitePlayer() {
    return this.whitePlayer;
  }

  public Player blackPlayer() {
    return this.blackPlayer;
  }

  public Player currentPlayer() {
    return this.currentPlayer;
  }

  public Pawn getEnPassantPawn() {
    return this.enPassantPawn;
  }

  public Collection<Piece> getBlackPieces() {
    return this.blackPieces;
  }

  public Collection<Piece> getWhitePieces() {
    return this.whitePieces;
  }

  public Collection<Move> getAllLegalMoves() {
    final List<Move> totalMoves = new ArrayList<Move>(this.whitePlayer.getLegalMoves());
    totalMoves.addAll(this.blackPlayer.getLegalMoves());
    return Collections.unmodifiableList(totalMoves);
  }

  public Square getSquare(final int index) {
    return gameBoard.get(index);
  }

  private static Collection<Piece> calculateActivePieces(final List<Square> gameBoard, final Alliance alliance) {
    final List<Piece> activePieces = new ArrayList<>();

    for (final Square square : gameBoard) {
      if (square.isSquareOccupied()) {
        final Piece piece = square.getPiece();
        if (piece.getPieceAlliance() == alliance) {
          activePieces.add(piece);
        }
      }
    }
    return Collections.unmodifiableList(activePieces);
  }

  /*
   * Putting Pieces on Board
   */
  private static List<Square> createGameBoard(final Builder builder) {
    final List<Square> squares = new ArrayList<>();

    for (int i = 0; i < Utils.TOT_SQUARES; i++) {
      squares.add(Square.createSquare(i, builder.boardConfig.get(i)));
    }
    return Collections.unmodifiableList(squares);
  }
  // private static List<Square> createGameBoard(final Builder builder) {
  // final Square[] squares = new Square[Utils.TOT_SQUARES];

  // for (int i = 0; i < Utils.TOT_SQUARES; i++) {
  // squares[i] = Square.createSquare(i, builder.boardConfig.get(i));
  // }
  // return Collections.unmodifiableList(Arrays.asList(squares));
  // }

  public static Board createStandardBoard() {
    final Builder builder = new Builder();

    // BLACK Layout
    builder.setPiece(new Rook(0, Alliance.BLACK));
    builder.setPiece(new Knight(1, Alliance.BLACK));
    builder.setPiece(new Bishop(2, Alliance.BLACK));
    builder.setPiece(new Queen(3, Alliance.BLACK));
    builder.setPiece(new King(4, Alliance.BLACK));
    builder.setPiece(new Bishop(5, Alliance.BLACK));
    builder.setPiece(new Knight(6, Alliance.BLACK));
    builder.setPiece(new Rook(7, Alliance.BLACK));
    builder.setPiece(new Pawn(8, Alliance.BLACK));
    builder.setPiece(new Pawn(9, Alliance.BLACK));
    builder.setPiece(new Pawn(10, Alliance.BLACK));
    builder.setPiece(new Pawn(11, Alliance.BLACK));
    builder.setPiece(new Pawn(12, Alliance.BLACK));
    builder.setPiece(new Pawn(13, Alliance.BLACK));
    builder.setPiece(new Pawn(14, Alliance.BLACK));
    builder.setPiece(new Pawn(15, Alliance.BLACK));

    // WHITE Layout
    builder.setPiece(new Pawn(48, Alliance.WHITE));
    builder.setPiece(new Pawn(49, Alliance.WHITE));
    builder.setPiece(new Pawn(50, Alliance.WHITE));
    builder.setPiece(new Pawn(51, Alliance.WHITE));
    builder.setPiece(new Pawn(52, Alliance.WHITE));
    builder.setPiece(new Pawn(53, Alliance.WHITE));
    builder.setPiece(new Pawn(54, Alliance.WHITE));
    builder.setPiece(new Pawn(55, Alliance.WHITE));
    builder.setPiece(new Rook(56, Alliance.WHITE));
    builder.setPiece(new Knight(57, Alliance.WHITE));
    builder.setPiece(new Bishop(58, Alliance.WHITE));
    builder.setPiece(new Queen(59, Alliance.WHITE));
    builder.setPiece(new King(60, Alliance.WHITE));
    builder.setPiece(new Bishop(61, Alliance.WHITE));
    builder.setPiece(new Knight(62, Alliance.WHITE));
    builder.setPiece(new Rook(63, Alliance.WHITE));

    builder.setMoveMaker(Alliance.WHITE);
    return builder.build();
  }

  public static class Builder {

    Map<Integer, Piece> boardConfig;
    Alliance nextMoveMaker;
    Pawn enPassantPawn;

    public Builder() {
      this.boardConfig = new HashMap<>();
    }

    public Builder setPiece(final Piece piece) {
      this.boardConfig.put(piece.getPiecePosition(), piece);
      return this;
    }

    public Builder setMoveMaker(final Alliance moveMaker) {
      this.nextMoveMaker = moveMaker;
      return this;
    }

    public Board build() {
      return new Board(this);
    }

    public void setEnPassantPawn(final Pawn enPassantPawn) {
      this.enPassantPawn = enPassantPawn;
    }
  }

}