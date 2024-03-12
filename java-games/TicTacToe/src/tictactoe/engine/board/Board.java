package tictactoe.engine.board;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * Board
 */
public class Board {

  private List<Tile> gameBoard;

  public Board(Builder builder) {
    this.gameBoard = createGameBoard(builder);
  }

  private static List<Tile> createGameBoard(final Builder builder) {
    final List<Tile> Tiles = new ArrayList<>();

    for (int i = 0; i < Utils.TOT_TileS; i++) {
      Tiles.add(Tile.createTile(i, builder.boardConfig.get(i)));
    }
    return Collections.unmodifiableList(Tiles);
  }
}