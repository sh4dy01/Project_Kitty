//@ts-check
import Phaser from "phaser";

export default class CreditsScreen extends Phaser.Scene {
    constructor() {
        super('CreditsScreen')
    }

    create() {
        this.add.text(this.scale.width/2-100, this.scale.height/2-100, "On vous remercie d'avoir joué.")
        this.add.text(this.scale.width/4, this.scale.height/2, 'Développeurs: \n\nHugo MAESTRACCI \nManuiva ATENI  \nQuentin RIPOT  \nNathanaël VOGT  \nMériadeg DUREL ')
        this.add.text(this.scale.width/2-25, this.scale.height/2, 'Artistes: \n\nNicolas BRINGE  \nAnaïs WATELOT ')
        this.add.text(this.scale.width/3*2, this.scale.height/2, 'Business: \n\nEmile LEVERGER  \nMathys LIMOUZA  \nRémi LUCAS  \nEdgar MAURANNE ')
    }
}
