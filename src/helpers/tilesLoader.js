//@ts-check
import Phaser from "phaser";

export default class TilesLoader {
    constructor(){
    }

    /**
        * @param {Phaser.Loader.LoaderPlugin} loader
        * @param {String} mapName
    */
    LoadTileMap(loader, mapName) {
        loader.tilemapTiledJSON("map", ["assets/tiledmap/" + mapName + ".json"]);  
    }
}
