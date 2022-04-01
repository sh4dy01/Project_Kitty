//@ts-check
import Phaser from "phaser";

export default class EnemyAIManager {

    constructor() {
    }
    
    /**
     * @param {Phaser.Physics.Matter.Sprite} enemy
     * @param {Number} speed
     * @param {String} dir
     */
    MoveTheEnemyLinear(enemy, speed, dir) {
        this.movementFinished = false;
        this.enemyDirection = dir;

        if (!this.movementFinished) {
            switch (this.enemyDirection) {
                case "top-left":
                    enemy.setVelocity(0, -speed)
                    this.enemyDirection = "bottom-right"
                    this.movementFinished = !this.movementFinished
                break;
    
                case "top":
                    enemy.setVelocity(speed, -speed)
                    this.enemyDirection = "bottom"
                    this.movementFinished = !this.movementFinished
                break;
    
                case "top-right":
                    enemy.setVelocity(speed, 0)
                    this.enemyDirection = "bottom-left"
                    this.movementFinished = !this.movementFinished
                break;
    
                case "left":
                    enemy.setVelocity(-speed, -speed)
                    this.enemyDirection = "right"
                    this.movementFinished = !this.movementFinished
                break;
    
                case "right":
                    enemy.setVelocity(speed, speed)
                    this.enemyDirection = "left"
                    this.movementFinished = !this.movementFinished
                break;
    
                case "bottom-left":
                    enemy.setVelocity(-speed, 0)
                    this.enemyDirection = "top-right"
                    this.movementFinished = !this.movementFinished
                break;
    
                case "bottom":
                    enemy.setVelocity(-speed, speed)
                    this.enemyDirection = "top"
                    this.movementFinished = !this.movementFinished
                break;
    
                case "bottom-right":
                    enemy.setVelocity(0, speed)
                    this.enemyDirection = "top-left"
                    this.movementFinished = !this.movementFinished
                break;
            }
        }
        
    }
}