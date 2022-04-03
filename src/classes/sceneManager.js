import { LEVEL_MAP } from "../helpers/constants"

//@ts-check
export default class SceneManager {
    /**
     * @param {Phaser.Scenes.ScenePlugin} sceneLoader
     * @param {Number} currentLevel
     * @param {Phaser.Cameras.Scene2D.Camera} camera
     */
    constructor(sceneLoader, currentLevel, camera) {
        this.sceneLoader = sceneLoader
        this.currentLevel = currentLevel
        this.camera = camera
        this.maxLives = 3
    }

    /**
     * @param {Phaser.Cameras.Scene2D.Camera} camera
     * @param {Number} currentLife
     */
    LoadNextScene(currentLife) {
        this.camera.fadeOut(2000, 0, 0, 0)
        this.camera.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
            console.log(currentLife);
            this.sceneLoader.start(LEVEL_MAP, {remainingLife: currentLife});
        })
    }

    /**
        * @param {Phaser.Cameras.Scene2D.Camera} camera
        * @param {Number} currentLife
    */
    RestartScene(currentLife) {
        this.camera.fadeOut(1000, 150, 0, 0)
        this.camera.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
            this.sceneLoader.start(LEVEL_MAP, {level: this.currentLevel, remainingLife: currentLife});
        })
    }

    RestartTheGame() {
        this.camera.fadeOut(3000, 255, 0, 0)
        this.camera.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
            this.sceneLoader.start(LEVEL_MAP, {remainingLife: this.maxLives})}
        )
    }
}