const puzzle = {
	order: 4, size: 300, board: undefined, toShuffle: false,
	shuffler: function () {
		let dirs = [-this.order, 1, this.order, -1]
			.filter(n => isValidMove(n + tile.empty) && n != -this.toShuffle);

		this.toShuffle = dirs[Math.random() * dirs.length | 0];
		tile.move(this.toShuffle + tile.empty);
	}
};
const tile = {
	all: [], isMoving: false,
	start: undefined, empty: 15,
	count: Math.pow(puzzle.order, 2),
	get size () {
		return puzzle.size / puzzle.order;
	},
	move: function (i, isUser = false) {
		if (tile.empty == undefined || tile.isMoving) return;

		let colD = ((i / puzzle.order | 0) - (tile.empty / puzzle.order | 0)),
			rowD = (i - tile.empty) % puzzle.order;
		let D = Math.abs(colD == 0 ? rowD : rowD == 0 ? colD : 0);

		if (1) {
			// console.log('nice', D);
		}

		new Promise((resolve, reject) => {
			const voh = Math.abs(i - tile.empty) / D;
			// console.log(this, i, tile.empty - i);
			// if (![1, puzzle.order].includes(voh)) {
			// 	return reject("Can't Move!");
			// }
			tile.isMoving = true;
			const d = {
				x: voh - puzzle.order, y: 1 - voh,
				s: Math.sign(i - tile.empty) * tile.size / (puzzle.order - 1)
			};
			// tile.all[i].style.transform = `translate(${d.x * d.s}px, ${d.y * d.s}px)`;
			if (isUser) {
				// console.log('chalja');
				for (let k = 0, e = tile.empty, s = (i - tile.empty) / D; k < D; k++) {
					// console.log(e, s, D);
					e += s;
					tile.all[e].classList.add('slide');
					tile.all[e].style.setProperty('--slide-to', `translate(${d.x * d.s}px, ${d.y * d.s}px)`);

				}
			} else {
				tile.all[i].classList.add('slide');
				tile.all[i].style.setProperty('--slide-to', `translate(${d.x * d.s}px, ${d.y * d.s}px)`);
			}
			// resolve();
			tile.all[i].addEventListener('webkitTransitionEnd', resolve);
			tile.start = i;
		})
			.then(() => {
				if (!tile.isMoving) return;
				// console.log("i'm done!", this);

				// tile.all[].style.transform = 'none';
				if (isUser) {
					const S = (tile.empty - i) / D;
					for (let k = 0; k < D && 0; k++) {
						let m = i + k * S;
						tile.all[m].classList.remove('slide');
						tile.all[m].style.backgroundPosition = tile.all[m + S].style.backgroundPosition;
						console.log(k, m, S);

					}
				} else {
					tile.all[tile.start].classList.remove('slide');
					tile.all[tile.empty].style.backgroundPosition = tile.all[tile.start].style.backgroundPosition;
				}
				for (const n of [tile.start, tile.empty]) {
					// tile.all[n].classList.toggle('empty-tile');
				}
				tile.empty = tile.start;
				tile.isMoving = false;

				if (puzzle.toShuffle) puzzle.shuffler();
			}).catch((err) => {
				console.error(err);
			});
	},
	moveBackup: function (i) {
		if (tile.empty == undefined || tile.isMoving) return;

		let colD = ((i / puzzle.order | 0) - (tile.empty / puzzle.order | 0)),
			rowD = (i - tile.empty) % puzzle.order;
		let d = Math.abs(colD == 0 ? rowD : rowD == 0 ? colD : 0);
		if (1) {
			console.log('nice', d);
		}
		new Promise((resolve, reject) => {
			const dir = Math.abs(i - tile.empty);
			// console.log(this, i, tile.empty - i);
			if (![1, puzzle.order].includes(dir)) {
				return reject("Can't Move!");
			}
			tile.isMoving = true;
			const d = {
				x: dir - puzzle.order, y: 1 - dir,
				s: Math.sign(i - tile.empty) * tile.size / (puzzle.order - 1)
			};
			// tile.all[i].style.transform = `translate(${d.x * d.s}px, ${d.y * d.s}px)`;
			tile.all[i].classList.add('slide');
			tile.all[i].style.setProperty('--slide-to', `translate(${d.x * d.s}px, ${d.y * d.s}px)`);
			// resolve();
			tile.all[i].addEventListener('webkitTransitionEnd', resolve);
			tile.start = i;
		})
			.then(() => {
				if (!tile.isMoving) return;
				// console.log("i'm done!", this);
				tile.all[tile.empty].style.backgroundPosition = tile.all[tile.start].style.backgroundPosition;
				for (const n of [tile.start, tile.empty]) {
					tile.all[n].classList.toggle('empty-tile');
				}
				// tile.all[].style.transform = 'none';
				// tile.all[tile.start].classList.remove('slide');
				tile.empty = tile.start;
				tile.isMoving = false;

				if (puzzle.toShuffle) puzzle.shuffler();
			}).catch((err) => {
				console.error(err);
			});
	}
};

window.onload = function () {
	puzzle.board = document.querySelector('#puzzle-board');
	puzzle.board.style.setProperty('--puzzle-order', puzzle.order);
	puzzle.board.style.setProperty('--puzzle-size', puzzle.size + 'px');

	for (let i = 0; i < tile.count; i++) {
		const tl = document.createElement('div');

		tl.style.backgroundPosition = `${-(i % puzzle.order) * tile.size}px ${-(i / puzzle.order | 0) * tile.size}px`;

		tl.onclick = function () {
			tile.move(i, true);
		};

		if (i == tile.empty) {
			tl.classList.add('empty-tile');
		}
		tile.all.push(tl);

		puzzle.board.appendChild(tl);
	}

	document.getElementById('shuffler').onclick = () => {
		if (tile.empty == undefined) {
			tile.empty = tile.count - 1;
			tile.all[tile.empty].classList.add('empty-tile');
		}
		puzzle.toShuffle = !puzzle.toShuffle;
		if (puzzle.toShuffle) puzzle.shuffler();
	};

	document.onkeypress = function (ev) {
		// console.log(ev.key);
		if (!'wasd'.includes(ev.key)) return;

		const magC = { w: puzzle.order, a: 1, s: -puzzle.order, d: -1 },
			trgt = tile.empty + magC[ev.key];

		if (isValidMove(trgt)) {
			tile.move(trgt);
		}
	};
};

function isValidMove (t) {
	return Math.abs(t % puzzle.order - tile.empty % puzzle.order) < 2 && t >= 0 && t < tile.count;
}