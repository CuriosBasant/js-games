package chess.gui;

import static javax.swing.SwingUtilities.isLeftMouseButton;
import static javax.swing.SwingUtilities.isRightMouseButton;

import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.Dimension;
import java.awt.GridBagLayout;
import java.awt.GridLayout;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.MouseEvent;
import java.awt.event.MouseListener;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.List;

import javax.imageio.ImageIO;
import javax.swing.ImageIcon;
import javax.swing.JCheckBoxMenuItem;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JMenu;
import javax.swing.JMenuBar;
import javax.swing.JMenuItem;
import javax.swing.JPanel;
import javax.swing.SwingUtilities;

import chess.engine.board.Board;
import chess.engine.board.Move;
import chess.engine.board.Move.MoveFactory;
import chess.engine.board.Square;
import chess.engine.board.Utils;
import chess.engine.pieces.Piece;
import chess.engine.player.MoveTransition;

/**
 * Table
 */
public class Table {
  private static final Dimension OUTER_FRAME_DIMENSION = new Dimension(720, 620);
  private static final Dimension BOARD_PANEL_DIMENSION = new Dimension(400, 400);
  static final Dimension TILE_PANEL_DIMENSION = new Dimension(50, 50);
  static final String defaultImagePath = "art/themes/Neo/pieces/";
  static final Color LIGHT_COLOR = Color.decode("#89bae2");
  static final Color DARK_COLOR = Color.decode("#2196f3");

  private final JFrame gameFrame;
  private final GameHistoryPanel gameHistoryPanel;
  private final TakenPiecesPanel takenPiecesPanel;
  private final BoardPanel boardPanel;
  private final MoveLog moveLog;
  protected Board chessBoard;

  private Square sourceSquare;
  private Square destinationSquare;
  private Piece movedPiece;
  private BoardDirection boardDirection;

  private boolean toHighlightLegalMoves;

  public Table() {
    this.chessBoard = Board.createStandardBoard();
    this.boardDirection = BoardDirection.NORMAL;
    this.toHighlightLegalMoves = true;
    this.gameFrame = new JFrame("Curios Chess");
    this.gameFrame.setLayout(new BorderLayout());
gameFrame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);

    final JMenuBar tableMenuBar = createTableMenuBar();
    this.gameFrame.setJMenuBar(tableMenuBar);
    this.gameFrame.setSize(OUTER_FRAME_DIMENSION);

    this.gameHistoryPanel = new GameHistoryPanel();
    this.takenPiecesPanel = new TakenPiecesPanel();
    this.boardPanel = new BoardPanel();
    this.moveLog = new MoveLog();

