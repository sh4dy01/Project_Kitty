//@ts-check
import Phaser from "phaser";
import { OFFSET_ORIENTATION, SINGLE_DIRECTION_MULTIPLIER } from "../helpers/constants";
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

        this.isSafe = true;
        this.canPress = false;
        this.pressedButton = false;
        this.direction = 'top_right';
        this.canMove = false;
        this.canLoseLife = true;
        this.canLoadNextScene = false;

        this.colliders = null
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
            player.anims.timeScale = 2
        } else {
            this.playerSpeed = this.walkSpeed;
            player.anims.timeScale = 1
        }
        
        if (cursors.up.isDown && !cursors.left.isDown && !cursors.right.isDown) {
            this.CheckIfChangeCollider('top_right', player)
            player.setVelocity(this.playerSpeed + OFFSET_ORIENTATION * this.playerSpeed, -this.playerSpeed);
            player.play('playerTopLeft', true).setFlipX(true)
        } 
        else if (cursors.right.isDown && !cursors.up.isDown && !cursors.down.isDown) {
            this.CheckIfChangeCollider('bottom_right', player)
            player.setVelocity(this.playerSpeed + OFFSET_ORIENTATION * this.playerSpeed, this.playerSpeed );
            player.play('playerBottomRight', true).setFlipX(false)
        }
        else if (cursors.down.isDown && !cursors.right.isDown && !cursors.left.isDown) {
            this.CheckIfChangeCollider('bottom_left', player)
            player.play('playerBottomRight', true).setFlipX(true)
            player.setVelocity(-this.playerSpeed - OFFSET_ORIENTATION * this.playerSpeed, this.playerSpeed);
        } 
        else if (cursors.left.isDown && !cursors.down.isDown && !cursors.up.isDown) {
            this.CheckIfChangeCollider('top_left', player)
            player.setVelocity(-this.playerSpeed - OFFSET_ORIENTATION * this.playerSpeed, -this.playerSpeed);
            player.play('playerTopLeft', true).setFlipX(false)
        }
        else if (cursors.up.isDown && cursors.right.isDown) {
            this.CheckIfChangeCollider('right', player)
            player.setVelocity(this.playerSpeed * SINGLE_DIRECTION_MULTIPLIER, 0);
            player.play('playerRight', true).setFlipX(false)
        }
        else if (cursors.right.isDown && cursors.down.isDown) {
            this.CheckIfChangeCollider('down', player)
            player.setVelocity(0, this.playerSpeed * SINGLE_DIRECTION_MULTIPLIER);
            player.play('playerDown', true).setFlipX(false)
        }
        else if (cursors.down.isDown && cursors.left.isDown) {
            this.CheckIfChangeCollider('left', player)
            player.setVelocity(-this.playerSpeed * SINGLE_DIRECTION_MULTIPLIER, 0);
            player.play('playerRight', true).setFlipX(true)
        }
        else if (cursors.left.isDown && cursors.up.isDown) {
            this.CheckIfChangeCollider('up', player)
            player.setVelocity(0, -this.playerSpeed * SINGLE_DIRECTION_MULTIPLIER);
            player.play('playerUp', true).setFlipX(false)
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

    /**
     * @param {string} newDirection
     * @param {Phaser.Physics.Matter.Sprite} player
     */
    CheckIfChangeCollider(newDirection, player) {
        // console.log(newDirection, this.direction);
        // if (this.direction === newDirection) { } else { 
        //     player.setBody(this.colliders['player_'+this.direction]);
        //     this.direction = newDirection 
        //     console.log('changing body to'+this.colliders['player_'+this.direction]);
        // }
    }
}
