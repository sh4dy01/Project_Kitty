//@ts-check
import Phaser from "phaser";

export default class SecondScene extends Phaser.Scene {

    constructor() {
        super('SecondScene')
    }

    init() {
        this.mapPath = "assets/tiledmap/testmap.json";
        this.canLoadNextScene = true;
        console.log('loaded: ' + this.mapPath)
    }

    preload() {
        this.load.image("floor", "assets/tiles/floor.png");

        this.load.tilemapTiledJSON(this.scene.key + " map", this.mapPath)
    }

    create() {
        this.scene.start('game', { key: this.scene.key })
    }
}