//@ts-check
import Phaser from "phaser";
import { ChangeDepth, UpdateLeverTexture } from "../helpers/ChangeDepth";
import { OFFSET_ORIENTATION, SINGLE_DIRECTION_MULTIPLIER } from "../helpers/constants";
import CollisionManager, { CheckNextLevel } from "./CollisionManager";
import SceneManager from "./SceneManager";
import UIManager from "./UIManager";

export default class PlayerManager {
    /**
     * @param {Number} currentLife
     * @param {SceneManager} sceneManager
     * @param {UIManager} UIManager
     */
    constructor(currentLife, sceneManager, UIManager) {
        this.walkSpeed = 2.5; // Vitesse de déplacement
        this.runSpeedMultiplier = 10; // Multiplicateur de vitesse de déplacement
        this.playerSpeed = this.walkSpeed;

        this.isSafe = true;
        this.direction = 'top_right';
        this.canPress = false;
        this.canPressButtonNumber = null
        this.allButtonPressed = false;

        this.canMove = false;
        this.canLoseLife = true;
        this.canLoadNextScene = true;

        this.colliders = null
        /**@type {Phaser.Physics.Matter.Image} */
        this.exitDoor = null

        this.currentLives = currentLife
        this.sceneManager = sceneManager
        this.UIManager = UIManager
    }
    
    /**
     * @param {Phaser.Physics.Matter.Sprite} player
     * @param {Phaser.Types.Input.Keyboard.CursorKeys} cursors
     */
    CheckPlayerInputs(player, cursors) {
        player.setVelocity(0); // Arreter le déplacement du joueur

        if (cursors.shift.isDown) {
            this.playerSpeed = this.runSpeedMultiplier;
            player.anims.timeScale = 2 // Animation x2 quand le joueur cours
        } else {
            this.playerSpeed = this.walkSpeed;
            player.anims.timeScale = 1 // Animation x1 quand le joueur marche
        }

        
        if (cursors.up.isDown && !cursors.left.isDown && !cursors.right.isDown) {
            player.setVelocity(this.playerSpeed + OFFSET_ORIENTATION * this.playerSpeed, -this.playerSpeed);
            player.play('playerTopLeft', true).setFlipX(true) // Flip le sprite quand le joueur va en haut à gauche
            ChangeDepth(player)
        } 
        else if (cursors.right.isDown && !cursors.up.isDown && !cursors.down.isDown) {
            player.setVelocity(this.playerSpeed + OFFSET_ORIENTATION * this.playerSpeed, this.playerSpeed );
            player.play('playerBottomRight', true).setFlipX(false)
            ChangeDepth(player)
        }
        else if (cursors.down.isDown && !cursors.right.isDown && !cursors.left.isDown) {
            player.play('playerBottomRight', true).setFlipX(true) // Flip le sprite quand le joueur va en bas à gauche
            player.setVelocity(-this.playerSpeed - OFFSET_ORIENTATION * this.playerSpeed, this.playerSpeed);
            ChangeDepth(player)
        } 
        else if (cursors.left.isDown && !cursors.down.isDown && !cursors.up.isDown) {
            player.setVelocity(-this.playerSpeed - OFFSET_ORIENTATION * this.playerSpeed, -this.playerSpeed);
            player.play('playerTopLeft', true).setFlipX(false)
            ChangeDepth(player)
        }
        else if (cursors.up.isDown && cursors.right.isDown) {
            player.setVelocity(this.playerSpeed * SINGLE_DIRECTION_MULTIPLIER, 0);
            player.play('playerRight', true).setFlipX(false)
           ChangeDepth(player)
        }
        else if (cursors.right.isDown && cursors.down.isDown) {
            player.setVelocity(0, this.playerSpeed * SINGLE_DIRECTION_MULTIPLIER);
            player.play('playerDown', true).setFlipX(false)
            ChangeDepth(player)
        }
        else if (cursors.down.isDown && cursors.left.isDown) {
            player.setVelocity(-this.playerSpeed * SINGLE_DIRECTION_MULTIPLIER, 0);
            player.play('playerRight', true).setFlipX(true)
            ChangeDepth(player)
        }
        else if (cursors.left.isDown && cursors.up.isDown) {
            player.setVelocity(0, -this.playerSpeed * SINGLE_DIRECTION_MULTIPLIER);
            player.play('playerUp', true).setFlipX(false)
            ChangeDepth(player)
        } else {
            player.stop()
        }
    }

    /**
     * @param {Phaser.Types.Input.Keyboard.CursorKeys} cursors
     * @param {Phaser.Physics.Matter.World} world
     * @param {Phaser.Physics.Matter.Sprite} player
    */

    // Utilisation des boutons
    UseButton(cursors, world, player){
        if(cursors.space.isDown){
            this.UIManager.UpdateLeversUI(this.canPressButtonNumber);
            this.CheckIfAllPressed(world, player);
        }
    }

    /**
     * @param {Phaser.Physics.Matter.World} world
     * @param {Phaser.Physics.Matter.Sprite} player
    */

    // Détection de l'activation de tous les boutons
    CheckIfAllPressed(world, player) {
        for (let index = 0; index < this.UIManager.leversStatus.length; index++) {
            if (this.UIManager.leversStatus[index] === false) {
                this.allButtonPressed = false;
                this.canLoadNextScene = false;

                return
            }
        }
        this.allButtonPressed = true;
        this.canLoadNextScene = true;
        this.exitDoor.setTexture('playerPoints', "door-open.png");
        if (this.canLoadNextScene) {
            CheckNextLevel(world, player, this, this.sceneManager)
        }
    }

    // Enleve un vie au joueur et reset la partie lorsque le joueur a 0 vie
    RemoveLife() {
        this.currentLives--;
        
        if (this.currentLives === 0) {
            this.sceneManager.RestartTheGame()
        }
    }

    /**
     * @param {Phaser.Physics.Matter.Sprite} player
    */
    StopPlayerMovement(player) {
        player.setVelocity(0, 0);
        this.canLoseLife = false;
        this.canMove = false;
    }

    /**
     * @param {Phaser.Physics.Matter.Sprite} player
    */
    DetectedPlayer(player) {
        this.StopPlayerMovement(player);
        this.canLoseLife = false;
        this.canMove = false;
        this.RemoveLife();
    }
}
