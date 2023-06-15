export interface IGpio_Control {
    state: Promise<boolean>;
    turnOn(): void;
    turnOn(time: number): void;
    turnOn(time: number, step: number): void;
    turnOff(): void;
    turnOff(time: number): void;
    turnOff(time: number, step: number): void;
    turn(stat: boolean): void;
    getPin(): number;
    switch(): void;
    pulse(durationOn: number, durationOff: number, step: number): Promise<void>;
}
