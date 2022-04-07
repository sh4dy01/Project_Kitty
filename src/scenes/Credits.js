//@ts-check
import Phaser from "phaser";

export default class CreditsScreen extends Phaser.Scene {
    constructor() {
        super('CreditsScreen')
    }

    create() {
        this.add.text(this.scale.width/2-100, this.scale.height/2-100, "On vous remercie d'avoir joué")
        this.add.text(this.scale.width/4, this.scale.height/2, 'Développeurs: \n\nMaestracci Hugo \nAteni Manuiva \nRipot Quentin \nVogt Nathanaël \nDurel Mériadeg')
        this.add.text(this.scale.width/2-25, this.scale.height/2, 'Artistes: \n\nBringé Nicolas \nWatelot Anais')
        this.add.text(this.scale.width/3*2, this.scale.height/2, 'Business: \n\nLeverger Emile \nLimouza Mathys \nLucas Rémi \nMauranne Edgar')
    }
}
