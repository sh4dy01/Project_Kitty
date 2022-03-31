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
    CheckHitBoxes(canLoadNextScene, world, camera, CanOpen) {
        if (canLoadNextScene) {
            world.on("collisionstart", (event, bodyA, bodyB) => {
                if((bodyA.label == "player" && bodyB.label == "cone") || (bodyA.label == "cone" && bodyB.label == "player")) {
                    console.log("vue!");
                }
    
                if((bodyA.label == "player" && bodyB.label == "boutonHit") || (bodyA.label == "boutonHit" && bodyB.label == "player")) {
                    console.log("on button area");
                    this.CanOpen = true;
                }
            })
            world.on("collisionend", (event, bodyA, bodyB) => {
                if((bodyA.label == "player" && bodyB.label == "boutonHit") || (bodyA.label == "boutonHit" && bodyB.label == "player")) {
                    console.log("exit button area");
                    this.CanOpen = false;
                }
            });
        }
    }
}