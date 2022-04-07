//@ts-check
import Phaser, { Physics } from "phaser";
import { ChangeEnemyHitBox } from "../helpers/Utilities";
import { BOTTOM_LEFT, BOTTOM_RIGHT, GREEN, GREEN_SIZE, OFFSET_ORIENTATION, PURPLE, RED, TOP_LEFT, TOP_RIGHT} from "../helpers/Constants";

export default class EnemyManager {     
    /**
     * @param {String} startDirection
     * @param {String} phantomType
     * @param {String} [startOrientataion]
     */
    constructor(startDirection, phantomType, startOrientataion) {
        this.type = phantomType

        switch (this.type) {

            // Vitesse de déplacement du fantôme violet
            case PURPLE:
                this.speed = 2
            break;

            // Vitesse de déplacement du fantôme vert
            case GREEN:
                this.speed = 4
            break;

            // Vitesse de déplacement du fantôme rouge
            case RED:
                this.speed = 1
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

    // Déplacement du fantôme vert plutôt classique, allez-retour mais une vitesse de déplacement augmentée
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

    // Déplacement du fantôme violet, il faut qu'il se déplace en diagonale
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
     * @param {Phaser.Physics.Matter.Sprite} player
     */
    MoveEnemyRed(enemy, manager, colliders, player) {
        console.log(player);
        const direction = Math.atan((player.x - enemy.x) / (player.y - enemy.y));
        const speed2 = player.y >= enemy.y ? manager.speed : -manager.speed;
        
        enemy.x = speed2 * Math.sin(direction)
        enemy.y = speed2 * Math.cos(direction)
    }
}