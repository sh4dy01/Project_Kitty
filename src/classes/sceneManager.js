import { LEVEL_MAP, OUTRO_SCREEN } from "../helpers/Constants"

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
            console.log(currentLife, this.currentLevel+1);
            this.sceneLoader.start(LEVEL_MAP, {remainingLife: currentLife, level: this.currentLevel+1});
        })
    }

    /**
        * @param {Phaser.Cameras.Scene2D.Camera} camera
        * @param {Number} currentLife
    */
    RestartScene(currentLife) {
        this.camera.fadeOut(1000, 150, 0, 0)
        this.camera.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
            console.log(currentLife);
            this.sceneLoader.start(LEVEL_MAP, {level: this.currentLevel, remainingLife: currentLife});
        })
    }

    RestartTheGame() {
        this.camera.fadeOut(3000, 255, 0, 0)
        this.camera.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
            this.sceneLoader.start(LEVEL_MAP, {remainingLife: this.maxLives, level: 0})}
        )
    }

    LoadWinScreen() {
        this.camera.fadeOut(3000, 0, 150, 0)
        this.camera.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
            this.sceneLoader.start(OUTRO_SCREEN)}
        )
    }
}