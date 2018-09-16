import { geolocation } from "geolocation";

console.log ("companion launched");

let lat = 0
let lon = 0
function locationSuccess(position) {
  lat = position.coords.latitude;
  lon = position.coords.longitude;
  console.log(`Latitude: ${lat}\nLongitude: ${lon}`);
}

function locationError(error) {
  console.log(`Error: ${error.code}\nMessage: ${error.message}`);
}
const location = locationSuccess()
let watcherID = geolocation.watchPosition(locationSuccess, locationError);

var url = 'https://us-central1-hackthenorth2018-78beb.cloudfunctions.net/addUserLocation'
var data = 
fetch(url, {
  method: 'POST', // or 'PUT'
  body: JSON.stringify({
    userID: "Test1",
    data: {
      fitbit_id: "FB1",
      location: [lat, lon]
    }
  }),
  headers:{
    'Content-Type': 'application/json',
    'auth': '6KQZ7S9Htgw7nmySVuq774dBcZ8G0kEkGjewwuIh'
  }
}).then(res => res.json())
.then(response => console.log('Success:', JSON.stringify(response)))
.catch(error => console.error('Error:', error));