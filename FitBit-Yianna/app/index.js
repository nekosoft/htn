// Import the messaging module
import * as messaging from "messaging";
import document from "document"

// UI slider
let container = document.getElementById("container");

// Get the selected index
let currentIndex = container.value;

// Set the selected index
container.value = 0; // jump to first slide



// Request data from the companion
function fetchMeetings() {
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    // Send a command to the companion
    messaging.peerSocket.send({
      command: 'meetings'
    });
  }
}

// Display the data received from the companion
// Used to update Hi 5 in range
function processMeetingsData(data) {
  console.log("The data is: " + data.userId + " | " + data.nextMeetingUserId);
  //var title = document.getElementById('title')
  //title.text = "HighFive " + data.nextMeetingUserId
  
  // change notification image
  document.getElementByClassName("ui").setAttribute("id", "item4");
  let container = document.getElementById("container");

  // Get the selected index
  let currentIndex = container.value;

  // Set the selected index
  container.value = 0; // jump to first slide
}

// Listen for the onopen event
messaging.peerSocket.onopen = function() {
  // Fetch weather when the connection opens
  fetchMeetings();
}

// Listen for messages from the companion
messaging.peerSocket.onmessage = function(evt) {
  if (evt.data) {
    processMeetingsData(evt.data);
    document.getElementByClassName("ui").setAttribute("id", "item5");
    let container = document.getElementById("container");

    // Get the selected index
    let currentIndex = container.value;

    // Set the selected index
    container.value = 0; // jump to first slide
  }
}

// Listen for the onerror event
messaging.peerSocket.onerror = function(err) {
  // Handle any errors
  console.log("Connection error: " + err.code + " - " + err.message);
}

setInterval(fetchMeetings, 5000);


