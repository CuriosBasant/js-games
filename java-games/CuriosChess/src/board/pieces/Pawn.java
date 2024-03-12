package board.pieces;

public class Pawn extends Piece {
  public String name = "Pawn";
  public byte indices[] = new byte[2];

  public Pawn(byte[] index) {
    indices = index;
  }
}