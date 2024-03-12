let sqr, game, def, piece, isKing,
	 chessBoard = $('#board'), PGN = $('#movelist');

const ROW = 12, COL = 10,
		sound = {
			move: new Audio('../sound/move.wav'),
			check: new Audio('../sound/check.wav'),
			castle: new Audio('../sound/castle.wav'),
			capture: new Audio('../sound/capture.wav'),
			takeBack: new Audio('../sound/takeBack.wav'),
			illegal: new Audio('../sound/illegalMove.wav')
		},
		MAGIC_ARR = {
			P: [COL - 1, COL + 1, COL, COL * 2],
			R: [-COL, -1, 1, COL],
			B: [-1 - COL, 1 - COL, COL - 1, COL + 1],
			get N() {
				const arr = [COL - 2, COL + 2, COL * 2 - 1, COL * 2 + 1];
				return [...arr, ...arr.map(n => -n)];
			},
			get Q() { return [...this.B, ...this.R]; },
			get K() { return this.Q; }
		};

$(document).ready( () => {
	chessBoard.html( `<tr>${'<td></td>'.repeat(COL)}</tr>`.repeat(ROW) );
	sqr = $('#board td');
	sqr.not('.invalid').click(clicked);

	for ( let i = 0; i < ROW * COL; i++ ) {
		if ( [0,1,10,11].includes(i / COL | 0) || [0,9].includes(i % COL) ) {
			sqr.eq(i).addClass('invalid'); // sqr.eq(i).text(i);
			/*if ( i > 19 && i < 91 && i % 10 == 0 )
				sqr.eq(i).addClass('_123');
			else if ( i > 100 && i < 109 )
				sqr.eq(i).addClass('_abc');*/
		}
	}

	( () => {		// On chosing Side and Opponent
		const avatar = $('.select-avatar'), faces = [0, 1, 2, 3, 12, 13, 18, 1230, 1387, 1388, 1390];

		//		Toggle between bot and opponent
		$('#play-with').change( () => {
			if ( +$('#play-with').val() ) {
				avatar.eq(1).html('&#129302;'); // botAvatar
				avatar.eq(1).next().val('ImBot');
				avatar.eq(1).prop('disabled', true);
			}
			else {
				avatar.eq(1).click();
				avatar.eq(1).next().val('');
				avatar.eq(1).prop('disabled', false);
			}
		});

		avatar.click( function () {		//	Setting Avatar
			$(this).html(`&#${128102 + faces[+$(this).val()]};&#127995;`);
			$(this).val( (+$(this).val() + 1) % faces.length );
		} );
		avatar.eq(0).val( Math.random() * faces.length | 0 );
		avatar.eq(1).val( Math.random() * faces.length | 0 );

		avatar.click();
	})();

	( () => {		// On start-panel range inputs
		const range = $('input[type=range]'), steps = [1,3,5,10,15,20,30,45,60];
		$('#to-set-time').click( () => {
			range.toggleClass('run-track run-thumb');
			range.next().toggle();
		} );

		range.on('input', function () {
			const $this = $(this),
					val = ( this.id == 'bonus-time' ? $this.val() + ' sec' :
							 ( $('.timer').data('timeLeft', steps[$this.val()] * 60),
							  steps[$this.val()] + ' min' ) );
			$this.next().text(val);
		}).trigger('input');
	})();

	( () => {		// On taking jumps
		let longPress;
		$("#buttons *[name='takeJump']").mousedown( function () {
			takeJump( +$(this).val() );
			longPress = setInterval( () => takeJump( +$(this).val() ), 250 );
		}).mouseup( () => clearInterval(longPress) );
		let key;
		$("body").keydown( function (e) {
			//			console.log(e.which, e);
			switch (e.which) {
				case 37: key = -1; break;
				case 39: key = 1; break;
				case 38: compMove();
				default: return;
			}
			//			setTimeout( () => takeJump( key ), 100 );
			longPress = setInterval( () => takeJump( key ), 250 );
			return false;
		}).keyup( function (e) {
			switch (e.which) {
				case 37: key = -1; break;
				case 39: key = 1; break;
				default: return;
			}
			takeJump( key );
			clearInterval(longPress);
			return false;
		});
	})();

	// Adding Click Events on Various Buttons
	$('#start-game #start-btn').click( () => {
		$('#start-game, #transparent-panel').hide(300);
		$('#btn-menu *').click( () => $('#btn-menu').toggle() );

		for ( let i = 0, avt = $('.select-avatar'); i < 2; i++ ) {
			if ( avt.eq(i ^ 1).next().val() )
				$('.player-name').eq(i).text( avt.eq(i ^ 1).next().val() );
			$('.player-avatar').eq(i).text( avt.eq(i ^ 1).text() );
		}
		if ( +$('#i-play').val() ) flipBoard();

		setPiecePosition();
		countDown();
	});
	newGame();
} );

