import Phaser from 'phaser';

export default class SoundsLoader extends Phaser.Scene {

    constructor() {
      super('SoundsLoader');
    }

    preload() {
      this.load.audio('ambiant_sfx', ['assets/SFX/ambiant_sfx.ogg','assets/SFX/ambiant_sfx.mp3']);
      this.load.audio('cat_sfx', ['assets/SFX/cat_sfx.ogg','assets/SFX/cat_sfx.mp3']);
      this.load.audio('door', ['assets/SFXdoor.ogg','assets/SFX/door.mp3']);
      this.load.audio('main', ['assets/SFX/main_music.ogg','assets/SFX/main_music.mp3']);
    }

}