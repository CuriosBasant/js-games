const puzzle = {
	order: 4, size: 400,
	board: null, toShuffle: false,
	isDirty: true,
	VoH: Math.random() < 0.5,
	shuffler: function () {
		this.VoH = !this.VoH;
		const validTiles = getValidTiles(this.VoH); // vertical if passed true
		const randTile = validTiles[Math.random() * validTiles.length | 0];
		slideTile(randTile, this.VoH);
	}
};
const tile = {
	all: [], lastSlide: null,
	get count() { return Math.pow(puzzle.order, 2); },
	get size() { return puzzle.size / puzzle.order },
	empty: null,

	addNew: function (i) {
		const tl = document.createElement('div');

		// tl.style.backgroundPosition = `${-(i % puzzle.order) * tile.size}px ${-(i / puzzle.order | 0) * tile.size}px`;

		tl.onclick = function () {
			if (tile.empty == null) return;

			const VoH = Math.abs(i - tile.empty) >= puzzle.order; // true on vertical :-P
			if (getValidTiles(VoH).includes(i)) {
				slideTile(i, VoH);
				
			} else {
				const tog = () => tl.classList.toggle('invalid-tile');
				tog();
				tl.addEventListener('animationend', tog, { once: true });

			}

		};

		if (i == tile.empty) {
			tl.classList.add('empty-tile');
		}

		tile.all.push(tl);
		puzzle.board.appendChild(tl);
	},
	isValid: function (t) {
		return Math.abs(t % puzzle.order - tile.empty % puzzle.order) < 2 && t >= 0 && t < tile.count;
	}
};

window.onload = () => {
	puzzle.board = document.querySelector('#puzzle-board');
	puzzle.board.style.setProperty('--puzzle-order', puzzle.order);
	puzzle.board.style.setProperty('--puzzle-size', puzzle.size + 'px');

	for (let i = 0; i < tile.count; i++) {
		tile.addNew(i);
	}

	// On clicking on Shuffle Button
	document.getElementById('shuffler').onclick = shuffleTiles;

	// On pressing of any Key
	puzzle.board.onkeypress = function (ev) {
		// console.log(ev);
		if (ev.code == "Space") {
			shuffleTiles();
			return;
		}
		const key = ev.key.toUpperCase();
		// if (tile.empty == null) return;
		// CharCodes - w: 119, s: 115, a: 97, d: 100
		// CharCodes - W: 87, S: 83, A: 65, D: 68

		if (tile.empty == null || !'WASD'.includes(key)) return;

		let trgt = tile.empty + { W: puzzle.order, A: 1, S: -puzzle.order, D: -1 }[key];
		
		const isVert = key == 'W' || key == 'S';
		const validTiles = getValidTiles(isVert);
		if (!validTiles.includes(trgt)) return;

		if (ev.shiftKey) {
			trgt = validTiles[trgt < tile.empty ? 'shift' : 'pop']();
		}

		slideTile(trgt, isVert);
	};

	let currentBG = 0;
	Array.from(document.getElementsByClassName('btn-image-slider')).forEach(btn => {
		btn.onclick = function () {
			currentBG = (currentBG - this.value) % 5;
			currentBG = currentBG < 0 ? 5 + currentBG : currentBG;
			// console.log(currentBG, val);
			document.documentElement.style.setProperty('--bg-image', `url('images/bg-img-${currentBG+1}.jpg')`);
		};
	});

	document.getElementById('cuttings').oninput = function () {
		puzzle.order = +this.value;
		puzzle.isDirty = true;
		
		if (tile.count < tile.all.length) {
			const toRemove = tile.all.splice(tile.count);
			/* for (const div of toRemove) {
				div.remove();
			} */
			toRemove.forEach(div => div.remove());
		} else {
			const toAdd = tile.count - tile.all.length;
			for (let i = tile.all.length; i < tile.count; i++) tile.addNew(i);
		}

		puzzle.board.style.setProperty('--puzzle-order', puzzle.order);
	}
};

function slideTile(tileToMove, VoH) {
	const sign = tileToMove > tile.empty ? -1 : 1;
	const dir = sign * (VoH ? puzzle.order : 1);

	for (let i = tileToMove; i != tile.empty; i += dir) {
		const self = tile.all[i];
		const bgPos = self.style.backgroundPosition;

		self.classList.add('slide-tile');
		self.style.setProperty('--slide-to', `translate${VoH ? 'Y' : 'X'}(${sign * tile.size}px)`);

		// When tile has completed its sliding motion
		self.addEventListener('webkitTransitionEnd', () => {
			self.classList.remove('slide-tile');
			const sible = tile.all[i + dir];
			sible.style.backgroundPosition = bgPos;
			// console.log(empty, '\n', this.div, '\n\n\n\n\n');
			if (i + dir == tile.empty) {
				for (const n of [tileToMove, tile.empty]) {
					tile.all[n].classList.toggle('empty-tile');
				}
				tile.empty = tileToMove;

				if (puzzle.toShuffle) setTimeout(puzzle.shuffler, 50);
			}
		}, { once: true });

	}
}

function getValidTiles(VoH) {
	const except = [tile.empty % puzzle.order, tile.empty / puzzle.order | 0];
	let func;

	if (VoH) {
		except.reverse();
		func = (_, i) => i * puzzle.order + except[1];
	} else {
		func = (_, i) => i + puzzle.order * except[1];
	}

	let validTiles = Array(puzzle.order).fill().map(func);
	validTiles.splice(except[0], 1);
	return validTiles;
}

function shuffleTiles() {
	if (tile.empty == null) {
		tile.empty = tile.count - 1;
		tile.all[tile.empty].classList.add('empty-tile');
	}

	if (puzzle.isDirty) {
		puzzle.board.classList.remove('bg-image');
		tile.all.forEach((tl, i) => {
			tl.style.backgroundPosition = `${-(i % puzzle.order) * tile.size}px ${-(i / puzzle.order | 0) * tile.size}px`;
		});
	}

	puzzle.toShuffle = !puzzle.toShuffle;
	if (puzzle.toShuffle) puzzle.shuffler();
	puzzle.isDirty = false;
}