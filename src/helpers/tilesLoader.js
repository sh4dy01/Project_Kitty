//@ts-check
import Phaser from "phaser";

/**
    * @param {Phaser.GameObjects.GameObjectFactory} gameObjectFactory
    * @param {Phaser.Physics.Matter.MatterPhysics} matter
*/
export function LoadTilesAssets(gameObjectFactory, matter) {
    const map = gameObjectFactory.tilemap("map");  // Ajoute les emplacements de chaque tile
    const floorTileset = map.addTilesetImage("floor", "floor");  // Ajoutes les tiles du sol
    const wallTileset = map.addTilesetImage("wall", "wall");  // Ajoutes les tiles des murs

    const floor = map.createLayer("floor", floorTileset); // Créé un layer pour le sol
    const wall = map.createLayer("wall", wallTileset); // Créé un layer pour les murs

    wall.setCollisionByProperty({ collides: true })
    matter.world.convertTilemapLayer(wall);

    const debugGraphics = gameObjectFactory.graphics().setAlpha(0.7);
    wall.renderDebug(debugGraphics, {
        tileColor: null,
        collidingTileColor: new Phaser.Display.Color(243, 234, 48, 255),
        faceColor: new Phaser.Display.Color(40, 39, 37, 255)
    })

    return map
}

/**
    * @param {Phaser.Loader.LoaderPlugin} loader
    * @param {String} mapName
*/
export function LoadTileMap(loader, mapName) {
    loader.tilemapTiledJSON("map", ["assets/tiledmap/" + mapName + ".json"]);  
}