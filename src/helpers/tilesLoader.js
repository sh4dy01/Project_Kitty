//@ts-check
import Phaser from "phaser";

export default class TilesLoader {
    constructor(){
        this.wallLayer = null
    }

    /**
        * @param {Phaser.GameObjects.GameObjectFactory} gameObjectFactory
        * @param {String} sceneName
    */

    LoadTilesAssets(gameObjectFactory, sceneName) {
        const map = gameObjectFactory.tilemap(sceneName);  // Ajoute les emplacements de chaque tile
        const floorTileset = map.addTilesetImage("floor", "floor");  // Ajoutes les tiles du sol
        const wallTileset = map.addTilesetImage("wall", "wall");  // Ajoutes les tiles des murs
        console.log(wallTileset);
        console.log(floorTileset);

        const floor = map.createLayer("floor", floorTileset); // Créé un layer pour le sol

        this.wallLayer = map.createLayer("wall", wallTileset); // Créé un layer pour les murs
        this.wallLayer.setCollisionByProperty({ collides: true })

        console.log(this.wallLayer)
        const debugGraphics = gameObjectFactory.graphics().setAlpha(0.7);
        this.wallLayer.renderDebug(debugGraphics, {
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
    LoadTileMap(loader, mapName) {
        loader.tilemapTiledJSON("map", ["assets/tiledmap/" + mapName + ".json"]);  
    }
}
