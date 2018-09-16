import * as messaging from "messaging";

const locationData = {
  userId: 'User2',
  highfives: 0,
  data: {
    fitbit_id: 'TestFitBit2',
    location: [52.518613, 13.408056]
  }
}

postData('https://us-central1-hackthenorth2018-78beb.cloudfunctions.net/addUserLocation', locationData)
  .then(data => console.log(JSON.stringify(data))) 
  .catch(error => console.error(error));

function postData(url = ``, data = {}) {
    return fetch(url, {
        method: "POST", 
        // mode: "cors", // no-cors, cors, *same-origin
        // credentials: "same-origin", // include, same-origin, *omit
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            "auth": "6KQZ7S9Htgw7nmySVuq774dBcZ8G0kEkGjewwuIh"
        },
        body: JSON.stringify(data),
    })
    .then(response => response.json());
}

function setHighfive(meetingId) {
  fetch('https://us-central1-hackthenorth2018-78beb.cloudfunctions.net/setHighfive?meetingId=' + meetingId, {
    method: 'GET',
    headers: {
      "Content-Type": "application/json",
      "auth": "6KQZ7S9Htgw7nmySVuq774dBcZ8G0kEkGjewwuIh"
    }
  })
}

function updateUserHighfive() {
  fetch('https://us-central1-hackthenorth2018-78beb.cloudfunctions.net/updateUserHighfives', {
        method: "POST", 
        // mode: "cors", // no-cors, cors, *same-origin
        // credentials: "same-origin", // include, same-origin, *omit
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            "auth": "6KQZ7S9Htgw7nmySVuq774dBcZ8G0kEkGjewwuIh"
        },
        body: JSON.stringify({
          userId: locationData.userId,
          highfives: locationData.highfives + 1
        }),
    })
    .then(response => response.json());
}

function queryMeetings() {
  fetch('https://us-central1-hackthenorth2018-78beb.cloudfunctions.net/getMeetings?userId=User2', {
    method: 'GET',
    headers: {
      "Content-Type": "application/json",
      "auth": "6KQZ7S9Htgw7nmySVuq774dBcZ8G0kEkGjewwuIh"
    }
  })
  .then(function (response) {
      response.json()
      .then(function(data) {
        returnMeetingsData(data);
      });
  })
  .catch(function (err) {
    console.log("Error fetching meetings: " + err);
  });
}

// Send the weather data to the device
function returnMeetingsData(data) {
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    // Send a command to the device
    messaging.peerSocket.send(data);
  } else {
    console.log("Error: Connection is not open");
  }
}

// Listen for messages from the device
messaging.peerSocket.onmessage = function(evt) {
  if (evt.data && evt.data.command == "meetings") {
    // The device requested weather data
    queryMeetings();
  }
  if (evt.data && evt.data.command == "highfive") {
    setHighfive(evt.data.meetingId);
    updateUserHighfive()
  }
}

// Listen for the onerror event
messaging.peerSocket.onerror = function(err) {
  // Handle any errors
  console.log("Connection error: " + err.code + " - " + err.message);
}
