"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckConfig = void 0;
const rxjs_1 = require("rxjs");
class CheckConfig {
    static testBouton(bouton) {
        const testBouton = 'testBouton';
        Object.keys(bouton.led).forEach((led) => {
            bouton.led[led].turnOn();
        });
        return Promise.all(Object.keys(bouton.led).map(async (led) => {
            console.log(`[[ Appuyer sur le bouton ${led} ]]`);
            return await (0, rxjs_1.firstValueFrom)(bouton.keysLabel(led)).then(() => {
                bouton.led[led].turnOff(3000);
            });
        }));
    }
}
exports.CheckConfig = CheckConfig;
