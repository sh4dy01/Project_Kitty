//@ts-check
import Phaser from "phaser";

/**
    * @param {Phaser.Loader.LoaderPlugin} loader
    * @param {String} mapName
*/
export function LoadTileMap(loader, mapName) {
    loader.tilemapTiledJSON("map", "assets/tiledmap/" + mapName + ".json");
}