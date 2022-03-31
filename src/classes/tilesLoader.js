//@ts-check
import Phaser from "phaser";

/**
    * @param {Phaser.GameObjects.GameObjectFactory} gameObjectFactory
*/
export function LoadTilesAssets(gameObjectFactory) {
    const map = gameObjectFactory.tilemap("map");  // Ajoute les emplacements de chaque tile
    const floorTileset = map.addTilesetImage("floor", "floor");  // Ajoutes les tiles du sol
    //const wallTileset = map.addTilesetImage("wall", "wall");  // Ajoutes les tiles des murs

    const floor = map.createLayer("floor", floorTileset); // Créé un layer pour le sol
    //const wall = map.createLayer("wall", wallTileset); // Créé un layer pour les murs

    return map
}

/**
    * @param {Phaser.Loader.LoaderPlugin} loader
    * @param {String} mapName
*/
export function LoadTileMap(loader, mapName) {
    loader.tilemapTiledJSON("map", ["assets/tiledmap/" + mapName + ".json"]);  
}