function setPiecePosition() {
	let piecePosition = [14,16,15,13,12,15,16,14],
		 getRandomPosition = () => {
			 let position = new Array(8);
			 for (let i = 0, rand, k = -1, vacant = [0,1,2,3,4,5,6,7]; i < 8; i++) {
				 rand = Math.random();

				 if ( i < 2 ) {
					 rand = (rand * 4 | 0) * 2;
					 ( i ? rand += rand < k : k = rand );
				 }
				 else if ( i == 2 ) rand = k = rand * (vacant.length - 2) + 1 | 0;
				 else if ( i < 5 ) rand = ( i == 3 ? rand * k-- : rand * (vacant.length - k) + k ) | 0;
				 else rand = rand * vacant.length | 0;

				 position[vacant[rand]] = [15,15,12,14,14,13,16,16][i];		// [3,3,0,2,2,1,4,4][i];
				 vacant.splice(rand, 1);		//	console.log(rand, vacant);
			 }
			 return position;
		 };

	/*switch ( $('#game-type').val() ) {
		case '960':
			break;
		case :
			break;
		case :
			break;
		case :
			break;
	}*/

	if ( $('#game-type').val() == '960' ) {
		piecePosition = getRandomPosition();
	}

	for (let i = 0, a, iOf0 = piecePosition.indexOf(12) + 1; i < 2; i++) {
		piece.pos[i].unshift( piece.pos[i].splice(
			piece.pos[i].indexOf(iOf0 + COL * (i * 7 + 2)), 1)[0] );

		a = 0;
		piecePosition.forEach( (n, j) => {
			sqr.eq(j + COL * (i * 7 + 2) + 1).html(`&#98${!i * 6 + n};`);
			sqr.eq(j + COL * (i * 5 + 3) + 1).html(`&#98${!i * 6 + 17};`);

			if ( n == 14 ) game.canCastle[i][a++ * 2] = i * 70 + j + 21;
		});
	}
}

function newGame() {
	sqr.not('.invalid').add('.captured').empty();
	sqr.not('.invalid').removeClass();
	PGN.html('<span></span>');

	$('.timer').removeClass('turn').text('0:00');

	try {
		clearInterval(game.switchTime);
	}	catch (e) {}

	$('#start-game, #promotion-dialog, #game-over').hide(100);
	$('#start-game, #transparent-panel').show(300);

	// __INITIALIZATION__
	def = { isBoardFlipped: false };
	piece = {
		ch: '', select: false, 
		trail: [0, 0], info: [[], []], path: [],
		pos: [[25, 21, 22, 23, 24, 26, 27, 28, 31, 32, 33, 34, 35, 36, 37, 38],
				[95, 81, 82, 83, 84, 85, 86, 87, 88, 91, 92, 93, 94, 96, 97, 98]]
	};
	game = {
		moves: 0, turn: true,		// true for White turn
		last: [false, -1], history: [piece.info],
		switchTime: undefined,
		captured: [['', '', '', '', ''], ['', '', '', '', '']],
		canCastle: [[1, true, 8], [1, true, 8]], // [R,K,R]
		alphCode: P => 'PNBRQK'['♙♘♗♖♕♔♟♞♝♜♛♚'.indexOf( sqr.eq(P).text() ) % 6]
	};
	isKing = { pinned: false, inCheck: false };
}

