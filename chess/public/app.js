import Chess from './scripts/chess.js'
import Board from './scripts/chess_board.js'
import Player from './scripts/player.js'

const NUM_OF_PLAYERS = 2

const chess = new Chess()
/* const board = new Board(chess.variants.transcendental, chess)

board.create() */
let board

// window.chess = chess
// window.board = board

window.addEventListener('load', () => {
  const values = Object.fromEntries(
    window.location.search.slice(1).split('&').map(str => str.replace('+', ' ').split('='))
  )
  httpRequestGET(values)
  // console.log(values)

  // const users = [...document.getElementsByClassName('user-name')]
  // users[0].textContent = values.player2_name
  // users[1].textContent = values.player1_name

  // board.players.push(new Player(values.player1_name, 0))
  // board.players.push(new Player(values.player2_name, 1))
})

document.getElementById('buttons').addEventListener('click', ev => {
  const button = ev.target

  switch (button.name) {
    case 'navigator':
      /* if (selectedPiece != null) {
        selectPiece(selectedPiece)
        selectedPiece = null
      } */
      board.navigateTo(+button.value)
      break
    case 'reset-board': board.reset()
      break
    case 'custom-setup':
      chess.toggleCustomSetup()
      break
    default:
      break
  }
})
// document.getElementById('buttons').firstElementChild.click()

// window.addEventListener('resize', onWindowResize)

let done = false
function onWindowResize () {
  // const s = document.querySelector('#board')
  //board.squareSize = (s.offsetWidth / 8) * 0.98
  // s.style.fontSize = s.offsetWidth / 10 + 'px'
  const gc = document.getElementById('game-container')
  const rect = gc.getBoundingClientRect()

  if (rect.bottom > window.innerHeight) {
    gc.style.maxWidth = `${(window.innerHeight - rect.top) * 1.66}px`
  } else {

  }
  console.log('resized')
  /* if (!done && document.body.offsetHeight > window.innerHeight * 0.98) {
    console.log(rect)
    // gc.style.width = '100%'
    gc.style.maxWidth = gc.offsetWidth + 'px'
    // done = true
  } else {

  } */
}

function setIt () {
  const history = document.getElementById('board-history')
  history.style.maxWidth = history.offsetWidth + 'px'
  history.style.maxHeight = history.offsetHeight + 'px'
  // console.log(history.scrollHeight)
}
// setIt()

function httpRequestGET (values) {
  const getDatabase = new Promise((resolve, reject) => {
    const request = new XMLHttpRequest()
    request.open('GET', './database/0')
    request.send()
    request.onload = () => {
      resolve(JSON.parse(request.responseText))
    }
  }).then(data => {
    // console.log({ data[0] })
    board = new Board(data, chess)
    board.create()
    window.chess = chess
    window.board = board
    board.players.push(new Player(values.player1_name, 0))
    board.players.push(new Player(values.player2_name, 1))
    board.initialPosition = chess.variants[values.variant]
    onWindowResize()
  })
}


Board.node.addEventListener('click', ev => {
  const rect = ev.currentTarget.getBoundingClientRect()
  const [r, c] = [ev.clientY - rect.top, ev.clientX - rect.left].map(lyr => lyr * 8 / rect.width | 0)
  console.log(r, c)
  /* let obj = {
    screen: [ev.screenX, ev.screenY],
    client: [ev.clientX, ev.clientY],
    page: [ev.pageX, ev.pageY],
    offset: [ev.offsetX, ev.offsetY],
    xy: [ev.x, ev.y]

  } */
  square.refer(board.square[r][c])
})

const square = {
  // current: null,
  // selected: null,
  refer: null,
  valid: [],
  select (current) {
    // console.log(current, board)
    if (current.piece == null) {
      console.warn('Please, select a piece first!')
      return
    }

    if (current.piece.side == board.turn) {
      board.selectedSquare = current

      this.valid = current.piece.getValidMoves()
      this.toggleHomes(true)

      this.refer = this.confirm
    } else {

    }
  },
  confirm (destiny) {
    this.toggleHomes(false)

    if (this.valid.includes(destiny)) {
      board.selectedSquare.moveTo(destiny)
    } else {
      console.warn('Not a valid square')
    }
    this.refer = this.select
  },
  toggleHomes (flag) {
    board.selectedSquare.node.classList.toggle('highlight', flag)
    for (const { node, piece } of this.valid) {
      node.classList.toggle(piece == null ? 'home' : 'capture', flag)
    }
  }
}
square.refer = square.select
/* console.log(square)

function squareOnClick ([r, c]) {
  const square = board.square[r][c]
} */



/* class A {
  constructor(val) {
    this.value = val
  }
  set (val) {
    this.value = val
  }
  sayHello () {
    console.log('Hello, from Parent')
  }
}
let a = new A(5)
class B extends A {
  sayHello () {
    super.sayHello()
    console.log('Hello, from Child', this.constructor.name)

  }
}

let C = new B()
C.sayHello() */