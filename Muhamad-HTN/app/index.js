import { Accelerometer } from "accelerometer";

// Create a new accelerometer, sampling at 1hz (once per second)
var accel = new Accelerometer({ frequency: 1 });

accel.onreading = function() {

  // Peek the current sensor values
  console.log(JSON.stringify({ x: accel.x, y: accel.y, z: accel.z }));

  // Stop monitoring the sensor
}
accel.start();
// Begin monitoring the sensor

setInterval(function(){   accel.stop(); }, 1000);


