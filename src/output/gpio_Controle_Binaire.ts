import {Gpio} from "pigpio";
import {IGpio_Control} from "./IGpio_Control";
import {delay} from "delaytimes";


/**
 * Relay class
 * Wraps the functionality of a relay connected to a Raspberry Pi
 */
export class Gpio_Controle_Binaire implements IGpio_Control {
    state: Promise<boolean> = Promise.resolve(false);
    private gpio: Gpio;
    private readonly pin: number;

    /**
     * Constructor
     * Initializes the relay object and sets the initial state to off
     * @param pin the pin number of the relay
     */
    constructor(pin = 35) {
        this.gpio = new Gpio(pin, {mode: Gpio.OUTPUT});
        this.pin = pin;
        this.state = Promise.resolve(false);
        this.gpio.digitalWrite(0);
    }

    /**
     * Turns the relay on
     */
    async turnOn(): Promise<boolean> {
        this.gpio.digitalWrite(0);
        this.state = Promise.resolve(true);
        return Promise.resolve(true);
    }

    /**
     * Turns the relay off
     */
    async turnOff(): Promise<boolean> {
        this.gpio.digitalWrite(1);
        this.state = Promise.resolve(false);
        return Promise.resolve(false);
    }

    /**
     * Returns the current state of the relay
     */
    getState(): Promise<boolean> {
        return this.state;
    }

    /**
     * Returns the pin number of the relay
     */
    getPin() {
        return this.pin;
    }

    switch(): Promise<boolean> {
        if (!this.state) {
            return this.turnOn();
        } else {
            return this.turnOff();
        }
    }

    turn(stat: boolean): Promise<boolean> {
        if (stat) {
            return this.turnOn();
        } else {
            return this.turnOff();
        }
    }

    async pulse(durationOn: number = 1000, durationOff: number = 1000, step: number = 1, count?: number): Promise<void> {
        count = count ?? 0;
        await this.turnOn();
        await delay(durationOn);
        await this.turnOff();
        await delay(durationOff);
        count++;
        count < step ? await this.pulse(durationOn, durationOff, step, count) : await delay(100);
    }


}
