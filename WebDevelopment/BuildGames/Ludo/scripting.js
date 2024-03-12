let square = [], player = [],
	 dieOccur = 0, turn = 0,//||Math.random() * 4 | 0,
	 rollBtn = document.createElement('button'),
	 path = [[6,1],[6,2],[6,3],[6,4],[6,5],
				[5,6],[4,6],[3,6],[2,6],[1,6],[0,6],			[0,7],[0,8],[1,8],[2,8],[3,8],[4,8],[5,8],
				[6,9],[6,10],[6,11],[6,12],[6,13],[6,14],		[7,14],[8,14],[8,13],[8,12],[8,11],[8,10],[8,9],
				[9,8],[10,8],[11,8],[12,8],[13,8],[14,8],		[14,7],[14,6],[13,6],[12,6],[11,6],[10,6],[9,6],
				[8,5],[8,4],[8,3],[8,2],[8,1],[8,0],			[7,0],[7,1],[7,2],[7,3],[7,4],[7,5],[7,6]
				
			  ];

function Token( self ) {
//	this.id = id;
//	this.position = sqInd;
	this.self = self;
	this.move = 0;
	this.isSafe = true;
	this.canMove = false;
}

window.onload = () => {
	let board = document.getElementById('ludo-board');

	for (let i = 0, row; i < 15; i++) {
		row = board.insertRow(-1);
		for (let j = 0, cell; j < 15; j++) {
			cell = row.insertCell(-1);
		}
		square.push( row.childNodes );
	}
	rollBtn.id = 'roll-dice-btn';
	rollBtn.onclick = rollDice;
	square[7][7].appendChild(rollBtn);
	
	for ( let side = 0; side < 4; side++ ) {
		player.push([]);

		for ( let i = 0, ij; i < 6; i++ ) {
			for ( let j = 0; j < 6; j++ ) {
				ij = getRespectiveSquare([i, j], side);
				
				if ( i == 0 || i == 5 || j == 0 || j == 5 ) {
					square[ij[0]][ij[1]].classList.add(`color-side-${side + 1}`, 'yard-boundary');
				}
				else if ( (i == 2 || i == 3) && (j == 2 || j == 3) ) {
					square[ij[0]][ij[1]].classList.add('token-yard');
					
					let token = document.createElement('span');
					token.classList.add('token', `color-side-${side + 1}`);
//					token.textContent = ij;
					token.dataset.tokenId = i * 2 + j - 6;
					token.onclick = moveToken;
					token.addEventListener('webkitTransitionEnd', onTokenStep );
					square[ij[0]][ij[1]].appendChild(token);
					
					player[side].push(new Token( token ));
				}
			}
			ij = getRespectiveSquare((i ? [7, i] : [6, 1]), side);
			square[ij[0]][ij[1]].classList.add(`color-side-${side + 1}`);
		}
		
		let safe = getRespectiveSquare([2,6], side);
		square[safe[0]][safe[1]].classList.add('safe-place');
	}
	switchPlayerTurn();
};

function rollDice() {
	if ( dieOccur != 0 ) return;	// Prevent double rolling
	highlightPlayerTurn();	// OFF

	let r, i = 0, _this = this,
		rolling = setInterval(() => {
			r = Math.random() * 6 + 1 | 0;
			_this.style.backgroundPosition = -r * 100.7 + '%';
			if ( ++i > 10 ) {
//				moveToken( r );
				dieOccur = r;
				filterMovableTokens();
				
				clearInterval(rolling);
			}
		}, 100);
//	console.log(r);

	
}

function filterMovableTokens() {
	let tm = 0;
	
	player[turn].forEach( tkn => {
		if ( 0&&tkn.move == 0 ) {		// if token is in its yard
			if ( dieOccur == 6 ) {
//				dieOccur = 1;
				tkn.canMove = true;
			} else {
				tm++;
				tkn.canMove = false;
			}
		} else if ( tkn.move + dieOccur > 57 ) {
			tkn.canMove = false;
		} else tkn.canMove = true;
	});
	
	if ( tm == 4 ) {
		switchPlayerTurn();
		console.log('Player hasn\'t opened yet');
	}
	else highlightMovableTokens();		// ON

}

