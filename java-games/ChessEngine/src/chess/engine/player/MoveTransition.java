package chess.engine.player;

import chess.engine.board.Board;
import chess.engine.board.Move;

public class MoveTransition {

  private final Board transitionBoard;
  private final Move move;
  private final MoveStatus moveStatus;

  public MoveTransition(final Board transitionBoard, final Move move, final MoveStatus moveStatus) {
    this.transitionBoard = transitionBoard;
    this.move = move;
    this.moveStatus = moveStatus;
  }

  public Board getTransitionBoard() {
    return transitionBoard;
  }

  public Move getMove() {
    return move;
  }

  public MoveStatus getMoveStatus() {
    return this.moveStatus;
  }
}
