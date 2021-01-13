//////////////////////////////////////////////////////////
// INITIALIZE
//////////////////////////////////////////////////////////

var firebaseConfig = {
	apiKey: "AIzaSyDB2PPCBhwd8H3NqY0Kod9eQCIL1-5STbE",
	authDomain: "maison-de-memoire.firebaseapp.com",
	databaseURL: "https://maison-de-memoire.firebaseio.com",
	projectId: "maison-de-memoire",
	storageBucket: "maison-de-memoire.appspot.com",
	messagingSenderId: "199263922824",
	appId: "1:199263922824:web:61a8e1beddc9a86cc08d3d",
	measurementId: "G-92BXY7MP9J"
};
	
firebase.initializeApp(firebaseConfig);
 
//Reference Messages Collection
var diaryRef = firebase.database().ref();
const auth = firebase.auth();
var totalDiary = 0;
 

//////////////////////////////////////////////////////////
// SIGN UP
//////////////////////////////////////////////////////////

var totalFish = 0;

async function signUp(){

	try{
		var email = document.getElementById("email");
		var password = document.getElementById("password");
		const promise = await auth.createUserWithEmailAndPassword(email.value, password.value);
		setTotalFish();
	
		alert("Signed Up! : D");
	}catch (e){
		alert(e.message);
	}
}

function setTotalFish(){

	var user = firebase.auth().currentUser;
	var uid = user.uid;
	firebase.database().ref(user.uid).child("totalFish").set(totalDiary);
}

//////////////////////////////////////////////////////////
// SIGN IN
//////////////////////////////////////////////////////////

function signIn(){

	var email = document.getElementById("email");
	var password = document.getElementById("password");

	const promise = auth.signInWithEmailAndPassword(email.value, password.value);
	promise.catch(e => alert(e.message));

	alert("Signed In! : D" + email.value);

	//Read & Set Total Diaries 
	readTotalFish();

	closeForm();

}

//////////////////////////////////////////////////////////
// MAKE FISH ACCORDING TO TOTAL
//////////////////////////////////////////////////////////

var lock = false; 
function fishGenerator(){
	if(!lock){
		console.log("f(x) fishGenerator");
		for(var i=0; i<totalDiary; i++){
			makeFish();
		}
		lock = true;
	}

}

//////////////////////////////////////////////////////////
// SIGN OUT
//////////////////////////////////////////////////////////

function signOut(){

	auth.signOut();
	alert("Bye bye");
}


auth.onAuthStateChanged(function(user){
	var user = firebase.auth().currentUser;
	if(user){
		uid = user.uid; 
	}else{

		//no user
	}
});


//////////////////////////////////////////////////////////
// 1. SUBMIT BUTTON
//////////////////////////////////////////////////////////

document.getElementById('diary').addEventListener('submit', 
	function(e) {

		e.preventDefault();
		var input = getInputDiary('diaryText');
		input = input.replace(/\n\r?/g, '<br />');
		saveDiary(input);
		
		closeDiary();
});

//////////////////////////////////////////////////////////
// 2. GET DIARY DATA	
//////////////////////////////////////////////////////////

function getInputDiary(id){
	return document.getElementById(id).value;
}

//////////////////////////////////////////////////////////
// ADD DIARY
//////////////////////////////////////////////////////////

var n = new Date();
// var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
var days = ['SUN','MON','TUE','WED','THU','FRI','SAT'];
function saveDiary(diaryText){
	
	makeFish();
	var user = firebase.auth().currentUser;
	var uid = user.uid;
	var newDiaryRef = firebase.database().ref(user.uid).child("fish").push();

	firebase.database().ref(user.uid).child("fish").child(fishArray.length-1).set({
		fishID: fishArray.length-1,
		date: days[day] + " " + m + "." + d + "." + y + "  / " + n.getHours() + ":" + n.getMinutes() + ":" + n.getSeconds(),
		diaryText: diaryText,		
	});

	totalDiary ++;
	console.log("f(x) saveDiary" + totalDiary);
	setTotalFish();

}	
//////////////////////////////////////////////////////////
// READ DIARY
//////////////////////////////////////////////////////////

var text = "", date = "";
function fetchDiary(){

	var user = firebase.auth().currentUser;
	var uid = user.uid;
	var r = Math.floor(Math.random() * totalDiary);

	console.log("f(x) fetchDiary " + r);
	
	firebase.database().ref(user.uid).child("fish").orderByChild("fishID").equalTo(r).once("value", function (snapshot) {
		snapshot.forEach(function(childSnapshot) {
			text = childSnapshot.val().diaryText;
			date = childSnapshot.val().date;
		});
	});

	document.getElementById("diaryDate").innerHTML = date;
	document.getElementById("theDiaryViewTXT").innerHTML = text;
	console.log(text + "aloha");
}

//////////////////////////////////////////////////////////
// READ TOTAL FISH
//////////////////////////////////////////////////////////

var total = 99;

function readTotalFish(){

	var user = firebase.auth().currentUser;
	var uid = user.uid;

	var ref = firebase.database().ref(user.uid).child("totalFish");
	ref.on("value", gotData);

	function gotData(data){
		total = data.val();

		totalDiary = total;
		document.getElementById("totalFishScreen").innerHTML = totalDiary + " Fish";
		console.log("f(x) readTotalFish Var: totalDiary" + totalDiary);
	
		fishGenerator();
	}
}

