//////////////////////////////////////////////////////////
// INITIALIZE
//////////////////////////////////////////////////////////

var canvas1 = document.getElementById("canvas1"); 
var canvas2 = document.getElementById("canvas2"); 
var canvas3 = document.getElementById("canvas3");

canvas1.width = window.innerWidth;
canvas1.height = window.innerHeight;

canvas2.width = window.innerWidth;
canvas2.height = window.innerHeight;

canvas3.width = window.innerWidth;
canvas3.height = window.innerHeight;


var c1 = canvas1.getContext('2d');
var c2 = canvas2.getContext('2d');
var c3 = canvas3.getContext('2d');

var clickDisabled = false;
var counter = 0;

//////////////////////////////////////////////////////////
// EVENT LISTENER
//////////////////////////////////////////////////////////

var mouse = {
	x: undefined,
	y: undefined
}


window.addEventListener ('mousemove',
	function(event) {
		mouse.x = event.x;
		mouse.y = event.y;

})

document.onclick= ('mouseClick', 
	function (event) {
    if (event===undefined) event= window.event;

    var target= 'target' in event? event.target : event.srcElement;

    if(!clickDisabled){
	    for(var i = 0; i < fishArray.length; i ++){
	    	fishArray[i].checkClick();
	    }
	}
});

window.addEventListener ('resize',
	function() {
		canvas1.width = window.innerWidth;
		canvas1.height = window.innerHeight;

		canvas2.width = window.innerWidth;
		canvas2.height = window.innerHeight;

		canvas3.width = window.innerWidth;
		canvas3.height = window.innerHeight;
	});


//////////////////////////////////////////////////////////
// OCEAN PARTICLE
//////////////////////////////////////////////////////////

var minRadius;
var maxRadius;

function Particle(x, y, dx, dy, radius){

	this.x = x;
	this.y = y;
	this.dx = dx;
	this.dy = dy;
	this.radius = radius;

	this.draw = function(){

		c1.beginPath(); 
  		c1.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false); //xy, radius, start & end      angle, direction
  		c1.fillStyle = "white";
  		c1.fill();

  	}
  	this.update = function(){

  		if(this.x + this.radius > innerWidth || this.x - this.radius < 0){
  			this.dx = -this.dx;
  		}
 		 if(this.y + this.radius > innerHeight || this.y - this.radius < 0){
  			this.dy = -this.dy;
  		}

  		// Interactivity Move Away
  		if(Math.sqrt(Math.pow(mouse.x-this.x, 2) + Math.pow(mouse.y-this.y, 2)) < 50){

  				this.dx *= 2;
  				this.dy *= 2;

  		}else if (this.dy > 1 || this.dx > 1 || this.dy < -1 || this.dx < -1){

			this.dx = 1 * (Math.random()-0.5);
			this.dy = 1 * (Math.random()-0.5);
  		} 

  		this.x += this.dx;
  		this.y += this.dy;
  		this.draw();
  	}
}


//////////////////////////////////////////////////////////
// FISH >O
//////////////////////////////////////////////////////////

function Fish(id){

	this.id = id;
	this.x = 0;
	this.y = 0;
	this.dx = 0;
	this.dy = 0;
	this.flag = 0;
	this.source = "LePoissonRoi.png"
	var imgFish = new Image();

	this.draw = function(){
		imgFish.src = this.source; 
		c3.drawImage(imgFish, this.x - imgFish.width, this.y); 
	}

	this.drawLeft = function(){
		imgFish.src = this.source; 
		c3.drawImage(imgFish, this.x, this.y); 
	}
	this.update = function(){
		this.y += this.dy;
		this.x += this.dx;

		if(this.dx > 0){	
			this.draw();
		} else{
			this.drawLeft();
		}

		if(this.x >= innerWidth + 100 || this.y >= innerHeight + 100 || this.x < -100 || this.y < -100){
			if(this.flag == 1){
				this.flag = 0;
				counter --;
			}
		}
	}
	this.checkClick = function(){
		if(Math.sqrt(Math.pow(mouse.x-this.x, 2) + Math.pow(mouse.y-this.y, 2)) < imgFish.height){
			if(!clickDisabled){
				readDiary();
			}if(document.getElementById("theDiaryView").style.height!="600px"){
				closeDiaryView();
			}
  		}
	}
}

//////////////////////////////////////////////////////////
// CLOUD 
//////////////////////////////////////////////////////////

var cloud1 = "cloud1.png";
var cloud2 = "cloud2.png";
var cloud3 = "cloud3.png";

function Cloud(id, x, y, dx, dy){

	this.id = id;
	this.x = x;
	this.y = y;
	this.dx = dx;
	this.dy = dy;
	this.flag = 0;

	this.draw = function(i){
		var imgCloud = new Image();
		imgCloud.src = this.id; //"fish.png";  

		c2.drawImage(imgCloud, this.x, this.y); 
	}

	this.update = function(){

  		if(this.x > innerWidth || this.x < 0){
  			this.dx = -this.dx;
  		}
 		 if(this.y > innerHeight || this.y < 0){
  			this.dy = -this.dy;
  		}
  		this.x += this.dx;
  		this.y += this.dy;
  		this.draw();

  		if(this.x >= innerWidth + 50 || this.y >= innerHeight + 50 || this.x < -50 || this.y < -50){
			this.flag = 0;
		}
  	}
}

