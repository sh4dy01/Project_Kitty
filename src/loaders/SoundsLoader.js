import Phaser from 'phaser';

export default class SoundsLoader extends Phaser.Scene {

    constructor() {
      super('SoundsLoader');
    }

    preload() {
      this.load.audio
    }

}