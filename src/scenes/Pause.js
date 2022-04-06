//@ts-check
import Phaser from "phaser";

export default class PauseScreen extends Phaser.Scene {
    constructor() {
        super('PauseScreen')
    }
    
    init(data) {
        this.sceneToResume = data.sceneToResume
    }

    create() {
        this.pauseKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC)
        this.pauseImage = this.add.image(this.scale.width/2, this.scale.height/2, 'pause-screen').setDepth(150000).setScrollFactor(0);
    }

    update() {
        if (this.pauseKey.isDown) {
            this.pauseImage.destroy()
            this.scene.resume(this.sceneToResume)
        }
    }
}