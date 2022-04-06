//@ts-check

import Phaser from "phaser";
import { ChangeDepth, ChangeEnemyHitBox } from "../helpers/ChangeDepth";
import { BOTTOM_LEFT, BOTTOM_RIGHT, BOTTOM, RIGHT, OFFSET_ORIENTATION, TOP, LEFT, TOP_LEFT, TOP_RIGHT, SINGLE_DIRECTION_MULTIPLIER} from "../helpers/constants";

/**
 * @param {String} startDirection
 */

export default class BossManager{
    constructor(){
        this.direction = "bottom";
        this.speed = 2
    }

    // Déplacement du boss avec un switch pour pouvoir manipuler plus facilement les directions pour l'automatisation
    MoveBoss(boss, manager, colliders){
        console.log(manager.direction);
        const x = boss.x
        const y = boss.y
        switch (manager.direction) {
            case LEFT:
                boss.setFlipX(true)
                boss.setVelocity(-manager.speed - OFFSET_ORIENTATION * manager.speed, -manager.speed)
            break;
            case "left-bottom":
                boss.setFlipX(true)
                boss.setVelocity(-manager.speed * SINGLE_DIRECTION_MULTIPLIER, 0)
                break;
            case "left-top":
                    boss.setFlipX(false)
                    boss.setVelocity(0, -manager.speed * SINGLE_DIRECTION_MULTIPLIER,)
            break;


            case TOP:
                boss.setFlipX(false)
                boss.setVelocity(manager.speed + OFFSET_ORIENTATION * manager.speed, -manager.speed)
            break;
            case "top-left":
                boss.setFlipX(true)
                boss.setVelocity(0, -manager.speed * SINGLE_DIRECTION_MULTIPLIER)
                break;
                case "top-right":
                    boss.setFlipX(false)
                    boss.setVelocity(+manager.speed * SINGLE_DIRECTION_MULTIPLIER, 0)
            break;


            case BOTTOM:
                boss.setFlipX(true)
                boss.setVelocity(-manager.speed - OFFSET_ORIENTATION * manager.speed, manager.speed)
            break;
            case "bottom-left":
                boss.setFlipX(true)
                boss.setVelocity(-manager.speed * SINGLE_DIRECTION_MULTIPLIER, 0)
                break;
                case "bottom-right":
                    boss.setFlipX(false)
                    boss.setVelocity(0, +manager.speed * SINGLE_DIRECTION_MULTIPLIER)
            break;


            case RIGHT:
                boss.setFlipX(false)
                boss.setVelocity(manager.speed + OFFSET_ORIENTATION * manager.speed, manager.speed)
            break;
            case "right-bottom":
                boss.setFlipX(true)
                boss.setVelocity(0, manager.speed * SINGLE_DIRECTION_MULTIPLIER)
                break;
            case "right-top":
                boss.setFlipX(false)
                boss.setVelocity(manager.speed * SINGLE_DIRECTION_MULTIPLIER, 0)
                break;
                    
                    default:
                console.log('wrong position');
            break;
        }
        boss.x = x
        boss.y = y
        ChangeDepth(boss)
    }
}