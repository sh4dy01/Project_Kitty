//@ts-check
import Phaser from "phaser";
import PlayerManager from "./PlayerManager";
import SceneManager from "./SceneManager";

/**
 * @param {Phaser.Physics.Matter.World} world
 * @param {PlayerManager} playerManager
 * @param {SceneManager} sceneManager
 * @param {Phaser.Physics.Matter.Sprite} playerPhysics
*/
export function CheckHitBoxes(world, playerManager, sceneManager, playerPhysics) {
    world.on("collisionstart", (event, bodyA, bodyB) => {
        if((bodyA.label == "player" && bodyB.label == "field") || (bodyA.label == "field" && bodyB.label == "player")) {
            if(playerManager.isSafe == true){
                console.log("hide");
            }
            else{
                console.log("vue");
                if (playerManager.canLoseLife) {
                    playerManager.DetectedPlayer(playerPhysics)
                    sceneManager.RestartScene(playerManager.currentLives);
                }
            }
        }
        if((bodyA.label == "player" && bodyB.label == "safezone") || (bodyA.label == "safezone" && bodyB.label == "player")) {
            console.log("safe");
            playerManager.isSafe = true
        }
    });

    world.on("collisionend", (event, bodyA, bodyB) => {
        if((bodyA.label == "player" && bodyB.label == "safezone") || (bodyA.label == "safezone" && bodyB.label == "player")) {
            console.log("not safe");
            playerManager.isSafe = false;
        }
    });
}

/**
 * @param {Phaser.Physics.Matter.World} world
 * @param {PlayerManager} player
 */
export function CheckButton(world, player){
    world.on("collisionstart", (event, bodyA, bodyB) => {
        if((bodyA.label == "player" && bodyB.label == "boutonHit") || (bodyA.label == "boutonHit" && bodyB.label == "player")) {
            console.log("on button area");
            player.canPress = true;
        }
    })
    world.on("collisionend", (event, bodyA, bodyB) => {
        if((bodyA.label == "player" && bodyB.label == "boutonHit") || (bodyA.label == "boutonHit" && bodyB.label == "player")) {
            console.log("exit button area");
            player.canPress = false;
        }
    });
}

/**
 * @param {Phaser.Physics.Matter.World} world
 * @param {PlayerManager} playerManager
 * @param {SceneManager} sceneManager
 * @param {Phaser.Physics.Matter.Sprite} playerPhysics
 * @param {Number} currentLives
 */
export function CheckNextLevel(world, playerManager, sceneManager, playerPhysics, currentLives) {
    world.on("collisionstart", (event, bodyA, bodyB) => {
        console.log(bodyA, bodyB);
        if((bodyA.label == "player" && bodyB.label == "NextLevel") || (bodyA.label == "NextLevel" && bodyB.label == "player")) {
            playerManager.StopPlayerMovement(playerPhysics)
            sceneManager.LoadNextScene(currentLives);
        }
    })
}