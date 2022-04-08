//@ts-check
import Phaser from "phaser";
import { SOUNDS_LOADER } from "../helpers/Constants";

export default class SplashScreen extends Phaser.Scene {
    constructor() {
        super('SplashScreen')
    }

    preload() {
        this.load.image('splash', 'assets/sprites/ui/Illu_debut_jeu.png')
    }

    create() {
       this.add.image(this.scale.width/2, this.scale.height/2, 'splash')
       this.space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
       this.add.text(this.scale.width/2-110, this.scale.height-100, 'APPUYEZ SUR LA TOUCHE ESPACE')
    }

    update() {
        if (this.space.isDown) {
            this.scene.start(SOUNDS_LOADER)
        }
    }
}