function clicked() {
	let thisSqr = sqr.index( this );
	if ( piece.select ) {								// Second Click
		if ( piece.path.includes(thisSqr) ) processOn( piece.select, thisSqr );
		else if ( !piece.pos[+game.turn].includes(thisSqr) ) sound.illegal.play();
		else if ( piece.select != thisSqr ) setTimeout( () => sqr.eq(thisSqr).click(), 10 );

		piece.select = false;
		sqr.removeClass('path capture castle');
	}
	else if ( piece.pos[+game.turn].includes(thisSqr) ) {		// First Click
		showTrail( thisSqr );
		piece.select = thisSqr;
		piece.path = getPath( thisSqr );
		//	Visualizing path for the selected piece to move
		piece.path.forEach( n => sqr.eq(n).addClass(sqr.eq(n).text() ? 'capture' : 'path') );
	}
}

function processOn( c1, c2 ) {
	game.moves++;
	piece.info = [ [c1, c2], [sqr.eq(c1).text(), sqr.eq(c2).text()] ];

	// If Playing En-Passant?
	if ( piece.ch == 'P' && sqr.eq(c2 + (game.turn * 2 - 1) * COL).hasClass('capture') ) {
		piece.info[1][1] = '♙♟'[+game.turn];
		piece.info.push(true);
	}

	updateHistory();
	movePiece( piece.info );
	showTrail( c2, 1 );
	countDown();

	if ( +$('#play-with').val() && +$('#i-play').val() == game.turn ) compMove();
}

function updateHistory() {
	let sym = {
		cap: '', cas: '', pie: '',
		loc: String.fromCharCode( piece.info[0][1] % 10 + 96 ) + ( 11 - piece.info[0][1] / 10 | 0 )
	};

	// Updating the Move List
	// Removing appending spans of current move, if present
	PGN.children().eq(game.moves - 1).nextAll().remove();
	PGN.append('<span></span> ');

	// Removing eligibility to CASTLE
	/*switch ( piece.ch ) {
		case 'K': castling.king[+game.turn] = false; break;
		case 'R': let s;
			switch ( piece.info[0][0] ) {
				case 21: case 91: s = 0; break;
				case 28: case 98: s = 1;
			}
			if (!isNaN(s)) castling.rook[s][+game.turn] = false;
	}*/

	if ( sqr.eq(piece.info[0][1]).hasClass('castle') )
		sym.cas = ( piece.info[0][1] % COL == 7 ? 'O-O' : 'O-O-O' );
	else if ( piece.info[1][1] )
		sym.cap = `${ piece.ch == 'P' ? String.fromCharCode( piece.info[0][0] % COL + 96 ) : '' }x`;

	if ( piece.ch != 'P' ) sym.pie = piece.ch;
	//	When the pawn is about to reach to its respective last rank
	else if ( ~~( piece.info[0][0] / COL ) == !game.turn * 5 + 3 ) {
		promotePawn( piece.info[0][1] );
		sym.loc += '=';
	}

	const lastSpan = PGN.children().last();
	lastSpan.text( !sym.cas ? sym.pie + sym.cap + sym.loc : sym.cas );
	if( game.turn ) lastSpan.prepend( `${game.moves / 2 + 1 | 0}. ` );

	game.history.splice( game.moves );
	game.history.push( piece.info );
	//	console.log(JSON.stringify(game.history));
}

