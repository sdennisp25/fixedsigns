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
var soundArray = [];
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
var rejectee;
var rejecteeID;
var rejector;
var rejectorID;
var signSound;


//pulls from the soundapi.js api to pull sound
var key = "4xpUB6VVkPsCPCmEeeyydBPJ47x4PWetDO6VrWnM";
window.onload = function () {
	freesound.setToken(key);
};

// ////Parsley.js////
$(document).ready(function () {
	$("#accountForm").parsley();
});

///////////////LISTENING FOR USER STATUS CHANGE///////////////////
//Firebase to listen for user status changes//
firebase.auth().onAuthStateChanged(function (user) {
	if (user) {
		$showLogin.hide();
		$showSignUp.hide();
		profilePath.orderByChild("userID").equalTo(user.uid).on("value", function (snapshot) {
			getProfile(snapshot);
		});
		console.log(user.uid);
		console.log("User Signed In");
	} else {
		console.log("User Signed Out");
	}
});

//////////////////////////////CREATE FUNCTIONS/////////////////////////////

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
	//Display profile information in the DOM as needed
	$(".sun-sign").html($sunSign);
	$("#sunSignPic").attr("src", "images/" + $sunSign + ".png");
	$("#showProfile").html("Name: " + $firstName + "<br>" + "Gender: " + $gender + "<br>" + "About Me: " + $aboutYou);
	$("#signDescription").html(description[$sunSign]);
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
	console.log("Your Sound: ", signSound);
	console.log(matchArray);
	renderButtons();
}

//THESE WILL RE-ASSIGN THE SOUND VALUE TO HAVE IT PASSED THROUGH THE API TO PULL THE SOUND
function zodiacSounds(sign) {
	if (sign === "Aquarius") {
		signSound = "water";
	}
	else if (sign === "Pisces") {
		signSound = "fish";
	}
	else if (sign === "Aries") {
		signSound = "yelling";
	}
	else if (sign === "Taurus") {
		signSound = "smash";
	}
	else if (sign === "Gemini") {
		signSound = "talking";
	}
	else if (sign === "Cancer") {
		signSound = "digging";
	}
	else if (sign === "Leo") {
		signSound = "roar";
	}
	else if (sign === "Virgo") {
		signSound = "swords";
	}
	else if (sign === "Libra") {
		signSound = "weights";
	}
	else if (sign === "Scorpio") {
		signSound = "bugs";
	}
	else if (sign === "Sagittarius") {
		signSound = "horses";
	}
	else if (sign === "Capricorn") {
		signSound = "goat";
	}
}

