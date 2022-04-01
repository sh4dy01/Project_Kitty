import { START_LEVEL } from "../helpers/constants"

//@ts-check
export class SceneManager {
    /**
     * @param {Phaser.Scenes.ScenePlugin} sceneLoader
     * @param {String} currentLevel
     * @param {Number} currentLevelIndex
     * @param {Phaser.Cameras.Scene2D.Camera} camera
     */
    constructor(sceneLoader, currentLevel, currentLevelIndex, camera) {
        this.sceneLoader = sceneLoader
        this.currentLevel = currentLevel
        this.currentLevelIndex = currentLevelIndex
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
            this.sceneLoader.start(this.sceneLoader.manager.getAt(this.currentLevelIndex + 1).scene.key, {remainingLife: currentLife});
        })
    }

    /**
        * @param {Phaser.Cameras.Scene2D.Camera} camera
        * @param {Number} currentLife
    */
    RestartScene(currentLife) {
        this.camera.fadeOut(1000, 150, 0, 0)
        // camera.flashEffect.start(1000, 255, 0, 0)
        this.camera.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
            this.sceneLoader.start(this.currentLevel, {remainingLife: currentLife});
        })
    }

    RestartTheGame() {
        this.camera.fadeOut(1000, 255, 0, 0)
        this.camera.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
            this.sceneLoader.start(START_LEVEL, {remainingLife: this.maxLives})}
        )
    }
}