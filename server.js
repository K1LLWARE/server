var express = require('express');
var app = express();
var expressWs = require('express-ws')(app);
var Gpio = require('pigpio').Gpio;

var pan_servo = new Gpio(18,{mode: Gpio.OUTPUT}); //brown
var tilt_servo = new Gpio(17,{mode: Gpio.OUTPUT}); //blue
var front_right_motor_forward = new Gpio(27,{mode: Gpio.OUTPUT}); //yellow
var front_right_motor_backward = new Gpio(22,{mode: Gpio.OUTPUT}); //green
var front_left_motor_forward = new Gpio(5,{mode: Gpio.OUTPUT}); //white
var front_left_motor_backward = new Gpio(6,{mode: Gpio.OUTPUT}); //grey
var rear_right_motor_forward = new Gpio(23,{mode: Gpio.OUTPUT}); //yellow
var rear_right_motor_backward = new Gpio(24,{mode: Gpio.OUTPUT}); //green
var rear_left_motor_forward = new Gpio(12,{mode: Gpio.OUTPUT}); //white
var rear_left_motor_backward = new Gpio(13,{mode: Gpio.OUTPUT}); //grey

app.use(express.static('www'));

app.ws('/', function(ws, req) {
    ws.on('message', function(msg) {
        var command_JSON = JSON.parse(msg);
        tilt_servo.servoWrite(Math.ceil(command_JSON.tilt/90*1000+1500));
        pan_servo.servoWrite(Math.ceil(command_JSON.pan/90*1000+1500));
        if(command_JSON.left_motor<0) {
            front_left_motor_backward.pwmWrite(Math.ceil(255*Math.abs(command_JSON.left_motor)));
            front_left_motor_forward.pwmWrite(0);
            rear_left_motor_backward.pwmWrite(Math.ceil(255*Math.abs(command_JSON.left_motor)));
            rear_left_motor_forward.pwmWrite(0);
        }
        else {
            front_left_motor_backward.pwmWrite(0);
            front_left_motor_forward.pwmWrite(Math.ceil(255*Math.abs(command_JSON.left_motor)));
            rear_left_motor_backward.pwmWrite(0);
            rear_left_motor_forward.pwmWrite(Math.ceil(255*Math.abs(command_JSON.left_motor)));
        }
        if(command_JSON.right_motor<0) {
            front_right_motor_backward.pwmWrite(Math.ceil(255*Math.abs(command_JSON.right_motor)));
            front_right_motor_forward.pwmWrite(0);
            rear_right_motor_backward.pwmWrite(Math.ceil(255*Math.abs(command_JSON.right_motor)));
            rear_right_motor_forward.pwmWrite(0);
        }
        else {
            front_right_motor_backward.pwmWrite(0);
            front_right_motor_forward.pwmWrite(Math.ceil(255*Math.abs(command_JSON.right_motor)));
            rear_right_motor_backward.pwmWrite(0);
            rear_right_motor_forward.pwmWrite(Math.ceil(255*Math.abs(command_JSON.right_motor)));
        }
    });
});

app.listen(3000);
