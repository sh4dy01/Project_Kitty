//@ts-check
import Phaser from "phaser";
import { MAX_LIVES} from "../helpers/constants";

export default class LevelLoader extends Phaser.Scene {

    constructor() {
        super('LevelMap')
    }

    /**
     * @param {{ remainingLife: Number; level: Number;}} data
    */
    init(data) {
        if (data.remainingLife === 0) {
            this.remainingLife = MAX_LIVES;
            this.level = 0
        } else {
            this.remainingLife = data.remainingLife
            this.level = data.level++
        }
        this.remainingLife = MAX_LIVES;
        this.level = 8
        console.log('loaded: ' + this.level)
    }

    preload() {
        this.load.tilemapTiledJSON("map", "assets/tiledmap/proto.json")
    }

    create() {
        this.scene.start('game', { level: this.level, remainingLife: this.remainingLife })
    }
}