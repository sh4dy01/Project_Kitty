//@ts-check
import Phaser from "phaser";
import { BOTTOM, BOTTOM_LEFT, BOTTOM_RIGHT, GREEN, LEFT, OFFSET_ORIENTATION, RIGHT, TOP, TOP_LEFT, TOP_RIGHT } from "../helpers/constants";
import PlayerManager from "./player";

export default class Enemy extends Phaser.Physics.Matter.Sprite {     
    /**
     * @param {{world: Phaser.Physics.Matter.World; x: Number; y: Number; texture?: String | Phaser.Textures.Texture ; options?: Phaser.Types.Physics.Matter.MatterBodyConfig;}} config
     * @param {String} startDirection
     * @param {Phaser.Types.Physics.Matter.MatterSetBodyConfig} collider
     * @param {String} phantomType
     */
    constructor(config, startDirection, collider, phantomType) {
        super(config.world, config.x, config.y, config.texture, null, config.options)
        this.setBody(collider);

        // @ts-ignore
        this.setTexture(config.texture);

        this.type = phantomType
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
                enemy.play(enemy.type+TOP_LEFT)
            break;

            case TOP_RIGHT:
                enemy.setVelocity(enemy.speed + OFFSET_ORIENTATION * enemy.speed, -enemy.speed)
                enemy.direction = BOTTOM_LEFT
                enemy.play(enemy.type+TOP_RIGHT)
            break;

            case BOTTOM_LEFT:
                enemy.setVelocity(-enemy.speed - OFFSET_ORIENTATION * enemy.speed, enemy.speed)
                enemy.direction = TOP_RIGHT
                enemy.play(enemy.type+BOTTOM_LEFT)
            break;

            case BOTTOM_RIGHT:
                enemy.setVelocity(enemy.speed + OFFSET_ORIENTATION * enemy.speed, enemy.speed)
                enemy.direction = TOP_LEFT
                enemy.play(enemy.type+BOTTOM_RIGHT)
            break;

            default:
                console.log('wrong position');
            break;
        }        
    }
}