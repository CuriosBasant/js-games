let clg = function() { console.log(...arguments); };
let square = []; square[-1] = [];
square[-1][-1] = document.createElement('fake');

for ( let move of document.getElementsByName('navigate-move') )
	move.addEventListener( 'click', navigateMove );

let Board = {
	position: ['rnbqkbnr','pppppppp','--------','--------','--------','--------','PPPPPPPP', 'RNBQKBNR'],
	setPosition: function () {
		let position = new Array(8);
		for (let i = 0, rand, k = -1, vacant = [0,1,2,3,4,5,6,7]; i < 8; i++) {
			rand = Math.random();

			if ( i < 2 ) {
				rand = (rand * 4 | 0) * 2;
				( i ? rand += rand < k : k = rand );
			}
			else if ( i == 2 ) {
				rand = k = rand * (vacant.length - 2) + 1 | 0;
				Game.kingPos[0].c = Game.kingPos[1].c = vacant[rand];
			}
			else if ( i < 5 ) rand = ( i == 3 ? rand * k-- : rand * (vacant.length - k) + k ) | 0;
			else rand = rand * vacant.length | 0;

			position[vacant[rand]] = 'bbkrrqnn'[i];
			vacant.splice(rand, 1);		//console.log(rand, vacant);
		}
		this.position[0] = position.join('');
		this.position[7] = this.position[0].toUpperCase();
	},
	updatePosition: function ( p = '-' ) {
		this.position[Move.to.r] = this.position[Move.to.r].slice(0, Move.to.c) + Move.from.p + this.position[Move.to.r].slice(Move.to.c + 1);
		this.position[Move.from.r] = this.position[Move.from.r].slice(0, Move.from.c) + p + this.position[Move.from.r].slice(Move.from.c + 1);

		square[Move.to.r][Move.to.c].innerHTML = Piece.conv( Move.from.p );
		square[Move.from.r][Move.from.c].innerHTML = Piece.conv( p );
	}
},
Move = {
	count: 0, side: true,
	from: { r: -1, c: -1, p: '' },
	to: { r: -1, c: -1, p: '' },
	index: thisSqr => ({
		r: thisSqr.parentElement.rowIndex,
		c: thisSqr.cellIndex,
		get p() { return Board.position[this.r][this.c]; }
	}),
	navigate: function ( mv ) {
		[ Game.history.from[mv].p, Game.history.to[mv].p ] = [ Game.history.to[mv].p, Game.history.from[mv].p ];
		[ Game.history.from[mv], Game.history.to[mv] ] = [ Game.history.to[mv], Game.history.from[mv] ];
		this.from = { ...Game.history.from[mv] };
		this.to = { ...Game.history.to[mv] };
//		[ this.from.p, this.to.p ] = [ this.to.p, this.from.p ];
	},
	highlight: function ( mv, s = 1) {
		let domList = mv;
//			[...Game.history.from.slice(mv, mv + 2), ...Game.history.to.slice(mv, mv + 2)] );
		
		if ( typeof mv == 'number' ) {
			domList = [Move.to, Game.history.to[mv], Move.from, Game.history.from[mv]];
			this.from = { ...Game.history.from[mv + s] };
			this.to = { ...Game.history.to[mv + s] };
		}
		domList.forEach( dom => square[dom.r][dom.c].classList.toggle('highlight') );
	}
},
Game = {
	highlight: [{r: 1, c: 1}, {r: 1, c: 1}],
	last: [false, -1],
	kingPos: [{r: 0, c: 4}, {r: 7, c: 4}],
	history: { from: [], to: [], size: 0 },
	saveToHistory: function () {
		this.history.from.push( { ...Move.from } );
		this.history.to.push( { ...Move.to } );
		this.history.size++;
	}
},
Piece = {
	isSelected: false, path: [],
	conv: p => ( p == '-' ? '' : `&#98${'KQRBNP'.indexOf(p.toUpperCase()) + 12 + (p == p.toLowerCase()) * 6};` ),
	removePath: function () {
		this.path.forEach( tup => {
			square[tup[0]][tup[1]].classList.remove(tup[2]);
		} );
	},
	isValid: P => P != '-' && P == P[`to${Move.side ? 'Upp' : 'Low'}erCase`]()

};

