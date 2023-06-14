import {Observable} from "rxjs";
import {BoutonConfig} from "./boutonConfig";

/**
 * Interface used to describe a keyboard button
 *
 * @property {string} name - The name of the button
 * @property {boolean} ctrl - A boolean indicating if the Ctrl button is pressed
 * @property {boolean} meta - A boolean indicating if the Meta button (e.g Windows key) is pressed
 * @property {boolean} shift - A boolean indicating if the Shift button is pressed
 * @property {string} sequence - A string containing the character sequence generated by the button
 * @property {string} code - A numerical code for the button
 */
export interface BoutonKeyboardCLI {
    name: string,
    ctrl: boolean,
    meta: boolean,
    shift: boolean,
    sequence: string,
    code: string
}


/**
 * Class used to listen for key press events on stdin and return an Observable
 *
 * @property {Observable<BoutonKeyboardCLI>} key - An observable that will emit a BoutonKeyboardCLI object when a configured key is pressed
 */
export class BoutonCLI {
    keyDebug: Observable<BoutonKeyboardCLI> | null = null;
    keys: { [keyboard: string]: Observable<boolean> } = {};
    pin: { [label: string]: number } = {};
    private keypress: any = require('keypress');

    /**
     *
     * @param buttons
     * @param {boolean} debug - A boolean indicating if all keys should be displayed or not. Default is false
     */
    constructor(buttons: BoutonConfig[], debug: boolean) {
        console.log(`BoutonCLI Lancé`);
        this.configureButtonsDebug(debug);
        this.configureButtons(buttons);

    }

    configureButtons(buttons: BoutonConfig[] = [
        {
            pin: 1,
            label: "C",
            keyboard: "c"
        },
        {
            pin: 2,
            label: "V",
            keyboard: "v"
        }]) {

        for (const keyElement of buttons) {

            // label
            if (keyElement.label) {
                this.pin[keyElement.label] = keyElement.pin;
            }

            if (keyElement.keyboard) {
                this.keys[keyElement.pin] = new Observable(observer => {
                    // make `process.stdin` begin emitting "keypress" events
                    this.keypress(process.stdin);

                    // listen for the "keypress" event
                    process.stdin.on('keypress', (ch, key: BoutonKeyboardCLI) => {
                        if (key?.ctrl && key?.name === 'c') {
                            console.log("EXIT");
                            process.stdin.pause();
                            process.exit();
                        } else if (key && keyElement.keyboard === key.name) {
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

    private configureButtonsDebug(debug: boolean) {
        if (!debug) return;
        this.keyDebug = new Observable(observer => {
            this.keypress(process.stdin);
            process.stdin.on('keypress', (ch, key: BoutonKeyboardCLI) => {
                observer.next(key);
                if (key?.ctrl && key?.name === 'c') process.stdin.pause();
            });
        });
    }


}