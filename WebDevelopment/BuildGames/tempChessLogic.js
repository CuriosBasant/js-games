window.onload = function () {

// White	♙	♖	♘	♗	♕	♔
// Black	♟	♜	♞	♝	♛	♚

var color = '♙♘♗♖♕♔', trail = [0, 0],
    turn = true, selected = false, castle = false;
let canICastle = {
   castleSqr : [],
   castled : [true, true],
   forKing : [true, true],
   queenSide : [true, true],
   kingSide : [true, true],
   now : function () {
      let kPos = (turn ? 60 : 4);
      this.castleSqr = [];
      if (turn) {
         if (this.forKing[0]) {
            if (this.queenSide[0] && box[kPos - 1].textContent == '' && box[kPos - 2].textContent == '' && box[kPos - 3].textContent == '')
                this.castleSqr.push(kPos - 2);
            if (this.kingSide[0] && box[kPos + 1].textContent == '' && box[kPos + 2].textContent == '')
                this.castleSqr.push(kPos + 2);
         }
      }
      else if (this.forKing[1]) {
         if (this.queenSide[1] && box[kPos - 1].textContent == '' && box[kPos - 2].textContent == '' && box[kPos - 3].textContent == '')
             this.castleSqr.push(kPos - 2);
         if (this.kingSide[1] && box[kPos + 1].textContent == '' && box[kPos + 2].textContent == '')
             this.castleSqr.push(kPos + 2);
      }
   }
};

function defaultSetup() {
   let tbl = document.querySelector('#board');

   for (let i = 0, j; i < 8; i++) {
      j = 8;				// i = row, j = col
      tbl.appendChild(document.createElement('tr'));
      while (j-- > 0)
         tbl.querySelectorAll('tr')[i].appendChild(document.createElement('td'));
   }
   box = tbl.querySelectorAll('td');

   for(let i = 0, piece = [14,16,15,13,12,15,16,14]; i < box.length; i++) {
      /* Default Position of all the Pieces */
      if ([0,4,7,1].includes(i)) {
         box[i].innerHTML = '&#98' + (piece[i] + 6);	// rank 8
         box[i + 8].innerHTML = '&#9823';					// rank 7
         box[i + 48].innerHTML = '&#9817';				// rank 2
         box[i + 56].innerHTML = '&#98' + piece[i];	// rank 1
      }
      box[i].className = 'sqr' + i;
      box[i].addEventListener('click', clicked);
   }
}	defaultSetup();

function clicked() {
   let i = parseInt(this.className.substr(3)),
       piece = '', isSameBox = false;
   let bool = color.includes(box[i].textContent) && box[i].textContent != '';
   if (!selected) {
      if (bool) {
         box[i].id = 'move';
         box[trail[0]].id = '';
         selected = trail[0] = i;
         piece = detectPiece(box[i].textContent);
         if (piece == 'pawn') window[piece](i);
         else showPath(piece, i);
      }
   }
   else {
      if (box[i].id != 'move' || box[i].classList.contains('path')) {
         makeMove(selected, i);

      /* If the Pawn reaches to the last Rank */
         if (box[i].textContent == '♙' && i < 8)
            box[i].textContent = '♕';
         if (box[i].textContent == '♟' && i > 55)
            box[i].textContent = '♛';
      }

      for (let a = 0; a < box.length; a++) {
         if (box[a].classList.contains('path'))
            box[a].classList.remove('path');
         if (box[a].id != 'move')
            box[a].id = '';
      }
      if (selected != i) isSameBox = true;
      selected = false;
      if (bool && isSameBox) box[i].click();
   }

   function makeMove(c1, c2) {
      /* Swapping the Piece */
      function swap(a, b) {
         let temp = box[a].textContent;
         box[a].textContent = '';
         box[b].textContent = temp;
      }	swap(c1, c2);

      /* Showing Move Trails */
      box[c2].id = 'move';
      box[trail[1]].id = '';
      trail[1] = c2;

      /* Removing Castling Eligibility */
      if ('♔♚'.includes(box[c1].textContent)) {
         if (turn) canICastle.forKing[0] = false;
         else canICastle.forKing[1] = false;
      }
      else if ('♖♜'.includes(box[c1].textContent)) {
         if (turn) {
            if (c1 == 63) canICastle.kingSide[0] = false;
            else canICastle.queenSide[0] = false;
         }
         else {
            if (c1 == 7) canICastle.kingSide[1] = false;
            else canICastle.queenSide[1] = false;
         }
      }

      /* Now actually Castling if eligible */
      if (canICastle.castleSqr.length !== 0 && (turn ? canICastle.castled[0] : canICastle.castled[1])) {
         //swap(60, castle);
         if (canICastle.castleSqr[0] % 8 == 2)
            swap(canICastle.castleSqr[0] - 2, canICastle.castleSqr[0] + 1);

         else if (canICastle.castleSqr[0] % 8 == 6)
            swap(canICastle.castleSqr[0] + 1, canICastle.castleSqr[0] - 1);
         else
            swap(canICastle.castleSqr[1] + 1, canICastle.castleSqr[1] - 1);

         if (turn) canICastle.castled[0] = false;
         else canICastle.castled[1] = false;
      }

      color = ((turn = !turn) ? '♙♘♗♖♕♔' : '♟♞♝♜♛♚');
   }
}


function detectPiece(piece) {
   switch (piece) {
      case '♘':	case '♞':	return 'knight';
      case '♙':	case '♟':	return 'pawn';
      case '♗':	case '♝':	return 'bishop';
      case '♖':	case '♜':	return 'rook';
      case '♕':	case '♛':	return 'queen';
      case '♔':	case '♚':	return 'king';
   }
}

function pawn(k, isForKing = false) {
   let a = (turn ? -1 : 1), b = k, arrP = [];
   if (!isForKing) {
      if (box[b += a * 8].textContent == '')
         box[b].classList.add('path');
      if (box[b += a * 8].textContent == '' && ((k / 8 | 0) == 1 || (k / 8 | 0) == 6))
         box[b].classList.add('path');
   }
   if (k % 8 == 0 || k % 8 == 7) {
      if (k % 8 == 0) {
         if (turn) {
            if (isForKing) arrP = [k + 9];
            else if (!color.includes(box[k - 7].textContent))
               box[k - 7].id = 'capture';
         }
         else {
            if (isForKing) arrP = [k - 7];
            else if (!color.includes(box[k + 9].textContent))
               box[k + 9].id = 'capture';
         }
      }
      else {
         if (turn) {
            if (isForKing) arrP = [k + 7];
            else if (!color.includes(box[k - 9].textContent))
               box[k - 9].id = 'capture';
         }
         else {
            if (isForKing) arrP = [k - 9];
            else if (!color.includes(box[k + 7].textContent))
               box[k + 7].id = 'capture';
         }
      }
   }	// If Pawns are at Edge
   else {
      if (isForKing) arrP = [k + a * -7, k + a * -9];
      else {
         if (!color.includes(box[k + a * 7].textContent))
            box[k + a * 7].id = 'capture';
         if (!color.includes(box[k + a * 9].textContent))
            box[k + a * 9].id = 'capture';
      }
   }

   if (isForKing) return arrP;
}

function knight(k) {
   let path = [-17, -10, -15, -6, 15, 6, 17, 10];
   switch (k % 8) {
      case 0: path[0] = path[4] = 0;
      case 1: path[1] = path[5] = 0;
         break;
      case 7: path[2] = path[6] = 0;
      case 6: path[3] = path[7] = 0;
   }
   path = path.map(n => n + k);
   path = path.filter(n => n != k && n >= 0 && n < 64);
   return path;
}

function bishop(k) {
   let path = [[],[],[],[]], bool = Array(4).fill(true);
   for (let i = 1, NW, NE, SE, SW; i < 8; i++) {
      NW = k - i * 9;
      NE = k - i * 7;
      SE = k + i * 7;
      SW = k + i * 9;

      if (bool[0] && NW % 8 != 7 && NW >= 0) {
         path[0].push(NW);
         if (box[NW].textContent != '') bool[0] = false;
      } else  bool[0] = false;

      if (bool[1] && NE % 8 != 0 && NE >= 0) {
         path[1].push(NE);
         if (box[NE].textContent != '') bool[1] = false;
      } else  bool[1] = false;

      if (bool[2] && SE % 8 != 7 && SE < 64) {
         path[2].push(SE);
         if (box[SE].textContent != '') bool[2] = false;
      } else  bool[2] = false;

      if (bool[3] && SW % 8 != 0 && SW < 64) {
         path[3].push(SW);
         if (box[SW].textContent != '') bool[3] = false;
      } else  bool[3] = false;
   }

   return path;
}

function rook(k) {
   let path = [[],[],[],[]], bool = Array(4).fill(true);
   for (let i = 1, N, E, S, W; i < 8; i++) {
      N = k - i * 8;
      E = k + i;
      W = k - i;
      S = k + i * 8;

      if (bool[0] && N % 8 - k % 8 == 0 && N >= 0 && N < 64) {
         path[0].push(N);
         if (box[N].textContent != '') bool[0] = false;
      } else bool[0] = false;

      if (bool[1] && E % 8 != 0) {
         path[1].push(E);
         if (box[E].textContent == '') bool[1] = false;
      } else bool[1] = false;

      if (bool[2] && S % 8 - k % 8 == 0 && S >= 0 && S < 64) {
         path[2].push(S);
         if (box[S].textContent != '') bool[2] = false;
      } else bool[2] = false;

      if (bool[3] && W % 8 != 7 && W >= 0) {
         path[3].push(W);
         if (box[W].textContent != '') bool[3] = false;
      } else bool[3] = false;
   }
   return path;
}

function queen(k) { return rook(k).concat(bishop(k)); }

function king(k) {
   let path = [-9, -8, -7, 1, 9, 8, 7, -1];
   if (k < 8) 			path[0] = path[1] = path[2] = 0;	// TOP
   if (k % 8 == 0)	path[0] = path[7] = path[6] = 0;	// LEFT
   if (k % 8 == 7)	path[2] = path[3] = path[4] = 0;	// RIGHT
   if (k > 55)			path[6] = path[5] = path[4] = 0;	// BOTTOM
   path = path.map(n => n + k);
   path = path.filter(n => n != k && n >= 0 && n < 64);
   return path;
}

function showPath(piece, k) {
   let path = window[piece](k);

   if (piece == 'king') {
      path = path.filter(n => !avoidCheck().includes(n) && (!color.includes(box[n].textContent) || box[n].textContent == ''));

      canICastle.now();
      canICastle.castleSqr.forEach (n => {
         path.push(n);
         box[n].id = "castle";

      });

   }
   document.getElementById('test').innerHTML = path;
   path.forEach (a => {
      if (Array.isArray(a)) {
         for (let i = 0; i < a.length; i++) {
            if (box[a[i]].textContent != '') {
               if (!color.includes(box[a[i]].textContent))
                  box[a[i]].id = 'capture';
               break;
            }
            else box[a[i]].classList.add('path');
         }
      }
      else {
         if (box[a].textContent == '')
            box[a].classList.add('path');
         else if (!color.includes(box[a].textContent))
            box[a].id = 'capture';
      }
   });

   function avoidCheck() {
      let oppArr = [], piece = '', arr1D = [], arr2D=[];
      for (let i = 0; i < box.length; i++) {
         if (!color.includes(box[i].textContent)) {
            piece = detectPiece(box[i].textContent);
            oppArr = oppArr.concat((piece != 'pawn' ? window[piece](i) : window[piece](i, true)));
         }
      }

      oppArr.forEach (num => {
         if (Array.isArray(num))
            arr2D = arr2D.concat(num);
         else arr1D = arr1D.concat(num);
      });

      oppArr = Array.from(new Set(arr1D.concat(arr2D)));
      return oppArr;
   }
}
}
