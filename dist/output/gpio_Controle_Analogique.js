"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gpio_Controle_Analogique = void 0;
const pigpio_1 = require("pigpio");
const delaytimes_1 = require("delaytimes");
class Gpio_Controle_Analogique {
    state = Promise.resolve(false);
    gpio;
    pin;
    animation;
    /**
     * Constructor
     * Initializes the relay object and sets the initial state to off
     * @param pin the pin number of the relay
     */
    constructor(pin = 35) {
        this.gpio = new pigpio_1.Gpio(pin, { mode: pigpio_1.Gpio.OUTPUT });
        this.pin = pin;
        this.animation = false;
        this.gpio.pwmWrite(0);
    }
    /**
     * Turns the relay on
     */
    async turnOn(time = 1000, step = 10) {
        return await this.state.then(async (value) => {
            if (!value) {
                this.state = new Promise((resolve, reject) => {
                    return this.setDutyCycleProgressive(255).then(() => {
                        resolve(true);
                        return;
                    });
                });
            }
        });
    }
    /**
     * Turns the relay off
     */
    async turnOff(time = 1000, step = 10) {
        return await this.state.then(async (value) => {
            if (value) {
                this.state = new Promise((resolve, reject) => {
                    return this.setDutyCycleProgressive(0).then(() => {
                        resolve(false);
                        return;
                    });
                });
            }
        });
    }
    async setDutyCycleProgressive(pwmRange, time = 1000, step = 10) {
        const currentDutyCycle = this.gpio.getPwmDutyCycle();
        const rangeDiff = Math.abs(pwmRange - currentDutyCycle);
        const delayMs = time / (rangeDiff / step);
        const rangeStep = Math.min(rangeDiff, step);
        const stepValue = rangeDiff / step;
        if (currentDutyCycle < pwmRange) {
            for (let i = currentDutyCycle; i <= Math.min(pwmRange, 255); i += stepValue) {
                this.gpio.pwmWrite(Math.round(i));
                await (0, delaytimes_1.delay)(delayMs);
            }
        }
        else {
            for (let i = Math.max(currentDutyCycle, 255); i >= pwmRange; i -= stepValue) {
                this.gpio.pwmWrite(Math.round(i));
                await (0, delaytimes_1.delay)(delayMs);
            }
        }
    }
    /**
     * Returns the pin number of the relay
     */
    getPin() {
        return this.pin;
    }
    switch() {
        this.state.then((value) => {
            if (value) {
                this.turnOff();
            }
            else {
                this.turnOn();
            }
        });
    }
    turn(stat) {
        if (stat) {
            this.turnOn();
        }
        else {
            this.turnOff();
        }
    }
    async pulse(durationOn = 1000, durationOff = 1000, step = 1, count) {
        const half = Math.round(durationOn / 2);
        count = count ?? 0;
        await this.turnOn(half);
        await this.turnOff(half);
        await (0, delaytimes_1.delay)(durationOff);
        count++;
        count < step ? await this.pulse(durationOn, durationOff, step, count) : await (0, delaytimes_1.delay)(100);
    }
}
exports.Gpio_Controle_Analogique = Gpio_Controle_Analogique;
