import { Observable } from "rxjs";
import { BoutonConfig } from "./boutonConfig";
export interface BoutonInterface {
    keys: {
        [key: string]: Observable<boolean | number>;
    };
    pin: {
        [label: string]: number;
    };
    configureButtons(buttons: BoutonConfig[]): void;
}
