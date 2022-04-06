//@ts-check
import Phaser from "phaser";
import PlayerManager from "./PlayerManager";
import SceneManager from "./SceneManager";

export default class CollisionManager {
    /**
     * @param {Phaser.Physics.Matter.World} world
     * @param {PlayerManager} playerManager
     * @param {SceneManager} sceneManager
     */
    constructor(world, playerManager, sceneManager) {
        this.world = world
        this.playerManager = playerManager
        this.sceneManager = sceneManager
    }
/**
 * @param {PlayerManager} playerManager
 * @param {Phaser.Physics.Matter.Sprite} player
*/
    CheckHitBoxes(playerManager, player) {
        this.world.on("collisionstart", (event, bodyA, bodyB) => {
            if((bodyA.label == "player" && bodyB.label == "field") || (bodyA.label == "field" && bodyB.label == "player")) {
                if(this.playerManager.isSafe == true){
                    console.log("hide");
                }
                else{
                    console.log("vue");
                    if (playerManager.canLoseLife) {
                        this.playerManager.DetectedPlayer(player)
                        this.sceneManager.RestartScene(this.playerManager.currentLives);
                    }
                }
            }
            if((bodyA.label == "player" && bodyB.label == "safezone") || (bodyA.label == "safezone" && bodyB.label == "player")) {
                console.log("safe");
                playerManager.isSafe = true
            }
        });

        this.world.on("collisionend", (event,bodyA, bodyB) => {
            if((bodyA.label == "player" && bodyB.label == "safezone") || (bodyA.label == "safezone" && bodyB.label == "player")) {
                console.log("not safe");
                this.playerManager.isSafe = false;
            }
        });
    }

    /**
     * @param {number} numberOfButtons
     */
    CheckButton(numberOfButtons){
        for (let index = 0; index < numberOfButtons; index++) {
            this.world.on("collisionstart", (event, bodyA, bodyB) => {
                if((bodyA.label == "player" && bodyB.label == "lever"+index) || (bodyA.label == "lever"+index && bodyB.label == "player")) {
                    console.log("on button area");
                    this.playerManager.canPress = true;
                    this.playerManager.canPressButton = index
                }
            })
            this.world.on("collisionend", (event,bodyA, bodyB) => {
                if((bodyA.label == "player" && bodyB.label == "lever"+index) || (bodyA.label == "lever"+index && bodyB.label == "player")) {
                    console.log("exit button area");
                    this.playerManager.canPress = false;
                    this.playerManager.canPressButton = null
                }
            })
        }
    }
}

/**
 * @param {Phaser.Physics.Matter.World} world
 * @param {Phaser.Physics.Matter.Sprite} player
 * @param {PlayerManager} playerManager
 * @param {SceneManager} sceneManager
 */
export function CheckNextLevel(world, player, playerManager, sceneManager) {
    world.on("collisionstart", (event, bodyA, bodyB) => {
        if((bodyA.label == "player" && bodyB.label == "NextLevel") || (bodyA.label == "NextLevel" && bodyB.label == "player")) {
            playerManager.StopPlayerMovement(player)
            sceneManager.LoadNextScene(playerManager.currentLives);
        }
    })
}

