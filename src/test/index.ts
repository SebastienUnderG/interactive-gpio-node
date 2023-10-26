import {Pin} from "../constante/pin";
import {BoutonConfig} from "../input/model/boutonConfig";
import {PresenceDetector} from "../input/presence";

export const btn: BoutonConfig[] = [
    {
        pin: Pin.raspberryPi3b.BCM22_X15,
        pinLED: Pin.raspberryPi3b.BCM27_X13,
        label: 'vert',
        keyboard: 'c'
    }
];
//new BoutonWeb(btn)
// const bouton: Bouton = new Bouton([new BoutonWeb(btn)], btn);

/*
bouton.keysLabel(btn[0].label).subscribe(() => {
    console.log("VERT");
});
*/


const presence: PresenceDetector = new PresenceDetector(
    Pin.raspberryPi3b.BCM24_X18,
    Pin.raspberryPi3b.BCM23_X16);

presence.isPresent.subscribe((distence) => {
    console.log('presence', distence);
})