function movePiece( info, flag = 0 ) {
	const current = PGN.children(), toTakeBack = flag == -1,
			swap = ( from, to, enPass = false, cap = '' ) => {
				if ( from == to ) return;
				sqr.eq(to).text( sqr.eq(from).text() );
				sqr.eq(from).text(cap);

				piece.pos[bl ^ enPass][ piece.pos[bl ^ enPass].indexOf(from) ] = to;
			};
	let bl = game.turn ^ toTakeBack, toPlay = sound.move;

	current.eq( game.moves ).addClass('highlight');		// this 
	current.eq( game.moves + 1 - !toTakeBack * 2 ).removeClass('highlight');
	if ( game.moves > 2 ) PGN.scrollLeft( current[game.moves - 2].offsetLeft );

	if ( current.eq(game.moves + 1 - !toTakeBack).text().substr(-1) == 'O' ) {
		let pvt = info[0][+!toTakeBack],
			 para = [ game.canCastle[bl][(pvt % COL - 3) / 2], 0, pvt - (pvt % COL - 5) / 2 ];

		if ( toTakeBack ) para.reverse();
		else toPlay = sound.castle;

		swap( para[0], para[1] );
		setTimeout( () => swap( para[1], para[2] ), 90 );
		game.canCastle[bl][1] = !game.canCastle[bl][1];
	}
	else if ( info[1][1] ) {
		if ( info[2] )		// If En-Passant?
			( !toTakeBack ? swap( info[0][1] + COL * (bl * 2 - 1), info[0][1], true ) : 
			 setTimeout( () => swap( info[0][0], info[0][0] + COL * (bl * 2 - 1), true ), 1) );

		const i = '♙♘♗♖♕♟♞♝♜♛'.indexOf(info[1][1]) % 5;
		if	( toTakeBack ) {
			game.captured[bl][i] = game.captured[bl][i].slice(1);
			piece.pos[bl ^ 1].push( info[0][0] );
		}
		else {
			game.captured[bl][i] += info[1][1];
			piece.pos[+!bl].splice( piece.pos[+!bl].indexOf( info[0][1] ), 1 );
			toPlay = sound.capture;
		}
		$('.captured').eq(bl).html( game.captured[bl].join('&emsp;') );
	}

	swap( ...info[0], false, ( toTakeBack ? info[1][1] : '' ) );
	game.turn = !game.turn;
	if ( !flag ) isKing.inCheck = checkCheck();

	if ( toTakeBack ) toPlay = sound.takeBack;
	else if ( current.eq(game.moves).text().slice(-1) == '+' )
		toPlay = sound.check;

	toPlay.play();
}

function takeJump( sign ) {
	if ( sign != game.last[1] ) game.last[0] = !game.last[0];
	game.moves += sign;
	let move = game.moves - +game.last[0];

	if ( move < 0 || move > game.history.length - 2 ) {
		game.moves -= sign;
		console.warn('Moves Exceeded!');
		return;
	}
	if ( piece.select ) {
		sqr.eq(piece.trail[0]).click();
		sqr.eq(game.history[game.moves + 1][0][0]).add( sqr.eq(piece.trail[0]) ).toggleClass('trail');
	}

	piece.info = game.history[move + 1];
	piece.trail = game.history[game.moves][0].slice().reverse();
	piece.info[0].reverse();

	movePiece(piece.info, sign);
	game.last[1] = sign;

	sqr.eq(game.history[move][0][0]).add( sqr.eq(game.history[move][0][1]) ).toggleClass('trail');
	sqr.eq(piece.info[0][0]).add( sqr.eq(piece.info[0][1]) ).toggleClass('trail');
}

function checkCheck() {
	for ( const A of 'NBR' ) for ( const V of MAGIC_ARR[A] ) {
		isKing.pinned = false;
		for ( let i = 1, n, checker, isCheck = true, pathOfChecker = []; i < 9; i++ ) {
			n = piece.pos[+game.turn][0] + ( A == 'N' ? 1 : i ) * V;
			if ( sqr.eq(n).hasClass('invalid') ) break;

			checker = sqr.eq(n).text();
			if ( !checker ) {
				if ( A != 'N' ) pathOfChecker.push(n);	// Empty Sqr
			}
			else {
				if ( piece.pos[+!game.turn].includes(n) ) { // Enemy
					if ( A == 'B' && '♝♗♛♕'.includes(checker) ||
						 A == 'R' && '♜♖♛♕'.includes(checker) ||
						 A == 'B' && i == 1 && '♟♙'.includes(checker) ||
						 A == 'N' && '♞♘'.includes(checker) ) {
						if ( isCheck ) PGN.children().last().append('+');
						pathOfChecker.push(n);
						return pathOfChecker;
					}
				}
				else if ( isCheck ) {	// Own Piece
					isCheck = false;
					isKing.pinned = n;
					continue;
				}
				break;
			}
		}
	}
	return false;
}

