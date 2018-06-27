
// Initialize Firebase
var config = {
    apiKey: "AIzaSyBBZuk2NAglUsKhsmyaJ8ciosb10W7scEk",
    authDomain: "traindemo-sujatha012.firebaseapp.com",
    databaseURL: "https://traindemo-sujatha012.firebaseio.com",
    projectId: "traindemo-sujatha012",
    storageBucket: "",
    messagingSenderId: "904761802088"


};
firebase.initializeApp(config);

var Train = {};

Train =	({

    startTimer: function () {
        setInterval('window.location.reload()', 60000);
    },



});

$(document).ready(function () {
    Train.startTimer();
});


// Create a variable to reference the database.
var database = firebase.database();

// -----------------------------

//button to add new trains
$('#newTrainBtn').on('click', function(){

  var trainName = $('#trainNameInput').val().trim();
	var destination = $('#destInput').val().trim();
	var firstTrain = $('#firstTrainInput').val().trim();
	var frequency = $('#freqInput').val().trim();

	if(trainName === "" | destination === "" | firstTrain === "" | frequency === "") return;

  // Creates local "temporary" object for holding train data
	var newTrain = {
		name: trainName,
		dest: destination,
		first: firstTrain,
		freq: frequency
	}

  //Uploads train data to the database
	database.ref().push(newTrain);

	console.log(newTrain.name);
	console.log(newTrain.dest);
	console.log(newTrain.first);
  console.log(newTrain.freq);
  
  // Clears all of the text-boxes
	$('#trainNameInput').val("");
	$('#destInput').val("");
	$('#firstTrainInput').val("");
	$('#freqInput').val("");

return false;
})

// $('#removeTrain').on('click', function(){
//
// })


database.ref().on("child_removed", function(childSnapshot) {
    console.log(childSnapshot.val());
});
// Creates a Firebase event for adding trains to the database and a row in the html
database.ref().on("child_added", function(childSnapshot){
	console.log(childSnapshot.val());

	// Store everything into a variable
	var trainName = childSnapshot.val().name;
	var destination = childSnapshot.val().dest;
	var firstTrain = childSnapshot.val().first;
	var frequency = childSnapshot.val().freq;
	var trainData= [
		trainName,
		destination,
		firstTrain,
		frequency
	];
	// Train info
	console.log(trainName);
	console.log(destination);
	console.log(firstTrain);
	console.log(frequency);

	//First time
	var firstTimeConverted = moment(firstTrain, "hh:mm A").subtract(1, "years");
	console.log(firstTimeConverted);

	// Current time
	var currentTime = moment();
	console.log("CURRENT TIME:" + moment(currentTime).format("HH:mm"));

	// Difference between times
	var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
	console.log("DIFFERENCE IN TIME: " + diffTime);

	// Time apart (remainder)
	var tRemainder = diffTime % frequency;
	console.log(tRemainder);

	// Mins until train
	var tMinutesTillTrain = frequency - tRemainder;
	console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

	// Next train
	var nextTrain = moment().add(tMinutesTillTrain, "minutes").format("hh:mm A");
	console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm A"));


	$("#trainTable > tbody").append("<tr><td><a href='#' id='removeTrain' data-train='"+ trainData + "'>-</a></td><td>" + trainName + "</td><td>" + destination  + "</td><td>" + frequency + "</td><td>" + nextTrain + "</td><td>" + tMinutesTillTrain + "</td></tr>");
	$("a").bind("click", function () {
        var train = $(this).attr("data-train").split(",");

		var delQueryRef = database.ref().orderByChild('name').equalTo(train[0]);
		delQueryRef.on('child_added', function(snapshot) {
            snapshot.ref.remove();
            location.reload();
        });
        return true;
    })
});
