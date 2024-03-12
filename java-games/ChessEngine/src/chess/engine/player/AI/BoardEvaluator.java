package chess.engine.player.AI;

import chess.engine.board.Board;

/**
 * BoardEvaluator
 */
public interface BoardEvaluator {

  int evaluate(Board board, int depth);
}