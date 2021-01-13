var canvas = document.querySelector('canvas'); 
console.log(canvas);

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var c = canvas.getContext('2d');

//BACKGROUND COLOUR

c.fillStyle = "rgba(255, 0, 0, 0.5)";// RGB + ALPHA
c.fillRect(100, 100, 100, 100);
c.fillStyle = "rgba(0, 255, 0, 0.5)";
c.fillRect(150, 80, 100, 100);
c.fillStyle = "rgba(0, 0, 255, 0.5)";
c.fillRect(150, 130, 100, 100);

// Line

c.beginPath();
c.moveTo(50, 300); // A point
c.lineTo(200, 50);
c.lineTo(400, 80);
c.lineTo(50, 300);
c.strokeStyle = "gold";
c.stroke();

//Arc / Circle

// for(var i = 0; i<100; i++){
//   var x = Math.random() * window.innerWidth;
//   var y = Math.random() * window.innerHeight;

//   c.beginPath(); // Separate from other path
//   c.arc(x, y, 30, 0, Math.PI * 2, false) //x, y, radius, start & end  angle, direction
//   c.strokeStyle = '#'+Math.random().toString(16).substr(-6);
//   c.stroke();
// }

var mouse = {
	x: undefined,
	y: undefined
}

var maxRadius = 40; 
var minRadius = 8;

var colourArray = [
	'#ffd5cd',
	'#efbbcf',
	'#c3aed6',
	'#8675a9',
	'#f6d6ad',
];

window.addEventListener('mousemove',
	function(event) {
		mouse.x = event.x;
		mouse.y = event.y;
		console.log(mouse);
})

window.addEventListener('resize', 
	function() {
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;

		init();
});

function Circle(x, y, dx, dy, radius){

	this.x = x;
	this.y = y;
	this.dx = dx;
	this.dy = dy;
	this.radius = radius;
	this.minRadius = radius;
	this.colour = colourArray[Math.floor(Math.random() * colourArray.length)];

	this.draw = function(){

		c.beginPath(); 
  		c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false); //xy, radius, start & end      angle, direction
  		c.strokeStyle = 'gold';
  		//c.stroke();
  		c.fillStyle =  this.colour; //"rgba(212, 175, 55, 0.7)"
  		c.fill();

  	}
  	this.update = function(){

  		if(this.x + this.radius > innerWidth || this.x - this.radius < 0){
  			this.dx = -this.dx;
  		}
 		 if(this.y + this.radius > innerHeight || this.y - this.radius < 0){
  			this.dy = -this.dy;
  		}

 	 	this.x += this.dx;
  		this.y += this.dy;

  		// Interactivity

  		if (mouse.x - this.x < 50 && mouse.x - this.x > -50 
  			&& mouse.y - this.y < 50 && mouse.y - this.y > -50) {

  			if(this.radius < maxRadius){

  				this.radius += 1;
  			}

  		} else if (this.radius > this.minRadius){
  			this.radius -= 1;
  		}

  		this.draw();
  	}

}


var circleArray = [];

//var circle = new Circle(200, 200, 3, 3, 30); //Create new Object
function init() {
	
	circleArray = []; //fix no o fcircle
	for(var i=0; i<1200; i++){ //No of Particles

		var x = Math.random() * (innerWidth - radius*2) + radius;
		var y = Math.random() * (innerHeight - radius*2) + radius;
		var dx = 3 * (Math.random()-0.5);
		var dy = 3 * (Math.random()-0.5); //velocity
		var radius = Math.random() * 3 + 1;

		circleArray.push(new Circle(x, y, dx, dy, radius));

	}
}


function animate(){

  requestAnimationFrame(animate); //call each other & loop
  c.clearRect(0, 0, innerWidth, innerHeight);
  //circle.update();

  for(var i=0; i<circleArray.length; i++){
  	circleArray[i].update();
  }
 
}

init();
animate();

