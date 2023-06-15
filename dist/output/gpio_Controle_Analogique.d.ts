import { IGpio_Control } from "./IGpio_Control";
export declare class Gpio_Controle_Analogique implements IGpio_Control {
    state: Promise<boolean>;
    private gpio;
    private readonly pin;
    private animation;
    /**
     * Constructor
     * Initializes the relay object and sets the initial state to off
     * @param pin the pin number of the relay
     */
    constructor(pin?: number);
    /**
     * Turns the relay on
     */
    turnOn(time?: number, step?: number): Promise<void>;
    /**
     * Turns the relay off
     */
    turnOff(time?: number, step?: number): Promise<void>;
    setDutyCycleProgressive(pwmRange: number, time?: number, step?: number): Promise<void>;
    /**
     * Returns the pin number of the relay
     */
    getPin(): number;
    switch(): void;
    turn(stat: boolean): void;
    pulse(durationOn?: number, durationOff?: number, step?: number, count?: number): Promise<void>;
}
