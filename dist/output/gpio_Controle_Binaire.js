"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gpio_Controle_Binaire = void 0;
const pigpio_1 = require("pigpio");
const delaytimes_1 = require("delaytimes");
/**
 * Relay class
 * Wraps the functionality of a relay connected to a Raspberry Pi
 */
class Gpio_Controle_Binaire {
    state = Promise.resolve(false);
    gpio;
    pin;
    /**
     * Constructor
     * Initializes the relay object and sets the initial state to off
     * @param pin the pin number of the relay
     */
    constructor(pin = 35) {
        this.gpio = new pigpio_1.Gpio(pin, { mode: pigpio_1.Gpio.OUTPUT });
        this.pin = pin;
        this.state = Promise.resolve(false);
        this.gpio.digitalWrite(0);
    }
    /**
     * Turns the relay on
     */
    async turnOn() {
        this.gpio.digitalWrite(0);
        this.state = Promise.resolve(true);
        return Promise.resolve(true);
    }
    /**
     * Turns the relay off
     */
    async turnOff() {
        this.gpio.digitalWrite(1);
        this.state = Promise.resolve(false);
        return Promise.resolve(false);
    }
    /**
     * Returns the current state of the relay
     */
    getState() {
        return this.state;
    }
    /**
     * Returns the pin number of the relay
     */
    getPin() {
        return this.pin;
    }
    switch() {
        if (!this.state) {
            return this.turnOn();
        }
        else {
            return this.turnOff();
        }
    }
    turn(stat) {
        if (stat) {
            return this.turnOn();
        }
        else {
            return this.turnOff();
        }
    }
    async pulse(durationOn = 1000, durationOff = 1000, step = 1, count) {
        count = count ?? 0;
        await this.turnOn();
        await (0, delaytimes_1.delay)(durationOn);
        await this.turnOff();
        await (0, delaytimes_1.delay)(durationOff);
        count++;
        count < step ? await this.pulse(durationOn, durationOff, step, count) : await (0, delaytimes_1.delay)(100);
    }
}
exports.Gpio_Controle_Binaire = Gpio_Controle_Binaire;
