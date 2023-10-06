led.enable(false)
let GripperStatus = 0
let GripperRelease = 1
let winchInner = PCA9685.ServoNum.Servo1
let winchOuter = PCA9685.ServoNum.Servo2
let rotor = PCA9685.ServoNum.Servo3
let gripper = PCA9685.ServoNum.Servo4
let addr = 64
radio.setGroup(92)
PCA9685.init(addr, 0)
PCA9685.setCRServoPosition(winchInner, 0, addr)
PCA9685.setCRServoPosition(winchOuter, 0, addr)
PCA9685.setCRServoPosition(rotor, 0, addr)
PCA9685.setServoPosition(gripper, 0, addr)
PCA9685.setLedDutyCycle(PCA9685.LEDNum.LED9, 80, addr)
radio.onReceivedValue(function (name, value) {
    if (name == "rotate") {
        PCA9685.setCRServoPosition(rotor, value, addr)
    } else if (name == "inner") {
        PCA9685.setCRServoPosition(winchInner, value, addr)
    } else if (name == "outer") {
        PCA9685.setCRServoPosition(winchOuter, value, addr)
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
basic.forever(function () {
    if (GripperStatus == 1) {
        PCA9685.setServoPosition(gripper, 50, addr)
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
        PCA9685.setServoPosition(gripper, 180, addr)
    }
})