// Board.setPosition();
Game.saveToHistory();

window.onload = () => {
	let board = document.getElementById('board');

	for (let i = 0, row; i < 8; i++) {
		row = board.insertRow(-1);
		for (let j = 0, sqr; j < 8; j++) {
			sqr = row.insertCell(-1);
			sqr.innerHTML =  Piece.conv( Board.position[i][j] );
			sqr.setAttribute( 'draggable', 'true' );
			sqr.addEventListener( 'click', clicked );
			sqr.addEventListener( 'dragstart', onDragStart );
			sqr.addEventListener( 'dragenter', preventDefault );
			sqr.addEventListener( 'dragover', preventDefault );
			sqr.addEventListener( 'dragleave', onDragHover );
			sqr.addEventListener( 'drop', onPieceDrop );
		}

		square.push( row.childNodes );
	}
};

function clicked ( _this ) {
	const index = Move.index ( _this.tagName ? _this : this );
	
	if ( Piece.isValid( index.p ) ) {
		Piece.removePath();
		if ( Piece.isSelected && index.r == Move.from.r && index.c == Move.from.c ) {
			Move.from = { ...Game.history.from[Game.history.size - 1] };
			Move.to = { ...Game.history.to[Game.history.size - 1] };
			Piece.path = [];
			Piece.isSelected = false;
		}
		else {
			Piece.isSelected = true;
			calculatePath( { ...index } );
			
			setTimeout( () => Move.from = { ...index }, 1 );
		}
		Move.highlight( [index, Move.from] );
	}
	else if ( Piece.isSelected ) {
		Piece.isSelected = false;
		Move.highlight ( [index, Move.to] );

		Move.to = { ...index };
		makeMove();
	}
}

function makeMove( trimHistory = true ) {
	Move.count++;
	if ( trimHistory && Move.count < Game.history.size ) {
		Game.history.from.splice( Move.count );
		Game.history.to.splice( Move.count );
		Game.history.size = Move.count;
	}
	Piece.removePath();

	Board.updatePosition();
	Game.saveToHistory();

	if ( Move.from.p.toUpperCase() == 'K' ) {
		Game.kingPos[+Move.side] = {...Move.to };
	}
	Move.side = !Move.side;
}

function navigateMove (x) {
	if ( Piece.isSelected ) square[Move.from.r][Move.from.c].click();

	const navTo = typeof x == 'number' ? x : +this.value;
	if ( navTo != Game.last[1] ) Game.last[0] = !Game.last[0];
	
	const move = Move.count + navTo - +Game.last[0];
	if ( move < 0 || move > Game.history.size - 2 ) {
		console.warn('Move-Count Out of Range!');
		return;
	}
	Move.count += navTo;
	Game.last[1] = navTo;
	Move.navigate( move + 1 );

	Board.updatePosition( navTo == -1 ? Move.to.p : '-' );
	Move.side = !Move.side;
	Move.highlight( move, navTo == 1 );
}

