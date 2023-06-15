import {Subject} from "rxjs";
import {exec, ExecException} from "child_process";

export class Temperature {
    public temperature$: Subject<{ temperature: number, isDangerous: boolean }> = new Subject();
    private temperature: number = 0;
    private dangerousTemperature: number = 75;

    /**
     * Constructor
     * Initializes the temperature monitoring interval
     * @param interval the interval at which to check the temperature
     * @param dangerousTemperature
     */
    constructor(dangerousTemperature: number = 70, interval = 20000) {
        setInterval(() => {
            exec("cat /sys/class/thermal/thermal_zone0/temp", (error: ExecException | null, stdout: string) => {
                if (error) {
                    console.error(`exec error: ${error.cmd}`);
                    return;
                }
                const stringOut: any = stdout.match(/\d+/) ?? [0];
                this.temperature = Number(stringOut[0]) / 1000;
                this.temperature$.next({
                    temperature: this.temperature,
                    isDangerous: this.temperature > dangerousTemperature
                });
            });
        }, interval);
    }

}