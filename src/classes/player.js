//@ts-check
import Phaser from "phaser";

export default class PlayerMovement{
    constructor(){
        this.walkSpeed = 1;
        this.runSpeedMultiplier = 10;
        this.playerSpeed = this.walkSpeed;
        this.offsetOrientation = 0.75;
        this.singleDirectionSpeedMultiplier = 2.25;
        this.lives = 3;
        this.CanOpen = false;

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
            player.setVelocity(this.playerSpeed + this.offsetOrientation * this.playerSpeed, -this.playerSpeed);
            player.setTexture('player-up-left').setFlipX(true);
        } 
        else if (cursors.right.isDown && !cursors.up.isDown && !cursors.down.isDown) {
            player.setVelocity(this.playerSpeed + this.offsetOrientation * this.playerSpeed, this.playerSpeed );
            player.setTexture('player-down-right').setFlipX(false);
        }
        else if (cursors.down.isDown && !cursors.right.isDown && !cursors.left.isDown) {
            player.setVelocity(-this.playerSpeed - this.offsetOrientation * this.playerSpeed, this.playerSpeed);
            player.setTexture('player-down-right').setFlipX(true);
        } 
        else if (cursors.left.isDown && !cursors.down.isDown && !cursors.up.isDown) {
            player.setVelocity(-this.playerSpeed - this.offsetOrientation * this.playerSpeed, -this.playerSpeed);
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

    UseButton(cursors, player){
        if(player.event == true){
            if (cursors.space.isDown) {
                console.log("open the door");
                player.event = false;
            }
        }
    }

    RemoveLife() {
        this.lives--;
    }
}