function calculatePath ( index ) {
	Piece.path = findPath( index );
	
	if ( index.p == 'K' ) {
		let allEnemyPath = [], obj = {r: 0, c: 0, p: ''}, tempPath = [];
		
		Move.side = !Move.side;
		Board.position.forEach( (rank, r) => {
			for (let c = 0; c < 8; c++) {
				if ( Piece.isValid(rank[c]) ) {
					tempPath = findPath( { r: r, c: c, p: rank[c] }, true );
					allEnemyPath.push(...tempPath.map( a => a[0] * 8 + a[1] ));
				}
			}
		});
		Move.side = !Move.side;

		allEnemyPath = new Set( allEnemyPath );
		Piece.path = Piece.path.filter( a => !allEnemyPath.has(a[0] * 8 + a[1]) );
		
		let castleRank = Board.position[index.r].toUpperCase();
		for ( const LoR of [-1, 1] ) {
			let castleTo = LoR * 2 + 4, gotRook = index.c == -LoR;
			
			if ( 'NBQ'.includes(castleRank[castleTo - LoR]) ) continue;
			
			for ( let k = index.c + gotRook * 2; true; k += LoR ) {
				if ( castleRank[k] == '-' || k == index.c ) {}
				else if ( gotRook || castleRank[k] != 'R' ) break;
				else gotRook = true;
				
				if ( k == castleTo && (gotRook || '-R'.includes(castleRank[k + LoR])) ) {
					Piece.path.push([index.r, k, 'castle']);
					break;
				}
			}
			
			
			/*if ( Game.kingPos[+Move.side].c == -LoR ) {
				gotRook = 0;
				if ( Board.position[Game.kingPos[+Move.side].r][castle].toUpperCase() == '-' ) {
					
				}
			}
			else for ( let k = Game.kingPos[+Move.side].c; 0 < k && k < 7; k += LoR ) {
				let p = Board.position[Game.kingPos[+Move.side].r][k].toUpperCase();
				if ( 'NBQ'.includes(p) ) break;
				
				if ( p == 'R' ) gotRook = k;
				if ( k + isContinuing == castle ) {
					clg('castle');
					if ( !gotRook ) {
						if ( LoR == 1 ) gotRook = castle + 1;
						else if ( 'NBQ'.includes(Board.position[Game.kingPos[+Move.side].r][castle - 1].toUpperCase()) ) break;
						else gotRook = castle - 2
					}
					
					if ( !gotRook ) {
						if ( LoR == 1 ) gotRook = castle + 1;
						else if ( isContinuing ) gotRook = castle - 2;
						else {
							isContinuing = true;
							continue;
						}
					}
					Piece.path.push([Game.kingPos[+Move.side].r, k, 'castle'])
					break;
				}
				
			}*/
			
		}
		
	}
	else if (false) {
		let checkerPath = [], pinnedPieces = [], isCheck = false;
		for ( const ch of 'NBR' ) {
			let direction = {
				N: [[-2,1], [1,2], [2,1], [1,-2], [2,-1], [-1,-2], [-2,-1], [-1,2]],
				B: [[-1,-1], [-1,1], [1,1], [1,-1]],
				R: [[-1,0], [0,1], [1,0], [0,-1]]
			} [ch], toBreak = false;
			
			for ( const dir of direction ) {
				let home = [Game.kingPos[+Move.side].r, Game.kingPos[+Move.side].c],
					isPinned = false;
//				pinnedPieces = [];
				if ( !isCheck ) checkerPath = [];


				while ( true ) {
					home = [home[0] + dir[0], home[1] + dir[1]];
					if ( home.some( h => h < 0 || h > 7 ) ) break;
					
					let p = Board.position[home[0]][home[1]];
					if ( p == '-' ) {
						if ( ch != 'N' && !isCheck )
							checkerPath.push( home[0] * 8 + home[1] );
						continue;
					}
					else if ( p == ( Move.side ? p.toLowerCase() : p.toUpperCase() ) ) {
						if ( ch == p.toUpperCase() || ch != 'N' && p.toUpperCase() == 'Q' ) {
//							clg(`${pinnedPieces ? 'Pin' : 'Check'} Detected`);
							/*if ( isCheck ) {
								checkerPath = [];
								Piece.path = [];
							}
							else {
								if ( !isPinned ) isCheck = true;
								checkerPath.push( home[0] * 8 + home[1] );
								
							}*/
							
							if ( isPinned ) {
								pinnedPieces.push(isPinned);
							}
							else {
								if ( isCheck ) {
									checkerPath = [];
									Piece.path = [];
									toBreak = true;
								}
								else {
									isCheck = true;
									checkerPath.push( home[0] * 8 + home[1] );
									
								}
								
							}
							
							
//							toBreak = true;
						}
					}	// If Self Piece
					else if ( isPinned ) {
//						pinnedPieces = [];
//						checkerPath = [];
						
					}
					else {
						isPinned = home[0] * 8 + home[1];
//						pinnedPieces.push(home[0] * 8 + home[1]);
						continue;
					}
					
					break;
				}
				if ( toBreak ) break;
			}
			if ( toBreak ) break;
		}
//		clg(Piece.path, checkerPath, 'hello');
		clg(index, pinnedPieces, checkerPath);
		
		/*if ( checkerPath.length && (!pinnedPieces.length || pinnedPieces.includes(index.r * 8 + index.c) ) ) {
			Piece.path = Piece.path.filter( path => checkerPath.includes( path[0] * 8 + path[1] ) );
		}*/
		
		/*if ( isCheck && !pinnedPieces.includes(index.r * 8 + index.c) || pinnedPieces.includes(index.r * 8 + index.c) ) {
			Piece.path = Piece.path.filter( path => checkerPath.includes(path[0] * 8 + path[1]) );
		}*/
		if ( pinnedPieces.includes(index.r * 8 + index.c) ) {
			Piece.path = ( isCheck ? [] : Piece.path.filter( path => checkerPath.includes(path[0] * 8 + path[1]) ));
		}
		
	}
	// TODO: HACK: 
	// NOTE: FIXME:
	Piece.path.forEach( path => square[path[0]][path[1]].classList.add(path[2]) );
}

