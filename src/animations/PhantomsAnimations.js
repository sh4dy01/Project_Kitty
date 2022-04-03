// //@ts-check
import Phaser from 'phaser'

/** 
 * @param {Phaser.Animations.AnimationManager} anims 
 * @param {String} phantom 
*/
export function  CreatePurplePhantomAnims(anims, phantom) {
    anims.create({
        key: phantom+'Front',
        frames: anims.generateFrameNames(phantom+'-front'),
        repeat: -1,
        frameRate: 2
    }),
    anims.create({
        key: phantom+'Back',
        frames: anims.generateFrameNames(phantom+'-back'),
        repeat: -1,
        frameRate: 2
    })
}

/** 
 * @param {Phaser.Animations.AnimationManager} anims 
 * @param {String} phantom 
*/
export function  CreateGreenPhantomAnims(anims, phantom) {
    anims.create({
        key: phantom+'Front',
        frames: anims.generateFrameNames(phantom+'-front'),
        repeat: -1,
        frameRate: 3
    }),
    anims.create({
        key: phantom+'Back',
        frames: anims.generateFrameNames(phantom+'-back'),
        repeat: -1,
        frameRate: 3
    })
}

/** 
 * @param {Phaser.Animations.AnimationManager} anims 
 * @param {String} phantom 
*/
export function  CreateRedPhantomAnims(anims, phantom) {
    anims.create({
        key: phantom+'Front',
        frames: anims.generateFrameNames(phantom+'-front'),
        repeat: -1,
        frameRate: 1
    }),
    anims.create({
        key: phantom+'Back',
        frames: anims.generateFrameNames(phantom+'-back'),
        repeat: -1,
        frameRate: 1
    })
}