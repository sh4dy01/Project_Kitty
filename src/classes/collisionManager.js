//@ts-check
import Phaser from "phaser";
import PlayerManager from "./PlayerManager";
import SceneManager from "./SceneManager";
import BossManager from "./BossManager";

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
    // Détection de collision entre le joueur et les ennemis
    /**
     * @param {PlayerManager} playerManager
     * @param {Phaser.Physics.Matter.Sprite} player
     * @param {Phaser.GameObjects.Image} [entrance]
     * @param {Phaser.Cameras.Scene2D.Camera} [camera]
     */
    CheckHitBoxes(playerManager, player, entrance, camera) {
        this.world.on("collisionstart", (event, bodyA, bodyB) => {
            // if((bodyA.label == "player" && (bodyB.label == "field" || bodyB.label == "boss")) || ((bodyA.label == "field" || bodyA.label == "boss") && bodyB.label == "player")) {
            //     if(this.playerManager.isSafe == true){
            //         console.log("hide");
            //     }
            //     else{
            //         console.log("vue");
            //         if (playerManager.canLoseLife) {
            //             this.playerManager.DetectedPlayer(player)
            //             this.sceneManager.RestartScene(this.playerManager.currentLives);
            //         }
            //     }
            // }

            // Détecion pour savoir si le joueur est en zone safe ou pas 
            if((bodyA.label == "player" && bodyB.label == "safezone") || (bodyA.label == "safezone" && bodyB.label == "player")) {
                console.log("safe");
                playerManager.isSafe = true
            }
        });

        this.world.on("collisionend", (event,bodyA, bodyB) => {
            if((bodyA.label == "player" && bodyB.label == "safezone") || (bodyA.label == "safezone" && bodyB.label == "player")) {
                console.log("not safe");
                this.playerManager.isSafe = false;
                // if (this.sceneManager.currentLevel === 0 ) {
                //     entrance.setFrame('closed.png')
                //     camera.shake(200, 0.015);
                // }
            }
        });
    }

    /**
     * @param {number} numberOfButtons
     */

    // Détection pour savoir si le joueur est dans la zone d'activation du levier
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
     CheckCollideWorld(bossManager, leversStatus) {
        const tabBR = ["left", "left-bottom", "left-top"];
        const tabTL = ["right", "right-bottom", "right-top"];
        const tabTR = ["bottom", "bottom-left", "bottom-right"];
        const tabBL = ["top", "top-left", "top-right"];
        this.world.on("collisionstart", (event, bodyA, bodyB) => {
            if((bodyA.label == "boss" && bodyB.label == "bottomRight") || (bodyA.label == "bottomRight" && bodyB.label == "boss")) {
                let rand = Math.floor(Math.random()*3)
                bossManager.direction = tabBR[rand]
                bossManager.ChangeBody(tabBR[rand], leversStatus);
            }
        })
        this.world.on("collisionstart", (event, bodyA, bodyB) => {
            if((bodyA.label == "boss" && bodyB.label == "topLeft") || (bodyA.label == "topLeft" && bodyB.label == "boss")) {
                let rand = Math.floor(Math.random()*3)
                bossManager.direction = tabTL[rand]
                bossManager.ChangeBody(tabTL[rand], leversStatus);
            }
        })
        this.world.on("collisionstart", (event, bodyA, bodyB) => {
            if((bodyA.label == "boss" && bodyB.label == "topRight") || (bodyA.label == "topRight" && bodyB.label == "boss")) {
                let rand = Math.floor(Math.random()*3)
                bossManager.direction = tabTR[rand]
                bossManager.ChangeBody(tabTR[rand], leversStatus);
            }
        })
        this.world.on("collisionstart", (event, bodyA, bodyB) => {
            if((bodyA.label == "boss" && bodyB.label == "bottomLeft") || (bodyA.label == "bottomLeft" && bodyB.label == "boss")) {
                let rand = Math.floor(Math.random()*3)
                bossManager.direction = tabBL[rand]
                bossManager.ChangeBody(tabBL[rand], leversStatus);
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

    // Détection de collision entre le joueur et la porte qui permet de changer de niveau
export function CheckNextLevel(world, player, playerManager, sceneManager) {
    world.on("collisionstart", (event, bodyA, bodyB) => {
        if((bodyA.label == "player" && bodyB.label == "NextLevel") || (bodyA.label == "NextLevel" && bodyB.label == "player")) {
            playerManager.StopPlayerMovement(player)
            sceneManager.LoadNextScene(playerManager.currentLives);
        }
    })
}

/**
 * @param {Phaser.Physics.Matter.World} world
 * @param {Phaser.Physics.Matter.Sprite} player
 * @param {PlayerManager} playerManager
 * @param {SceneManager} sceneManager
 */
export function CheckFinalLevel(world, player, playerManager, sceneManager) {
    world.on("collisionstart", (event, bodyA, bodyB) => {
        if((bodyA.label == "player" && bodyB.label == "NextLevel") || (bodyA.label == "NextLevel" && bodyB.label == "player")) {
            playerManager.StopPlayerMovement(player)
            sceneManager.LoadWinScreen();
        }
    })
}
