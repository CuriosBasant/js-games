package player;

/**
 * Player
 */
public class Player {

  public static byte playerCounter = 0;
  public String name = null;
  public final byte sideNumber = ++playerCounter;
  public int activePieces[];

  public Player(String _name) {
    name = _name;
  }
}