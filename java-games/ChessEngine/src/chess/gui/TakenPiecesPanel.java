package chess.gui;

import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.Dimension;
import java.awt.GridLayout;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

import javax.imageio.ImageIO;
import javax.swing.ImageIcon;
import javax.swing.JLabel;
import javax.swing.JPanel;
import javax.swing.border.EtchedBorder;

import chess.engine.board.Move;
import chess.engine.pieces.Piece;
import chess.gui.Table.MoveLog;

/**
 * TakenPiecesPanel
 */
public class TakenPiecesPanel extends JPanel {
  private static final long serialVersionUID = 1L;
  private final JPanel northPanel;
  private final JPanel southPanel;

  private static final Color PANEL_COLOR = Color.decode("#f00");
  private static final Dimension TAKEN_PIECES_DIMENSION = new Dimension(50, 80);

  private static final EtchedBorder PANEL_BORDER = new EtchedBorder(EtchedBorder.RAISED);

  public TakenPiecesPanel() {
    super(new BorderLayout());
    this.setBackground(PANEL_COLOR);
    this.setBorder(PANEL_BORDER);
    this.northPanel = new JPanel(new GridLayout(8, 2));
    this.southPanel = new JPanel(new GridLayout(8, 2));
    this.northPanel.setBackground(PANEL_COLOR);
    this.southPanel.setBackground(PANEL_COLOR);
    this.add(this.northPanel, BorderLayout.NORTH);
    this.add(this.southPanel, BorderLayout.SOUTH);
    setPreferredSize(TAKEN_PIECES_DIMENSION);

  }

  public void redo(final MoveLog moveLog) {
    northPanel.removeAll();
    southPanel.removeAll();

    final List<Piece> whiteTakenPieces = new ArrayList<>();
    final List<Piece> blackTakenPieces = new ArrayList<>();

    for (final Move move : moveLog.getMoves()) {
      if (move.isAttack()) {
        final Piece takenPiece = move.getAttackedPiece();
        if (takenPiece.getPieceAlliance().isWhite()) {
          whiteTakenPieces.add(takenPiece);
        } else {
          blackTakenPieces.add(takenPiece);
        }
      }
    }

    Collections.sort(whiteTakenPieces, new Comparator<Piece>() {
      @Override
      public int compare(final Piece p1, final Piece p2) {
        return Integer.compare(p1.getPieceValue(), p2.getPieceValue());
      }
    });
    Collections.sort(blackTakenPieces, new Comparator<Piece>() {
      @Override
      public int compare(final Piece p1, final Piece p2) {
        return Integer.compare(p1.getPieceValue(), p2.getPieceValue());
      }
    });

    for (final Piece takenPiece : whiteTakenPieces) {
      try {
        final BufferedImage image = ImageIO.read(new File(Table.defaultImagePath
            + takenPiece.getPieceAlliance().toString().substring(0, 1) + takenPiece.toString() + ".png"));
        final ImageIcon icon = new ImageIcon(image);
        final JLabel imageLabel = new JLabel(icon);
        this.northPanel.add(imageLabel);
      } catch (final IOException e) {
        e.printStackTrace();
      }
    }
    for (final Piece takenPiece : blackTakenPieces) {
      try {
        final BufferedImage image = ImageIO.read(new File(Table.defaultImagePath
            + takenPiece.getPieceAlliance().toString().substring(0, 1) + takenPiece.toString() + ".png"));
        final ImageIcon icon = new ImageIcon(image);
        final JLabel imageLabel = new JLabel(icon);
        this.northPanel.add(imageLabel);
      } catch (final IOException e) {
        e.printStackTrace();
      }
    }

    validate();
  }
}