    this.gameFrame.add(this.takenPiecesPanel, BorderLayout.WEST);
    this.gameFrame.add(this.boardPanel, BorderLayout.CENTER);
    this.gameFrame.add(this.gameHistoryPanel, BorderLayout.EAST);
    this.gameFrame.setVisible(true);
  }

  private JMenuBar createTableMenuBar() {
    final JMenuBar tableMenuBar = new JMenuBar();
    tableMenuBar.add(createFileMenu());
    tableMenuBar.add(createPreferencesMenu());
    return tableMenuBar;
  }

  private JMenu createFileMenu() {
    final JMenu fileMenu = new JMenu("File");
    final JMenuItem openPGN = new JMenuItem("Load PGN File");
    // openPGN.addActionListener(new ActionListener() {
    // @Override
    // public void actionPerformed(final ActionEvent ev) {
    // System.out.println("Open Up PGN");
    // }
    // });
    openPGN.addActionListener(ev -> System.out.println("Open Up PGN"));
    fileMenu.add(openPGN);

    final JMenuItem exitMenuItem = new JMenuItem("Exit");
    exitMenuItem.addActionListener(ev -> System.exit(0));
    fileMenu.add(exitMenuItem);

    return fileMenu;
  }

  private JMenu createPreferencesMenu() {
    final JMenu preferencesMenu = new JMenu("Preferences");
    final JMenuItem flipBoardMenuItem = new JMenuItem("Flip Board");
    flipBoardMenuItem.addActionListener(new ActionListener() {
      @Override
      public void actionPerformed(final ActionEvent ev) {
        boardDirection = boardDirection.opposite();
        boardPanel.drawBoard(chessBoard);
      }
    });
    preferencesMenu.add(flipBoardMenuItem);

    preferencesMenu.addSeparator();

    final JCheckBoxMenuItem legalMoveHighlighterCheckbox = new JCheckBoxMenuItem("Show Legal Moves", true);
    legalMoveHighlighterCheckbox
        .addActionListener(ev -> toHighlightLegalMoves = legalMoveHighlighterCheckbox.isSelected());
    preferencesMenu.add(legalMoveHighlighterCheckbox);
    return preferencesMenu;
  }

  public enum BoardDirection {
    NORMAL {
      @Override
      List<SquarePanel> traverse(final List<SquarePanel> boardSquares) {
        return boardSquares;
      }

      @Override
      BoardDirection opposite() {
        return FLIPPED;
      }
    },
    FLIPPED {
      @Override
      List<SquarePanel> traverse(final List<SquarePanel> boardSquares) {
        Collections.reverse(boardSquares);
        return boardSquares;
      }

      @Override
      BoardDirection opposite() {
        return NORMAL;
      }
    };

    abstract List<SquarePanel> traverse(final List<SquarePanel> boardSquares);

    abstract BoardDirection opposite();
  }

  private class BoardPanel extends JPanel {
    private static final long serialVersionUID = 1L;
    final List<SquarePanel> boardSquares;

    BoardPanel() {
      super(new GridLayout(Utils.PER_ROW, Utils.PER_ROW));
      this.boardSquares = new ArrayList<>();

      for (int i = 0; i < Utils.TOT_SQUARES; i++) {
        final SquarePanel squarePanel = new SquarePanel(this, i);

        this.boardSquares.add(squarePanel);
        add(squarePanel);
      }
      setPreferredSize(BOARD_PANEL_DIMENSION);
      validate();
    }

    public void drawBoard(final Board board) {
      removeAll();
      for (final SquarePanel squarePanel : boardDirection.traverse(boardSquares)) {
        squarePanel.drawSquare(board);
        add(squarePanel);
      }
      validate();
      repaint();
    }
  }

  public static class MoveLog {
    private final List<Move> moves;

    MoveLog() {
      this.moves = new ArrayList<>();
    }

    public List<Move> getMoves() {
      return this.moves;
    }

    public void addMove(final Move move) {
      this.moves.add(move);
    }

    public int size() {
      return this.moves.size();
    }

    public void clear() {
      this.moves.clear();
    }

    public Move removeMove(final int index) {
      return this.moves.remove(index);
    }

    public boolean removeMove(final Move move) {
      return this.moves.remove(move);
    }
  }

  private class SquarePanel extends JPanel {
    /**
     *
     */
    private static final long serialVersionUID = 262944660893003916L;
    private final int squareID;

    SquarePanel(final BoardPanel boardPanel, final int squareID) {
      super(new GridBagLayout());
      this.squareID = squareID;
      setPreferredSize(Table.TILE_PANEL_DIMENSION);
      assignSquareColor();
      assignSquarePieceIcon(chessBoard);

      addMouseListener(new MouseListener() {
        @Override
        public void mouseClicked(final MouseEvent ev) {
          if (isLeftMouseButton(ev)) {
            // System.out.println("click");
            if (sourceSquare == null) {
              sourceSquare = chessBoard.getSquare(squareID);
              movedPiece = sourceSquare.getPiece();
              if (movedPiece == null) {
                sourceSquare = null;
              }
            } else {
              destinationSquare = chessBoard.getSquare(squareID);
              final Move move = MoveFactory.createMove(chessBoard, sourceSquare.getSquareIndex(),
                  destinationSquare.getSquareIndex());
              final MoveTransition transition = chessBoard.currentPlayer().makeMove(move);
              if (transition.getMoveStatus().isDone()) {
                chessBoard = transition.getTransitionBoard();
                moveLog.addMove(move);
              }
              sourceSquare = null;
              // destinationSquare = null;
              movedPiece = null;
            }

            SwingUtilities.invokeLater(new Runnable() {
              @Override
              public void run() {
                takenPiecesPanel.redo(moveLog);
                boardPanel.drawBoard(chessBoard);
                gameHistoryPanel.redo(chessBoard, moveLog);
              }
            });
          } else if (isRightMouseButton(ev)) {
            sourceSquare = null;
            destinationSquare = null;
            movedPiece = null;
          }
        }

        @Override
        public void mousePressed(final MouseEvent ev) {
        }

        @Override
        public void mouseReleased(final MouseEvent ev) {
        }

        @Override
        public void mouseEntered(final MouseEvent ev) {
        }

        @Override
        public void mouseExited(final MouseEvent ev) {
        }
      });

      validate();
    }

    public void drawSquare(final Board board) {
      assignSquareColor();
      assignSquarePieceIcon(board);
      highlightLegals(board);
      validate();
      repaint();
    }

    private void assignSquarePieceIcon(final Board board) {
      this.removeAll();
      if (board.getSquare(squareID).isSquareOccupied()) {
        BufferedImage image;
        try {
          image = ImageIO.read(new File(
              defaultImagePath + board.getSquare(squareID).getPiece().getPieceAlliance().toString().substring(0, 1)
                  + board.getSquare(squareID).getPiece().toString() + ".png"));
          add(new JLabel(new ImageIcon(image)));
        } catch (final IOException e) {
          e.printStackTrace();
        }
      }
    }

    private void assignSquareColor() {
      final int x = squareID / Utils.PER_ROW;
      // int x = Math.floorDiv(squareID, Utils.PER_ROW);
      final int y = squareID % Utils.PER_ROW;
      setBackground((x + y) % 2 == 1 ? LIGHT_COLOR : DARK_COLOR);
    }

    private void highlightLegals(final Board board) {
      if (toHighlightLegalMoves) {
        for (final Move move : pieceLegalMoves(board)) {
          if (move.getDestinationIndex() == this.squareID) {
            try {
              add(new JLabel(new ImageIcon(ImageIO.read(new File("art/dot/dot.png")))));
            } catch (final Exception e) {
              e.printStackTrace();
            }
          }
        }
      }
    }

    private Collection<Move> pieceLegalMoves(final Board board) {
      if (movedPiece != null && movedPiece.getPieceAlliance() == board.currentPlayer().getAlliance()) {
        return movedPiece.calculateLegalMoves(board);
      }
      return Collections.emptyList();
    }
  }
}