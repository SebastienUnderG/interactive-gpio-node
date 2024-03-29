import {Gpio} from "pigpio";
import {IGpio_Control} from "./IGpio_Control";
import {delay} from "delaytimes";

export class Gpio_Controle_Analogique implements IGpio_Control {
    state: Promise<boolean> = Promise.resolve(false);
    private gpio: Gpio;
    private readonly pin: number;
    private animation: boolean;

    /**
     * Constructor
     * Initializes the relay object and sets the initial state to off
     * @param pin the pin number of the relay
     */
    constructor(pin = 35) {
        this.gpio = new Gpio(pin, {mode: Gpio.OUTPUT});
        this.pin = pin;
        this.animation = false;
        this.gpio.pwmWrite(0);
    }

    /**
     * Turns the relay on
     */
    async turnOn(time = 1000, step = 10): Promise<void> {
        return await this.state.then(async (value) => {
            if (!value) {
                this.state = new Promise<boolean>((resolve, reject) => {
                    return this.setDutyCycleProgressive(255).then(() => {
                        resolve(true);
                        return;
                    })
                })
            }

        })
    }

    /**
     * Turns the relay off
     */
    async turnOff(time = 1000, step = 10): Promise<void> {
        return await this.state.then(async (value) => {
            if (value) {
                this.state = new Promise<boolean>((resolve, reject) => {
                    return this.setDutyCycleProgressive(0).then(() => {
                        resolve(false);
                        return;
                    })
                });
            }
        });
    }


    async setDutyCycleProgressive(pwmRange: number, time = 1000, step = 10): Promise<void> {

        const currentDutyCycle = this.gpio.getPwmDutyCycle();
        const rangeDiff = Math.abs(pwmRange - currentDutyCycle);
        const delayMs = time / (rangeDiff / step);

        const rangeStep = Math.min(rangeDiff, step);
        const stepValue = rangeDiff / step;

        if (currentDutyCycle < pwmRange) {
            for (let i: number = currentDutyCycle; i <= Math.min(pwmRange, 255); i += stepValue) {
                this.gpio.pwmWrite(Math.round(i));
                await delay(delayMs);
            }
        } else {
            for (let i: number = Math.max(currentDutyCycle, 255); i >= pwmRange; i -= stepValue) {
                this.gpio.pwmWrite(Math.round(i));
                await delay(delayMs);
            }
        }


    }

    /**
     * Returns the pin number of the relay
     */
    getPin(): number {
        return this.pin;
    }


    switch() {
        this.state.then((value) => {
            if (value) {
                this.turnOff();
            } else {
                this.turnOn();
            }
        });
    }

    turn(stat: boolean): void {
        if (stat) {
            this.turnOn();
        } else {
            this.turnOff();
        }
    }

    async pulse(durationOn: number = 1000, durationOff: number = 1000, step: number = 1, count?: number): Promise<void> {
        const half: number = Math.round(durationOn / 2)

        count = count ?? 0;
        await this.turnOn(half)
        await this.turnOff(half);
        await delay(durationOff);
        count++;
        count < step ? await this.pulse(durationOn, durationOff, step, count) : await delay(100);
    }



}