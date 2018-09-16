import * as messaging from "messaging";
import document from "document"
import { Accelerometer } from "accelerometer";

// Create a new accelerometer, sampling at 1hz (once per second)
var accel = new Accelerometer({ frequency: 5 });
let readings = []
let meetingId = 0

// UI slider
let container = document.getElementById("container");

// Get the selected index
let currentIndex = container.value;

// Set the selected index
container.value = 0; // jump to first slide

accel.onreading = function() {
  
  readings.unshift({
    timestamp: accel.timestamp,
    x: accel.x,
    y: accel.y,
    z: accel.z
  })
  
  if (readings.length > 10) {
    readings.pop()
  }
  
  const threshold = 4
  const filteredReadings = readings.filter((reading) => {
    if (reading.x > threshold && reading.z > threshold) {
      return true
    } else {
      return false
    }
  })

  console.log(JSON.stringify(filteredReadings))
  if (filteredReadings.length > 0) {
    let container = document.getElementById("container");

    // Get the selected index
    let currentIndex = container.value;

    // Set the selected index
    container.value = 4; // jump to first slide
    sendHighfive()  
  }
  

//   console.log('x1 ' + readings[0].x, ' | y1 ' + readings[0].y, ' | z1 ' + readings[0].z)
//   console.log('x2 ' + readings[1].x, ' | y2 ' + readings[1].y, ' | z2 ' + readings[1].z)
//   console.log('x3 ' + readings[2].x, ' | y3 ' + readings[2].y, ' | z3 ' + readings[2].z)
//   console.log('---------------------------------------------------------------')
}

accel.start();

function fetchMeetings() {
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    messaging.peerSocket.send({
      command: 'meetings'
    });
  }
}

function sendHighfive() {
 if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
   messaging.peerSocket.send({
     command: 'highfive',
     meetingId: meetingId
   })
 } 
}

function processMeetingsData(data) {
  console.log("The data is: " + data.userId + " | " + data.nextMeetingUserId);
  let container = document.getElementById("container");

  // Get the selected index
  let currentIndex = container.value;

  // Set the selected index
  container.value = 3; // jump to first slide
  meetingId = data.meetingId
}

messaging.peerSocket.onopen = function() {
  fetchMeetings();
}

messaging.peerSocket.onmessage = function(evt) {
  if (evt.data) {
    processMeetingsData(evt.data);
  }
}

messaging.peerSocket.onerror = function(err) {
  console.log("Connection error: " + err.code + " - " + err.message);
}

setInterval(fetchMeetings, 5000);