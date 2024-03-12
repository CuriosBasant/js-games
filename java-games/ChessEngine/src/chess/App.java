package chess;

import chess.engine.board.Board;
import chess.gui.Table;

class App {
  public static void main(String[] args) throws Exception {
    Board board = Board.createStandardBoard();
    System.out.println(board);

    // Table table =
    new Table();
  }
}