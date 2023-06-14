import {Gpio} from "pigpio";
import {Observable, Subscriber} from "rxjs";

// HC-SR04
export class PresenceDetector {
    public isPresent: Observable<boolean> = new Observable<boolean>();

    private trigger: Gpio;
    private echo: Gpio;

    // Thresholds for presence detection
    private stepThreshold: number;
    private readonly updateInterval: number;

    // Variables for tracking presence status
    private step: number = 0;
    private timeStep: number = 0;

    // Constants for calculating distance from time
    private readonly MICROSECONDS_PER_CM: number = 1e6 / 34321;
    private readonly MIN_DISTANCE_TIME: number;
    private readonly MAX_DISTANCE_TIME: number;
    /**
     * Constructor for PresenceDetector class
     * @param echoPin - GPIO pin number for the echo signal of the sensor
     * @param triggerPin - GPIO pin number for the trigger signal of the sensor
     * @param updateInterval - frequency (in milliseconds) of updates for the presence detection status (default 200)
     * @param staticStateTime - time (in milliseconds) to wait for static state (default 1000)
     * @param minDistance - minimum distance (in centimeters) for presence detection
     * @param maxDistance - maximum distance (in centimeters) for presence detection
     */
    constructor(echoPin: number,
                triggerPin: number,
                minDistance: number,
                maxDistance: number,
                updateInterval: number = 200,
                staticStateTime: number = 1000
    ) {

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
        this.trigger = new Gpio(triggerPin, {mode: Gpio.OUTPUT});
        this.echo = new Gpio(echoPin, {mode: Gpio.INPUT, alert: true});
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
    public startPresenceDetection() {
        let startTick: number;

        this.isPresent = new Observable<boolean>((observer: Subscriber<boolean>) => {
            this.echo.on("alert", (level: number, tick: number) => {
                if (level === 1) {
                    startTick = tick;
                } else {
                    const diff: number = tick - startTick;

                    if (diff <= this.MAX_DISTANCE_TIME && diff >= this.MIN_DISTANCE_TIME) {
                        this.step++;
                    } else {
                        this.step = 0;
                        observer.next(false);
                    }

                    if (this.step >= this.timeStep / this.updateInterval) {
                        observer.next(true);
                    }
                }
            });

        })


    }

    public stopPresenceDetection(): void {
        this.echo.removeAllListeners("alert");
        this.isPresent = new Observable<boolean>();
    }
}
