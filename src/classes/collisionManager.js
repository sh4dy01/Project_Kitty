//@ts-check
import Phaser from "phaser";
import PlayerManager from "./PlayerManager";
import SceneManager from "./SceneManager";
import BossManager from "../classes/BossManager";

import { ConvertXCartesianToIsometric, ConvertYCartesianToIsometric } from "../helpers/CartesianToIsometric";
import { ChangeDepth } from "../helpers/ChangeDepth";

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
                    this.playerManager.canPressButtonNumber = index
                }
            })
            this.world.on("collisionend", (event,bodyA, bodyB) => {
                if((bodyA.label == "player" && bodyB.label == "lever"+index) || (bodyA.label == "lever"+index && bodyB.label == "player")) {
                    console.log("exit button area");
                    this.playerManager.canPress = false;
                    this.playerManager.canPressButtonNumber = null
                }
            })
        }
    }
    
    /**
     * @param {BossManager} bossManager
     */
    CheckCollideWorld(bossManager) {
        const tabBR = ["left", "left-bottom", "left-top"];
        const tabTL = ["right", "right-bottom", "right-top"];
        const tabTR = ["bottom", "bottom-left", "bottom-right"];
        const tabBL = ["top", "top-left", "top-right"];
        this.world.on("collisionstart", (event, bodyA, bodyB) => {
            if((bodyA.label == "boss" && bodyB.label == "bottomRight") || (bodyA.label == "bottomRight" && bodyB.label == "boss")) {
                let rand = Math.floor(Math.random()*3)
                bossManager.direction = tabBR[rand]
            }
        })
        this.world.on("collisionstart", (event, bodyA, bodyB) => {
            if((bodyA.label == "boss" && bodyB.label == "topLeft") || (bodyA.label == "topLeft" && bodyB.label == "boss")) {
                let rand = Math.floor(Math.random()*3)
                bossManager.direction = tabTL[rand]
            }
        })
        this.world.on("collisionstart", (event, bodyA, bodyB) => {
            if((bodyA.label == "boss" && bodyB.label == "topRight") || (bodyA.label == "topRight" && bodyB.label == "boss")) {
                let rand = Math.floor(Math.random()*3)
                bossManager.direction = tabTR[rand]
            }
        })
        this.world.on("collisionstart", (event, bodyA, bodyB) => {
            if((bodyA.label == "boss" && bodyB.label == "bottomLeft") || (bodyA.label == "bottomLeft" && bodyB.label == "boss")) {
                let rand = Math.floor(Math.random()*3)
                bossManager.direction = tabBL[rand]
            }
        })
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
