//@ts-check
import Phaser from "phaser";
import { START_LEVEL } from "../helpers/constants";

export default class StartLevel extends Phaser.Scene {

    constructor() {
        super(START_LEVEL)
    }

    /**
     * @param {{ remainingLife: Number }} [data]
    */
    init(data) {
        if (data == null) {
            this.remainingLife = 3;
        } else {
            this.remainingLife = data.remainingLife
        }
        
        this.mapPath = "assets/tiledmap/testmap.json";

        console.log('loaded: ' + this.mapPath)
    }

    preload() {
        this.load.image("floor", "assets/tiles/floor.png");
        this.load.image("wall", "assets/tiles/wall.png");

        this.load.tilemapTiledJSON(this.scene.key, this.mapPath)
    }

    create() {
        this.scene.start('game', { key: this.scene.key, remainingLife: this.remainingLife })
    }
}