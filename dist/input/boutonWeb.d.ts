import { Observable, Subscriber } from 'rxjs';
import { BoutonConfig } from "./boutonConfig";
import { BoutonInterface } from "./BoutonInterface";
export declare class BoutonWeb implements BoutonInterface {
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
    actionButton(config: BoutonConfig, observer: Subscriber<boolean>, res: any): void;
    configureButtons(): void;
}
