import Phaser from 'phaser';
import { INTRO_SCREEN, TEXTURES_LOADER } from '../helpers/Constants';

export default class SoundsLoader extends Phaser.Scene {

    constructor() {
      super('SoundsLoader');
    }

    preload() {
      this.load.audio('ambiant_sfx', ['assets/SFX/ambiant_sfx.ogg','assets/SFX/ambiant_sfx.mp3']);
      this.load.audio('cat_sfx', ['assets/SFX/cat_sfx.ogg','assets/SFX/cat_sfx.mp3']);
      this.load.audio('door', ['assets/SFX/door.ogg','assets/SFX/door.mp3']);
      this.load.audio('main', ['assets/SFX/main_music.ogg','assets/SFX/main_music.mp3']);
    }

    create() {
      this.scene.start(TEXTURES_LOADER)
    }
}