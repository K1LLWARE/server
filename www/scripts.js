var serverSocket = new WebSocket('ws://192.168.1.103:3000');

var mousedown=false;
var pan = 0;
var tilt = 0;
var left_motor = 0;
var right_motor = 0;

update_command();

//Look Controls
document.getElementById("lookpad").addEventListener("mousedown", function(event) {
  mousedown=true;
  update_look(event);
});

document.getElementById("lookpad").addEventListener("mouseup", function(event) {
  mousedown=false;
});

document.getElementById("lookpad").addEventListener("mousemove", function(event) {
  if(mousedown) {
    update_look(event);
  }
});

function update_look(e) {
  pan = -1.0 * Math.ceil(e.offsetX / e.target.offsetWidth * 180.0 - 90.0);
  tilt = -1.0 * Math.ceil(e.offsetY / e.target.offsetHeight * 180.0 - 90.0);
  update_command();
}

//Drive Controls
document.getElementById("drivepad").addEventListener("mousedown", function(event) {
  mousedown=true;
  update_drive(event);
});

document.getElementById("drivepad").addEventListener("mouseup", function(event) {
  mousedown=false;
  stop_drive(event);
});

document.getElementById("drivepad").addEventListener("mouseout", function(event) {
  mousedown=false;
  stop_drive(event);
});

document.getElementById("drivepad").addEventListener("mousemove", function(event) {
  if(mousedown) {
    update_drive(event);
  }
});

function stop_drive(e) {
  left_motor = 0;
  right_motor = 0;
  update_command();
}

function update_drive(e) {
  var x_factor = 2.0*(e.offsetX / e.target.offsetWidth-0.5);
  var y_factor = -2.0*(e.offsetY/e.target.offsetHeight-0.5);
  
  left_motor = y_factor + x_factor;
  right_motor = y_factor - x_factor;
  left_motor = left_motor.toPrecision(2);
  right_motor = right_motor.toPrecision(2);
  
  if(left_motor>1.0){
    left_motor = 1.0
  }
  if(right_motor>1.0){
    right_motor = 1.0
  }
  if(left_motor<-1.0){
    left_motor = -1.0
  }
  if(right_motor<-1.0){
    right_motor = -1.0
  }
  update_command();
}

//Display Update

function update_command() {
  var command = {
    pan: pan,
    tilt: tilt,
    left_motor: left_motor,
    right_motor: right_motor,
  };

  if(serverSocket.readyState == 1) {
    serverSocket.send(JSON.stringify(command));
  };

  var coor = "pan: " + pan + "deg<br />tilt:" + tilt +"deg<br />left motor: "+left_motor+"<br />right motor: "+right_motor;
  document.getElementById("command_display").innerHTML = coor;
}
