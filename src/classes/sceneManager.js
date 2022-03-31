//@ts-check
import Phaser from "phaser";

export default class SceneManager{
    /**
        * @param {Phaser.Scenes.SceneManager} sceneManager
        * @param {Number} currentSceneIndex
    */
    constructor(sceneManager, currentSceneIndex){
        this.sceneManager = sceneManager;
        this.currentSceneIndex = currentSceneIndex;
    }

    /**
        * @param {Phaser.Cameras.Scene2D.Camera} camera
    */
    LoadNextScene(camera) {
        camera.fadeOut(1000, 0, 0, 0)
        camera.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
            let sceneToLoad = this.sceneManager.getAt(this.currentSceneIndex + 1)

            console.log(this.currentSceneIndex);
            console.log(this.sceneManager.getAt(this.currentSceneIndex + 1));

            this.currentSceneIndex++;
            this.sceneManager.start(sceneToLoad);
        })
    }

    /**
        * @param {Phaser.Cameras.Scene2D.Camera} camera
        * @param {Phaser.Scenes.ScenePlugin} scene
    */
    RestartScene(camera, scene) {
        camera.fadeOut(1000, 0, 0, 0)
        camera.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
            scene.restart();
        })
    }
}