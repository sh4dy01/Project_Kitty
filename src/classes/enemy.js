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
    MoveTheEnemyLinear(enemy, speed, dir) {
        console.log(dir)
        switch (dir) {
            case "top-left":
                enemy.setVelocity(0, -speed)
                dir = "bottom-right"
            break;

            case "top":
                enemy.setVelocity(speed, -speed)
                dir = "bottom"
            break;

            case "top-right":
                enemy.setVelocity(speed, 0)
                dir = "bottom-left"
            break;

            case "left":
                enemy.setVelocity(-speed, -speed)
                dir = "right"
            break;

            case "right":
                enemy.setVelocity(speed, speed)
                dir = "left"
            break;

            case "bottom-left":
                enemy.setVelocity(-speed, 0)
                dir = "top-right"
            break;

            case "bottom":
                enemy.setVelocity(-speed, speed)
                dir = "top"
            break;

            case "bottom-right":
                enemy.setVelocity(0, speed)
                dir = "top-left"
            break;
        }
    }
}