function onTokenStep() {
	let _token = this.parentElement.removeChild(this);
	_token.style.transform = 'none';
	square[to[0]][to[1]].appendChild(_token);
	console.log('stepping');
}
let to;
function moveToken() {
	let toSwitchTurn = true, token = this;
	
	if ( !token.classList.contains('animate-turn') || !dieOccur ) return;

	highlightMovableTokens( false );	// OFF

	let plyr = player[turn][token.dataset.tokenId];
	let step = 0, //fm = plyr.position,
		mv = setInterval( () => {
			to = getRespectiveSquare(path[plyr.move++]);
			let dT = square[to[0]][to[1]].offsetTop - token.parentElement.offsetTop,
				dL = square[to[0]][to[1]].offsetLeft - token.parentElement.offsetLeft;
			
			token.style.transform = `translate(${dL}px, ${dT}px) scale(1.2)`;
			
			if ( ++step == dieOccur /*|| plyr.move == 1*/ ) {
				switchPlayerTurn();
				plyr.isSafe = [1,9,14,22,27,35,40,48].includes(plyr.move);
				clearInterval( mv );
				console.log('move stopped');

			}
		}, 400);
}

function switchPlayerTurn() {
	if ( dieOccur != 6 ) {
		
		turn = ++turn % 4;
	}
	dieOccur = 0;
	setTimeout( highlightPlayerTurn, 1000 );		// NEXT ONE
}

function highlightMovableTokens( bl = true) {
	//	let tokens = document.getElementsByClassName(`color-side-${turn} token`);
	console.log(player[turn]);
	player[turn].forEach( plyr => {
//		if ( plyr.canMove )
		plyr.self.classList.toggle('animate-turn', plyr.canMove && bl);
		
	});
}

function highlightPlayerTurn() {
	let ok = document.getElementsByClassName(`color-side-${turn + 1} yard-boundary`);
	
	for ( i = 0; i < ok.length; i++ ) {
		ok[i].classList.toggle('blink-player-turn');
	}

}

function getRespectiveSquare( sq, tn = turn ) {
	let ok = ((tn < 2 ? !tn : tn) + 4).toString(2).slice(1);
	let ij = sq.map( (k, l) => Math.abs(k - ok[l] * 14));
	if( tn % 2 == 0 ) ij.reverse();
	return ij;
}









