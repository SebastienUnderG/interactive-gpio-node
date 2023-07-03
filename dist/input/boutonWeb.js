"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BoutonWeb = void 0;
const express_1 = __importDefault(require("express"));
const rxjs_1 = require("rxjs");
class BoutonWeb {
    pins;
    port;
    keys = {};
    pin = {};
    app = (0, express_1.default)();
    constructor(pins, port = 99) {
        this.pins = pins;
        this.port = port;
        this.configureButtons();
        this.app.listen(this.port, () => null);
    }
    addButton(config) {
        this.keys[config.pin.toString()] = new rxjs_1.Observable((observer) => {
            this.app.get(`/keys/${config.pin}`, (req, res) => {
                this.actionButton(config, observer, res);
            });
            this.app.get(`/keys/${config.label}`, (req, res) => {
                this.actionButton(config, observer, res);
            });
        });
    }
    actionButton(config, observer, res) {
        const date = new Date();
        // Crée une liste HTML de boutons pour chaque endpoint de broche
        const buttonsList = this.pins.map((pin) => `<form method="get" action="/keys/${pin.pin}"><button type="submit">Button ${pin.label} pin ${pin.pin}</button></form><br>`)
            .join('');
        const log = `Button ${config.label} pin ${config.pin}  has been pressed at ${date.toLocaleString()}`;
        console.info(log);
        res.status(200).send(`<h1>${log}</h1> <br/> <h1>Liste des boutons :</h1><div> ${buttonsList}</div>`);
        observer.next(true);
    }
    configureButtons() {
        // Routes pour chaque broche
        this.pins.forEach((config) => {
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
exports.BoutonWeb = BoutonWeb;
