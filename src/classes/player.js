//@ts-check
import Phaser from "phaser";

export default class PlayerMovement{
    constructor(){
        this.walkSpeed = 1;
        this.runSpeedMultiplier = 2;
        this.playerSpeed = this.walkSpeed;
        this.offsetOrientation = 0.75;
        this.singleDirectionSpeedMultiplier = 2.25;

        this.lives = 3;
    }
    
    /**
     * @param {Phaser.Physics.Matter.Sprite} player
     * @param {Phaser.Types.Input.Keyboard.CursorKeys} cursors
     */
    CheckPlayerInputs(player, cursors){
        player.setVelocity(0);

        if (cursors.shift.isDown) {
            this.playerSpeed = this.runSpeedMultiplier;
        } else {
            this.playerSpeed = this.walkSpeed;
        }
        
        if (cursors.up.isDown && !cursors.left.isDown && !cursors.right.isDown) {
            player.setVelocity(this.playerSpeed + this.offsetOrientation * this.playerSpeed, -this.playerSpeed);
        } 
        else if (cursors.right.isDown && !cursors.up.isDown && !cursors.down.isDown) {
            player.setVelocity(this.playerSpeed + this.offsetOrientation * this.playerSpeed, this.playerSpeed );
        }
        else if (cursors.down.isDown && !cursors.right.isDown && !cursors.left.isDown) {
            player.setVelocity(-this.playerSpeed - this.offsetOrientation * this.playerSpeed, this.playerSpeed);
        } 
        else if (cursors.left.isDown && !cursors.down.isDown && !cursors.up.isDown) {
            player.setVelocity(-this.playerSpeed - this.offsetOrientation * this.playerSpeed, -this.playerSpeed);
        }
        else if (cursors.up.isDown && cursors.right.isDown) {
            player.setVelocity(this.playerSpeed * this.singleDirectionSpeedMultiplier, 0);
        }
        else if (cursors.right.isDown && cursors.down.isDown) {
            player.setVelocity(0, this.playerSpeed * this.singleDirectionSpeedMultiplier);
        }
        else if (cursors.down.isDown && cursors.left.isDown) {
            player.setVelocity(-this.playerSpeed * this.singleDirectionSpeedMultiplier, 0);
        }
        else if (cursors.left.isDown && cursors.up.isDown) {
            player.setVelocity(0, -this.playerSpeed * this.singleDirectionSpeedMultiplier);
        }
    }
}
