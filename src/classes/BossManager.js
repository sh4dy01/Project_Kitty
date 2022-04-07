//@ts-check

import Phaser, { Scene } from "phaser";
import { ChangeDepth, ChangeEnemyHitBox } from "../helpers/Utilities";
import { BOTTOM_LEFT, BOTTOM_RIGHT, BOTTOM, RIGHT, OFFSET_ORIENTATION, TOP, LEFT, TOP_LEFT, TOP_RIGHT, SINGLE_DIRECTION_MULTIPLIER, BOSS_SPEED_BOSST} from "../helpers/Constants";

/**
 * @param {String} startDirection
 */

export default class BossManager extends Phaser.Physics.Matter.Sprite{

    /**
     * @param {{ scene: Phaser.Scene; x: number; y: number; texture: string; frame: string; }} config
     * @param {any} colliders
     */
    constructor(config, colliders){
        super(config.scene.matter.world, config.x, config.y, config.texture, config.frame)
        this.colliders = colliders

		this.setFrictionAir(0.0005)
		this.setBounce(.1)
        this.setDepth(config.y)

        const direction = ["left", "bottom-left", "top-left", "right", "bottom-right", "top-right", "top", "bottom"];
        this.direction = direction[Math.floor(Math.random()*direction.length)];
        this.setFrame(this.direction+'.png')
        this.setBody(this.colliders['boss_'+this.direction])

        console.log(this.direction);

        this.speed = 4
        config.scene.add.existing(this)
    }

    preUpdate(t, dt) {
		super.preUpdate(t, dt)

        this.MoveBoss()
	}
    
    MoveBoss(){
        switch (this.direction) {
            case LEFT:
                this.setVelocity(-this.speed - OFFSET_ORIENTATION * this.speed, -this.speed)
            break;

            case "left-bottom":
                this.setVelocity(-this.speed * SINGLE_DIRECTION_MULTIPLIER, 0)
            break;

            case "left-top":
                this.setVelocity(0, -this.speed * SINGLE_DIRECTION_MULTIPLIER)
            break;

            case TOP:
                this.setVelocity(this.speed + OFFSET_ORIENTATION * this.speed, -this.speed)
            break;

            case "top-left":
                this.setVelocity(0, -this.speed * SINGLE_DIRECTION_MULTIPLIER)
            break;

            case "top-right":
                this.setVelocity(+this.speed * SINGLE_DIRECTION_MULTIPLIER, 0)
            break;

            case BOTTOM:
                this.setVelocity(-this.speed - OFFSET_ORIENTATION * this.speed, this.speed)
            break;

            case "bottom-left":
                this.setVelocity(-this.speed * SINGLE_DIRECTION_MULTIPLIER, 0)
            break;

            case "bottom-right":
                this.setVelocity(0, +this.speed * SINGLE_DIRECTION_MULTIPLIER)
            break;

            case RIGHT:
                this.setVelocity(this.speed + OFFSET_ORIENTATION * this.speed, this.speed)
            break;

            case "right-bottom":
                this.setVelocity(0, this.speed * SINGLE_DIRECTION_MULTIPLIER)
            break;

            case "right-top":
                this.setVelocity(this.speed * SINGLE_DIRECTION_MULTIPLIER, 0)
            break;
                    
            default:
                console.log('wrong this position');
            break;
        }
        ChangeDepth(this)
    }

    /** @param {string} direction*/
    ChangeBody(direction) {
        let tempx = this.x
        let tempy = this.y
        this.speed += BOSS_SPEED_BOSST
        console.log(direction);

        if (direction === TOP_LEFT || direction === TOP_RIGHT || direction === BOTTOM_RIGHT || direction === TOP || direction === BOTTOM || direction === BOTTOM_RIGHT || direction === BOTTOM_LEFT || direction === 'right' || direction === 'left') {
            this.setFrame(direction+'.png')
            this.setBody(this.colliders['boss_'+direction])
        } else if (direction === 'left-top'){
            this.setFrame('top.png')
            this.setBody(this.colliders['boss_top'])
        } else if (direction === 'right-top') {
            this.setFrame('right.png')
            this.setBody(this.colliders['boss_right'])
        } else if (direction === 'left-bottom') {
            this.setFrame('bottom-left.png')
            this.setBody(this.colliders['boss_bottom-left'])
        } else if (direction === 'right-bottom') {
            this.setFrame('bottom.png')
            this.setBody(this.colliders['boss_bottom'])
        } else {
            console.log('missing direction');
        }
        this.x = tempx
        this.y = tempy
    }
}