//@ts-check
import Phaser from "phaser";
import SceneManager from "./sceneManager";


export default class CollisionManager{

    /**
     * @param {Phaser.Physics.Matter.World} world
    */

     CheckHitBoxes(world, camera) {

        world.on("collisionstart", (event, bodyA, bodyB) => {
            if((bodyA.label == "player" && bodyB.label == "field") || (bodyA.label == "field" && bodyB.label == "player")) {
                if(this.safe == true){
                    console.log("hide");
                }
                else{
                    console.log("vue");
                }
            }
            if((bodyA.label == "player" && bodyB.label == "safezone") || (bodyA.label == "safezone" && bodyB.label == "player")) {
                console.log("safe");
                this.safe = true
            }
        });

        world.on("collisionend", (event, bodyA, bodyB) => {
            if((bodyA.label == "player" && bodyB.label == "safezone") || (bodyA.label == "safezone" && bodyB.label == "player")) {
                console.log("not safe");
                this.safe = false;
            }
            if ((bodyA.label == "player" && bodyB.label == "collison") || (bodyA.label == "collision" && bodyB.label == "player")){
                console.log("collision");
            }
        });
    }
    
    CheckButton(world){
        world.on("collisionstart", (event, bodyA, bodyB) => {
            if((bodyA.label == "player" && bodyB.label == "boutonHit") || (bodyA.label == "boutonHit" && bodyB.label == "player")) {
                console.log("on button area");
                bodyA.event = true;
                console.log(bodyA);
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