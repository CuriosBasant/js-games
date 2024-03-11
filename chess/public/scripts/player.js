export default class Player {
  static counter = 0
  static domElement = [...document.getElementsByClassName('user-name')].reverse()
  constructor(name, side) {
    this.ID = ++Player.counter
    this.username = name
    this.side = side
    this.node = Player.domElement[side]
    this.node.textContent = name

    this.canCastle = true
    this.isInCheck = false
    this.kingReference = null
    this.pieces = {
      active: [],
      captured: []
    }
  }
}