//@ts-check
import Phaser from "phaser";
import { BOTTOM_LEFT, BOTTOM_RIGHT, OFFSET_ORIENTATION, TOP_LEFT, TOP_RIGHT } from "../helpers/constants";

export default class EnemyManager {     
    /**
     * @param {String} startDirection
     * @param {String} phantomType
     */
    constructor(startDirection, phantomType) {
        this.type = phantomType

        switch (this.type) {
            case 'purple':
                this.speed = 1
            break;

            case 'green':
                this.speed = 2
            break;

            case 'red':
                this.speed = 0.5
            break;
        
            default:
                console.log('wrong type for speed');
            break;
        }
        this.direction = startDirection;
    }
    
    /**
     * @param {Phaser.Physics.Matter.Sprite} enemy
     * @param {EnemyManager} manager
     * @param {any} colliders
    */
    MoveTheEnemyLinear(enemy, manager, colliders) {  
        const x = enemy.x
        const y = enemy.y

        switch (manager.direction) {
            case TOP_LEFT:
                switch (manager.type) {
                    case 'purple':
                        enemy.setBody(colliders.purple_top_left)
                    break;
        
                    case 'green':
                        enemy.setBody(colliders.green_top_left)
                    break;
        
                    case 'red':
                        enemy.setBody(colliders.red_top_left)
                    break;
        
                    default:
                        console.log('wrong type');
                    break;
                }
                enemy.setFlipX(true)
                enemy.setVelocity(-manager.speed - OFFSET_ORIENTATION * manager.speed, -manager.speed)
                enemy.play(manager.type+'Back')
                manager.direction = BOTTOM_RIGHT
            break;

            case TOP_RIGHT:
                switch (manager.type) {
                    case 'purple':
                        enemy.setBody(colliders.purple_top_right)
                    break;
        
                    case 'green':
                        enemy.setBody(colliders.green_top_right)
                    break;
        
                    case 'red':
                        enemy.setBody(colliders.red_top_right)
                    break;
        
                    default:
                        console.log('wrong type');
                    break;
                }
                enemy.setFlipX(false)
                enemy.setVelocity(manager.speed + OFFSET_ORIENTATION * manager.speed, -manager.speed)
                manager.direction = BOTTOM_LEFT
                enemy.play(manager.type+'Back')
            break;

            case BOTTOM_LEFT:
                switch (manager.type) {
                    case 'purple':
                        enemy.setBody(colliders.purple_bottom_left)
                    break;
        
                    case 'green':
                        enemy.setBody(colliders.green_bottom_left)
                    break;
        
                    case 'red':
                        enemy.setBody(colliders.red_bottom_left)
                    break;
        
                    default:
                        console.log('wrong type');
                    break;
                }
                enemy.setFlipX(true)
                enemy.setVelocity(-manager.speed - OFFSET_ORIENTATION * manager.speed, manager.speed)
                manager.direction = TOP_RIGHT
                enemy.play(manager.type+'Front')
            break;

            case BOTTOM_RIGHT:
                switch (manager.type) {
                    case 'purple':
                        enemy.setBody(colliders.purple_bottom_right)
                    break;
        
                    case 'green':
                        enemy.setBody(colliders.green_bottom_right)
                    break;
        
                    case 'red':
                        enemy.setBody(colliders.red_bottom_right)
                    break;
        
                    default:
                        console.log('wrong type');
                    break;
                }
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

}