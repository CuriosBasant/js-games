const pool = {
	cv: document.getElementById('pool-table'),
	x: 500, get y() { return this.x / 2 },
	radius: 5,
	friction: 0.04
};
pool.cv.height = pool.y;//window.innerHeight - 20;
pool.cv.width = pool.x;//window.innerWidth - 10;
let pen = pool.cv.getContext('2d');

//pen.fillStyle = 'green';
//pen.fillRect(0, 0, poolTable.w, poolTable.h);

const getRandom = (min, max) => {
	if ( max == undefined ) {
		max = min;
		min = 0;
	}
	return Math.random() * (max - min) + min | 0;
},
distance = ( x, y ) => Math.sqrt(x * x + y * y),

mouse = { x: 0, y: 0 };

pool.cv.onmousemove = ev => {
	mouse.x = ev.offsetX;
	mouse.y = ev.offsetY;
};

function PoolBalls(x, y, color) {
	this.x = x;
	this.y = y;
	this.speed = 1;
	this.velocity = {
		x: Math.random() - 0.5, y: Math.random() - 0.5
	};
	this.color = color;
	
	this.draw = function() {
		pen.beginPath();
		pen.arc(this.x, this.y, pool.radius, Math.PI * 2, false);
		pen.fillStyle = this.color;
		pen.fill();
	};
	this.update = function() {
		
		balls.forEach( ball => {
			if ( ball == this ) {}
			else if ( distance(this.x - ball.x, this.y - ball.y) < pool.radius * 2 ) {
//				console.log(distance(ball, this)); 
				resolveCollision( this, ball );
			}
		});
		
		let chk = c => {
			/*if ( this[c] < pool.radius )
				this.velocity[c] = Math.abs[this.velocity[c]];
			if ( this[c] + pool.radius > pool[c] )
				this.velocity[c] = -Math.abs[this.velocity[c]];*/
			if ( this[c] < pool.radius || this[c] + pool.radius > pool[c] ) {
				this.velocity[c] = -this.velocity[c];
			}
		};
		chk('x');
		chk('y');
		
		/*if ( this.x < pool.radius || this.x + pool.radius > pool.x ) {
			this.velocity.x = -this.velocity.x;
		}
		if ( this.y < pool.radius || this.y + pool.radius > pool.y ) {
			this.velocity.y = -this.velocity.y;
		}*/
		this.x += this.velocity.x * this.speed;
		this.y += this.velocity.y * this.speed;
		
//		if ( this.speed > 0 ) this.speed -= pool.friction;
		
		this.draw();
		
//		this.speed = (this.speed > 0 ? this.speed - pool.friction : 0);
	};
}
let balls = [];

for ( let i = 0; i < 10; i++ ) {
	for ( let j = 0; j < i + 1; j++ ) {
		let clr = i % 2 ? 'red' : 'blue';
		if (i==2&&j==1) clr = 'black';
		balls.push(new PoolBalls(i * pool.radius * 1.9 + 375, 
										 (j * 2.1 - i * 1.05) * pool.radius + 125, clr));
	}
}
balls.unshift(new PoolBalls(125, 125, 'white'));

function animate() {
	requestAnimationFrame(animate);
	pen.clearRect(0, 0, pool.x, pool.y);
	pen.beginPath();
	pen.moveTo(balls[0].x, balls[0].y);
	pen.lineTo(mouse.x, mouse.y);
	pen.stroke();
	balls.forEach( ball => ball.update() );
}
animate();

function resolveCollision( ball, otherBall ) {
	const velDiff = {
		x: ball.velocity.x - otherBall.velocity.x,
		y: ball.velocity.y - otherBall.velocity.y
	},
	dist = {
		x: otherBall.x - ball.x,
		y: otherBall.y - ball.y
	},
	rotate = (vel, ang) => ({
		x: vel.x * Math.cos(ang) - vel.y * Math.sin(ang),
		y: vel.x * Math.sin(ang) + vel.y * Math.cos(ang)
	});
	
	if ( velDiff.x * dist.x + velDiff.y * dist.y >= 0 ) {
		const angle = -Math.atan2(dist.y, dist.x);
		const u1 = rotate(ball.velocity, angle),
				u2 = rotate(otherBall.velocity, angle);
		
		ball.velocity = {...rotate({ x: u2.x, y: u1.y }, -angle)};
		otherBall.velocity = {...rotate({ x: u1.x, y: u2.y }, -angle)};
		
	}
}