hy = {
		format: {
			tagTypes: ['ID3v2.3', 'ID3v1'],
			lossless: false,
			container: 'MPEG',
			codec: 'MP3',
			sampleRate: 44100,
			numberOfChannels: 2,
			bitrate: 256000,
			codecProfile: 'CBR',
			tool: '55.37.100',
			duration: 246.25632653061226
		},
		native: {
			'ID3v2.3': [{
					id: 'TALB',
					value: 'Single Track'
				},
				{
					id: 'TPE1',
					value: 'Ninja'
				},
				{
					id: 'TCON',
					value: 'Sad'
				},
				{
					id: 'TCMP',
					value: '1'
				},
				{
					id: 'POPM',
					value: {
						email: 'Windows Media Player 9 Series',
						rating: 255,
						counter: undefined
					}
				},
				{
					id: 'TIT2',
					value: 'Aadat (N)'
				},
				{
					id: 'USLT',
					value: {
						language: 'eng',
						description: '',
						text: '*** Here is Song Lyrics *** ' } }, {
							id: 'APIC',
							value: {
								format: 'image/jpeg',
								type: 'Other file icon',
								description: 'FRONT_COVER',
								data:
									<
									Buffer ff d8 ff e0 00 10 4 a 46 49 46 00 01 01 00 00 01 00 01 00 00 ff fe 00 3 c 43 52 45 41 54 4 f 52 3 a 20 67 64 2 d 6 a 70 65 67 20 76
								31 2 e 30 20 28 75 73 69... >
							}
						},
						{
							id: 'PRIV',
							value: {
								owner_identifier: 'AverageLevel',
								data: < Buffer 7 b 15 00 00 >
							}
						},
						{
							id: 'PRIV',
							value: {
								owner_identifier: 'WM/MediaClassSecondaryID',
								data: < Buffer 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 >
							}
						},
						{
							id: 'PRIV',
							value: {
								owner_identifier: 'WM/MediaClassPrimaryID',
								data: < Buffer bc 7 d 60 d1 23 e3 e2 4 b 86 a1 48 a4 2 a 28 44 1 e >
							}
						},
						{
							id: 'PRIV',
							value: {
								owner_identifier: 'PeakValue',
								data: < Buffer a1 66 00 00 >
							}
						},
						{
							id: 'PRIV',
							value: {
								owner_identifier: 'WM/Provider',
								data:
									<
									Buffer 55 00 73 00 65 00 72 00 20 00 46 00 65 00 65 00 64 00 62 00 61 00 63 00 6 b 00 00 00 >
							}
						},
						{
							id: 'PRIV',
							value: {
								owner_identifier: 'WM/WMContentID',
								data: < Buffer cf 69 39 e1 ff c2 c2 48 8 a 68 95 3 a 40 39 64 03 >
							}
						},
						{
							id: 'PRIV',
							value: {
								owner_identifier: 'WM/WMCollectionID',
								data: < Buffer 65 1 d 38 0 d 14 bf c3 4 c b3 d2 68 60 3 e 91 88 08 >
							}
						},
						{
							id: 'PRIV',
							value: {
								owner_identifier: 'WM/WMCollectionGroupID',
								data: < Buffer 65 1 d 38 0 d 14 bf c3 4 c b3 d2 68 60 3 e 91 88 08 >
							}
						},
						{
							id: 'PRIV',
							value: {
								owner_identifier: 'WM/UniqueFileIdentifier',
								data: < Buffer 3 b 00 00 00 >
							}
						}],
					ID3v1: [{
							id: 'title',
							value: 'Aadat (N)'
						},
						{
							id: 'artist',
							value: 'Ninja'
						},
						{
							id: 'album',
							value: 'Single Track'
						}]
				},
		quality:
				{
					warnings: [{
							message: 'Unknown PRIV owner-identifier: WM/MediaClassSecondaryID'
						},
						{
							message: 'Unknown PRIV owner-identifier: WM/MediaClassPrimaryID'
						},
						{
							message: 'Unknown PRIV owner-identifier: WM/Provider'
						},
						{
							message: 'Unknown PRIV owner-identifier: WM/WMContentID'
						},
						{
							message: 'Unknown PRIV owner-identifier: WM/WMCollectionID'
						},
						{
							message: 'Unknown PRIV owner-identifier: WM/WMCollectionGroupID'
						},
						{
							message: 'Unknown PRIV owner-identifier: WM/UniqueFileIdentifier'
						}]
				},
		common:
				{
					track: {
						no: null,
						of: null
					},
					disk: {
						no: null,
						of: null
					},
					album: 'Single Track',
					artists: ['Ninja'],
					artist: 'Ninja',
					genre: ['Sad'],
					compilation: '1',
					rating: [{
						source: 'Windows Media Player 9 Series',
						rating: 1
					}],
					title: 'Aadat (N)',
					picture: [{
						format: 'image/jpeg',
						type: 'Other file icon',
						description: 'FRONT_COVER',
						data:
							<
							Buffer ff d8 ff e0 00 10 4 a 46 49 46 00 01 01 00 00 01 00 01 00 00 ff fe 00 3 c 43 52 45 41 54 4 f 52 3 a 20 67 64 2 d 6 a 70 65 67 20 76 31
						2 e 30 20 28 75 73 69... >
					}],
					averageLevel: 5499
				}
			};
hy.common