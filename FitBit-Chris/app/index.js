// Import the messaging module
import * as messaging from "messaging";
import document from "document"

// Request weather data from the companion
function fetchMeetings() {
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    // Send a command to the companion
    messaging.peerSocket.send({
      command: 'meetings'
    });
  }
}

// Display the weather data received from the companion
function processMeetingsData(data) {
  console.log("The data is: " + data.userId + " | " + data.nextMeetingUserId);
  var title = document.getElementById('title')
  title.text = "HighFive " + data.nextMeetingUserId
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
  }
}

// Listen for the onerror event
messaging.peerSocket.onerror = function(err) {
  // Handle any errors
  console.log("Connection error: " + err.code + " - " + err.message);
}

setInterval(fetchMeetings, 5000);