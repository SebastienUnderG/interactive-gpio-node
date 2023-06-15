"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PresenceDetector = void 0;
const pigpio_1 = require("pigpio");
const rxjs_1 = require("rxjs");
// HC-SR04
class PresenceDetector {
    isPresent = new rxjs_1.Observable();
    trigger;
    echo;
    // Thresholds for presence detection
    stepThreshold;
    updateInterval;
    // Variables for tracking presence status
    step = 0;
    timeStep = 0;
    // Constants for calculating distance from time
    MICROSECONDS_PER_CM = 1e6 / 34321;
    MIN_DISTANCE_TIME;
    MAX_DISTANCE_TIME;
    /**
     * Constructor for PresenceDetector class
     * @param echoPin - GPIO pin number for the echo signal of the sensor
     * @param triggerPin - GPIO pin number for the trigger signal of the sensor
     * @param updateInterval - frequency (in milliseconds) of updates for the presence detection status (default 200)
     * @param staticStateTime - time (in milliseconds) to wait for static state (default 1000)
     * @param minDistance - minimum distance (in centimeters) for presence detection
     * @param maxDistance - maximum distance (in centimeters) for presence detection
     */
    constructor(echoPin, triggerPin, minDistance, maxDistance, updateInterval = 200, staticStateTime = 1000) {
        if (!triggerPin || !echoPin) {
            throw new Error('Invalid GPIO parameters');
        }
        if (!minDistance || !maxDistance || !staticStateTime || !updateInterval) {
            throw new Error('Invalid distance parameters');
        }
        this.MIN_DISTANCE_TIME = minDistance * this.MICROSECONDS_PER_CM * 2;
        this.MAX_DISTANCE_TIME = maxDistance * this.MICROSECONDS_PER_CM * 2;
        this.stepThreshold = staticStateTime / updateInterval;
        this.updateInterval = updateInterval;
        this.trigger = new pigpio_1.Gpio(triggerPin, { mode: pigpio_1.Gpio.OUTPUT });
        this.echo = new pigpio_1.Gpio(echoPin, { mode: pigpio_1.Gpio.INPUT, alert: true });
        this.trigger.digitalWrite(0);
        // Start presence detection loop
        this.startPresenceDetection();
    }
    /**
     * Starts the loop to detect presence using the HC-SR04 sensor
     * This function listens to the echo pin, and checks the time difference between the
     * rising edge (level 1) and falling edge (level 0) of the echo signal.
     * If the time difference is within the specified min and max distance, it increments
     * the step counter. If the step counter reaches the threshold, it sets the presence
     * status to true. If the time difference is outside of the specified min and max distance,
     * it resets the step counter and sets the presence status to false.
     */
    startPresenceDetection() {
        let startTick;
        this.isPresent = new rxjs_1.Observable((observer) => {
            this.echo.on("alert", (level, tick) => {
                if (level === 1) {
                    startTick = tick;
                }
                else {
                    const diff = tick - startTick;
                    if (diff <= this.MAX_DISTANCE_TIME && diff >= this.MIN_DISTANCE_TIME) {
                        this.step++;
                    }
                    else {
                        this.step = 0;
                        observer.next(false);
                    }
                    if (this.step >= this.timeStep / this.updateInterval) {
                        observer.next(true);
                    }
                }
            });
        });
    }
    stopPresenceDetection() {
        this.echo.removeAllListeners("alert");
        this.isPresent = new rxjs_1.Observable();
    }
}
exports.PresenceDetector = PresenceDetector;
