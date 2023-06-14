import {firstValueFrom} from "rxjs";
import {promises as fsPromises} from 'fs';
import {Bouton} from "../input/bouton";

export class CheckConfig {

    static testBouton(bouton: Bouton): Promise<any> {

        const testBouton: string = 'testBouton';

        Object.keys(bouton.led).forEach((led: string) => {
            bouton.led[led].turnOn();
        })

        return Promise.all(Object.keys(bouton.led).map(async (led: string) => {
            console.log(`[[ Appuyer sur le bouton ${led} ]]`);
            return await firstValueFrom(bouton.keysLabel(led)).then(() => {
                bouton.led[led].turnOff(3000);
            });
        }));
    }

}