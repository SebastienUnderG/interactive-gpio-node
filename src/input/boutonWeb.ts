import express from 'express';
import {Observable, Subscriber} from 'rxjs';
import {BoutonConfig} from "./boutonConfig";

export class BoutonWeb {
    keys: { [pin: string]: Observable<boolean> } = {};
    pin: { [label: string]: number } = {};
    private readonly app = express();

    constructor(private readonly pins: BoutonConfig[], private readonly port: number = 99) {
        this.configureButtons();
        this.app.listen(this.port, () => null);
    }


    addButton(config: BoutonConfig) {
        this.keys[config.pin.toString()] = new Observable((observer: Subscriber<boolean>) => {
            this.app.get(`/keys/${config.pin}`, (req, res) => {
                const date = new Date();
                // Crée une liste HTML de boutons pour chaque endpoint de broche
                const buttonsList = this.pins.map(pin => `<form method="get" action="/keys/${pin.pin}"><button type="submit">Button ${pin.label} pin ${pin.pin}</button></form><br>`)
                    .join('');

                const message = `Button ${config.label} pin ${config.pin}  has been pressed at ${date.toLocaleString()}`;
                console.log(message);
                res.status(200).send(`<h1>${message}</h1> <br/> <h1>Liste des boutons :</h1><div> ${buttonsList}</div>`);
                observer.next(true);
            });
        });


    }


    private configureButtons() {

        // Routes pour chaque broche
        this.pins.forEach((config: BoutonConfig) => {
            this.addButton(config);

            // label
            if (config.label) {
                this.pin[config.label] = config.pin;
            }
        });


        // Route pour le chemin racine
        this.app.get('/keys/', (req, res) => {

            // Crée une liste HTML de boutons pour chaque endpoint de broche
            const buttonsList = this.pins.map(pin => `<form method="get" action="/keys/${pin.pin}"><button type="submit">Button ${pin.label} pin ${pin.pin}</button></form><br>`)
                .join('');

            // Renvoie la liste HTML au client
            res.send(`<h1>Liste des boutons :</h1><div>${buttonsList}</div>`);
        });

    }
}
