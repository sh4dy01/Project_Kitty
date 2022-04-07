//@ts-check
import Phaser from "phaser";

export default class SoundManager {
    /**
     * @param {Phaser.Sound.NoAudioSoundManager | Phaser.Sound.HTML5AudioSoundManager | Phaser.Sound.WebAudioSoundManager} sound
    */
    constructor(sound) {
        sound.volume = 0.5

        this.entranceCloseSound = sound.add('entrance');
        this.ambientMusic = sound.add('main', {loop: true});
        this.doorSound = sound.add('door');
        this.leverSound = sound.add('lever');
        this.bossSound = sound.add('boss');
        this.catSound = sound.add('cat_sfx');
    }
}