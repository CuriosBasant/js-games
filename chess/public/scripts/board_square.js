// import Chess from './chess.js'
import Move from './movement.js'

export default class Square {
  static cssSize = 0
  static ofBoard = null

  constructor(index, node, piece = null) {
    this.indices = index
    this.node = node
    this._piece = piece
  }

  set piece (piece) {
    const [r, c] = this.indices
    if (piece == null) {
      // this._piece.node.remove()
      Square.ofBoard.position[r][c] = '_'
    } else {
      piece.index = this.indices
      piece.node.style.transform = `translate(${c * 100}%, ${r * 100}%)`
      Square.ofBoard.position[r][c] = piece.symbol + (piece.side + 1)
    }
    this._piece = piece
  }

  get piece () {
    return this._piece
  }

  showPiece () {
    const pieceNode = this.node.firstElementChild
    pieceNode.className = `player-${this.piece.side + 1}`
    pieceNode.textContent = this.piece.symbol
  }

  moveTo (square) {
    Square.ofBoard.spliceHistory()
    const span = Square.ofBoard.history[-1].cloneFirst
    span.textContent = this.piece.symbol + String.fromCharCode(square.indices[1] + 97) + Math.abs(square.indices[0] - 8)
    Square.ofBoard.history[-1].node.appendChild(span)
    // const self = new Square(this.indices.slice(), this.node, clone(this._piece))
    if (this.piece.name == 'Pawn') {
      this.piece.canDouble = false
    } else if (this.piece.name == 'King' && square.node.classList.contains('castle')) {
      const sign = Math.sign(square.indices[1] - this.indices[1])
      const rook = Square.ofBoard.getSquareAtIndex([this.indices[0], square.indices[1] + sign])
      rook.moveTo(Square.ofBoard.getSquareAtIndex([this.indices[0], square.indices[1] - sign]))
    }
    Square.ofBoard.history.push(new Move(this, square))
    Square.ofBoard.navigateTo(1)
  }
}
/*
function deepClone (obj) {
  if (obj === null || typeof obj !== "object")
    return obj
  var props = Object.getOwnPropertyDescriptors(obj)
  for (var prop in props) {
    props[prop].value = deepClone(props[prop].value)
  }
  return Object.create(
    Object.getPrototypeOf(obj),
    props
  )
}

function clone (obj) {
  return Object.create(
    Object.getPrototypeOf(obj),
    Object.getOwnPropertyDescriptors(obj)
  )
}
 */