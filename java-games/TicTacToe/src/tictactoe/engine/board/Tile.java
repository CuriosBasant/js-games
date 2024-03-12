package tictactoe.engine.board;

/**
 * Tile
 */
public class Tile {

  private int tileIndex;

  public int getTileIndex() {
    return tileIndex;
  }

  public Tile(int tileIndex) {
    this.tileIndex = tileIndex;
  }

  public static Tile createTile(int i, Character character) {
    return null;
  }
}