//////////////////////////////////////////////////////////
// DRAW CLOUD FUNCTION
//////////////////////////////////////////////////////////

var cloudArray = [];

function drawCloud() {

	particleArray = [];
	for(var i=0; i<12; i++){

		makeCloud();
	}
}

function makeCloud(){

	var x = Math.random() * innerWidth;
	var y = Math.random() * innerHeight;
	var dx = 2 * (Math.random()-0.5);
	var dy = 0;//* (Math.random()-0.5); //velocity

	var tmp = Math.floor(Math.random()*3);

	if(tmp == 0){
		cloudArray.push(new Cloud (cloud1, x, y, dx, dy));
	}else if (tmp == 1){
		cloudArray.push(new Cloud (cloud2, x, y, dx, dy));
		console.log("another cloud");
	}else if (tmp == 2){
		cloudArray.push(new Cloud (cloud3, x, y, dx, dy));
		console.log("another cloud");
	}	
}

//////////////////////////////////////////////////////////
// DRAW FISH FUNCTION
//////////////////////////////////////////////////////////

var fishArray = [];


function makeFish() {
	var id = fishArray.length;
	var newFish = new Fish(id);
	fishArray.push(newFish);
	drawFish(id);
	return newFish;
}

function swim(){

	if(fishArray.length > 0){
		var r = Math.floor(Math.random() *fishArray.length);

		if(fishArray[r].flag == 0 && counter < 10){
			drawFish(r);
			console.log(counter);
		}		
	}
}

function drawFish(id){

	if(Math.round(Math.random()) == 0){
		fishArray[id].x = -100;
		fishArray[id].dx = 1 + Math.random();
		
		tmpRandom = Math.floor(Math.random() * totalDiary) + 1;

		if(tmpRandom < (totalDiary/3)){
			fishArray[id].source = "fish.png";
		}else if(tmpRandom < (totalDiary/3*2)){
			fishArray[id].source = "jellyfish.png";
		}else{
			fishArray[id].source = "flatFish.png";
		}

		fishArray[id].draw();
	
	}else{
		fishArray[id].x = innerWidth + 100;
		fishArray[id].dx = - (1 + Math.random());

		tmpRandom = Math.floor(Math.random() * totalDiary) + 1;

		if(tmpRandom < (totalDiary/3)){
			fishArray[id].source = "Lfish.png";
		}else if(tmpRandom < (totalDiary/3*2)){
			fishArray[id].source = "Ljellyfish.png";
		}else{
			fishArray[id].source = "LflatFish.png";
		}

		fishArray[id].drawLeft();
	}

	fishArray[id].y = Math.random() * innerHeight;
	fishArray[id].dy = 2 * (Math.random()-0.5); 

	fishArray[id].flag = 1;
	counter ++;
}

//////////////////////////////////////////////////////////
// DRAW PARTICLE FUNCTION
//////////////////////////////////////////////////////////

var particleArray = [];

function drawParticle() {

	particleArray = [];
	for(var i=0; i<1200; i++){


		var x = Math.random() * innerWidth;
		var y = Math.random() * innerHeight;
		var dx = 1 * (Math.random()-0.5);
		var dy = 1 * (Math.random()-0.5); //velocity

		particleArray.push(new Particle (x, y, dx, dy, 1));
		
	}
}

//////////////////////////////////////////////////////////
// ANIMATE CANVAS
//////////////////////////////////////////////////////////

function animate(){

 	requestAnimationFrame(animate); //Recursive
 	c1.clearRect(0, 0, innerWidth, innerHeight);

 	var imgBG = new Image();
	imgBG.src = "daylightMountain.png";

	if(getTime() < 9){
		imgBG.src = "morningMountain.png";
	}else if(getTime() < 17){
		imgBG.src = "daylightMountain.png";
	}else if(getTime() < 20){
		imgBG.src = "eveningMountain.png";
	}else if(getTime() < 23){
		imgBG.src = "nightMountain.png";
	}else{
		imgBG.src = "midnightMountain.png";
	}

	var ratio1 = imgBG.width/window.innerWidth;
	var ratio2 = imgBG.height/window.innerHeight;

	c1.drawImage(imgBG, 0, 0, imgBG.width, imgBG.height); 

	//c1.fillRect(0, 0, window.innerWidth, window.innerHeight);

	c2.clearRect(0, 0, innerWidth, innerHeight);

 	c3.clearRect(0, 0, innerWidth, innerHeight);

	for(var i=0; i<fishArray.length; i++){
	   	fishArray[i].update();
	}
	swim();

	for(var i=0; i<particleArray.length; i++){
	  	particleArray[i].update();
    }

    for(var i=0; i<cloudArray.length; i++){
	  	cloudArray[i].update();
    }
}

