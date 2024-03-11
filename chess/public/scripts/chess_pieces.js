import Move from './movement.js'

const magicArray = {
  Pawn: [],
  Knight: [[-1, -2], [-2, -1], [-2, 1], [-1, 2], [1, 2], [2, 1], [2, -1], [1, -2]],
  Bishop: [[-1, -1], [-1, 1], [1, 1], [1, -1]],
  Rook: [[-1, 0], [0, 1], [1, 0], [0, -1]],
  get Queen () { return this.Bishop.concat(this.Rook) },
  get King () { return this.Queen }
}

class Piece {
  static onBoard = null
  static node = document.getElementById('pieces')

  constructor(index, name, symbol, player) {
    // this.position = index
    this.name = name
    this.symbol = symbol
    this.side = player[1] - 1
    this.index = index
    this.node = document.createElement('div')

    this.node.style.backgroundImage = `url('./../images/pieces/${player}.png')`
    Piece.node.appendChild(this.node)
    // this.node = Piece.onBoard.square[index[0]][index[1]].node.firstElementChild
    // this.putPiece()
    // this.isPinned = false
  }

  getValidMoves () {
    let homes = this.movableSquares()

    /*const myKing = King.onBoardPosition[this.side]

      if (myKing.isInCheck == 'Double Check' && this.name != 'King') {
       return []
     }
 
     let pinnedPath = null
     for (const path of myKing.checkerPath) {
       if (path.includes(this)) {
         pinnedPath = path
         break
       }
     }
     
     if (pinnedPath == null) {
       if (myKing.isInCheck) {
 
       } else {
 
       }
     } else {
       if (myKing.isInCheck) {
 
       } else {
 
       }
     }

    if (this.isPinned || myKing.isInCheck) {
      homes = homes.filter(piece => myKing.checkerPath.includes(piece))
    }
    console.log(myKing.checkerPath) */

    return homes
  }
  putPiece () {
    this.node.className = `player-${this.side + 1}`
    this.node.textContent = this.symbol
    return this
  }

  get indices () {
    return JSON.parse(this.node.parentElement.dataset.index)
  }

  moveTo (toSquare) { // by default aurg is piece object
    // Piece.onBoard.spliceHistory()

    // let temp = aurg

    /* if (typeof temp == 'number') {
      temp = [temp / 8 | 0, temp % 8]
    } else if (typeof temp == 'string') {
      temp = [Math.abs(temp[1] - 8), temp[0].charCodeAt() - 97]
    }
    if (Array.isArray(temp)) {
      if (temp.some(n => n < 0 || n > 7)) {
        console.error('That Square doesn\'t Exist!')
        return
      } else {
        temp = Piece.onBoard.getPieceAtIndex(temp)
      }
    } */

    // const [r2, c2] = toSquare.indices
    // const mT = Piece.onBoard.getPieceAtIndex(aurg)
    // const history = document.getElementById('board-history')

    // Updating History
    /* const code = Piece.onBoard.history[-1].to.node
    code.textContent = this.symbol +
      String.fromCharCode(c2 + 97) +
      Math.abs(r2 - 8)
    Piece.onBoard.history[-1].node.appendChild(code) */

    Piece.onBoard.history.push(new Move(this, toSquare))
    Piece.onBoard.navigateTo(1)
  }

  invalid () {
    if (this.node.classList.toggle('invalid')) {
      setTimeout(() => { this.invalid() }, 200)
    }
  }
}

class Empty extends Piece {
  constructor(position, player) {
    super(position, null, '_', -1)
  }
}

class Pawn extends Piece {
  constructor(position, player) {
    super(position, 'Pawn', 'P', player)
    this.canDouble = true
  }

  moveTo (aurg) {
    this.canDouble = false
    super.moveTo(aurg)
  }

  movableSquares () {
    // This function only returns the capturable squares
    const path = [], dir = this.side * 2 - 1 + this.index[0]

    for (const c of [-1, 1]) {
      const square = Piece.onBoard.getSquareAtIndex([dir, this.index[1] + c])
      if (square != undefined) {
        path.push(square)
      }
    }
    return path
  }

  getValidMoves () {
    const path = this.movableSquares()
      .filter(sqr => sqr.piece != null && sqr.piece.side != Piece.onBoard.turn),
      dir = this.side * 2 - 1, index = this.index.slice()

    const checkPath = () => {
      index[0] += dir
      const square = Piece.onBoard.getSquareAtIndex(index)
      if (square.piece == null) {
        path.push(square)
        return true
      }
    }
    if (checkPath() && this.canDouble) checkPath()

    return path
  }
}

class Knight extends Piece {
  constructor(position, player) {
    super(position, 'Knight', 'N', player)
  }

  movableSquares () {
    const homes = getPieceHomes(this)

    return homes
  }
}

class Bishop extends Piece {
  constructor(position, player) {
    super(position, 'Bishop', 'B', player)
  }

  movableSquares () {
    const homes = getPieceHomes2D(this)

    return homes
  }
}

class Rook extends Piece {
  constructor(position, player) {
    super(position, 'Rook', 'R', player)
    this.couldCastle = true
  }

  movableSquares () {
    const homes = getPieceHomes2D(this)

    return homes
  }
}

class Queen extends Piece {
  constructor(position, player) {
    super(position, 'Queen', 'Q', player)
  }

  movableSquares () {
    const homes = getPieceHomes2D(this)

    return homes
  }
}

