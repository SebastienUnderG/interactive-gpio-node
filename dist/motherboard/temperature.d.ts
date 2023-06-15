import { Subject } from "rxjs";
export declare class Temperature {
    temperature$: Subject<{
        temperature: number;
        isDangerous: boolean;
    }>;
    private temperature;
    private dangerousTemperature;
    /**
     * Constructor
     * Initializes the temperature monitoring interval
     * @param interval the interval at which to check the temperature
     * @param dangerousTemperature
     */
    constructor(dangerousTemperature?: number, interval?: number);
}
