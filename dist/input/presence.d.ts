import { Observable } from "rxjs";
export declare class PresenceDetector {
    isPresent: Observable<boolean>;
    private trigger;
    private echo;
    private stepThreshold;
    private readonly updateInterval;
    private step;
    private timeStep;
    private readonly MICROSECONDS_PER_CM;
    private readonly MIN_DISTANCE_TIME;
    private readonly MAX_DISTANCE_TIME;
    /**
     * Constructor for PresenceDetector class
     * @param echoPin - GPIO pin number for the echo signal of the sensor
     * @param triggerPin - GPIO pin number for the trigger signal of the sensor
     * @param updateInterval - frequency (in milliseconds) of updates for the presence detection status (default 200)
     * @param staticStateTime - time (in milliseconds) to wait for static state (default 1000)
     * @param minDistance - minimum distance (in centimeters) for presence detection
     * @param maxDistance - maximum distance (in centimeters) for presence detection
     */
    constructor(echoPin: number, triggerPin: number, minDistance: number, maxDistance: number, updateInterval?: number, staticStateTime?: number);
    /**
     * Starts the loop to detect presence using the HC-SR04 sensor
     * This function listens to the echo pin, and checks the time difference between the
     * rising edge (level 1) and falling edge (level 0) of the echo signal.
     * If the time difference is within the specified min and max distance, it increments
     * the step counter. If the step counter reaches the threshold, it sets the presence
     * status to true. If the time difference is outside of the specified min and max distance,
     * it resets the step counter and sets the presence status to false.
     */
    startPresenceDetection(): void;
    stopPresenceDetection(): void;
}
