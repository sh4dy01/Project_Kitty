// //@ts-check
import Phaser from 'phaser'

/** 
 * @param {Phaser.Animations.AnimationManager} anims 
*/
export function CreatePlayerAnims(anims) {
    const framerate = 3
    // Animation de déplacement du joueur vers le haut + la sprite du joueur qui correspond à la direction du joueur
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
    // Animation de déplacement du joueur en haut à gauche + la sprite du joueur qui correspond à la direction du joueur
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
    // Animation de déplacement du joueur vers le bas + la sprite du joueur qui correspond à la direction du joueur
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
    // Animation de déplacement du joueur en bas à droite + la sprite du joueur qui correspond à la direction du joueur
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
    // Animation de déplacement du joueur vers la droite + la sprite du joueur qui correspond à la direction du joueur
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

// Les animations pour le bottom-left et top-right sont flipées dans le fichier PlayerManagement.js