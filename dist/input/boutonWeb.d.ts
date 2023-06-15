import { Observable } from 'rxjs';
import { BoutonConfig } from "./boutonConfig";
export declare class BoutonWeb {
    private readonly pins;
    private readonly port;
    keys: {
        [pin: string]: Observable<boolean>;
    };
    pin: {
        [label: string]: number;
    };
    private readonly app;
    constructor(pins: BoutonConfig[], port?: number);
    addButton(config: BoutonConfig): void;
    private configureButtons;
}
