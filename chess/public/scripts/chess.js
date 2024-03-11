
export default class Chess {
  constructor() {
    this.gameContainer = document.getElementById('game-container')
    this.sound = {
      player: new Audio(),
      movement: './sound/movement.wav',
      check: './sound/check.wav',
      castle: './sound/castle.wav',
      capture: './sound/capture.wav',
      takingBack: './sound/taking_back.wav'
    }
    // this.soundToPlay = ''
    this.customSetup = {
      isActive: false,
      selectedPieceCode: 'P1',
      lastSelected: null,
      pieceSelect: piece => {
        selectPiece.classList.remove('selected')
        piece.classList.add('selected')
      },
      setUI: function () {
        const container = document.getElementById('pieces')
        if (!container.children.length) {
          let span
          for (let i = 0; i < 2; i++) {
            for (const P of 'PNBRQK'.split('')) {
              span = document.createElement('span')
              span.textContent = P
              span.classList.add('player-' + (i + 1))

              span.onclick = ev => {
                let v = [...container.children].indexOf(ev.currentTarget) / 6 | 0
                console.log(v)
                this.lastSelected.classList.remove('selected')
                ev.target.classList.add('selected')

                this.selectedPieceCode = ev.target.textContent + (v + 1)
                this.lastSelected = ev.target
              }

              container.appendChild(span)
            }

          }
          this.lastSelected = span
        }
      }
    }

    this.variants = {
      get standard () {
        return [
          ['R2', 'N2', 'B2', 'Q2', 'K2', 'B2', 'N2', 'R2'],
          ['P2', 'P2', 'P2', 'P2', 'P2', 'P2', 'P2', 'P2'],
          ['_', '_', '_', '_', '_', '_', '_', '_'],
          ['_', '_', '_', '_', '_', '_', '_', '_'],
          ['_', '_', '_', '_', '_', '_', '_', '_'],
          ['_', '_', '_', '_', '_', '_', '_', '_'],
          ['P1', 'P1', 'P1', 'P1', 'P1', 'P1', 'P1', 'P1'],
          ['R1', 'N1', 'B1', 'Q1', 'K1', 'B1', 'N1', 'R1']
        ]
      },
      get chess960 () {
        const pos = this.standard, _960 = this._960Setup()
        pos[0] = _960.map(p => p + 2)
        pos[7] = _960.map(p => p + 1)
        return pos
      },
      get transcendental () {
        const pos = this.chess960
        pos[0] = this._960Setup().map(p => p + 2)
        return pos
      },
      get upsideDown () {
        return this.standard.reverse()
      },
      _960Setup: () => {
        let vacantSquares = Array.from({ length: 8 }).map((_, i) => i)
        const position = []

        // Bishops
        for (let i = 0; i < 2; i++) {
          const rand = i + (Math.random() * 4 | 0) * 2
          position[rand] = 'B'
        }
        vacantSquares = vacantSquares.filter(n => !position[n])

        // King
        const king = (Math.random() * 4 | 0) + 1
        position[vacantSquares[king]] = 'K'

        // left Rook
        let rand = Math.random() * king | 0
        position[vacantSquares[rand]] = 'R'

        // right Rook
        rand = (Math.random() * (5 - king) | 0) + king + 1
        position[vacantSquares[rand]] = 'R'
        vacantSquares = vacantSquares.filter(n => !position[n])

        // Knights
        for (let i = 0; i < 2; i++) {
          rand = Math.random() * vacantSquares.length | 0
          position[vacantSquares[rand]] = 'N'
          vacantSquares.splice(rand, 1)
        }

        // Queen 
        position[vacantSquares[0]] = 'Q'

        return position
      },
      get horde () {
        /* const pos = this.standard
        pos[7] = pos[5] = pos[4] = pos[6] */
        return [
          ['R2', 'N2', 'B2', 'Q2', 'K2', 'B2', 'N2', 'R2'],
          ['P2', 'P2', 'P2', 'P2', 'P2', 'P2', 'P2', 'P2'],
          ['_', '_', '_', '_', '_', '_', '_', '_'],
          ['_', '_', '_', '_', '_', '_', '_', '_'],
          ['P1', 'P1', 'P1', 'P1', 'P1', 'P1', 'P1', 'P1'],
          ['P1', 'P1', 'P1', 'P1', 'P1', 'P1', 'P1', 'P1'],
          ['P1', 'P1', 'P1', 'P1', 'P1', 'P1', 'P1', 'P1'],
          ['P1', 'P1', 'P1', 'P1', 'P1', 'P1', 'P1', 'P1']
        ]
      }
    }
  }

  set soundToPlay (sound) {
    this.sound.player.src = this.sound[sound]
    this.sound.player.load()
  }

  toggleCustomSetup () {
    [...this.gameContainer.children].forEach(div => {
      div.classList.toggle('hide')
    })
    this.customSetup.isActive = !this.customSetup.isActive

    if (this.customSetup.isActive) {
      this.customSetup.setUI()
    } else {
      return
    }
  }
}

