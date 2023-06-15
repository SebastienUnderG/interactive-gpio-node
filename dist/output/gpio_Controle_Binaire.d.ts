import { IGpio_Control } from "./IGpio_Control";
/**
 * Relay class
 * Wraps the functionality of a relay connected to a Raspberry Pi
 */
export declare class Gpio_Controle_Binaire implements IGpio_Control {
    state: Promise<boolean>;
    private gpio;
    private readonly pin;
    /**
     * Constructor
     * Initializes the relay object and sets the initial state to off
     * @param pin the pin number of the relay
     */
    constructor(pin?: number);
    /**
     * Turns the relay on
     */
    turnOn(): Promise<boolean>;
    /**
     * Turns the relay off
     */
    turnOff(): Promise<boolean>;
    /**
     * Returns the current state of the relay
     */
    getState(): Promise<boolean>;
    /**
     * Returns the pin number of the relay
     */
    getPin(): number;
    switch(): Promise<boolean>;
    turn(stat: boolean): Promise<boolean>;
    pulse(durationOn?: number, durationOff?: number, step?: number, count?: number): Promise<void>;
}
