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
var matchEmail;
var matchAbout;
var matchID;
var matchDisplayName;
var denier;
var denierID;
var denied;
var deniedID;
// var rejectee;
var rejecteeID;
// var rejector;
// var rejectorID;


// ////Parsley.js////
// $(document).ready(function () {
// 	$("#accountForm").parsley();
// });

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

//TAKE THE VALUES FROM THE PROFILE FORM AND SEND TO FIREBASE PROFILE FOLDER
function setProfile() {
	//Retrieve Values//
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
		userEmail: user.email,
		userID: user.uid,
		displayName: user.displayName
	};
	//Push to Firebase location
	database.ref("/profile").push().set(userProfile);
	console.log(userProfile);
	//LISTEN for new additions to the PROFILE folder in Firebase
	database.ref("/profile").on("child_added", function (snapshot) {
		// console.log(snapshot.val());
	})
}

//RETRIEVE THE USER'S PROFILE FROM FIREBASE///Call this on the AuthStateChange function//
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
	userID = profile.userID;
	displayName = profile.displayName;
	userEmail = profile.userEmail;
	// console.log($firstName, $lastName, $sunSign, $gender, $seeking, $aboutYou, userID, displayName);
	//Display profile information in the DOM as needed
	$(".sun-sign").html($sunSign);
	$("#showProfile").html("Name: " + $firstName + "<br>" + "Gender: " + $gender + "<br>" + "About Me: " + $aboutYou);
	bestMatches($sunSign);
	console.log("Matches: " + match1 + " " + match2 + " " + match3);
}

//DETERMINE MOST COMPATIBLE SIGNS
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
	//PUSH MATCHES INTO AN ARRAY, THEN RENDER BUTTONS FOR EACH MATCH
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

//RETRIEVE PROFILES FOR THE SUNSIGN SELECTED/
function getMatches(sign) {
	console.log(sign);
	profilePath.orderByChild("sunSign").equalTo(sign).once("value").then(function (snapshot) {
		snapshot.forEach(function (data) {
			var matchData = data.val();
			// var key = data.key;
			console.log(matchData);
			matchName = matchData.firstName;
			matchSign = matchData.sunSign;
			matchSeeking = matchData.relationship;
			matchAbout = matchData.aboutYou;
			matchID = matchData.userID;
			matchEmail = matchData.userEmail;
			matchDisplayName = matchData.displayName;
			// console.log("Match info: " + matchName + " " + matchSign + " " + matchGender + " " + matchSeeking + " " + matchAbout);
			//Sort Profiles for Gender Preferences//
			sortByGender();
			setExclusions();
		});
	});

	//SORT PROFILE MATCHES BASED ON TYPE OF RELATIONSHIP BEING SAUGHT
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
}

//APPEND THE SORTED MATCHES TO THE MATCH TABLE IN THE DOM
function matchTable() {
	// var contactBtn = $("<button>")
	// contactBtn.attr("data-matchid", matchID);
	// contactBtn.attr("id", "contactBtn");
	//CREATE A LINK THAT WILL ALLOW USERS TO EMAIL A MATCH//
	var contactLink = $("<a>");
	contactLink.text("Send Email");
	contactLink.attr("href", "Mailto:" + matchEmail);
	//CREATE A BUTTON THAT ALLOWS THE USER TO REMOVE A MATCH//
	var excludeBtn = $("<button>");
	excludeBtn.attr("data-matchid", matchID);
	excludeBtn.attr("id", "excludeBtn");
	var newRow = $("<tr>")
	newRow.attr("data-rowid", matchID).append(
		$("<td>").text(matchSign),
		$("<td>").text(matchName),
		$("<td>").text(matchAbout),
		$("<td>").append(contactLink),
		$("<td>").append(excludeBtn),
	)
	//Add the new row to the table body
	$("tbody").append(newRow);
	//DO NOT DISPLAY ANY MATCHES WHERE THE USER REMOVED A MATCH OR HAS BEEN REMOVED//
	checkIfMatchAllowed(userID);
}

//IF USERS CLICKS "REMOVE" BUTTON, PROFILE REMOVED FROM DOM & SENT TO EXCLUDED FILE IN FIREBASE
function setExclusions() {
	$("#excludeBtn").on("click", function () {
		this.closest("tr").remove();
		denier = displayName;
		denierID = userID;
		denied = matchDisplayName;
		deniedID = matchID;
		console.log(denier + " denies: " + denied);
		var deniedPair = {
			denier: denier,
			denierID: denierID,
			denied: denied,
			deniedID: deniedID,
		}
		database.ref("/excluded").push().set(deniedPair);
	});
	database.ref("/excluded").on("child_added", function (snapshot) {
	});
}

//CONFIRM NO MATCHES DISPLAY THAT ARE ALREADY IN THE EXCLUDED PAIRS FOLDER IN FIREBASE//
function checkIfMatchAllowed(userID) {
	//CHECK FIRST TO SEE IF USER DENIED ANY MATCHES//
	database.ref("/excluded").orderByChild("denierID").equalTo(userID).once("value").then(function (snapshot) {
		snapshot.forEach(function (sv) {
			var sv = sv.val();;
			console.log(sv);
			denier = sv.denier;
			denierID = sv.denierID;
			denied = sv.denied;
			deniedID = sv.deniedID;
			console.log(denier + " denied " + denied);
		});
		//THEN CHECK IF THE USER HAS BEEN DENIED BY ANOTHER USER//
		checkForDenied(userID);
	});
	function checkForDenied(userID) {
		database.ref("/excluded").orderByChild("deniedID").equalTo(userID).once("value").then(function (snapshot) {
			snapshot.forEach(function (sv) {
				var sv = sv.val();;
				console.log(sv);
				var rejector = sv.denier;
				// var rejectorID = sv.denierID;
				var rejectee = sv.denied;
				rejecteeID = sv.deniedID;
				console.log(rejector + " denied " + rejectee);
			});
			//HIDE ROWS ON THE MATCH TABLE//
			if ((userID === rejecteeID) || (matchID === deniedID)) {
				console.log("no match allowed");
				$("tr[data-rowid=" + matchID+"]").hide();
			}
		});
	}
}

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