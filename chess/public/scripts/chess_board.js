import Piece, { Empty, Pawn, Knight, Bishop, Rook, Queen, King } from './chess_pieces.js'
import Square from './board_square.js'
import Player from './player.js'
// import Chess from './chess.js'

let chess
const homes = {
  all: [],
  show: function (bool = true) {
    // console.log(this)
    for (const { node, piece } of this.all) {
      node.classList.toggle(piece.name == null ? 'home' : 'capture', bool)
    }
  }
}

let squareOnClick = function (index) {
  // console.log(ev.currentTarget)
  // const index = JSON.parse(ev.currentTarget.dataset.index)
  const square = this.square[index[0]][index[1]]
  // const square = this.getPieceAtIndex(index)

  if (chess.customSetup.isActive) {
    if (square.piece.name == null) {
      this.placePieceOn(index, chess.customSetup.selectedPieceCode)
    } else {
      this.placePieceOn(index, '_')
    }
  } else {
    selectSquare(square, this)
  }
}

function selectSquare (square, board) {
  if (board.selectedPiece == null) {
    if (square.piece.side == board.turn) {
      board.selectedPiece = square
      homes.all = square.piece.getValidMoves()
      homes.show()
    } else {
      square.piece.invalid()
    }
  } else {
    homes.show(false)

    if (square.piece.side == board.turn) {
      if (board.selectedPiece != square) {
        setTimeout(() => selectSquare(square, board), 50)
      }
    } else {
      board.selectedPiece.moveTo(square)
    }
    board.selectedPiece = null
  }
}

class Board {
  static counter = 0
  static node = document.getElementById('board')
  constructor({ turn, totalMovesCount, position }, ches) {
    chess = ches
    this.players = []
    this.ID = ++Board.counter
    this.turn = turn
    this.player = null
    this.totalMoves = 0
    this.position = position
    // this.piece = [[], [], [], [], [], [], [], []]
    this.history = []

    this.square = [[], [], [], [], [], [], [], []]

    this.selectedSquare = null
    this.squareSize = null
    this.initialPosition = chess.variants.standard
    this.history[-1] = {
      node: document.getElementById('board-history'),
      get cloneFirst () {
        return this.node.firstElementChild.cloneNode()
      },
      highlight: () => { }
    }

  }

  create () {
    const brd = document.getElementById('squares')
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        const sqr = document.createElement('div')
        // sqr.dataset.index = `[${i}, ${j}]`
        this.square[i][j] = new Square([i, j], sqr)
        sqr.classList.add('square', (i + j) % 2 ? 'dark' : 'light')
        // sqr.appendChild(document.createElement('span'))

        // sqr.addEventListener('click', squareOnClick.bind(this))
        brd.appendChild(sqr)
      }
    }
    this.reset(this.position)
  }

  reset (position = null) {
    Piece.onBoard = this
    Square.ofBoard = this

    if (position == null) {
      console.log(this.initialPosition)
      position = this.initialPosition
      this.position = position
      this.turn = 0
      this.totalMoves = 0
      this.history.length = 0
    }

    /* const getPieceClass = {
      _: Empty, P: Pawn, N: Knight, B: Bishop, R: Rook, Q: Queen, K: King
    } */
    while (Piece.node.firstChild) Piece.node.firstChild.remove()
    for (let i = 0, s = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++ , s++) {
        this.placePieceOn([i, j], position[i][j])
      }
    }
  }

  placePieceOn ([r, c], code) {
    const pieceClass = {
      _: Empty, P: Pawn, N: Knight, B: Bishop, R: Rook, Q: Queen, K: King
    }
    // const pieces = document.getElementById('pieces')
    if (code == '_') {
      this.square[r][c].piece = null
    } else {
      const piece = new pieceClass[code[0]]([r, c], code)
      // const pieceNode = document.createElement('div')
      // pieceNode.style.backgroundImage = `url('./../images/pieces/${code}.png')`
      this.square[r][c].piece = piece
      // this.square[r][c].showPiece()
    }
    // this.piece[r][c] = piece
  }

  navigateTo (sign) {
    const isTakingBack = sign == -1

    const moveCount = this.totalMoves - isTakingBack

    if (moveCount < 0 || moveCount > this.history.length - 1) {
      console.warn('Moves out of Bound!')
      return
    }

    const move = this.history[moveCount]
    // const [r1, c1] = move.from.indices, [r2, c2] = move.to.indices

    if (isTakingBack) {
      chess.soundToPlay = 'takingBack'
      move.from.piece = move.to.piece
      move.to.piece = move.captured
    } else {

      if (move.hasCaptured) {
        move.capture = move.to.piece
        chess.soundToPlay = 'capture'

      } else {
        chess.soundToPlay = 'movement'
      }
      move.to.piece = move.from.piece
      move.from.piece = null
    }

    setTimeout(() => chess.sound.player.play(), 180)

    this.history[this.totalMoves - 1]?.highlight(false)
    this.history[moveCount - isTakingBack]?.highlight()

    this.nextTurn(sign)

    this.history[-1].node.children[this.totalMoves].classList.add('highlight')
    this.history[-1].node.children[this.totalMoves - sign].classList.remove('highlight')
  }

  nextTurn (sign = 1, NUM_OF_PLAYERS = 2) {
    // console.log(this.turn)
    King.onBoardPosition[this.turn].isInCheck = false
    this.turn = (this.turn + sign + NUM_OF_PLAYERS) % NUM_OF_PLAYERS
    this.totalMoves += sign

    updateDatabase(this)
  }

  spliceHistory () {
    if (this.totalMoves < this.history.length) {
      this.history.splice(this.totalMoves)
      const node = this.history[-1].node.children[this.totalMoves]

      while (node != this.history[-1].node.lastElementChild) {
        this.history[-1].node.lastElementChild.remove()
      }
    }// else console.log('hahaha lol')
  }

  getPieceAtIndex (index) {
    return this.getSquareAtIndex(index).piece
  }

  getSquareAtIndex (index) {
    if (index.every(n => n > -1 && n < 8)) {
      return this.square[index[0]][index[1]]
    }
  }
}

export default Board


function checkCheck (turn) {
  const king = King.onBoardPosition[turn]
  king.checkIfInCheck()
  if (king.isInCheck) {
    chess.soundToPlay = 'check'
    // king.isInCheck = false
  }
}

function updateDatabase (board) {
  const data = {
    board_ID: board.ID,
    totalMovesCount: board.totalMoves,
    turn: board.turn,
    position: board.position
  }

  const request = new XMLHttpRequest()
  request.open('POST', "./database")
  request.setRequestHeader("Content-Type", "application/json")
  /* request.onload = function (ev) {
    // const data = JSON.parse(request.responseText)
    // console.log(ev, data)
    console.log(ev, 'hogya')
  } */
  request.send(JSON.stringify(data))
}