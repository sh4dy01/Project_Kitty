//@ts-check
import Phaser from "phaser";

export default class SecondScene extends Phaser.Scene {

    constructor() {
        super('SecondScene')
    }

    init() {
        this.mapPath = "assets/tiledmap/testmap2.json";

        console.log('loaded: ' + this.mapPath)
    }

    preload() {
        this.load.image("floor", "assets/tiles/floor.png");
        this.load.image("wall", "assets/tiles/wall.png");

        this.load.tilemapTiledJSON(this.scene.key, this.mapPath)
    }

    create() {
        this.scene.start('game', { key: this.scene.key })
    }
}