function findPath ( index, forKing = false ) {
	index.p = index.p.toUpperCase();

	let path = [], isKingFound = false,
		home = {
			r: 0, c: 0,
			set add ( val ) {
				this.r = val[0];
				this.c = val[1];
			},
			get p () { return Board.position[this.r][this.c]; },
			get vals () { return [this.r, this.c]; }
		}, 
		direction = {
		P: [1 - Move.side * 2, 0],
		N: [[-2,1], [1,2], [2,1], [1,-2], [2,-1], [-1,-2], [-2,-1], [-1,2]],
		B: [[-1,-1], [-1,1], [1,1], [1,-1]],
		R: [[-1,0], [0,1], [1,0], [0,-1]],
		get Q() { return [...this.B, ...this.R]; },
		get K() { return this.Q; }
	} [index.p];

	if ( index.p == 'P' ) {
		home.add = [index.r + direction[0], index.c];
		while ( !forKing && home.p == '-' ) {
			path.push([...home.vals, 'path']);
			
			if ( home.r - direction[0] != Move.side * 5 + 1 ) break;
			home.r += direction[0];
		}
		for ( const cap of [-1, 1] ) {
			home.add = [index.r + direction[0], index.c + cap];
			if ( home.c < 0 || home.c > 7 ) continue;
			let p = home.p;
			if ( forKing || p == ( Move.side ? p.toLowerCase() : p.toUpperCase() ) && p != '-' ) {
				path.push([...home.vals, 'capture']);
			}
		}
	}
	else for ( const dir of direction ) {
		home.add = [index.r, index.c];
		while ( true ) {
			home.add = [home.r + dir[0], home.c + dir[1]];
			if ( home.vals.some( h => h < 0 || h > 7 ) ) break;
			let p = home.p;
			
			if ( p == '-' ) {
				path.push([...home.vals, 'path']);
				if ( !'NK'.includes(index.p) ) continue;
			}
			else if ( p == ( Move.side ? p.toLowerCase() : p.toUpperCase() ) ) {
				if ( forKing && p.toUpperCase() == 'K' ) {
					path.push([home.r + dir[0], home.c + dir[1]]);
					isKingFound = true;
				}
				else path.push([...home.vals, 'capture']);
			}
			
			break;
			
			/*if ( p == ( Move.side ? p.toLowerCase() : p.toUpperCase() ) ) {
				if ( forKing && p.toUpperCase() == 'K' ) {
					path.push([home.r + dir[0], home.c + dir[1]]);
					isKingFound = true;
				}
				else path.push([...home.vals, p == '-' ? 'path' : 'capture']);
				if ( p != '-' || index.p == 'N' || index.p == 'K' ) break;
			}
			else { 

				break;
			}*/
		}
		if ( isKingFound ) break;
	}

	return path;
}

