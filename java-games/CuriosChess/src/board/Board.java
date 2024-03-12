package board;

import java.util.Arrays;
import board.pieces.*;

import player.Player;

/**
 * Board
 */
public class Board {
  private byte order = 8;
  private final char position[][] = { { 'r', 'n', 'b', 'q', 'k', 'b', 'n', 'r' },
      { 'p', 'p', 'p', 'p', 'p', 'p', 'p', 'p' }, { '-', '-', '-', '-', '-', '-', '-', '-' },
      { '-', '-', '-', '-', '-', '-', '-', '-' }, { '-', '-', '-', '-', '-', '-', '-', '-' },
      { '-', '-', '-', '-', '-', '-', '-', '-' }, { 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P' },
      { 'R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R' } };

  private final Player players[] = { new Player("John"), new Player("Johnny") };
  public Player activePlayer = players[0];
  public Piece all[][] = new Piece[8][8];

  public Board(final byte odr) {
    order = odr;
    reset();
  }

  public void reset() {
    for (byte i = 0; i < order; i++) {
      for (byte j = 0; j < order; j++) {
        byte ind[] = { i, j };
        switch (position[i][j]) {
        case 'p':
          all[i][j] = new Pawn(ind);
          break;

        default:
          System.out.println('h');
          break;
        }
      }
    }
  }

  public void display() {
    final char SING_HORI = 0x2500, SING_VERT = 0x2502, VERT_HORI = 0x253C;
    // DOWN_RIGHT = 0x2554, DOWN_LEFT = 0x2557, UP_RIGHT = 0x255A, UP_LEFT = 0x255D,
    // VERT_LEFT = 0x2562, VERT_RIGHT = 0x255F, HORI_UP = 0x2567, HORI_DOWN =
    // 0x2564,
    // DOUB_HORI = 0x2550, DOUB_VERT = 0x2551,
    System.out.println("\n\n");

    final String divider = "  " + (VERT_HORI + ("" + SING_HORI).repeat(3)).repeat(order) + VERT_HORI + '\n';
    byte num = 8;

    for (final char[] rank : position) {
      String str = num-- + new String(rank).replace("", String.format(" %c ", SING_VERT));
      System.out.println(divider + str);
    }
    // Printing Coordinates
    System.out.printf("%s %s\n\n\n", divider, "abcdefgh".replace("", "   "));
  }

  /*
   * private void nextTurn() { activePlayer = players[activePlayer.sideNumber %
   * 2]; // playerCounter;JavaSE-1.8 }
   */
}
