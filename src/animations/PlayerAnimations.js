// //@ts-check
import Phaser from 'phaser'

/** 
 * @param {Phaser.Animations.AnimationManager} anims 
 * @param {String} phantom 
*/
export function CreatePlayerAnims(anims) {
    const framerate = 3
    
    anims.create({
        key: 'playerUp',
        frames: anims.generateFrameNames('player',{
            start: 1,
            end: 2,
            prefix: 'back-up ',
            suffix: '.png'
        }),
        repeat: -1,
        frameRate: framerate
    }),
    anims.create({
        key: 'playerTopLeft',
        frames: anims.generateFrameNames('player',{
            start: 1,
            end: 2,
            prefix: 'back-left-up ',
            suffix: '.png'
        }),
        repeat: -1,
        frameRate: framerate
    }),
    anims.create({
        key: 'playerDown',
        frames: anims.generateFrameNames('player',{
            start: 1,
            end: 2,
            prefix: 'face-down ',
            suffix: '.png'
        }),
        repeat: -1,
        frameRate: framerate
    }),
    anims.create({
        key: 'playerBottomRight',
        frames: anims.generateFrameNames('player',{
            start: 1,
            end: 2,
            prefix: 'face-right-down ',
            suffix: '.png'
        }),
        repeat: -1,
        frameRate: framerate
    }),
    anims.create({
        key: 'playerRight',
        frames: anims.generateFrameNames('player',{
            start: 1,
            end: 2,
            prefix: 'right ',
            suffix: '.png'
        }),
        repeat: -1,
        frameRate: framerate
    })
}