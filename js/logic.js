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
var matchSeeking;
var matchSign;
var matchName;
var matchAbout;


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
});

//Sign out of Firebase using Navbar-Sign Out
$signOut.on("click", function () {
	event.preventDefault();
	firebase.auth().signOut().then(function () {
		console.log("Sign Out Successful");
		location.reload();
		matchArray = [];
	}).catch(function (error) {
		console.log("Error Signing Out");
	});
});

//Firebase to listen for user status changes//
firebase.auth().onAuthStateChanged(function (user) {
	if (user) {
		$showLogin.hide();
		$showSignUp.hide();
		//firebase.getProfile(user.uid).then(){window.location = /matches}
		profilePath.orderByChild("userID").equalTo(user.uid).on("value", function (snapshot) {
			getProfile(snapshot);
		});
		console.log(user.uid);
		console.log("User Signed In");
	} else {
		console.log("User Signed Out");
	}
});

///SUBMIT PROFILE AND SET IN FIREBASE//
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
		displayName: user.displayName
	};
	database.ref("/profile").push().set(userProfile);
	console.log(userProfile);
}

database.ref("/profile").on("child_added", function (snapshot) {
	// console.log(snapshot.val());
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
	$(".sun-sign").html($sunSign);
	$("#showProfile").html("Name: "+ $firstName + "<br>" + "Gender: "+ $gender + "<br>" + "About Me: "+ $aboutYou);
	bestMatches($sunSign);
	console.log("Matches: " + match1 + " " + match2 + " " + match3);
}

//FUNCTION TO DETERMINE MOST COMPATIBLE SIGNS
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

//CREATE BUTTONS IN DOM WHICH CARRY MATCH1-3 VALUES AS THEIR DATA-PROPERTY
function renderButtons() {
	for (var i = 0; i < matchArray.length; i++) {
		var matchButtons = $("<button>");
		matchButtons.attr("id", "matchBtn");
		matchButtons.attr("data-matchvalue", matchArray[i]);
		$("#displayButtons").append(matchButtons);
	}
}

//CLICKING ON A MATCH BUTTON DISPLAYS USER PROFILES THAT HAVE THAT SIGN
$(document).on("click", "#matchBtn", function () {
	var sign = $(this).attr("data-matchvalue")
	getMatches(sign)
})

function getMatches(sign) {
	console.log(sign);
	profilePath.orderByChild("sunSign").equalTo(sign).once("value").then(function (snapshot) {
		snapshot.forEach(function (data) {
			var matchData = data.val();
			// var key = data.key;
			console.log(matchData);
			var matchName = matchData.firstName;
			var matchSign = matchData.sunSign;
			var matchGender = matchData.gender;
			var matchSeeking = matchData.relationship;
			var matchAbout = matchData.aboutYou;
			// console.log("Match info: " + matchName + " " + matchSign + " " + matchGender + " " + matchSeeking + " " + matchAbout);
			//Sort Profiles for Gender Preferences//
			function sortByGender() {
				if (($seeking === "f/m") && (matchSeeking === "m/f")) {
					console.log(matchName);
					matchTable();
				} else if ($seeking === "m/f" && matchSeeking === "f/m") {
					console.log(matchName);
					matchTable();
				} else if ($seeking === "m/m" && matchSeeking === "m/m") {
					console.log(matchName);
					matchTable();
				} else if ($seeking === "f/f" && matchSeeking === "f/f") {
					console.log(matchName);
					matchTable();
				} else { }
			}
			function matchTable() {
				var newRow = $("<tr>").append(
					$("<td>").text(matchSign),
					$("<td>").text(matchName),
					$("<td>").text(matchAbout),
				)
				//Add the new row to the table body
				$("tbody").append(newRow);
			}
			sortByGender();
		});
	});
}

// DO WE NEED THIS? Or can this be included in getProfile Function?//
// function displayUser() {
// 	var user = firebase.auth().currentUser;
// 	var displayName, email, photoUrl, uid;
// 	if (user != null) {
// 		displayName = user.displayName;
// 		email = user.email;
// 		photoUrl = user.photoURL;
// 		uid = user.uid;
// 		$("#showProfile").html(displayName + "<br>" + email);
// 	}
// }


///////////////////REFERENCES CODE/////////////////////////////
//REFERENCE: LOOP Attempt - Returned most recent value only - switched to forEach
// 	profilePath.orderByChild("sunSign").equalTo(sign).on("value", function (matchData) {
	//  console.log('snapshot: ', matchData.val());
	// 		matchData = matchData.val();
	// 		for (var key in matchData) {
		// 			var matchName = matchData[key].firstName;
		// 			var matchSign = matchData[key].sunSign;
		// 			var matchGender = matchData[key].gender;
		// 			var matchSeeking = matchData[key].relationship;
		// 			var matchAbout = matchData[key].aboutYou;
		//    }
		// 		console.log("Match info: " + matchName + " " + matchSign + " " + matchGender + " " + matchSeeking + " " + matchAbout);

//REFERNCE: LOOP Example: 
// var query = firebase.database().ref("users").orderByKey();
		// query.once("value")
		// 	.then(function (snapshot) {
		// 		snapshot.forEach(function (childSnapshot) {
		// 			// key will be "ada" the first time and "alan" the second time
		// 			var key = childSnapshot.key;
		// 			// childData will be the actual contents of the child
		// 			var childData = childSnapshot.val();
		// 		});
		// 	});

// REFERENCE: Show Object on Child-Added
		// 	var playersRef = firebase.database().ref("players/");
		// playersRef.orderByChild("name").on("child_added", function(data) {
		//    console.log(data.val().name);
		// });