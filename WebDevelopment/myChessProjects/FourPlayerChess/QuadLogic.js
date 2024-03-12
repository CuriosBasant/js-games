// var jQuery = require('./../../JS-Modules/jQuery');jQuery();
$(document).ready( newGame );

let sqr, game, def, piece, king, castling;

const ROW = 18, COL = 16,
	sound = {
		move : new Audio('../sound/move.wav'),
		check : new Audio('../sound/check.wav'),
		castle : new Audio('../sound/castle.wav'),
		capture : new Audio('../sound/capture.wav'),
		illegal : new Audio('../sound/illegalMove.wav')
	},
	MAGIC = {
		R : [-COL, -1, 1, COL],
		B : [-1-COL, 1-COL, COL-1, COL+1],
		get Q() { return [...this.B, ...this.R]; },
		get K() { return this.Q; },
		get P() { return this.Q; },
		get N() {
			const arr = [COL-2, COL+2, COL*2-1, COL*2+1];
			return [...arr, ...arr.map(n => -n)];
		}
	};

function newGame() {
	$('#board').html(`<tr>${'<td></td>'.repeat(COL)}</tr>`.repeat(ROW));
	sqr = $('#board td');
	
	def = { firstClick : 0, select : false, isBoardFlipped : false };
	piece = {
		ch : '', trail : [0, 0], info : [[],[]], path : [],
		pos : [	// R, G, B, B
			[248,228,229,230,231,232,233,234,235,244,245,246,247,249,250,251],
			[129,81,82,97,98,113,114,130,145,146,161,162,177,178,193,194],
			[39,36,37,38,40,41,42,43,52,53,54,55,56,57,58,59],
			[158,93,94,109,110,125,126,141,142,157,173,174,189,190,205,206]
		],
		capElem : $('.captured').empty(),
		captured : [['','','','',''],['','','','',''],['','','','',''],['','','','','']]
	};
	game = {
		moves : 0, turn : 0, last : [false, -1],
		history : [piece.info], timeLeft : [300, 15,,],
		alphCode : P => 'PNBRQK'['♟♞♝♜♛♚'.indexOf($(sqr[P]).text())],
		get opps() {
			let arr = [];
			for (let i = 0; i < 4; i++) {
				if (i != game.turn) arr.push(...piece.pos[i]);
			}
			return arr;
		}
	};
	castling = {
		king : [true, true, true, true],		// R, G, B, B
		rook : [[true, true],[true, true],[true, true],[true, true]]
	};
	
	for(let i = 0, pCode = [20,22,21,19,19,21,22,20]; i < ROW * COL; i++) {
		if ([0,1,ROW-2,ROW-1].includes(i / COL | 0) || [0,COL-1].includes(i % COL) ||
			[2,3,4,13,14,15].includes(i / COL | 0) && [1,2,3,12,13,14].includes(i % COL)) {
			$(sqr[i]).addClass('invalid');//	$(sqr[i]).text(i);
		}
		else {
			switch (i % COL) {
				case 1 :		case COL - 2 :
					$(sqr[i]).html(`&#98${pCode[(i / COL | 0) - 5]};`);
					break;			//	ON VERTICAL
				case 2 :		case COL - 3 :
					$(sqr[i]).html('&#9823;');
			}
			switch (i / COL | 0) {
				case 2 :		case ROW - 3 :
					$(sqr[i]).html(`&#98${pCode[i % COL - 4]};`);
					break;			// ON HORIZONTAL
				case 3 :		case ROW - 4 :
					$(sqr[i]).html('&#9823;');
			}
			$(sqr[i]).prop('id', 
								(i < 60 ? 'blue' : 
								 (i % COL < 3 ? 'green' : 
								  (i % COL > 12 ? 'black' : 'red'))));
		}
	}
	for (let n of [39,129,158,248]) $(sqr[n]).html('&#9818;');
	$(sqr).click(clicked);
	window.setTimeout(() => console.clear(), 3500);
} //newGame();

function clicked() {
	let i = $(sqr).index(this);
	
	if (def.select) {
		let canClick = def.select = false;
		
		if (piece.path.includes(i)) {
			makeMove(def.firstClick, i);
		}
		else if (!piece.pos[+game.turn].includes(i)) 
			sound.illegal.play();
		else if (def.firstClick != i) canClick = true;
		
		piece.path.forEach (n => $(sqr[n]).removeClass('path capture castle'));
		if (canClick) $(sqr[i]).click();
	}
	else if (piece.pos[game.turn].includes(i)) {
		def.firstClick = i;
		def.select = true;
		showTrail(i);
		piece.path = getPath(i);
	//	Visualizing path for the selected piece to move
		piece.path.forEach(n => $(sqr[n]).addClass($(sqr[n]).text() ? 'capture' : 'path'));
	}
}