function getPath( k ) {
	let avoidCheck = [], path = findPath( k );

	piece.ch = game.alphCode( k );
	if ( piece.ch == 'K' ) {
		//	Checking Castling Eligibilities
		for ( const LoR of [-1, 1] ) {
			if ( !game.canCastle[+game.turn][1] || !isKing.pinned && isKing.inCheck ) break;
			const castleTo = game.turn * 70 + 25 + LoR * 2;
			if ( !game.canCastle[+game.turn][LoR + 1] || 'NBQ'.includes(game.alphCode(castleTo - LoR)) )
				continue;	// if Rook has moved already

			let hasRook = ( k % COL == 2 && LoR == -1 );
			for ( let i = k + hasRook * 2; true; i += LoR ) {
				if ( sqr.eq(i).text() && i != k ) {
					if ( hasRook || game.alphCode(i) != 'R' ) break;
					else hasRook = true;
				}
				if ( i == castleTo && ( hasRook || 'PR'.includes(game.alphCode(i + LoR)) ) ) {
					sqr.eq(i).addClass('castle');
					path.push(i);
					break;
				}
				if ( Math.abs(k-i) > 10 ) {
					console.warn('Infinite Loop! Breaking.....');
					break;
				}
			}
		}

		//	Restricting the king, to make paths on Checks!
		piece.pos[+!game.turn].forEach( n => avoidCheck = avoidCheck.concat( findPath(n, true) ) );
		avoidCheck = new Set( avoidCheck );	//Array.from(new Set(notPath));
		path = path.filter( n => !avoidCheck.has(n) );
	}
	//	Handling Checking and Pinning of Pieces
	else if ( isKing.inCheck && ( isKing.pinned == k || !isKing.pinned ) )
		path = path.filter( x => isKing.inCheck.includes(x) );

	return path;
}

function findPath( k, forKing = false ) {
	let path = [], canMove;
	const alphCode = game.alphCode( k );

	switch ( alphCode ) {
		case 'P':
			canMove = 1 - (game.turn ^ forKing) * 2; // 1 if both XNOR true else -1
			path = MAGIC_ARR.P.map( n => k + canMove * n );

			for ( let i = 0; i < 2 && !forKing; i++ )
				if ( !piece.pos[+!game.turn].includes(path[i]) )
					path[i] = false;

			if ( sqr.eq(path[2]).text() || forKing )
				path[2] = false;
			// First Double Move Check
			if ( ~~(k / COL) != ( canMove > 0 ? 3 : 8 ) || !path[2] || sqr.eq(path[3]).text() )
				path[3] = false;

			// Checking for En-Passant
			if ( ~~(k / COL) * 2 == ROW + canMove - 1 &&		// is on 5th rank
				 (k - 1 == piece.trail[1] || k + 1 == piece.trail[1]) &&		// is last move on adjacent sqr
				 game.alphCode(game.history[game.moves][1][0]) == 'P' ) {	// is last move was a pawn
				sqr.eq(piece.trail[1]).addClass('capture');
				path.push(piece.trail[1] + COL * canMove);
			}

			return path.filter( Number );

		case 'N': case 'K':
			return MAGIC_ARR[alphCode].map( n => k + n )
				.filter( n => !sqr.eq(n).hasClass('invalid') && !piece.pos[+game.turn].includes(n) );

		default: // case 'B' :	case 'R' :	case 'Q' :
			canMove = Array( MAGIC_ARR[alphCode].length ).fill(true);

			for ( let i = 1; canMove.some( b => b ); i++ ) {
				MAGIC_ARR[alphCode].map(n => k + i * n).forEach((n, j) => {
					if ( canMove[j] ) {
						if ( sqr.eq(n).hasClass('invalid') || sqr.eq(n).text() ) {
							canMove[j] = forKing && n == piece.pos[+game.turn][0];
							if ( piece.pos[+!game.turn].includes(n) ) path.push(n);
						}
						else path.push(n);
					}
				});
			}
			return path;
	}
}