//CREATE BUTTONS IN DOM WHICH CARRY MATCH1-3 VALUES AS THEIR DATA-PROPERTY
function renderButtons() {
	for (var i = 0; i < matchArray.length; i++) {
		var matchButtons = $("<img>");
		matchButtons.attr("id", "matchBtn");
		matchButtons.attr("data-matchvalue", matchArray[i]);
		matchButtons.attr("src", "images/" + matchArray[i] + ".png");
		var buttonLabel = $("<h2>")
		buttonLabel.html("    " + matchArray[i]);
		$("#displayButtons").append(matchButtons);
		$("#displayLabel").append(buttonLabel);
	}
}
//RETRIEVE PROFILES FOR THE SUNSIGN SELECTED/
function getMatches(sign) {
	console.log(sign);
	profilePath.orderByChild("sunSign").equalTo(sign).once("value").then(function (snapshot) {
		snapshot.forEach(function (data) {
			var matchData = data.val();
			// console.log(matchData);
			matchName = matchData.firstName;
			matchSign = matchData.sunSign;
			matchSeeking = matchData.relationship;
			matchAbout = matchData.aboutYou;
			matchID = matchData.userID;
			matchEmail = matchData.userEmail;
			matchDisplayName = matchData.displayName;
			//Sort Profiles for Gender Preferences//
			sortByGender();
			//-----------SOUND API START-----------------------------------------
			console.log("SOUND: ", signSound);
			var queryURL = "https://freesound.org/apiv2/search/text/?query=" + signSound + "&token=" + key;

			$.ajax({
				url: queryURL,
				method: "GET"
			}).then(function (response) {
				var d = response.results[0].id

				freesound.getSound(d, function (sound) {
					//grab my audio tag and add mp3
					var test = sound.previews["preview-hq-mp3"];
					var a = new Audio(test);
					a.play();
					// console.log("Sound URL: ", test);
					// console.log("a: ", a);
					// console.log("test: ", sound);
				})
			})
		});
	});
	//---------------SOUND API END-------------------------------------

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

//CONFIRM NO MATCHES DISPLAY THAT ARE ALREADY IN THE EXCLUDED PAIRS FOLDER IN FIREBASE//
function checkIfDenied(userID) {
	//CHECK FIRST TO SEE IF USER DENIED ANY MATCHES//
	database.ref("/excluded").orderByChild("denierID").equalTo(userID).once("value").then(function (snapshot) {
		snapshot.forEach(function (sv) {
			var sv = sv.val();;
			console.log(sv);
			denier = sv.denier;
			denierID = sv.denierID;
			denied = sv.denied;
			deniedID = sv.deniedID;
			console.log("denierID: " + denierID + "userID: " + userID);
		});
		//HIDE ROWS ON THE MATCH TABLE//
		if ((userID === denierID) || (matchName === denied)) {
			console.log("no match allowed: " + denier + " denied: " + denied);
			$("tr[data-rowid=" + denied + "]").hide();
		} else if ((userID === deniedID) || (matchName === denier)) {
			console.log("no match allowed: " + denier + " denied: " + denied);
			$("tr[data-rowid=" + denier + "]").hide();
		}
	});
}

// THEN CHECK IF THE USER HAS BEEN DENIED BY ANOTHER USER//
function checkIfWasDenied(userID) {
	database.ref("/excluded").orderByChild("deniedID").equalTo(userID).once("value").then(function (snapshot) {
		snapshot.forEach(function (sv) {
			var sv = sv.val();;
			console.log(sv);
			rejector = sv.denier;
			rejectorID = sv.denierID;
			rejectee = sv.denied;
			rejecteeID = sv.deniedID;
		});
		//HIDE ROWS ON THE MATCH TABLE//
		if ((userID === rejecteeID) || (matchName === rejector)) {
			console.log("no match allowed: " + rejector + " denied: " + rejectee);
			$("tr[data-rowid=" + rejector + "]").hide();
		}
	});
}

//APPEND THE SORTED MATCHES TO THE MATCH TABLE IN THE DOM
function matchTable() {
	//CREATE A LINK THAT WILL ALLOW USERS TO EMAIL A MATCH//
	var contactLink = $("<a>");
	contactLink.text("Send Email");
	contactLink.attr("href", "Mailto:" + matchEmail);
	//CREATE A BUTTON THAT ALLOWS THE USER TO REMOVE A MATCH//
	var excludeBtn = $("<button>");
	excludeBtn.attr("data-matchname", matchName);
	excludeBtn.attr("data-matchid", matchID);
	excludeBtn.attr("id", "excludeBtn");
	var newRow = $("<tr>")
	newRow.attr("data-rowid", matchName).append(
		$("<td>").text(matchSign),
		$("<td>").text(matchName),
		$("<td>").text(matchAbout),
		$("<td>").append(contactLink),
		$("<td>").append(excludeBtn),
	)
	//Add the new row to the table body
	$("tbody").append(newRow);
	//DO NOT DISPLAY ANY MATCHES WHERE THE USER REMOVED A MATCH OR HAS BEEN REMOVED//
	console.log("Current Match Name: " + matchName);
	checkIfDenied(userID);
	checkIfWasDenied(userID);
}

//////////////////////////CALL FUNCTIONS//////////////////////////////
$("#matchPage").on("click", function () {
	window.location.href = "./matches.html";
})

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
	$("#profile").hide();
	firebase.auth().signInWithEmailAndPassword(email, password).catch(function (error) {
		var errorCode = error.code;
		var errorMessage = error.message;
		console.log("Error: " + errorCode + " Message: " + errorMessage);
	});
});

///SUBMIT PROFILE AND SET IN FIREBASE//
$("#profileSubmit").on("click", function () {
	window.location.href = "./matches.html";
	event.preventDefault();
	setProfile();
})

//Sign out of Firebase using Navbar-Sign Out
$signOut.on("click", function () {
	event.preventDefault();
	firebase.auth().signOut().then(function () {
		console.log("Sign Out Successful");
		matchArray = [];
	}).catch(function (error) {
		console.log("Error Signing Out");
	});
	window.location.href = "./index.html";
});

//IF USERS CLICKS "REMOVE" BUTTON, PROFILE REMOVED FROM DOM & SENT TO EXCLUDED FILE IN FIREBASE
$(document).on("click", "#excludeBtn", function () {
	this.closest("tr").remove();
	denier = $firstName;
	denierID = userID;
	denied = $(this).attr("data-matchname");
	deniedID = $(this).attr("data-matchid");
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

//CLICKING ON A MATCH BUTTON DISPLAYS USER PROFILES THAT HAVE THAT SIGN
$(document).on("click", "#matchBtn", function () {
	event.preventDefault();
	var sign = $(this).attr("data-matchvalue");
	signSound = $(this).attr("data-matchvalue");
	console.log(sign);
	getMatches(sign);
	zodiacSounds(sign);
})