drawCloud();
drawParticle();
animate();

//////////////////////////////////////////////////////////
// SIDE MENU
//////////////////////////////////////////////////////////

function toggle() {

    if(document.getElementById("theSlideMenu").style.width == "200px"){
		closeNav();		
	}else{
		openNav();
	}  
}
function openNav(){
	document.getElementById("theSlideMenu").style.width = "200px";
   	document.getElementById("theSlideMenu").style.opacity = "0.75";
    document.body.style.backgroundColor = "rgba(0,0,0,0.4)";
    document.getElementById("switchButton").className = "fa fa-caret-left"; 
	closeDiaryView();
	closeForm();
}
function closeNav(){
	document.getElementById("theSlideMenu").style.opacity = "0";
	document.getElementById("theSlideMenu").style.width = "0";
	document.getElementById("switchButton").className = "fa fa-caret-right"; 
	document.body.style.backgroundColor = "white";
}
//////////////////////////////////////////////////////////
// DIARY WRITE WINDOW 
//////////////////////////////////////////////////////////

function addDiary() {

	clickDisabled = true;
	closeForm();
	closeDiaryView();
	//1. Close Side Menu
	closeNav();

	//2. Pop up Write Area
	document.getElementById("theDiaryPad").style.height = "600px";
	document.getElementById("theDiaryPad").style.opacity = "0.8";
	document.getElementById("diaryText").style.display = "block";
	document.getElementById("diaryText").style.opacity = "1";
	dateTime();
}

function closeDiary(){
	clickDisabled = false;
	document.getElementById("diaryText").value = "";
	document.getElementById("theDiaryPad").style.height = "0px";
	document.getElementById("theDiaryPad").style.opacity = "0";
	document.getElementById("diaryText").style.display = "none";
}

//////////////////////////////////////////////////////////
// DIARY READ WINDOW 
//////////////////////////////////////////////////////////

function readDiary(){
	if(!clickDisabled){
		clickDisabled = true;
		fetchDiary(); 
		closeForm();
		closeHelp();
		document.getElementById("theDiaryView").style.visibility = "visible";
		document.getElementById("theDiaryView").style.opacity = "0.8";
		document.getElementById("theDiaryView").style.height = "600px";
		document.getElementById("theDiaryViewTXT").style.display = "inline-block";	
	}
}

function closeDiaryView(){
	document.getElementById("theDiaryView").style.visibility = "none";
	document.getElementById("theDiaryView").style.opacity = "0";
	document.getElementById("theDiaryView").style.height = "0px";
	document.getElementById("theDiaryViewTXT").style.display = "none";
	clickDisabled = false;
}

//////////////////////////////////////////////////////////
// FORM WINDOW 
//////////////////////////////////////////////////////////

function openForm(){
	clickDisabled = true;
	closeNav();
	document.getElementById("theForm").style.opacity = "0.9";
	document.getElementById("theForm").style.visibility = "visible";
	// document.getElementById("theForm").style.display = "block";
}

function closeForm(){
	clickDisabled = false;
	document.getElementById("theForm").style.opacity = "0";
	document.getElementById("theForm").style.visibility = "hidden";
	// document.getElementById("theForm").style.display = "none";
}

function dateTime(){
	n =  new Date();
	y = n.getFullYear();
	m = n.getMonth() + 1;
	d = n.getDate();
	day = n.getDay();

	var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

	document.getElementById("date").innerHTML = days[day] + " " + m + "." + d + "." + y + "  / " + n.getHours() + ":" + n.getMinutes() + ":" + n.getSeconds() ;
	return n.getHours();
}

function getTime(){
	n =  new Date();
	return n.getHours();
}

//////////////////////////////////////////////////////////
// HELP WINDOW
//////////////////////////////////////////////////////////

function help(){
	if(!clickDisabled){
		clickDisabled = true;
		closeForm();
		closeNav();
		document.getElementById("theDiaryView").style.visibility = "visible";
		document.getElementById("theDiaryView").style.opacity = "0.8";
		document.getElementById("theDiaryView").style.height = "600px";
		document.getElementById("theDiaryViewTXT").style.display = "inline-block";

		document.getElementById("diaryDate").innerHTML = "Welcome To Fishology!";
		document.getElementById("theDiaryViewTXT").innerHTML = "<br><br>1. Wait until no fish around before clicking a button.<br><br>2. If a button won't work, click more times.<br><br>3. Sign in/up here before add diary.<br><br>Enjoy! : D";	
	}
}

function closeHelp(){
	document.getElementById("theDiaryView").style.visibility = "none";
	document.getElementById("theDiaryView").style.opacity = "0";
	document.getElementById("theDiaryView").style.height = "0px";
	document.getElementById("theDiaryViewTXT").style.display = "none";
	clickDisabled = false;
}
function uselessFunction(){
	alert("\"www.a_fake_link_that_will_do_nothing\" <-- Send this link to your friend to share your water of memory! : D");
}