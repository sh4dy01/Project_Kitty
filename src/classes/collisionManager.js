//@ts-check
import Phaser from "phaser";
import SceneManager from "./sceneManager";


export default class CollisionManager{
    /**
        * @param {SceneManager} sceneManager
    */
    constructor(sceneManager){
        this.sceneManager = sceneManager
    }

    /**
        * @param {Boolean} canLoadNextScene
        * @param {Phaser.Physics.Matter.World} world
        * @param {Phaser.Cameras.Scene2D.Camera} camera
    */
    CheckHitBoxes(canLoadNextScene, world, camera) {
        if (canLoadNextScene) {
            world.on("collisionstart", (event, bodyA, bodyB) => {
                if((bodyA.label == "player" && bodyB.label == "nextLevel") == (bodyB.label == "nextLevel" && bodyA.label == "player")) {
                    this.sceneManager.LoadNextScene(camera);
                }
            })
        }
    }
}