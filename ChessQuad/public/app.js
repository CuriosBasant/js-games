import Board from "./scripts/Board.js";
import Utils, { convertForEngine, convertForGUI } from "./scripts/Utilities.js";

let sourceSquare = null, boardPanel;
const square = {
  source: null,
  destination: null,
  candidates: [],
  toggle: function (flag) {
    // board.selectedSquare.node.classList.toggle('highlight', flag)
    for (const move of this.candidates) {
      const squarePanel = boardPanel.boardSquares[convertForGUI(move.destinationIndex)];

      squarePanel.node.classList.toggle('piece-path', flag);
    }
  }
}

let chessBoard = Board.createStandardBoard();
window.board = chessBoard;

window.onload = () => {
  document.documentElement.style.setProperty('--board-order', Utils.ORDER - 2);

  boardPanel = new BoardPanel();

}

function squareClicked (index) {
  index = convertForEngine(index);
  // console.log(index);

  if (sourceSquare == null) {
    sourceSquare = chessBoard.getSquare(index);
    // console.log(chessBoard);
    if (sourceSquare.isOccupied && sourceSquare.piece.alliance == chessBoard.activePlayer.alliance) {
      square.candidates = sourceSquare.piece.calculateLegalMoves(chessBoard);
      square.toggle(true);
    }
    if (!square.candidates.length) {
      sourceSquare = null;
    }
  } else {
    square.toggle(false);
    const selectedMove = square.candidates.filter(move => move.destinationIndex == index)[0] || null;

    if (selectedMove == null) {

    } else {
      const sourcePanel = boardPanel.getSquarePanel(selectedMove.movedPiece.position);
      const destinationPanel = boardPanel.getSquarePanel(index);
      if (selectedMove.isAttack) {
        destinationPanel.pieceIcon.remove();
      }

      destinationPanel.pieceIcon = sourcePanel.placePieceOn(destinationPanel.id);
      sourcePanel.pieceIcon = null;

      chessBoard = selectedMove.execute();
      square.candidates = [];
    }

    sourceSquare = null;
  }
}

class BoardPanel {
  constructor() {
    this.boardSquares = [];
    this.boardNode = document.getElementById("board-panel");

    for (let i = 0; i < 64; i++) {
      const span = document.createElement("span");
      span.addEventListener('click', () => squareClicked(i));
      const squarePanel = new SquarePanel(i, span);
      this.boardSquares.push(squarePanel);
      this.boardNode.appendChild(span);
    }
  }

  getSquarePanel (index) {
    return this.boardSquares[convertForGUI(index)];
  }
}

class SquarePanel {
  static piecesContainer = document.getElementById("pieces");
  constructor(id, node) {
    this.id = id;
    this.node = node;
    this.pieceIcon = null;

    this.assignSquarePiece(chessBoard);
  }

  placePieceOn (index) {
    const [x, y] = [index % 8, index / 8 | 0];
    this.pieceIcon.style.transform = `translate(${x * 100}%, ${y * 100}%)`;
    return this.pieceIcon;
  }

  squareClicked () {
    console.log(this.id);
  }

  assignSquarePiece (board) {
    const square = board.getSquare(convertForEngine(this.id));
    // console.log(square, convertForEngine(this.id), this.id);
    const [x, y] = [this.id % 8, this.id / 8 | 0];
    this.node.classList.add('square', (x + y) % 2 ? 'dark' : 'light');
    if (!square.isOccupied) return;

    const piece = square.piece;
    this.pieceIcon = document.createElement('img');
    this.pieceIcon.src = `./images/pieces/${piece.toString()}.png`;
    this.pieceIcon.style.transform = `translate(${x * 100}%, ${y * 100}%)`;
    SquarePanel.piecesContainer.appendChild(this.pieceIcon);

  }
}

// assignSquarePieces(chessBoard);



