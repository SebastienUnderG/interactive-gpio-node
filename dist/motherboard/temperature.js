"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Temperature = void 0;
const rxjs_1 = require("rxjs");
const child_process_1 = require("child_process");
class Temperature {
    temperature$ = new rxjs_1.Subject();
    temperature = 0;
    dangerousTemperature = 75;
    /**
     * Constructor
     * Initializes the temperature monitoring interval
     * @param interval the interval at which to check the temperature
     * @param dangerousTemperature
     */
    constructor(dangerousTemperature = 70, interval = 20000) {
        setInterval(() => {
            (0, child_process_1.exec)("cat /sys/class/thermal/thermal_zone0/temp", (error, stdout) => {
                if (error) {
                    console.error(`exec error: ${error.cmd}`);
                    return;
                }
                const stringOut = stdout.match(/\d+/) ?? [0];
                this.temperature = Number(stringOut[0]) / 1000;
                this.temperature$.next({
                    temperature: this.temperature,
                    isDangerous: this.temperature > dangerousTemperature
                });
            });
        }, interval);
    }
}
exports.Temperature = Temperature;
