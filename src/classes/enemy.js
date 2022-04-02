//@ts-check
import Phaser from "phaser";
import { BOTTOM, BOTTOM_LEFT, BOTTOM_RIGHT, GREEN, LEFT, OFFSET_ORIENTATION, RIGHT, TOP, TOP_LEFT, TOP_RIGHT } from "../helpers/constants";
import PlayerManager from "./player";

export default class Enemy extends Phaser.Physics.Matter.Sprite {     
    /**
     * @param {{world: Phaser.Physics.Matter.World; x: Number; y: Number; texture?: String | Phaser.Textures.Texture ; options?: Phaser.Types.Physics.Matter.MatterBodyConfig;}} config
     * @param {String} startDirection
     * @param {Phaser.Types.Physics.Matter.MatterSetBodyConfig} collider
     */
    constructor(config, startDirection, collider) {
        super(config.world, config.x, config.y, config.texture, null, config.options)
        this.setBody(collider);

        this.speed = 2;
        this.direction = startDirection;
        this.movementFinished = false;

        // this.update()
        // this.anims.play('phantomIdle')
    }
    
    CreateTheHitbox() {
    }
    
    /**
     * @param {Enemy} enemy
    */
    MoveTheEnemyLinear(enemy) {
        console.log(enemy.direction);
        
        switch (enemy.direction) {
            case TOP_LEFT:
                enemy.setVelocity(-enemy.speed - OFFSET_ORIENTATION * enemy.speed, -enemy.speed)
                enemy.direction = BOTTOM_RIGHT
            break;

            case TOP:
                enemy.setVelocity(0, -enemy.speed)
                enemy.direction = BOTTOM
            break;

            case TOP_RIGHT:
                enemy.setVelocity(enemy.speed + OFFSET_ORIENTATION * enemy.speed, -enemy.speed)
                enemy.direction = BOTTOM_LEFT
            break;

            case LEFT:
                enemy.setVelocity(-enemy.speed, 0)
                enemy.direction = RIGHT
            break;

            case RIGHT:
                enemy.setVelocity(enemy.speed, 0)
                enemy.direction = LEFT
            break;

            case BOTTOM_LEFT:
                enemy.setVelocity(-enemy.speed - OFFSET_ORIENTATION * enemy.speed, enemy.speed)
                enemy.direction = TOP_RIGHT
            break;

            case BOTTOM:
                enemy.setVelocity(0, enemy.speed)
                enemy.direction = TOP            
            break;

            case BOTTOM_RIGHT:
                enemy.setVelocity(enemy.speed + OFFSET_ORIENTATION * enemy.speed, enemy.speed)
                enemy.direction = TOP_LEFT
            break;

            default:
                console.log('wrong position');
            break;
        }        
    }
}