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

    CheckNextLevel(canLoadNextScene, world, camera, CanOpen) {
        if (canLoadNextScene) {
            
        }
    }

    /**
        * @param {Boolean} canLoadNextScene
        * @param {Phaser.Physics.Matter.World} world
        * @param {Phaser.Cameras.Scene2D.Camera} camera
    */
    CheckHitBoxes(canLoadNextScene, world, camera, CanOpen) {
        if (canLoadNextScene) {
        }

    }
    
    CheckButton(world, player){
        world.on("collisionstart", (event, bodyA, bodyB) => {
            if((bodyA.label == "player" && bodyB.label == "boutonHit") || (bodyA.label == "boutonHit" && bodyB.label == "player")) {
                console.log("on button area");
                player.event = true;
            }
        })
        world.on("collisionend", (event, bodyA, bodyB) => {
            if((bodyA.label == "player" && bodyB.label == "boutonHit") || (bodyA.label == "boutonHit" && bodyB.label == "player")) {
                console.log("exit button area");
                bodyA.event = false;
            }
        });
    }
}