function makeMove(c1, c2) {
	game.moves++;
	piece.info = [[c1, c2], [$(sqr[c1]).text(), $(sqr[c2]).text()]];
	
	swappy(piece.info);
	showTrail(c2, 1);
}

function swappy(info, flag = 0) {
	let bl = game.turn, toTakeBack = flag == -1;
	
	if (toTakeBack) {
		bl = !bl;
		if (info[1][1]) piece.pos[+!bl].push(info[0][0]);
	}
	else if (info[1][1]) {
		piece.pos[+!bl].splice(piece.pos[+!bl].indexOf(info[0][1]), 1);
		sound.capture.play();
	}
	else sound.move.play();

	let i = piece.pos[bl].indexOf(info[0][0]);
	piece.pos[bl][i] = info[0][1];
	$(sqr[info[0][0]]).text(toTakeBack ? info[1][1] : '');
	$(sqr[info[0][1]]).text(info[1][0]);
	
/*	$(PGN).children().eq(game.moves - 1).addClass('highlight');
	$(PGN).children().eq(game.moves - !toTakeBack * 2).removeClass('highlight');*/
	
	$(sqr[info[0][1]]).prop('id', $(sqr[info[0][0]]).prop('id'));
	window.setTimeout(() => rotateBoard(), 200);
	game.turn = game.moves % 4;
}

function getPath(k) {
	let path = findPath(k), avoidCheck = [];
	piece.ch = game.alphCode(k);

	if (piece.ch == 'K') {
	// Checking Castling Eligibilities
/* 		if (castling.king[game.turn]) {
			let dir = (game.turn % 2 ? col : 1);
			for (let i = 1; ; i++) {
				if ($(sqr[k + dir * i]).text()) {
					if ($(sqr[k + dir * i]).text() == '♜') {
					
					} else break;
				}
				
			}
			[-dir, dir].forEach ((n, i) => {
				
			});
		} */

	//	Restricting the king, to make paths on Checks!
		game.opps.forEach(n => avoidCheck = avoidCheck.concat(findPath(n, true)));
		avoidCheck = new Set(avoidCheck);	//Array.from(new Set(notPath));
		path = path.filter(n => !avoidCheck.has(n));
	}

	return path;
}

function findPath(k, forKing = false) {
	let path = [], canMove;
	const alphCode = game.alphCode(k);
	
	switch (alphCode) {
		case 'P' :
			let turn = game.turn;
			if (forKing) {
				switch ($(sqr[k]).css('color').substr(3)) {
					case '(255, 0, 0)' : turn = 0;	break;
					case '(0, 255, 0)' : turn = 1;	break;
					case '(0, 0, 255)' : turn = 2;	break;
					case 'a(0, 0, 0, 0.8)' : turn = 3;
				}
			}
			let toMove = -(turn % 2 ? 1 : COL) * (+!(turn % 3) * 2 - 1),
				 toCap = (turn % 2 ? COL : 1),
				 isOnHome = [(k / COL | 0) == ROW - 4, k % COL == 2, (k / COL | 0) == 3, k % COL == COL - 3];
			
			for (let c of [k + toMove - toCap, k + toMove + toCap]) {
				if (forKing || game.opps.includes(c)) path.push(c);
			}
			if (!forKing) {
				path.push(k + toMove);
				if (game.opps.includes(path[0]))
					path.pop();
				else if (isOnHome[turn] && !game.opps.includes(path[0] + toMove))
					path.push(path[0] + toMove);
			}
			return path;
			
		case 'N' :	case 'K' :
			return MAGIC[alphCode].map(n => k + n)
				.filter(n => !$(sqr[n]).hasClass('invalid') && !piece.pos[game.turn].includes(n));
			
		default : // case 'B' :	case 'R' :	case 'Q' :
			canMove = Array(MAGIC[alphCode].length).fill(true);
	
			for (let i = 1; canMove.some(b => b); i++) {
				MAGIC[alphCode].map(n => k + i * n).some((n, j) => {
					if (canMove[j]) {
						if ($(sqr[n]).hasClass('invalid')) return canMove[j] = false;		// continue;
						if ($(sqr[n]).text()) {
							canMove[j] = false;
							if (!piece.pos[game.turn].includes(n))
								path.push(n);
						}
						else path.push(n);
					/* 
						if ($(sqr[n]).text())
							canMove[j] = forKing && n == piece.pos[game.turn][0];
						else	path.push(n);

						if (game.opps.includes(n)) path.push(n); */
					}
				});
			}
			return path;
	}
}

function rotateBoard() {
	$('#board').css('transform', `rotate(${-game.turn * 90}deg)`);
	$('#board td').css('transform', `rotate(${game.turn * 90}deg)`);
}

function showTrail(f, z = 0) {
	$(sqr[piece.trail[z]]).removeClass('trail');
	$(sqr[f]).addClass('trail');
	piece.trail[z] = f;
}