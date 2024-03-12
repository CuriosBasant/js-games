package app;

import java.util.Scanner;

import board.Board;
import board.pieces.*;

public class App {

  public static void main(String[] args) throws Exception {
    System.out.println("\n\n==================== OUTPUT ====================\n");

    Board board = new Board((byte) 8);

    board.display();

    System.out.print("Select Piece: ");
    Scanner input = new Scanner(System.in);
    // input.next();
  }
}