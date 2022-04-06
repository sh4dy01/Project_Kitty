//@ts-check
import Phaser from "phaser";
import { ChangeEnemyHitBox } from "../helpers/ChangeDepth";
import { BOTTOM_LEFT, BOTTOM_RIGHT, GREEN, GREEN_SIZE, OFFSET_ORIENTATION, PURPLE, RED, TOP_LEFT, TOP_RIGHT} from "../helpers/constants";

export default class EnemyManager {     
    /**
     * @param {String} startDirection
     * @param {String} phantomType
     * @param {String} [startOrientataion]
     */
    constructor(startDirection, phantomType, startOrientataion) {
        this.type = phantomType

        switch (this.type) {
            case PURPLE:
                this.speed = 1
            break;

            case GREEN:
                this.speed = 2
            break;

            case RED:
                this.speed = 0.5
            break;
        
            default:
                console.log('wrong type for speed');
            break;
        }
        this.direction = startDirection;
        this.orientation = startOrientataion;
        this.zig = 0;
    }

    /**
     * @param {Phaser.Physics.Matter.Sprite} enemy
     * @param {EnemyManager} manager
     * @param {any} colliders
    */
    MoveEnemyGreen(enemy, manager, colliders) {  
        const x = enemy.x
        const y = enemy.y

        switch (manager.direction) {
            case TOP_LEFT:
                ChangeEnemyHitBox(enemy, colliders, TOP_LEFT, manager.type)

                enemy.setFlipX(true)
                enemy.setVelocity(-manager.speed - OFFSET_ORIENTATION * manager.speed, -manager.speed)
                enemy.play(manager.type+'Back')
                manager.direction = BOTTOM_RIGHT
            break;

            case TOP_RIGHT:
                ChangeEnemyHitBox(enemy, colliders, TOP_RIGHT, manager.type)

                enemy.setFlipX(false)
                enemy.setVelocity(manager.speed + OFFSET_ORIENTATION * manager.speed, -manager.speed)
                manager.direction = BOTTOM_LEFT
                enemy.play(manager.type+'Back')
            break;

            case BOTTOM_LEFT:
                ChangeEnemyHitBox(enemy, colliders, BOTTOM_LEFT, manager.type)

                enemy.setFlipX(true)
                enemy.setVelocity(-manager.speed - OFFSET_ORIENTATION * manager.speed, manager.speed)
                manager.direction = TOP_RIGHT
                enemy.play(manager.type+'Front')
            break;

            case BOTTOM_RIGHT:
                ChangeEnemyHitBox(enemy, colliders, BOTTOM_RIGHT, manager.type)

                enemy.setFlipX(false)
                enemy.setVelocity(manager.speed + OFFSET_ORIENTATION * manager.speed, manager.speed)
                manager.direction = TOP_LEFT
                enemy.play(manager.type+'Front')
            break;

            default:
                console.log('wrong position');
            break;
        }
        enemy.x = x
        enemy.y = y
    }

    /**
     * @param {Phaser.Physics.Matter.Sprite} enemy
     * @param {EnemyManager} manager
     * @param {any} colliders
    */
    MoveEnemyPurple(enemy, manager, colliders) {  
        const x = enemy.x
        const y = enemy.y
        const NumbZig = 5;

        switch (manager.direction) {
            case TOP_LEFT:
                ChangeEnemyHitBox(enemy, colliders, TOP_LEFT, manager.type)

                enemy.setFlipX(true)
                enemy.setVelocity(-manager.speed - OFFSET_ORIENTATION * manager.speed, -manager.speed)
                enemy.play(manager.type+'Back')

                if(manager.zig<NumbZig){
                    manager.direction = TOP_RIGHT
                    manager.zig = manager.zig + 1
                }
                else{
                    manager.zig = 0
                    manager.direction = BOTTOM_RIGHT
                }
                break;

            case TOP_RIGHT:
                ChangeEnemyHitBox(enemy, colliders, TOP_RIGHT, manager.type)

                enemy.setFlipX(false)
                enemy.setVelocity(manager.speed + OFFSET_ORIENTATION * manager.speed, -manager.speed)
                if(manager.zig<NumbZig){
                    manager.direction = TOP_LEFT
                    manager.zig = manager.zig + 1
                }
                else{
                    manager.zig = 0
                    manager.direction = BOTTOM_LEFT
                }
                enemy.play(manager.type+'Back')
            break;

            case BOTTOM_LEFT:
                ChangeEnemyHitBox(enemy, colliders, BOTTOM_LEFT, manager.type)

                enemy.setFlipX(true)
                enemy.setVelocity(-manager.speed - OFFSET_ORIENTATION * manager.speed, manager.speed)
                if(manager.zig<NumbZig){
                    manager.zig = manager.zig + 1
                    manager.direction = BOTTOM_RIGHT
                }
                else{
                    manager.zig = 0     
                    manager.direction = TOP_RIGHT
                }
                enemy.play(manager.type+'Front')
            break;

            case BOTTOM_RIGHT:
                ChangeEnemyHitBox(enemy, colliders, BOTTOM_RIGHT, manager.type)

                enemy.setFlipX(false)
                enemy.setVelocity(manager.speed + OFFSET_ORIENTATION * manager.speed, manager.speed)
                if(manager.zig<NumbZig){
                    manager.direction = BOTTOM_LEFT
                    manager.zig = manager.zig + 1
                }
                else{
                    manager.zig = 0
                    manager.direction = TOP_LEFT
                }
                enemy.play(manager.type+'Front')
            break;
        }
        enemy.x = x
        enemy.y = y
    }

    /**
     * @param {Phaser.Physics.Matter.Sprite} enemy
     * @param {EnemyManager} manager
     * @param {any} colliders
    */
    MoveEnemyRed(enemy, manager, colliders) {
        
    }
}

