//@ts-check

import Phaser from "phaser";
import { ChangeEnemyHitBox } from "../helpers/ChangeDepth";
import { BOTTOM_LEFT, BOTTOM_RIGHT, BOTTOM, RIGHT, OFFSET_ORIENTATION, TOP, LEFT, TOP_LEFT, TOP_RIGHT} from "../helpers/constants";

/**
 * @param {String} startDirection
 */

export default class BossManager{
    constructor(){
        this.direction = "bottom";
        this.speed = 1
    }
    
    MoveBoss(boss, manager, colliders){
        const x = boss.x
        const y = boss.y
        switch (manager.direction) {
            case TOP:
                boss.setFlipX(true)
                boss.setVelocity(-manager.speed - OFFSET_ORIENTATION * manager.speed, -manager.speed)
            break;

            case LEFT:

                boss.setFlipX(false)
                boss.setVelocity(manager.speed + OFFSET_ORIENTATION * manager.speed, -manager.speed)
            break;

            case RIGHT:

                boss.setFlipX(true)
                boss.setVelocity(-manager.speed - OFFSET_ORIENTATION * manager.speed, manager.speed)
            break;

            case BOTTOM:

                boss.setFlipX(false)
                boss.setVelocity(manager.speed + OFFSET_ORIENTATION * manager.speed, manager.speed)
            break;

            default:
                console.log('wrong position');
            break;
        }
        boss.x = x
        boss.y = y
    }
}