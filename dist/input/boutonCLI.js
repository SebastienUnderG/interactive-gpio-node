"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BoutonCLI = void 0;
const rxjs_1 = require("rxjs");
/**
 * Class used to listen for key press events on stdin and return an Observable
 *
 * @property {Observable<BoutonKeyboardCLI>} key - An observable that will emit a BoutonKeyboardCLI object when a configured key is pressed
 */
class BoutonCLI {
    keyDebug = null;
    keys = {};
    pin = {};
    keypress = require('keypress');
    /**
     *
     * @param buttons
     * @param {boolean} debug - A boolean indicating if all keys should be displayed or not. Default is false
     */
    constructor(buttons, debug) {
        console.log(`BoutonCLI Lancé`);
        this.configureButtonsDebug(debug);
        this.configureButtons(buttons);
    }
    configureButtons(buttons = [
        {
            pin: 1,
            label: "C",
            keyboard: "c"
        },
        {
            pin: 2,
            label: "V",
            keyboard: "v"
        }
    ]) {
        for (const keyElement of buttons) {
            // label
            if (keyElement.label) {
                this.pin[keyElement.label] = keyElement.pin;
            }
            if (keyElement.keyboard) {
                this.keys[keyElement.pin] = new rxjs_1.Observable(observer => {
                    // make `process.stdin` begin emitting "keypress" events
                    this.keypress(process.stdin);
                    // listen for the "keypress" event
                    process.stdin.on('keypress', (ch, key) => {
                        if (key?.ctrl && key?.name === 'c') {
                            console.log("EXIT");
                            process.stdin.pause();
                            process.exit();
                        }
                        else if (key && keyElement.keyboard === key.name) {
                            observer.next(true);
                            console.log(`Button [${keyElement.label}] at keyboard ${keyElement.keyboard} pressed at ${new Date()}`);
                        }
                    });
                });
            }
        }
        process.stdin.setRawMode(true);
        process.stdin.resume();
    }
    configureButtonsDebug(debug) {
        if (!debug)
            return;
        this.keyDebug = new rxjs_1.Observable(observer => {
            this.keypress(process.stdin);
            process.stdin.on('keypress', (ch, key) => {
                observer.next(key);
                if (key?.ctrl && key?.name === 'c')
                    process.stdin.pause();
            });
        });
    }
}
exports.BoutonCLI = BoutonCLI;
