//@ts-check
import Phaser from "phaser";

export default class PauseScreen extends Phaser.Scene {
    constructor() {
        super('Pause')

        this.pauseImage = null
    }
    
    preload() {
        console.log('preload');
        this.load.image('pause-screen', 'assets/sprites/ui/pause-screen.png')
    }

    create() {
        console.log('create');

        this.pauseKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC)
        this.pauseImage = this.add.image(this.scale.width/2, this.scale.height/2, 'pause-screen').setScrollFactor(0).setDepth(9999);
    }

    update() {
        if (this.pauseKey.isDown) {
            this.pauseImage.destroy
            this.scene.resume('Game')
        }
    }
}