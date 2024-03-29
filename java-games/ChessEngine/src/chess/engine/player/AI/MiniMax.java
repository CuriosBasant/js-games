package chess.engine.player.AI;

import chess.engine.board.Board;
import chess.engine.board.Move;
import chess.engine.player.MoveTransition;

/**
 * MiniMax
 */
public class MiniMax implements MoveStrategy {
  private final BoardEvaluator boardEvaluator;
  private final int searchDepth;

  public MiniMax(final int searchDepth) {
    this.boardEvaluator = new StandardBoardEvaluator();
    this.searchDepth = searchDepth;
  }

  @Override
  public String toString() {
    return "MiniMax";
  }

  @Override
  public Move execute(final Board board) {
    // final long startTime = System.currentTimeMillis();
    Move bestMove = null;
    int lowestSeenValue = Integer.MAX_VALUE;
    int highestSeenValue = Integer.MIN_VALUE;
    int currentValue;

    System.out.println(board.currentPlayer() + " Thinking with depth = " + searchDepth);
    // int numMoves = board.currentPlayer().getLegalMoves().size();

    for (final Move move : board.currentPlayer().getLegalMoves()) {
      final MoveTransition moveTransition = board.currentPlayer().makeMove(move);

      if (moveTransition.getMoveStatus().isDone()) {
        currentValue = board.currentPlayer().getAlliance().isWhite()
            ? min(moveTransition.getTransitionBoard(), searchDepth - 1)
            : max(moveTransition.getTransitionBoard(), searchDepth - 1);

        if (board.currentPlayer().getAlliance().isWhite() && currentValue > highestSeenValue) {
          highestSeenValue = currentValue;
          bestMove = move;
        } else if (board.currentPlayer().getAlliance().isBlack() && currentValue < lowestSeenValue) {
          lowestSeenValue = currentValue;
          bestMove = move;
        }
      }
    }

    // final long executionTime = System.currentTimeMillis() - startTime;

    return bestMove;
  }

  public int min(final Board board, final int depth) {
    if (depth == 0 || isEndGameScenario(board)) {
      return this.boardEvaluator.evaluate(board, depth);
    }
    int lowestSeenValue = Integer.MAX_VALUE;
    for (final Move move : board.currentPlayer().getLegalMoves()) {
      final MoveTransition moveTransition = board.currentPlayer().makeMove(move);

      if (moveTransition.getMoveStatus().isDone()) {
        final int currentValue = max(moveTransition.getTransitionBoard(), depth - 1);

        if (currentValue < lowestSeenValue) {
          lowestSeenValue = currentValue;
        }
      }
    }
    return lowestSeenValue;
  }

  private boolean isEndGameScenario(final Board board) {
    return board.currentPlayer().isInCheckMate() || board.currentPlayer().isInStaleMate();
  }

  public int max(final Board board, final int depth) {
    if (depth == 0 || isEndGameScenario(board)) {
      return this.boardEvaluator.evaluate(board, depth);
    }
    int highestSeenValue = Integer.MIN_VALUE;

    for (final Move move : board.currentPlayer().getLegalMoves()) {
      final MoveTransition moveTransition = board.currentPlayer().makeMove(move);

      if (moveTransition.getMoveStatus().isDone()) {
        final int currentValue = min(moveTransition.getTransitionBoard(), depth - 1);

        if (currentValue > highestSeenValue) {
          highestSeenValue = currentValue;
        }
      }
    }
    return highestSeenValue;
  }
}