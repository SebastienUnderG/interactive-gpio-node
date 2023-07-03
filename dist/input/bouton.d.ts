import { Observable } from "rxjs";
import { BoutonConfig } from "./boutonConfig";
import { IGpio_Control } from "../output/IGpio_Control";
import { BoutonInterface } from "./BoutonInterface";
type Mode = "prod" | "dev" | "debug";
export declare class Bouton {
    private readonly boutonsConfig;
    private readonly setLed;
    private readonly mode;
    private readonly boutonProd;
    private readonly boutonDev;
    private ledSub;
    private ledControl;
    private freezeFlag;
    constructor(bouton: BoutonInterface[], boutonsConfig: BoutonConfig[], setLed?: boolean, mode?: Mode);
    /**
     * Récupère l'objet contenant les observables des événements de pression des boutons.
     * Renvoie un objet vide si le mode n'est pas "prod", "dev" ou "debug".
     */
    get keys(): {
        [pin: string]: Observable<number | boolean>;
    };
    get pin(): {
        [label: string]: number;
    };
    get led(): {
        [label: string]: IGpio_Control;
    };
    keysLabel(label: string): Observable<boolean | number>;
    setLED(boutonsConfig: BoutonConfig[]): Promise<void[]>;
    freeze(label: string): void;
    unFreeze(label: string): void;
    freezeAll(): void;
    unFreezeAll(): void;
    isFreeze(label: string): boolean;
}
export {};
