"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bouton = void 0;
const rxjs_1 = require("rxjs");
const gpio_Controle_Analogique_1 = require("../output/gpio_Controle_Analogique");
class Bouton {
    boutonsConfig;
    setLed;
    mode;
    boutonProd = null;
    boutonDev = null;
    ledSub = {};
    ledControl = {};
    freezeFlag = {};
    constructor(boutonProd, boutonDev, boutonsConfig, setLed = false, mode = "dev") {
        this.boutonsConfig = boutonsConfig;
        this.setLed = setLed;
        this.mode = mode;
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
    get keys() {
        if (this.boutonProd && (this.mode === "prod")) {
            return this.boutonProd.keys;
        }
        if (this.boutonDev && (this.mode === "dev")) {
            return this.boutonDev.keys;
        }
        if (this.boutonDev?.keys && this.boutonProd?.keys && (this.mode === "debug")) {
            const keys = {};
            Object.keys(this.boutonProd.keys).forEach((key) => {
                if (this.boutonProd?.keys && this.boutonDev?.keys) {
                    keys[key] = (0, rxjs_1.merge)(this.boutonProd.keys[key], this.boutonDev.keys[key]);
                }
            });
            return keys;
        }
        return {};
    }
    get pin() {
        if (this.boutonProd && (this.mode === "prod" || this.mode === "debug")) {
            return this.boutonProd.pin;
        }
        if (this.boutonDev && (this.mode === "dev" || this.mode === "debug")) {
            return this.boutonDev.pin;
        }
        return {};
    }
    get led() {
        return this.ledControl;
    }
    keysLabel(label) {
        return this.keys[this.pin[label]];
    }
    setLED(boutonsConfig) {
        return Promise.all(boutonsConfig.map((bouton) => {
            if (bouton.pinLED) {
                this.ledControl[bouton.label] = new gpio_Controle_Analogique_1.Gpio_Controle_Analogique(bouton.pinLED);
            }
        }));
    }
    freeze(label) {
        if (!this.freezeFlag[label]) {
            this.freezeFlag[label] = true;
            this.led[label].turnOff();
        }
    }
    unFreeze(label) {
        if (this.freezeFlag[label]) {
            this.freezeFlag[label] = false;
            this.led[label].turnOn();
        }
        this.led[label].turnOn();
    }
    freezeAll() {
        Object.keys(this.ledControl).forEach((label) => {
            this.freeze(label);
        });
    }
    unFreezeAll() {
        Object.keys(this.ledControl).forEach((label) => {
            this.unFreeze(label);
        });
    }
    isFreeze(label) {
        return this.freezeFlag[label];
    }
}
exports.Bouton = Bouton;
