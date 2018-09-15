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

//GLOBAL//
//firebase paths//
var database = firebase.database();
var profilePath = database.ref("/profile");
var user = firebase.auth().currentUser;
//Jquery HTML Buttons//
var $submitSignUp = $("#submitSignUp");
var $showSignUp = $("#showSignUp");
var $submitLogIn = $("#submitLogin");
var $showLogin = $("#showLogin");
var $submitProfile = $("#profileSubmit")
var $signOut = $("#signOut");
//Related to profile
var $firstName;
var $lastName;
var $gender;
var $seeking;
var $birthday;
var $sunSign;
var $aboutYou;
var match1;
var match2;
var match3;
var matchArray = [];


//FIREBASE AUTHS - CREATE ACCOUNT, LOGIN, LOGOUT, USER STATUS CHANGE//
//Create a Firebase User using Navbar-Register
$submitSignUp.on("click", function (user) {
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
$submitLogIn.on("click", function () {
	var email = $("#loginEmail").val().trim();
	var password = $("#LoginPsw").val().trim();
	console.log("Login Successful!");
	firebase.auth().signInWithEmailAndPassword(email, password).catch(function (error) {
		var errorCode = error.code;
		var errorMessage = error.message;
		console.log("Error: " + errorCode + " Message: " + errorMessage);
	});
	$showLogin.hide();
	$showSignUp.hide();
});

//Sign out of Firebase using Navbar-Sign Out
$signOut.on("click", function () {
	event.preventDefault();
	firebase.auth().signOut().then(function () {
		console.log("Sign Out Successful");
		$showLogin.show();
		$showSignUp.show();
	}).catch(function (error) {
		console.log("Error Signing Out");
	});
});

//Firebase to listen for user status changes//
firebase.auth().onAuthStateChanged(function (user) {
	if (user) {
		//firebase.getProfile(user.uid).then(){window.location = /matches}
		profilePath.orderByChild("userID").equalTo(user.uid).on("value", function (snapshot) {
			getProfile(snapshot);
			});
		console.log(user.uid);
		console.log("User Signed In");
		displayUser();
	} else {
		console.log("User Signed Out");
	}
});

//DO WE NEED THIS? Or can this be included in getProfile Function?//
function displayUser() {
	var user = firebase.auth().currentUser;
	// var displayName, email, photoUrl, uid;
	if (user != null) {
		displayName = user.displayName;
		email = user.email;
		// photoUrl = user.photoURL;
		// uid = user.uid;
		// $("#showProfile").html(displayName + "<br>" + email);
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

//Retrieve the user's profile information from Firebase//
//Call this on the AuthStateChange function//
function getProfile(snapshot) {
	var sv = snapshot.val();
	var keys = Object.keys(sv);
	var profile = sv[keys]
	$sunSign = profile.sunSign;
	$firstName = profile.firstName;
	$lastName = profile.lastName;
	$gender = profile.gender;
	$seeking = profile.relationship;
	$aboutYou = profile.aboutYou;
	console.log($firstName, $lastName, $sunSign, $gender, $seeking, $aboutYou);
	//Display profile information in the DOM as needed
	bestMatches($sunSign);
	console.log("Matches: " + match1 + " " + match2 + " " + match3);
}

function bestMatches() {
	if ($sunSign === "Aquarius") {
		match1 = "Aries";
		match2 = "Gemini";
		match3 = "Libra";
	} else if ($sunSign === "Pisces") {
		match1 = "Taurus";
		match2 = "Cancer";
		match3 = "Scorpio";
	} else if ($sunSign === "Aries") {
		match1 = "Gemini";
		match2 = "Leo";
		match3 = "Sagittarius";
	} else if ($sunSign === "Taurus") {
		match1 = "Cancer";
		match2 = "Virgo";
		match3 = "Capricorn";
	} else if ($sunSign === "Gemini") {
		match1 = "Aries";
		match2 = "Leo";
		match3 = "Libra";
	} else if ($sunSign === "Cancer") {
		match1 = "Taurus";
		match2 = "Virgo";
		match3 = "Scorpio";
	} else if ($sunSign === "Leo") {
		match1 = "Aries";
		match2 = "Gemini";
		match3 = "Libra";
	} else if ($sunSign === "Virgo") {
		match1 = "Taurus";
		match2 = "Cancer";
		match3 = "Scorpio";
	} else if ($sunSign === "Libra") {
		match1 = "Gemini";
		match2 = "Leo";
		match3 = "Sagittarius";
	} else if ($sunSign === "Scorpio") {
		match1 = "Cancer";
		match2 = "Virgo";
		match3 = "Capricorn";
	} else if ($sunSign === "Sagittarius") {
		match1 = "Aries";
		match2 = "Leo";
		match3 = "Libra";
	} else if ($sunSign === "Capricorn") {
		match1 = "Taurus";
		match2 = "Virgo";
		match3 = "Scorpio";
	}
	matchArray.push(match1, match2, match3);
	console.log(matchArray);
	renderButtons();
}

function renderButtons() {
	for (var i = 0; i <matchArray.length; i++){
		var matchButton= $("<button>");
		matchButton.attr("id","matchBtn");
		matchButton.attr("data-matchvalue", matchArray[i]);
		$("#showProfile").append(matchButton);
	}
}

profilePath.once('value', function(snapshot) {
  snapshot.forEach(function(childSnapshot) {
    var childKey = childSnapshot.key;
		var childData = childSnapshot.val();
		console.log(childKey);
		console.log(childData);
		
    // ...
  });
});