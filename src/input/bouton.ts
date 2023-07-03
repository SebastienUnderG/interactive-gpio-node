import {merge, Observable, Subscription} from "rxjs";
import {BoutonConfig} from "./boutonConfig";
import {IGpio_Control} from "../output/IGpio_Control";
import {BoutonInterface} from "./BoutonInterface";

type Mode = "prod" | "dev" | "debug";

export class Bouton {
    private readonly boutonProd: BoutonInterface | null = null;
    private readonly boutonDev: BoutonInterface | null = null;
    private ledSub: { [pin: string]: Subscription } = {};
    private ledControl: { [boutonLabels: string]: IGpio_Control } = {};
    private freezeFlag: { [label: string]: boolean } = {};

    constructor(
        bouton: BoutonInterface[],
        private readonly boutonsConfig: BoutonConfig[],
        private readonly setLed: boolean = false,
        private readonly mode: Mode = "dev"
    ) {
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

    // Récupère les broches des boutons
    get pin(): { [label: string]: number } {
        if (this.boutonProd && (this.mode === "prod" || this.mode === "debug")) {
            return this.boutonProd.pin;
        }

        if (this.boutonDev && (this.mode === "dev" || this.mode === "debug")) {
            return this.boutonDev.pin;
        }
        return {};
    }

    // Récupère les contrôles des LED
    get led(): { [label: string]: IGpio_Control } {
        return this.ledControl;
    }

    // Récupère l'observable d'un bouton en fonction de son label
    keysLabel(label: string): Observable<boolean | number> {
        return this.keys[this.pin[label]];
    }

    // Configure les contrôles des LED
    setLED(boutonsConfig: BoutonConfig[]): Promise<void[]> {
        return Promise.all(boutonsConfig.map((bouton: BoutonConfig) => {
            if (bouton.pinLED) {
                const importPromise = import("../output/gpio_Controle_Analogique")
                    .then((module) => {
                        const Gpio_Controle_Analogique = module.Gpio_Controle_Analogique;
                        this.ledControl[bouton.label] = new Gpio_Controle_Analogique(bouton.pinLED);
                    });
            }
        }));
    }

    // Met en pause la LED associée à un label donné
    freeze(label: string) {
        if (!this.freezeFlag[label]) {
            this.freezeFlag[label] = true;
            this.led[label].turnOff();
        }
    }

    // Réactive la LED associée à un label donné
    unFreeze(label: string) {
        if (this.freezeFlag[label]) {
            this.freezeFlag[label] = false;
            this.led[label].turnOn();
        }
        this.led[label].turnOn();
    }

    // Met en pause toutes les LED
    freezeAll() {
        Object.keys(this.ledControl).forEach((label: string) => {
            this.freeze(label)
        });
    }

    // Réactive toutes les LED
    unFreezeAll() {
        Object.keys(this.ledControl).forEach((label: string) => {
            this.unFreeze(label)
        });
    }

    // Vérifie si une LED associée à un label est en pause
    isFreeze(label: string): boolean {
        return this.freezeFlag[label];
    }
}
