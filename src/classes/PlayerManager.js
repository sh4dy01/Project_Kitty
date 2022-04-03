//@ts-check
import Phaser from "phaser";
import { OFFSET_ORIENTATION } from "../helpers/constants";
import { CheckNextLevel } from "./CollisionManager";
import SceneManager from "./SceneManager";

export default class PlayerManager {
    /**
        * @param {Number} currentLife
        * @param {SceneManager} sceneManager
    */
    constructor(currentLife, sceneManager) {
        this.walkSpeed = 2.5;
        this.runSpeedMultiplier = 10;
        this.playerSpeed = this.walkSpeed;

        this.singleDirectionSpeedMultiplier = 2.25;

        this.isSafe = true;
        this.canPress = false;
        this.pressedButton = false;
        this.canMove = false;
        this.canLoseLife = true;
        this.canLoadNextScene = false;

        this.currentLives = currentLife
        this.sceneManager = sceneManager
    }
    
    /**
     * @param {Phaser.Physics.Matter.Sprite} player
     * @param {Phaser.Types.Input.Keyboard.CursorKeys} cursors
     */
    CheckPlayerInputs(player, cursors) {
        player.setVelocity(0);

        if (cursors.shift.isDown) {
            this.playerSpeed = this.runSpeedMultiplier;
        } else {
            this.playerSpeed = this.walkSpeed;
        }
        
        if (cursors.up.isDown && !cursors.left.isDown && !cursors.right.isDown) {
            player.setVelocity(this.playerSpeed + OFFSET_ORIENTATION * this.playerSpeed, -this.playerSpeed);
            player.setTexture('player-up-left').setFlipX(true);
        } 
        else if (cursors.right.isDown && !cursors.up.isDown && !cursors.down.isDown) {
            player.setVelocity(this.playerSpeed + OFFSET_ORIENTATION * this.playerSpeed, this.playerSpeed );
            player.setTexture('player-down-right').setFlipX(false);
        }
        else if (cursors.down.isDown && !cursors.right.isDown && !cursors.left.isDown) {
            player.setVelocity(-this.playerSpeed - OFFSET_ORIENTATION * this.playerSpeed, this.playerSpeed);
            player.setTexture('player-down-right').setFlipX(true);
        } 
        else if (cursors.left.isDown && !cursors.down.isDown && !cursors.up.isDown) {
            player.setVelocity(-this.playerSpeed - OFFSET_ORIENTATION * this.playerSpeed, -this.playerSpeed);
            player.setTexture('player-up-left').setFlipX(false);
        }
        else if (cursors.up.isDown && cursors.right.isDown) {
            player.setVelocity(this.playerSpeed * this.singleDirectionSpeedMultiplier, 0);
            player.setTexture('player-right').setFlipX(false);
        }
        else if (cursors.right.isDown && cursors.down.isDown) {
            player.setVelocity(0, this.playerSpeed * this.singleDirectionSpeedMultiplier);
            player.setTexture('player-down').setFlipX(false);
        }
        else if (cursors.down.isDown && cursors.left.isDown) {
            player.setVelocity(-this.playerSpeed * this.singleDirectionSpeedMultiplier, 0);
            player.setTexture('player-right').setFlipX(true);
        }
        else if (cursors.left.isDown && cursors.up.isDown) {
            player.setVelocity(0, -this.playerSpeed * this.singleDirectionSpeedMultiplier);
            player.setTexture('player-up').setFlipX(false);
        }
    }

    /**
     * @param {Phaser.Types.Input.Keyboard.CursorKeys} cursors
     * @param {Phaser.Physics.Matter.World} world
     * @param {Phaser.Physics.Matter.Sprite} player
     */
    UseButton(cursors, world, player){
        if(this.canPress && !this.pressedButton){
            if (cursors.space.isDown) {
                console.log('pressed');
                this.pressedButton = true
                this.canLoadNextScene = true;
                CheckNextLevel(world, this, this.sceneManager, player, this.currentLives)
            }
        }
    }


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
        console.log(player);
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
