package chess.engine;

import chess.engine.board.Utils;
import chess.engine.player.BlackPlayer;
import chess.engine.player.Player;
import chess.engine.player.WhitePlayer;

public enum Alliance {
  WHITE {
    @Override
    public int getDirection() {
      return -1;
    }

    @Override
    public boolean isWhite() {
      return true;
    }

    @Override
    public boolean isBlack() {
      return false;
    }

    @Override
    public Player choosePlayer(final WhitePlayer whitePlayer, final BlackPlayer blackPlayer) {
      return whitePlayer;
    }

    @Override
    public int getOppositeDirection() {
      return 1;
    }

    @Override
    public boolean isPawnPromotionSquare(final int position) {
      return position < Utils.PER_ROW;
    }

  },
  BLACK {
    @Override
    public int getDirection() {
      return 1;
    }

    @Override
    public boolean isWhite() {
      return false;
    }

    @Override
    public boolean isBlack() {
      return true;
    }

    @Override
    public Player choosePlayer(final WhitePlayer whitePlayer, final BlackPlayer blackPlayer) {
      return blackPlayer;
    }

    @Override
    public int getOppositeDirection() {
      return -1;
    }

    @Override
    public boolean isPawnPromotionSquare(final int position) {
      return position >= Utils.TOT_SQUARES - Utils.PER_ROW;
    }
  };

  public abstract int getDirection();

  public abstract boolean isWhite();

  public abstract boolean isBlack();

  public abstract Player choosePlayer(WhitePlayer whitePlayer, BlackPlayer blackPlayer);

  public abstract int getOppositeDirection();

  public abstract boolean isPawnPromotionSquare(int position);
}