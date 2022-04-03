// //@ts-check
import Phaser from 'phaser'

/** 
 * @param {Phaser.Animations.AnimationManager} anims 
 * @param {String} phantom 
*/
const createPhantomAnims = (anims, phantom)=>{
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

export {
    createPhantomAnims
}