//@ts-check

import Phaser from "phaser";
import { ChangeEnemyHitBox } from "../helpers/ChangeDepth";
import { BOTTOM_LEFT, BOTTOM_RIGHT, BOTTOM, RIGHT, OFFSET_ORIENTATION, TOP, LEFT, TOP_LEFT, TOP_RIGHT} from "../helpers/constants";

/**
 * @param {String} startDirection
 */

export default class BossManager extends Phaser.Physics.Matter.Sprite{
    constructor(matter, x, y, textures){
        super(matter, x, y, textures)
        this.direction = "bottom";
        this.speed = 1
    }
    
    MoveBoss(boss, manager, colliders){
        const x = boss.x
        const y = boss.y
        console.log(manager);
        switch (manager.direction) {
            case TOP:
                boss.setFlipX(true)
                boss.setVelocity(-manager.speed - OFFSET_ORIENTATION * manager.speed, -manager.speed)
                boss.play(manager.type+'Back')
                manager.direction = BOTTOM
            break;

            case LEFT:

                boss.setFlipX(false)
                boss.setVelocity(manager.speed + OFFSET_ORIENTATION * manager.speed, -manager.speed)
                manager.direction = RIGHT
                boss.play(manager.type+'Back')
            break;

            case RIGHT:

                boss.setFlipX(true)
                boss.setVelocity(-manager.speed - OFFSET_ORIENTATION * manager.speed, manager.speed)
                manager.direction = LEFT
                boss.play(manager.type+'Front')
            break;

            case BOTTOM:

                boss.setFlipX(false)
                boss.setVelocity(manager.speed + OFFSET_ORIENTATION * manager.speed, manager.speed)
                manager.direction = TOP
                boss.play(manager.type+'Front')
            break;

            default:
                console.log('wrong position');
            break;
        }
        boss.x = x
        boss.y = y
    }
}