// Initialize Firebase
var config = {
	apiKey: "AIzaSyD7BpmQ-_7EuEqYUsn8DhwGSIDJ2qVwW6c",
	authDomain: "cams-project-422f6.firebaseapp.com",
	databaseURL: "https://cams-project-422f6.firebaseio.com",
	projectId: "cams-project-422f6",
	storageBucket: "cams-project-422f6.appspot.com",
	messagingSenderId: "648522365381"
};
firebase.initializeApp(config);

var database = firebase.database();
var user = firebase.auth().currentUser;

//FIREBASE AUTHS - CREATE ACCOUNT, LOGIN, LOGOUT, USER STATUS CHANGE//
//Create a Firebase User using Navbar-Register
$("#submitSignUp").on("click", function (user) {
	var displayName = $("#username").val().trim();
	var email = $("#email").val().trim();
	var password = $("#password").val().trim();
	console.log("USER: " + displayName);
	console.log("email: " + email);
	firebase.auth().createUserWithEmailAndPassword(email, password).then(function (user) {
		user.updateProfile({ displayName: displayName });
	}).catch(function (error) {
		console.log(error);
	});
});

//Sign into Firebase using Navbar-Login
$("#submitLogin").on("click", function () {
	var email = $("#loginEmail").val().trim();
	var password = $("#LoginPsw").val().trim();
	console.log("Login Successful!");
	console.log(user);
	firebase.auth().signInWithEmailAndPassword(email, password).catch(function (error) {
		var errorCode = error.code;
		var errorMessage = error.message;
		console.log("Error: " + errorCode + " Message: " + errorMessage);

	});
});

//Sign out of Firebase using Navbar-Sign OUt
$("#signOut").on("click", function () {
	event.preventDefault();
	firebase.auth().signOut().then(function () {
		console.log("Sign Out Successful");
	}).catch(function (error) {
		console.log("Error Signing Out");
	});
});

//Firebase to listen for user status changes//
firebase.auth().onAuthStateChanged(function (user) {
	if (user) {
		console.log("User Signed In");
		displayUser();
	} else {
		console.log("User Signed Out");
	}
});


function displayUser() {
	var user = firebase.auth().currentUser;
	var name, email, photoUrl, uid;
	if (user != null) {
		name = user.displayName;
		email = user.email;
		photoUrl = user.photoURL;
		uid = user.uid;
		$("#showProfile").html(name + "<br>" + email);
	}
}

$("#profileSubmit").on("click", function () {
	event.preventDefault();
	setProfile();
})

function setProfile() {
	var $firstName = $("#fname").val().trim();
	var $lastName = $("#lname").val().trim();
	var $gender = $("input[name='gender']:checked").val();
	var $seeking = $("#seeking").val();
	var $birthday = $("#bday").val();
	var $sunSign = $("#sunSign").val();
	var $aboutYou = $("#aboutYou").val();

	var user = firebase.auth().currentUser;
	var userProfile = {
		aboutYou: $aboutYou,
		relationship: $seeking,
		gender: $gender,
		birthday: $birthday,
		sunSign: $sunSign,
		lastName: $lastName,
		firstName: $firstName,
		userID: user.uid,
	};
	database.ref("/profile").push().set(userProfile);
	console.log(userProfile);
}

database.ref("/profile").on("child_added", function (snapshot) {
	console.log(snapshot.val());
})