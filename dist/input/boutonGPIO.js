"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BoutonGPIO = void 0;
const rxjs_1 = require("rxjs");
const onoff_1 = require("onoff");
/**
 * BoutonGPIO class
 * Wraps the functionality of multiple GPIO buttons connected to a Raspberry Pi
 */
class BoutonGPIO {
    /**
     * An object that holds the button instances
     */
    boutons = {};
    /**
     * An object that holds the observables of the button press events
     */
    keys = {};
    pin = {};
    constructor(configPin) {
        console.log(`BoutonGPIO Lancé`);
        this.configureButtons(configPin);
    }
    addButton(config) {
        this.boutons[config.pin] = new onoff_1.Gpio(Number(config.pin), 'in', 'both', { debounceTimeout: config.debounceTimeout ?? 50 });
        this.keys[config.pin] = new rxjs_1.Observable((observer) => {
            let pressedTime;
            // Watch for button press event
            this.boutons[config.pin].watch((err, value) => {
                if (value === 1) {
                    pressedTime = Date.now();
                }
                else {
                    const releaseTime = Date.now();
                    const duration = releaseTime - pressedTime;
                    observer.next(duration);
                    const time = new Date().toLocaleTimeString();
                    console.log(`Button [${config.label}] at pin ${config.pin} pressed at ${time} and released after ${duration}ms.`);
                }
            });
        });
    }
    removeButton(pin) {
        this.boutons[pin].unexport();
        delete this.boutons[pin];
        delete this.keys[pin];
    }
    configureButtons(buttons) {
        buttons.forEach((button) => {
            if (button.label) {
                this.pin[button.label] = button.pin;
            }
            this.addButton(button);
        });
    }
}
exports.BoutonGPIO = BoutonGPIO;
