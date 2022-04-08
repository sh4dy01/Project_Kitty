//@ts-check
import Phaser from "phaser";
import { MAX_LIVES} from "../helpers/Constants";

export default class LevelLoader extends Phaser.Scene {

    constructor() {
        super('LevelMap')
    }

    /**
     * @param {{ remainingLife: Number; level: Number;}} data
    */
    init(data) {
        if (data.remainingLife === 0 || data.level === 0 || data == null) {
            this.remainingLife = MAX_LIVES;
            this.level = 8
        } else {
            this.remainingLife = data.remainingLife
            this.level = data.level
        }

        console.log('loaded level: ' + this.level)
    }

    preload() {
        this.load.tilemapTiledJSON("map"+this.level, "assets/tiledmap/Levels/level"+this.level+".json")
    }

    create() {
        this.scene.start('game', { level: this.level, remainingLife: this.remainingLife })
    }
}