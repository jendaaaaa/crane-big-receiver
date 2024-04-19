// RADIO
radio.setGroup(11)

// PCA 5V PINOUT
let PCA_WINCH_INNER = PCA9685.ServoNum.Servo1
let PCA_WINCH_OUTER = PCA9685.ServoNum.Servo2
let PCA_ROTOR = PCA9685.ServoNum.Servo3
let PCA_GRIPPER = PCA9685.ServoNum.Servo4
let addr = 64

// PIN 3V3 PINOUT
let PIN_WINCH_INNER = AnalogPin.P0;
let PIN_WINCH_OUTER = AnalogPin.P1;
let PIN_ROTOR = AnalogPin.P2;
let PIN_GRIPPER = AnalogPin.P15;

// INIT
led.enable(false)
let GripperStatus = 0
let GripperRelease = 1
PCA9685.init(addr, 0)
PCA9685.setCRServoPosition(PCA_WINCH_INNER, 0, addr)
PCA9685.setCRServoPosition(PCA_WINCH_OUTER, 0, addr)
PCA9685.setCRServoPosition(PCA_ROTOR, 0, addr)
PCA9685.setServoPosition(PCA_GRIPPER, 0, addr)
PCA9685.setLedDutyCycle(PCA9685.LEDNum.LED9, 80, addr)

// MAIN
radio.onReceivedValue(function (name, value) {
    if (name == "rotate") {
        PCA9685.setCRServoPosition(PCA_ROTOR, value, addr)
        pins.servoWritePin(PIN_ROTOR, 90 + value)
    } else if (name == "inner") {
        PCA9685.setCRServoPosition(PCA_WINCH_INNER, value, addr)
        pins.servoWritePin(PIN_WINCH_INNER, 90 + value)
    } else if (name == "outer") {
        PCA9685.setCRServoPosition(PCA_WINCH_OUTER, value, addr)
        pins.servoWritePin(PIN_WINCH_OUTER, 90 + value)
    } else if (name == "gripper") {
        if (value == 1) {
            if (GripperRelease == 1) {
                GripperStatus = 1
                GripperRelease = 0
            }
        } else {
            GripperRelease = 1
        }
    }
})

// GRIPPER
basic.forever(function () {
    if (GripperStatus == 1) {
        // close gripper
        PCA9685.setServoPosition(PCA_GRIPPER, 50, addr)
        pins.servoWritePin(PIN_GRIPPER, 50)
        PCA9685.setLedDutyCycle(PCA9685.LEDNum.LED10, 80, addr)
        PCA9685.setLedDutyCycle(PCA9685.LEDNum.LED9, 0, addr)
        basic.pause(4000)
        for (let index = 0; index < 6; index++) {
            PCA9685.setLedDutyCycle(PCA9685.LEDNum.LED10, 0, addr)
            basic.pause(400)
            PCA9685.setLedDutyCycle(PCA9685.LEDNum.LED10, 80, addr)
            basic.pause(400)
        }
        GripperStatus = 0
    } else {
        PCA9685.setLedDutyCycle(PCA9685.LEDNum.LED10, 0, addr)
        PCA9685.setLedDutyCycle(PCA9685.LEDNum.LED9, 80, addr)
        PCA9685.setServoPosition(PCA_GRIPPER, 180, addr)
        // open gripper
        pins.servoWritePin(PIN_GRIPPER, 180)
    }
})