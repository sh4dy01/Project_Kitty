//@ts-check
import Phaser from "phaser";

class Character extends Phaser.GameObjects.Sprite {
    constructor(scene){
        var x = scene.player.x;
        var y = scene.player.y;

        super(scene, x, y, "player");
        scene.add.existing(this);
    }

    CheckPlayerInputs(){
        this.player.setVelocity(0);

        if (this.cursors.shift.isDown) {
            this.playerSpeed = this.runSpeed;
        } else {
            this.playerSpeed = this.walkSpeed;
        }
        
        if (this.cursors.up.isDown) {
            this.player.setVelocityY(-this.playerSpeed);
        } 
        else if (this.cursors.down.isDown) {
            this.player.setVelocityY(this.playerSpeed);
        }

        if (this.cursors.right.isDown) {
            this.player.setVelocityX(this.playerSpeed);
        } 
        else if (this.cursors.left.isDown) {
            this.player.setVelocityX(-this.playerSpeed);
        }
    }
}