function randomMove () {
	if ( Piece.isSelected ) square[Move.from.r][Move.from.c].click();

	let legalMoves = [], obj = {r: 0, c: 0, p: ''};
	for ( const rank of Board.position ) {
		obj.c = 0;
		for ( const ch of rank ) {
			obj.p = ch;
			if ( Piece.isValid(ch) && findPath( {...obj} ).length > 0 ) {
				legalMoves.push({...obj});
			}
			obj.c++;
		}
		obj.r++;
	}
	
	Move.from = legalMoves[Math.random() * legalMoves.length | 0];
	calculatePath( {...Move.from }, false );
	
	obj = Piece.path[Math.random() * Piece.path.length | 0];
	Move.to = { r: obj[0], c: obj[1], p: Board.position[obj[0]][obj[1]] };
	
//	Game.saveToHistory();
//	navigateMove(1);
	makeMove();
	Move.highlight ( Move.count - 1 );
}








/*
Hello Pratik Bhaiya, kya aap Rajiv Dixit Ji ke vichaaro ko sunte hai? Agar haa, to unke baare mei aapne apni kisi video mei kabhi jikra kyu nahi kiya?
Maine Rajiv Dixit Ji ki Hamare Rashtra Gaan (Jana Gana Mana) ke upar ek video dekhi hai, jissme ve iss Gaan ka Bhahishkaar kar rahe hai (Aap wo video zaroor dekhe). Mai aapse uss video ke baare mei, aapke vichaar jaan-na chahta hu, kyunki mai uss video ko dekhkar bahot pareshaan hu ki mujhe hamare Raashtra Gaan ka samaan karna chahiye ya nahi? Kyunki ye to hamari gulaami ka prateek hai.
Kripya iss par ek Video zaroor banaye!
Mere hisaab se hamara Rashtra Gaan "Vande Matram" hona chahiye tha.

Dosto aap sab bhi ek baar wo video zaroor dekhe -
"Rajiv Dixit on Jana Gana Mana"

1971,deadline,naqaab,prince,black Friday,30th October,sardar,traffic signal ,yahaan,saaya,budha in a traffic jam,knock out,chittogong,khelein hum jee Jaan se 
*/




function preventDefault( ev ) {
	ev.preventDefault();
}

function onDragStart( ev ) {
	//	preventDefault(ev);
	ev.target.classList.add('sqr-active');
	setTimeout( () => {
		ev.target.classList.remove('sqr-active');
	}, 1 );

	clicked( ev.target );
	/*Piece.setIndex = ev.target;
	let index = Piece.index, sym = Piece.sym;

	if ( sym != ( Game.turn ? sym.toUpperCase() : sym.toLowerCase() ) || sym == '-' ) {
		return false;
	}

	ev.dataTransfer.setData('text', ev.target.textContent);
	showPath( index, sym.toUpperCase() );
	Piece.isSelected = true;

	Object.assign(Game.lastIndex, index);

	ev.target.textContent = '';*/

}

function onDragHover( ev ) {
	//	preventDefault( ev );
	/*if ( ev.target.classList.contains('path') ) {
		ev.target.style.fontSize = '2.5em';

	}*/

	//	ev.target.classList.toggle('on-drag-hover');
}

function onPieceDrop( ev ) {
	preventDefault( ev );

	clicked( ev.target );

	/*Piece.setIndex = ev.target;
	Piece.removePath();
//	square[Game.lastIndex.r][Game.lastIndex.c].textContent = '';
	ev.target.textContent = ev.dataTransfer.getData('text');

	if ( !Piece.isSelected || Piece.index.r == Game.lastIndex.r && Piece.index.c == Game.lastIndex.c) {
		Piece.path = [];
		Piece.isSelected = false;
		return false;
	}

	clg('Piece Dropped');

	Board.updatePosition( Piece.index );

	Piece.isSelected = false;
	Game.turn = !Game.turn;
	
	
	
	1971,deadline,Shree,naqaab,prince,black Friday,30th October,sardar,traffic signal ,paan Singh tomar,yahaan,saaya,budha in a traffic jam,knock out,chittogong,khelein hum jee Jaan se 
	
	
	
	*/
}