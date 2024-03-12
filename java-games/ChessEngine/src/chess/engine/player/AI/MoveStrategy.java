package chess.engine.player.AI;

import chess.engine.board.Board;
import chess.engine.board.Move;

/**
 * MoveStrategy
 */
public interface MoveStrategy {

  Move execute(Board board);
}