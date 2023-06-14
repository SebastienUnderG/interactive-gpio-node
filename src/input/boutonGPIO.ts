import {Observable, Subscriber} from "rxjs";
import {Gpio} from "onoff";
import {BoutonConfig} from "./boutonConfig";


/**
 * BoutonGPIO class
 * Wraps the functionality of multiple GPIO buttons connected to a Raspberry Pi
 */
export class BoutonGPIO {

    /**
     * An object that holds the button instances
     */
    boutons: { [pin: string]: any } = {};
    /**
     * An object that holds the observables of the button press events
     */
    keys: { [pin: string]: Observable<number> } = {};
    pin: { [label: string]: number } = {};

    constructor(configPin: BoutonConfig[]) {
        console.log(`BoutonGPIO Lancé`);
        this.configureButtons(configPin);
    }

    addButton(config: BoutonConfig) {
        this.boutons[config.pin] = new Gpio(
            Number(config.pin),
            'in',
            'both',
            {debounceTimeout: config.debounceTimeout ?? 50});

        this.keys[config.pin] = new Observable((observer: Subscriber<number>) => {
            let pressedTime: number;
            // Watch for button press event
            this.boutons[config.pin].watch((err: Error, value: number) => {
                if (value === 1) {
                    pressedTime = Date.now();
                } else {
                    const releaseTime = Date.now();
                    const duration = releaseTime - pressedTime;
                    observer.next(duration);
                    const time: string = new Date().toLocaleTimeString();
                    console.log(`Button [${config.label}] at pin ${config.pin} pressed at ${time} and released after ${duration}ms.`);
                }
            });
        });

    }

    removeButton(pin: string) {
        this.boutons[pin].unexport();
        delete this.boutons[pin];
        delete this.keys[pin];
    }

    configureButtons(buttons: BoutonConfig[]) {
        buttons.forEach(button => {

            if (button.label) {
                this.pin[button.label] = button.pin;
            }
            this.addButton(button);
        });
    }
}

