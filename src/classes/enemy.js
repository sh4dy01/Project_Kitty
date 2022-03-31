//@ts-check
import Phaser from "phaser";

export default class Enemy extends Phaser.Physics.Matter.Sprite {
    /**
     * @param {Phaser.Physics.Matter.World} world
     * @param {Number} x
     * @param {Number} y
     * @param {String} texture
     * @param {(String|Number)=} frame
    */
    constructor(world, x, y, texture, speed, frame) {
        super(world, x, y, texture, frame)

        this.speed = speed;
    }

    /**
     * @param {Number} t
     * @param {Number} dt
    */
    preUpdate(t, dt) {
        super.preUpdate(t, dt);
    }

    /**
     * @param {Phaser.Physics.Matter.Sprite} enemy
    */
    MoveTheEnnemiLinear(enemy) {
        switch (this.enemyDirection) {
            case "top-left":
                enemy.setVelocity(0, -this.speed)
                this.enemyDirection = "bottom-right"
            break;

            case "top":
                enemy.setVelocity(this.speed, -this.speed)
                this.enemyDirection = "bottom"
            break;

            case "top-right":
                enemy.setVelocity(this.speed, 0)
                this.enemyDirection = "bottom-left"
            break;

            case "left":
                enemy.setVelocity(-this.speed, -this.speed)
                this.enemyDirection = "right"
            break;

            case "right":
                enemy.setVelocity(this.speed, this.speed)
                this.enemyDirection = "left"
            break;

            case "bottom-left":
                enemy.setVelocity(-this.speed, 0)
                this.enemyDirection = "top-right"
            break;

            case "bottom":
                enemy.setVelocity(-this.speed, this.speed)
                this.enemyDirection = "top"
            break;

            case "bottom-right":
                enemy.setVelocity(0, this.speed)
                this.enemyDirection = "top-left"
            break;

            default:
                console.log("wrong position")
            break;
        }
    }
}