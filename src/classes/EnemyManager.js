//@ts-check
import Phaser, { Physics } from "phaser";
import { ChangeEnemyHitBox } from "../helpers/Utilities";
import { BOTTOM_LEFT, BOTTOM_RIGHT, GREEN, GREEN_SIZE, OFFSET_ORIENTATION, PURPLE, RED, TOP_LEFT, TOP_RIGHT} from "../helpers/Constants";
import PlayerManager from "./PlayerManager";

export default class EnemyManager {     
    /**
     * @param {String} startDirection
     * @param {String} phantomType
     * @param {any} colliders
     * @param {String} startOrientataion
     */
    constructor(startDirection, phantomType, colliders, startOrientataion) {
        this.type = phantomType
        this.colliders = colliders

        switch (this.type) {

            // Vitesse de déplacement du fantôme violet
            case PURPLE:
                this.speed = 2
                this.zig = 0;
                this.orientation = startOrientataion;
            break;

            // Vitesse de déplacement du fantôme vert
            case GREEN:
                this.speed = 4
            break;

            // Vitesse de déplacement du fantôme rouge
            case RED:
                this.speed = 1.2
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
    */

    // Déplacement du fantôme vert plutôt classique, allez-retour mais une vitesse de déplacement augmentée
    MoveEnemyGreen(enemy, manager) {  
        const x = enemy.x
        const y = enemy.y

        switch (manager.direction) {
            case TOP_LEFT:
                ChangeEnemyHitBox(enemy, manager.colliders, TOP_LEFT, manager.type)

                enemy.setFlipX(true)
                enemy.setVelocity(-manager.speed - OFFSET_ORIENTATION * manager.speed, -manager.speed)
                enemy.play(manager.type+'Back')
                manager.direction = BOTTOM_RIGHT
            break;

            case TOP_RIGHT:
                ChangeEnemyHitBox(enemy, manager.colliders, TOP_RIGHT, manager.type)

                enemy.setFlipX(false)
                enemy.setVelocity(manager.speed + OFFSET_ORIENTATION * manager.speed, -manager.speed)
                manager.direction = BOTTOM_LEFT
                enemy.play(manager.type+'Back')
            break;

            case BOTTOM_LEFT:
                ChangeEnemyHitBox(enemy, manager.colliders, BOTTOM_LEFT, manager.type)

                enemy.setFlipX(true)
                enemy.setVelocity(-manager.speed - OFFSET_ORIENTATION * manager.speed, manager.speed)
                manager.direction = TOP_RIGHT
                enemy.play(manager.type+'Front')
            break;

            case BOTTOM_RIGHT:
                ChangeEnemyHitBox(enemy, manager.colliders, BOTTOM_RIGHT, manager.type)

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
    */

    // Déplacement du fantôme violet, il faut qu'il se déplace en diagonale
    MoveEnemyPurple(enemy, manager) {  

        const x = enemy.x
        const y = enemy.y
        const NumbZig = 5;

        switch (manager.direction) {
            case TOP_LEFT:
                ChangeEnemyHitBox(enemy, manager.colliders, TOP_LEFT, manager.type)

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
                ChangeEnemyHitBox(enemy, manager.colliders, TOP_RIGHT, manager.type)

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
                ChangeEnemyHitBox(enemy, manager.colliders, BOTTOM_LEFT, manager.type)

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
                ChangeEnemyHitBox(enemy, manager.colliders, BOTTOM_RIGHT, manager.type)

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
     * @param {Phaser.Physics.Matter.Sprite} player
     * @param {PlayerManager} playerManager
     */
    MoveEnemyRed(enemy, manager, player, playerManager) {
        if (playerManager.isSafe === false) {
            const direction = Math.atan((player.x - enemy.x) / (player.y - enemy.y));
            const speed2 = player.y >= enemy.y ? manager.speed : -manager.speed;

            const tempX = enemy.x
            const tempY = enemy.y

            if ((speed2 * Math.sin(direction) > 0) && speed2 * Math.cos(direction) > 0 && manager.direction !== BOTTOM_RIGHT ) {
                manager.direction = BOTTOM_RIGHT
                if (enemy.anims.isPaused) {
                    enemy.anims.resume()
                } else {
                    enemy.play(manager.type+'Front')
                }
                enemy.setFlipX(false);
                enemy.setBody(manager.colliders[RED+'_'+manager.direction])            
            } else if ((speed2 * Math.sin(direction) < 0) && speed2 * Math.cos(direction) > 0 && manager.direction !== BOTTOM_LEFT) {
                manager.direction = BOTTOM_LEFT
                if (enemy.anims.isPaused) {
                    enemy.anims.resume()
                } else {
                    enemy.play(manager.type+'Front')
                }
                enemy.setFlipX(true);
                enemy.setBody(manager.colliders[RED+'_'+manager.direction])
            } else if ((speed2 * Math.sin(direction) > 0) && speed2 * Math.cos(direction) < 0 && manager.direction !== TOP_RIGHT) {
                manager.direction = TOP_RIGHT
                if (enemy.anims.isPaused) {
                    enemy.anims.resume()
                } else {
                    enemy.play(manager.type+'Back')
                }
                enemy.setFlipX(false);
                enemy.setBody(manager.colliders[RED+'_'+manager.direction])
            } else if ((speed2 * Math.sin(direction) < 0) && speed2 * Math.cos(direction) < 0 && manager.direction !== TOP_LEFT){
                manager.direction = TOP_LEFT
                if (enemy.anims.isPaused) {
                    enemy.anims.resume()
                } else {
                    enemy.play(manager.type+'Back')
                }
                enemy.setFlipX(true);
                enemy.setBody(manager.colliders[RED+'_'+manager.direction])
            }
            enemy.x = tempX
            enemy.y = tempY
            enemy.setVelocity(speed2 * Math.sin(direction), speed2 * Math.cos(direction))
        } else {
            enemy.setVelocity(0, 0)
            enemy.anims.pause()
        }
    }
}