import { Observable } from "rxjs";
import { BoutonConfig } from "./boutonConfig";
/**
 * BoutonGPIO class
 * Wraps the functionality of multiple GPIO buttons connected to a Raspberry Pi
 */
export declare class BoutonGPIO {
    /**
     * An object that holds the button instances
     */
    boutons: {
        [pin: string]: any;
    };
    /**
     * An object that holds the observables of the button press events
     */
    keys: {
        [pin: string]: Observable<number>;
    };
    pin: {
        [label: string]: number;
    };
    constructor(configPin: BoutonConfig[]);
    addButton(config: BoutonConfig): void;
    removeButton(pin: string): void;
    configureButtons(buttons: BoutonConfig[]): void;
}
