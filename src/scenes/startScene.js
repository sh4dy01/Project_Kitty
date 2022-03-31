//@ts-check
import Phaser from "phaser";

export default class StartScene extends Phaser.Scene {

    constructor() {
        super('StartScene')
    }

    init() {
        this.mapPath = "assets/tiledmap/testmap2.json";
        this.canLoadNextScene = true;
        console.log('loaded: ' + this.mapPath)
    }

    preload() {
        this.load.image("floor", "assets/tiles/floor.png");
        this.load.image("wall", "assets/tiles/wall.png");

        this.load.tilemapTiledJSON(this.scene.key + " map", this.mapPath)
    }

    create() {
        this.scene.start('game', { key: this.scene.key })
    }
}