//@ts-check
import Phaser from "phaser";
import SceneManager from "../classes/sceneManager";

export default class Player{
    /**
        * @param {SceneManager} sceneManager
        * @param {Phaser.Physics.Matter.World} world
        * @param {Phaser.Cameras.Scene2D.Camera} camera
    */
    constructor(sceneManager, world, camera){
        this.walkSpeed = 2.5;
        this.runSpeedMultiplier = 2.5;
        this.playerSpeed = this.walkSpeed;
        this.offsetOrientation = 0.75;
        this.singleDirectionSpeedMultiplier = 2.25;

        this.lives = 3;
        this.canOpen = false;
        this.canLoadNextScene = false;

        this.sceneManager = sceneManager;
        this.world = world;
        this.camera = camera;
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

    /**
     * @param {Phaser.Types.Input.Keyboard.CursorKeys} cursors
     */
    UseButton(cursors, player){
        if(player.event == true){
            if (cursors.space.isDown) {
                this.canLoadNextScene = true;
                this.CheckNextLevel(this.world, this.camera)
                player.event = false;
            }
        }
    }

    /**
     * @param {Phaser.Physics.Matter.World} world
     * @param {Phaser.Cameras.Scene2D.Camera} camera
    */
     CheckNextLevel(world, camera) {
        if (this.canLoadNextScene) {
            world.on("collisionstart", (event, bodyA, bodyB) => {
                if((bodyA.label == "player" && bodyB.label == "NextLevel") || (bodyA.label == "NextLevel" && bodyB.label == "player")) {
                    this.sceneManager.LoadNextScene(camera);
                }
            })
        }
    }

    RemoveLife() {
        this.lives--;
    }
}