function compMove() {
	setTimeout( () => {
		let possibleMoves = piece.pos[+game.turn].filter( n => getPath( n ).length );
		let toMove = possibleMoves[ possibleMoves.length * Math.random() | 0 ];
		let c1Path = getPath( toMove );
		let moveTo = c1Path[ c1Path.length * Math.random() | 0 ];

		showTrail( toMove );
		processOn( toMove, moveTo );
	}, 600 );
}

function countDown() {
	if ( !$('#to-set-time').is(':checked') ) return;

	const clock = $('.timer'), bit = game.turn ^ def.isBoardFlipped,
			updateClock = $this => $this.text(`${$this.data('timeLeft') / 60 | 0}:${($this.data('timeLeft') % 60).toString().padStart(2, '0')}`);

	if ( game.moves ) {		//To add the bonus time and update the clock
		clock.toggleClass('turn');
		clock.eq(+!bit).data().timeLeft += +$('#bonus-time').val();
		updateClock( clock.eq(+!bit) );
	}
	else {
		clock.text(`${clock.eq(0).data('timeLeft') / 60}:00`);
		clock.eq(+!def.isBoardFlipped).addClass('turn');
	}

	clearInterval( game.switchTime );
	game.switchTime = setInterval( () => {
		let thisClock = --clock.eq(bit).data().timeLeft;
		if ( thisClock < 11 ) {		// If only 10 secs are left
			clock.eq(bit).css('background', thisClock % 2 ? '#fff' : '#f44');
			if ( !thisClock ) {		// If Time-Up
				clearInterval( game.switchTime );
				gameOver( 'by Time-Up' );
			}
		}
		updateClock( clock.eq(bit) );
	}, 1000 );
}

function gameOver( reason ) {
	$('#game-over').toggle();
	$('#game-over p').text(`${game.turn ? 'Black' : 'White'} has Won the Game ` + reason);
	sqr.off('click');
}

function promotePawn( k ) {
	function toggleAdvanceDialog( z_ind, disp ) {
		$('#board').css( 'z-index', z_ind );
		$('#promotion-dialog').css( 'display', disp );
	} toggleAdvanceDialog( '-1', 'flex' );

	let promoteTo = $('#promotion-dialog span'), p, t = +!game.turn;
	for (let i = 0; i < 4; i++) {
		promoteTo.eq(i).html(`&#98${i + t * 6 + 13};`);
		promoteTo.eq(i).on('click', () => detect(i));
	}
	function detect( i ) {
		sqr.eq(k).text(promoteTo.eq(i).text());
		//clearInterval(wait);
		toggleAdvanceDialog( 'auto', 'none' );
	}
}

function flipBoard() {
	def.isBoardFlipped = !def.isBoardFlipped;
	let angle = +def.isBoardFlipped * 180, board = $('#boardContainer');
	//	$('._123, ._abc').toggleClass('cord');
	chessBoard.css('transform', `rotate(${-angle}deg)`);
	$('tr td:not(.invalid)').css('transform', `rotate(${angle}deg)`);

	board.prev().detach().insertAfter( board.next() );
	board.next().detach().insertBefore( board );
}

function copyPGN() {
	var dummy = $("<textarea/>");
	dummy.text(PGN.text());
	$('body').append(dummy);
	dummy.select();
	document.execCommand('copy');
	dummy.remove();
}

function showTrail( f, z = 0 ) {
	sqr.eq(piece.trail[z]).removeClass('trail');
	sqr.eq(f).addClass('trail');
	piece.trail[z] = f;
}