//@ts-check
import Phaser from "phaser";

export default class EnemyAIManager {

    /**
     * @param {String} enemyDirection
     */
    constructor(enemyDirection) {
        this.enemyDirection = enemyDirection
    }

    /**
     * @param {Phaser.Physics.Matter.Sprite} enemy
     * @param {Number} speed
    */
    MoveTheEnemyLinear(enemy, speed) {
        switch (this.enemyDirection) {
            case "top-left":
                enemy.setVelocity(0, -speed)
                this.enemyDirection = "bottom-right"
            break;

            case "top":
                enemy.setVelocity(speed, -speed)
                this.enemyDirection = "bottom"
            break;

            case "top-right":
                enemy.setVelocity(speed, 0)
                this.enemyDirection = "bottom-left"
            break;

            case "left":
                enemy.setVelocity(-speed, -speed)
                this.enemyDirection = "right"
            break;

            case "right":
                enemy.setVelocity(speed, speed)
                this.enemyDirection = "left"
            break;

            case "bottom-left":
                enemy.setVelocity(-speed, 0)
                this.enemyDirection = "top-right"
            break;

            case "bottom":
                enemy.setVelocity(-speed, speed)
                this.enemyDirection = "top"
            break;

            case "bottom-right":
                enemy.setVelocity(0, speed)
                this.enemyDirection = "top-left"
            break;
        }
    }
}