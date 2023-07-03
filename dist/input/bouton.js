"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bouton = void 0;
const rxjs_1 = require("rxjs");
class Bouton {
    boutonsConfig;
    setLed;
    mode;
    boutonProd = null;
    boutonDev = null;
    ledSub = {};
    ledControl = {};
    freezeFlag = {};
    constructor(bouton, boutonsConfig, setLed = false, mode = "dev") {
        this.boutonsConfig = boutonsConfig;
        this.setLed = setLed;
        this.mode = mode;
        // Assigner les objets BoutonInterface en fonction du mode
        if (bouton.length > 0 && (mode === "prod" || mode === "debug")) {
            this.boutonProd = bouton[0];
        }
        if (bouton.length === 1 && (mode === "dev" || mode === "debug")) {
            this.boutonDev = bouton[0];
        }
        if (bouton.length > 1 && (mode === "dev" || mode === "debug")) {
            this.boutonDev = bouton[1];
        }
        // Configurer les LED si setLed est vrai
        if (setLed) {
            this.setLED(boutonsConfig);
        }
    }
    /**
     * Récupère l'objet contenant les observables des événements de pression des boutons.
     * Renvoie un objet vide si le mode n'est pas "prod", "dev" ou "debug".
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
    // Récupère les broches des boutons
    get pin() {
        if (this.boutonProd && (this.mode === "prod" || this.mode === "debug")) {
            return this.boutonProd.pin;
        }
        if (this.boutonDev && (this.mode === "dev" || this.mode === "debug")) {
            return this.boutonDev.pin;
        }
        return {};
    }
    // Récupère les contrôles des LED
    get led() {
        return this.ledControl;
    }
    // Récupère l'observable d'un bouton en fonction de son label
    keysLabel(label) {
        return this.keys[this.pin[label]];
    }
    // Configure les contrôles des LED
    setLED(boutonsConfig) {
        return Promise.all(boutonsConfig.map((bouton) => {
            if (bouton.pinLED) {
                const importPromise = Promise.resolve().then(() => __importStar(require("../output/gpio_Controle_Analogique"))).then((module) => {
                    const Gpio_Controle_Analogique = module.Gpio_Controle_Analogique;
                    this.ledControl[bouton.label] = new Gpio_Controle_Analogique(bouton.pinLED);
                });
            }
        }));
    }
    // Met en pause la LED associée à un label donné
    freeze(label) {
        if (!this.freezeFlag[label]) {
            this.freezeFlag[label] = true;
            this.led[label].turnOff();
        }
    }
    // Réactive la LED associée à un label donné
    unFreeze(label) {
        if (this.freezeFlag[label]) {
            this.freezeFlag[label] = false;
            this.led[label].turnOn();
        }
        this.led[label].turnOn();
    }
    // Met en pause toutes les LED
    freezeAll() {
        Object.keys(this.ledControl).forEach((label) => {
            this.freeze(label);
        });
    }
    // Réactive toutes les LED
    unFreezeAll() {
        Object.keys(this.ledControl).forEach((label) => {
            this.unFreeze(label);
        });
    }
    // Vérifie si une LED associée à un label est en pause
    isFreeze(label) {
        return this.freezeFlag[label];
    }
}
exports.Bouton = Bouton;
