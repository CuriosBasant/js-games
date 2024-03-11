// import { Empty } from './chess_pieces.js'

export default class Move {
  static homes = null
  static hasNavigated = false
  constructor(from, to) {
    this.from = from
    this.to = to
    this._captured = to.piece
  }

  set capture (piece) {
    piece?.node.classList.add('hide')
    this._captured = piece
  }

  get captured () {
    this._captured?.node.classList.remove('hide')
    return this._captured
  }

  get hasCaptured () {
    return this._captured != null
  }

  static showHomes (bool = true) {
    for (const [className, nodes] of Object.entries(Move.homes)) {
      for (const node of nodes) {
        node.parentNode.classList.toggle(className, bool)
      }
    }
  }

  highlight (flag = true) {
    this.from.node.classList.toggle('highlight', flag)
    this.to.node.classList.toggle('highlight', flag)
  }

  resolve () {
    this.from = this.from.indices
    this.to = this.to.indices
  }
}


function clone (obj) {
  return Object.create(
    Object.getPrototypeOf(obj),
    Object.getOwnPropertyDescriptors(obj)
  )
}