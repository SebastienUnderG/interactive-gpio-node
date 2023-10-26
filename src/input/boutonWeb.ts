import express from 'express';
import {Observable, Subscriber} from 'rxjs';
import {BoutonConfig} from "./model/boutonConfig";
import {BoutonInterface} from "./model/BoutonInterface";

export class BoutonWeb implements BoutonInterface {
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
                this.actionButton(config, observer, res)
            });

            this.app.get(`/keys/${config.label}`, (req, res) => {
                this.actionButton(config, observer, res)
            });

        });
    }

    actionButton(config: BoutonConfig, observer: Subscriber<boolean>, res: any) {
        const date :Date = new Date();
        // Crée une liste HTML de boutons pour chaque endpoint de broche
        const buttonsList: string = this.pins.map((pin: BoutonConfig): string => `<form method="get" action="/keys/${pin.pin}"><button type="submit">Button ${pin.label} pin ${pin.pin}</button></form><br>`)
            .join('');

        const log: string = `Button ${config.label} pin ${config.pin}  has been pressed at ${date.toLocaleString()}`;
        console.info(log);
        res.status(200).send(`<h1>${log}</h1> <br/> <h1>Liste des boutons :</h1><div> ${buttonsList}</div>`);
        observer.next(true);
    }

    configureButtons() {
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
