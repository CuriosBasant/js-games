package tictactoe.engine.board;

import java.util.HashMap;
import java.util.Map;

/**
 * Builder
 */
public class Builder {
  Map<Integer, Character> boardConfig;

  public Builder() {
    this.boardConfig = new HashMap<>();
  }

  public Board build() {
    return new Board(this);
  }

}