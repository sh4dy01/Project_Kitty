//@ts-check

import Phaser from "phaser";
import { ChangeDepth, ChangeEnemyHitBox } from "../helpers/ChangeDepth";
import { BOTTOM_LEFT, BOTTOM_RIGHT, BOTTOM, RIGHT, OFFSET_ORIENTATION, TOP, LEFT, TOP_LEFT, TOP_RIGHT, SINGLE_DIRECTION_MULTIPLIER} from "../helpers/constants";

/**
 * @param {String} startDirection
 */

export default class BossManager{
    constructor(colliders){
        this.direction = "bottom";
        this.speed = 2
        this.colliders = colliders
    }

    
    /**
     * @param {Phaser.Physics.Matter.Sprite} boss
     * @param {BossManager} manager
     */
    MoveBoss(boss, manager){
        console.log(manager.direction);
        const x = boss.x
        const y = boss.y

        switch (manager.direction) {
            case LEFT:
                boss.setFlipX(true)
                boss.setVelocity(-manager.speed - OFFSET_ORIENTATION * manager.speed, -manager.speed)
                // ChangeEnemyHitBox(boss, this.colliders, LEFT, 'boss')
            break;

            case "left-bottom":
                boss.setFlipX(true)
                boss.setVelocity(-manager.speed * SINGLE_DIRECTION_MULTIPLIER, 0)
                // ChangeEnemyHitBox(boss, this.colliders, 'left-bottom', 'boss')
            break;

            case "left-top":
                boss.setFlipX(false)
                boss.setVelocity(0, -manager.speed * SINGLE_DIRECTION_MULTIPLIER)
                // ChangeEnemyHitBox(boss, this.colliders, 'left-top', 'boss')
            break;

            case TOP:
                boss.setFlipX(false)
                boss.setVelocity(manager.speed + OFFSET_ORIENTATION * manager.speed, -manager.speed)
                // ChangeEnemyHitBox(boss, this.colliders, TOP, 'boss')
            break;

            case "top-left":
                boss.setFlipX(true)
                boss.setVelocity(0, -manager.speed * SINGLE_DIRECTION_MULTIPLIER)
                // ChangeEnemyHitBox(boss, this.colliders, 'top-left', 'boss')
            break;

            case "top-right":
                boss.setFlipX(false)
                boss.setVelocity(+manager.speed * SINGLE_DIRECTION_MULTIPLIER, 0)
                // ChangeEnemyHitBox(boss, this.colliders, 'top-right', 'boss')
            break;

            case BOTTOM:
                boss.setFlipX(true)
                boss.setVelocity(-manager.speed - OFFSET_ORIENTATION * manager.speed, manager.speed)
                // ChangeEnemyHitBox(boss, this.colliders, BOTTOM, 'boss')
            break;

            case "bottom-left":
                boss.setFlipX(true)
                boss.setVelocity(-manager.speed * SINGLE_DIRECTION_MULTIPLIER, 0)
                // ChangeEnemyHitBox(boss, this.colliders, 'bottom-left', 'boss')
            break;

            case "bottom-right":
                boss.setFlipX(false)
                boss.setVelocity(0, +manager.speed * SINGLE_DIRECTION_MULTIPLIER)
                // ChangeEnemyHitBox(boss, this.colliders, "bottom-right", 'boss')
            break;

            case RIGHT:
                boss.setFlipX(false)
                boss.setVelocity(manager.speed + OFFSET_ORIENTATION * manager.speed, manager.speed)
                // ChangeEnemyHitBox(boss, this.colliders, RIGHT, 'boss')
            break;

            case "right-bottom":
                boss.setFlipX(true)
                boss.setVelocity(0, manager.speed * SINGLE_DIRECTION_MULTIPLIER)
                // ChangeEnemyHitBox(boss, this.colliders, 'right-bottom', 'boss')
            break;

            case "right-top":
                boss.setFlipX(false)
                boss.setVelocity(manager.speed * SINGLE_DIRECTION_MULTIPLIER, 0)
                // ChangeEnemyHitBox(boss, this.colliders, 'right-top', 'boss')
            break;
                    
            default:
                console.log('wrong boss position');
            break;
        }
        boss.x = x
        boss.y = y
        ChangeDepth(boss)
    }
}