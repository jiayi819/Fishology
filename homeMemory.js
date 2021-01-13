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
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
//Reference Messages Collection
var diaryRef = firebase.database().ref();
const auth = firebase.auth();
var totalMessage;
var lock = false;
 
console.log("Why you run twice??");


document.addEventListener('DOMContentLoaded', function() {
   readTotalMessage();
}, false);


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
	// var email = document.getElementById("email");
	// var password = document.getElementById("password");
	// await auth.createUserWithEmailAndPassword(email.value, password.value);
	// setTotalFish();
	// alert("Signed Up! : D");
}

function setTotalFish(){

	var user = firebase.auth().currentUser;
	var uid = user.uid;

	// firebase.database().ref(user.uid).set({
	// 	totalFish: 0,
	// });
	// firebase.database().ref(user.uid).child("totalFish").setValue({
	// 	totalFish: totalDiary,	
	// });
	firebase.database().ref(user.uid).child("totalFish").set(totalMessage);
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

	document.getElementById('personalLink').disabled = false;
	closeForm();

}

//////////////////////////////////////////////////////////
// MAKE FISH ACCORDING TO TOTAL
//////////////////////////////////////////////////////////

function fishGenerator(){

	if(!lock){
		console.log("I should only called once");
		for(var i=0; i<totalMessage; i++){
		makeFish();
		lock = true;
		}
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

	if(user){
		document.getElementById("personalLink").disabled = false;
	}else{
		document.getElementById("personalLink").disabled = true;
	}
});
//////////////////////////////////////////////////////////
// 1. SUBMIT BUTTON
//////////////////////////////////////////////////////////

document.getElementById('message').addEventListener('submit', 
	function(e) {

		e.preventDefault();
		var input = getInputDiary('messageText');
		input = input.replace(/\n\r?/g, '<br />');
		saveMessage(input);
		
		closeDiary();
});

//////////////////////////////////////////////////////////
// 2. GET DIARY DATA	
//////////////////////////////////////////////////////////

function getInputDiary(id){
	return document.getElementById(id).value;
}

//////////////////////////////////////////////////////////
// ADD MESSAGE
//////////////////////////////////////////////////////////

var n = new Date();
// var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
var days = ['SUN','MON','TUE','WED','THU','FRI','SAT'];

function saveMessage(messageText){
	
	makeFish();
	console.log(fishArray.length-1);

	firebase.database().ref("Hall").child("fish").child(fishArray.length-1).set({
		fishID: fishArray.length-1,
		date: days[day] + " " + m + "." + d + "." + y + "   " + n.getHours() + ":" + n.getMinutes() + ":" + n.getSeconds(),
		messageText: messageText,		
	});
	totalMessage ++;
	firebase.database().ref("Hall").child("totalFish").set(totalMessage);

	// console.log("f(x) saveMessage" + totalDiary);
	// setTotalFish();
}

//////////////////////////////////////////////////////////
// READ DIARY
//////////////////////////////////////////////////////////

var text = "", date = "";
function fetchDiary(){

	var r = Math.floor(Math.random() * totalMessage);

	console.log("f(x) fetchDiary " + r);
	
	firebase.database().ref("Hall").child("fish").orderByChild("fishID").equalTo(r).once("value", function (snapshot) {
		snapshot.forEach(function(childSnapshot) {
			text = childSnapshot.val().messageText;
			date = childSnapshot.val().date;
		});
	});

	document.getElementById("diaryDate").innerHTML = date;
	document.getElementById("theDiaryViewTXT").innerHTML = text;
	console.log(text + "aloha");
}

//////////////////////////////////////////////////////////
// READ TOTAL MESSAGE
//////////////////////////////////////////////////////////

function readTotalMessage(){

	var refUnique = firebase.database().ref("Hall").child("totalFish");
	refUnique.on("value", gotData);

	function gotData(data){
		total = data.val();
		totalMessage = total;
		fishGenerator(totalMessage);
	}
}

function spaceChange(){
	var user = firebase.auth();

	if(user.currentUser != null){
		window.open("leau.html", "personalSpace");
		console.log(user);
	}else{
		console.log("no user");
		document.getElementById("personalLink").disabled = true;
		document.getElementById("personalLink").addEventListener("click", function(e) {
		    alert("Sign-in or Sign-up to access personal diary space : )");
			openForm();
		})
	}
}