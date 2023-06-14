import {BoutonGPIO} from "./boutonGPIO";
import {BoutonWeb} from "./boutonWeb";
import {merge, Observable, Subscription} from "rxjs";
import {BoutonConfig} from "./boutonConfig";
import {BoutonCLI} from "./boutonCLI";
import {IGpio_Control} from "../output/IGpio_Control";
import {Gpio_Controle_Analogique} from "../output/gpio_Controle_Analogique";

type Mode = "prod" | "dev" | "debug";

export class Bouton {
    private readonly boutonProd: BoutonGPIO | BoutonWeb | BoutonCLI | null = null;
    private readonly boutonDev: BoutonGPIO | BoutonWeb | BoutonCLI | null = null;
    private ledSub: { [pin: string]: Subscription } = {};
    private ledControl: { [boutonLabels: string]: IGpio_Control } = {};
    private freezeFlag: { [label: string]: boolean } = {};

    constructor(
        boutonProd: any,
        boutonDev: any,
        private readonly boutonsConfig: BoutonConfig[],
        private readonly setLed: boolean = false,
        private readonly mode: Mode = "dev"
    ) {
        if (mode === "prod" || mode === "debug") {
            this.boutonProd = boutonProd;
        }

        if (mode === "dev" || mode === "debug") {
            this.boutonDev = boutonDev;
        }

        if (setLed) {
            this.setLED(boutonsConfig);
        }

    }

    /**
     * Get the keys object containing the observables of the button press events.
     * Returns an empty object if not in 'prod', 'dev', or 'debug' mode.
     */
    get keys(): { [pin: string]: Observable<number | boolean> } {


        if (this.boutonProd && (this.mode === "prod")) {
            return this.boutonProd.keys;
        }

        if (this.boutonDev && (this.mode === "dev")) {
            return this.boutonDev.keys;
        }

        if (this.boutonDev?.keys && this.boutonProd?.keys && (this.mode === "debug")) {
            const keys: { [pin: string]: Observable<boolean | number> } = {};
            Object.keys(this.boutonProd.keys).forEach((key: string) => {
                if (this.boutonProd?.keys && this.boutonDev?.keys) {
                    keys[key] = merge(this.boutonProd.keys[key], this.boutonDev.keys[key])
                }
            });
            return keys;
        }

        return {};
    }

    get pin(): { [label: string]: number } {
        if (this.boutonProd && (this.mode === "prod" || this.mode === "debug")) {
            return this.boutonProd.pin;
        }

        if (this.boutonDev && (this.mode === "dev" || this.mode === "debug")) {
            return this.boutonDev.pin;
        }
        return {};
    }

    get led(): { [label: string]: IGpio_Control } {
        return this.ledControl;
    }

    keysLabel(label: string): Observable<boolean |number> {
        return this.keys[this.pin[label]];
    }

    setLED(boutonsConfig: BoutonConfig[]): Promise<any> {

        return Promise.all(boutonsConfig.map( (bouton: BoutonConfig) => {
            if (bouton.pinLED) {
                this.ledControl[bouton.label] = new Gpio_Controle_Analogique(bouton.pinLED);
            }
        }));

    }

    freeze(label: string) {
        if (!this.freezeFlag[label]) {
            this.freezeFlag[label] = true;
            this.led[label].turnOff();
        }
    }

    unFreeze(label: string) {
        if (this.freezeFlag[label]) {
            this.freezeFlag[label] = false;
            this.led[label].turnOn();
        }
        this.led[label].turnOn();
    }

    freezeAll() {
        Object.keys(this.ledControl).forEach((label: string) => {
            this.freeze(label)
        });
    }

    unFreezeAll() {
        Object.keys(this.ledControl).forEach((label: string) => {
            this.unFreeze(label)
        });
    }

    isFreeze(label: string): boolean {
        return this.freezeFlag[label];
    }

}