class King extends Piece {
  static onBoardPosition = []
  constructor(position, player) {
    super(position, 'King', 'K', player)
    this.isInCheck = false
    this.canCastle = true
    this.checkerPath = []
    King.onBoardPosition[this.side] = this
  }

  movableSquares () {  // without any restriction
    return getPieceHomes(this)
  }

  getValidMoves () {
    let homes = this.movableSquares()

    homes = homes.concat(checkIfCanCastle())
    console.log(homes)

    // Avoid going in Check
    let allInvalidSquares = []
    for (const { piece } of [].concat(...Piece.onBoard.square)) {
      if (piece != null && piece.side != this.side) {
        allInvalidSquares = allInvalidSquares.concat(piece.movableSquares())
      }
    }
    // console.log(allInvalidSquares)
    allInvalidSquares = [...new Set(allInvalidSquares)]
    homes = homes.filter(sqr => !allInvalidSquares.includes(sqr))

    return homes
    // super.calculateValidMoves()
  }


  checkIfInCheck () {
    return
    // console.log(this)
    // debugger
    this.checkerPath = []
    const kingPosition = this.indices
    for (const dir of magicArray['Knight']) {
      const index = kingPosition.map((n, i) => n + dir[i])
      const piece = Piece.onBoard.getPieceAtIndex(index)
      if (piece == undefined) {
        continue
      } else if (this.side != piece.side && piece.name == 'Knight') {
        console.log('Hurray! I\'m in Check!')
      }
    }

    for (const pieceName of ['Bishop', 'Rook']) {
      for (const dir of magicArray[pieceName]) {
        let index = kingPosition.map((n, i) => n + dir[i]), tempPin = false, tempCheckPath = []

        while (true) {
          const piece = Piece.onBoard.getPieceAtIndex(index)
          if (piece == undefined) break

          tempCheckPath.push(piece)

          if (this.side == piece.side) {
            if (tempPin) {
              break
            } else {
              tempPin = piece
            }
          } else if (piece.name == pieceName || piece.name == 'Queen') {
            if (tempPin) {
              tempPin.isPinned = true
              // console.log(tempPin)
            } else {
              if (this.isInCheck) {
                this.isInCheck = 'Double Check'
              } else {
                this.isInCheck = true
              }
              console.log('Hurray! I\'m in Check!')

            }
            this.checkerPath.push(tempCheckPath)
            break
          }
          index = index.map((n, i) => n + dir[i])
        }
      }
    }
  }
}

export default Piece
export { Empty, Pawn, Knight, Bishop, Rook, Queen, King }

function getPieceHomes (currentPiece) {
  const path = [],
    direction = magicArray[currentPiece.name],
    from = currentPiece.index //Piece.onBoard.selectedSquare.indices

  for (const dir of direction) {
    const index = from.map((n, i) => n + dir[i])
    const square = Piece.onBoard.getSquareAtIndex(index)

    /* if (!(square == undefined || square.piece.side == Piece.onBoard.turn)) {
      path.push(square)
    } */
    if (square != undefined && (square.piece == null || square.piece.side != Piece.onBoard.turn)) {
      path.push(square)
    }
  }
  return path
}

function getPieceHomes2D (currentPiece) {
  const path = [],
    direction = magicArray[currentPiece.name],
    from = currentPiece.index //Piece.onBoard.selectedSquare.indices

  for (const dir of direction) {
    let index = from.map((n, i) => n + dir[i])
    while (true) {
      const square = Piece.onBoard.getSquareAtIndex(index)
      if (square == undefined) {
        break
      }

      if (square.piece == null) {
        path.push(square)
      } else {
        if (square.piece.side != Piece.onBoard.turn) {
          path.push(square)
        }
        break
      }

      index = index.map((n, i) => n + dir[i])
    }
  }
  return path
}

function checkIfCanCastle () {
  const index = Piece.onBoard.selectedSquare.indices, castleSquares = []
  for (const side of [-1, 1]) {
    const castlePoint = (2 - side) * 2

    const castleConfirmed = () => {
      console.log('Yeah, you can castle here.')

      const sqr = Piece.onBoard.getSquareAtIndex([rank, castlePoint])
      castleSquares.push(sqr)
      sqr.node.classList.add('castle')
    }

    let gotRook = castlePoint - side  // assume default to edges
    const rank = index[0]
    if (index[1] == gotRook) {
      const rookPlace = Piece.onBoard.getSquareAtIndex([rank, castlePoint + side]).piece
      const cp = Piece.onBoard.getSquareAtIndex([rank, castlePoint + side * 2]).piece

      if (cp == null && rookPlace == cp) {
        castleConfirmed()
      }

    } else for (let col = castlePoint; true; col += side) {
      const piece = Piece.onBoard.getSquareAtIndex([rank, col]).piece

      if (piece == null) {
        continue
      } else if (piece.name == 'King') {
        if (col == castlePoint) {
          const rookPlace = Piece.onBoard.getSquareAtIndex([rank, col + side]).piece,
            donno = Piece.onBoard.getSquareAtIndex([rank, col - side]).piece
          if (rookPlace == null && (donno == null || donno.name == 'Rook')) {
            castleConfirmed()
          }
        } else {
          castleConfirmed()
        }
      } else if (piece.name == 'Rook') {
        gotRook = col
        continue
      }

      break

      if (piece.name == 'Rook') {
        gotRook = col
      } else if (piece == this) {
        console.log('you can castle', gotRook)
        break
      } else if (piece.name != null) {
        console.log('breaking')
        break
      }

    }
  }
  return castleSquares
}