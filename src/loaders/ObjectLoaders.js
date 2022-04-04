//@ts-check
import Phaser from "phaser";

import EnemyManager from "../classes/EnemyManager";
import { ConvertXCartesianToIsometric, ConvertYCartesianToIsometric } from "../helpers/CartesianToIsometric";
import { TOP_LEFT, TOP_RIGHT } from "../helpers/constants";

/**
    * @param {Phaser.Loader.LoaderPlugin} loader
    * @param {String} mapName
*/
export function LoadTileMap(loader, mapName) {
    loader.tilemapTiledJSON("map", "assets/tiledmap/" + mapName + ".json");
}

/**
 * @param {EnemyManager[]} enemiesAIManager
 * @param {Phaser.Physics.Matter.Sprite[]} enemies
 * @param {Phaser.Physics.Matter.MatterPhysics} matter
 * @param {Phaser.Time.Clock} time
 * @param {any} colliders
 * @param {Phaser.GameObjects.GameObjectFactory} add
 */
export function LoadAllObjects(add, enemiesAIManager, enemies, matter, time, colliders) {
    const map = add.tilemap("map");  // Ajoute les emplacements des tiles dans le jeu
    const floorTileset = map.addTilesetImage("floor", "floor");  // Affiche les tiles du sol
    const wallTileset = map.addTilesetImage("wall", "wall");  // Affiches les tiles des murs

    map.createLayer("floor", floorTileset); // Créé un layer pour le sol
    map.createLayer("wall", wallTileset); // Créé un layer pour les murs

    // --- Créer le point de spawn du joueur --- ///
    const spawnPoint = map.filterObjects('PlayerPoints', obj => obj.name === 'SpawnPoint')[0]; // Récupère l'emplacement de spawn du joueur depuis Tiled
    let tempObject = matter.add.image(
        ConvertXCartesianToIsometric(spawnPoint.x, spawnPoint.y),
        ConvertYCartesianToIsometric(spawnPoint.x, spawnPoint.y),
        'checkpoint'
    ).setBody(colliders.checkPoint)
    // @ts-ignore
    tempObject.setDepth(tempObject.y - tempObject.height /2)  // Définit la profondeur du sprite

    const nextLevelPoint = map.filterObjects('PlayerPoints', obj => obj.name === 'NextLevel')[0]; // Récupère l'emplacement du prochain niveau depuis Tiled
    matter.add.image(
        ConvertXCartesianToIsometric(nextLevelPoint.x, nextLevelPoint.y),
        ConvertYCartesianToIsometric(nextLevelPoint.x, nextLevelPoint.y),
        "exit-door"
    ).setBody(colliders.exit_door) // Ajoute la collision

    /// --- Create all the enemies with their AI and animations --- //
    map.createFromObjects('Enemies', {}).forEach(
        /**
            * @param {Phaser.GameObjects.Sprite} enemy
        */
        (enemy, index)=>{

            enemiesAIManager.push(new EnemyManager(enemy.getData('direction'), enemy.getData('phantom'))), // Ajoute son manager

            enemies.push(matter.add.sprite( // Ajoute le sprite dans le jeu
                ConvertXCartesianToIsometric(enemy.x, enemy.y),
                ConvertYCartesianToIsometric(enemy.x, enemy.y),
                enemy.getData('phantom')+'-'+enemy.getData('direction')
            )),
            // @ts-ignore
            tempObject.setDepth(tempObject.y - tempObject.height /2)  // Définit la profondeur du sprite
            
            time.addEvent({ // Ajoute son IA
                delay: 2000,
                callback: enemiesAIManager[index].MoveEnemiesZig,
                args: [enemies[index], enemiesAIManager[index], colliders],
                loop: true,
            })
        }
    )
    
    const button = map.filterObjects('Interactions', (obj) => obj.name === 'Button')[0];

    // --- Ajoute le bouton pour sortir du niveau si il y en a un --- //
    if (button) {
        let buttonSprite = matter.add.image(
            ConvertXCartesianToIsometric(button.x, button.y), 
            ConvertYCartesianToIsometric(button.x, button.y), 
            "bouton", 
            null
        )
        buttonSprite.setCircle(60, {label: 'bouton'})
        buttonSprite.setSensor(true);
        buttonSprite.setData(button.properties)
    }

    // --- Créer les différentes safezones du niveau --- //
    map.createFromObjects('SafeZones', {}).forEach(
        /**
            * @param {Phaser.GameObjects.Sprite} safeZone
        */
        (safeZone)=>(
        matter.add.rectangle(
            ConvertXCartesianToIsometric(safeZone.x, safeZone.y)+(safeZone.width-safeZone.height)/2,
            ConvertYCartesianToIsometric(safeZone.x, safeZone.y)+safeZone.height/2,
            safeZone.width,
            safeZone.height,
            { isSensor:true, angle:0.52, label: "safezone", isStatic: true }
        ))
    )
    /**
            * @type {Phaser.Physics.Matter.Image}
        */
    // --- Créer les différents obstacles --- //
    map.createFromObjects('Obstacles', {}).forEach(
        /**
            * @param {Phaser.GameObjects.Sprite} object
        */
        (object) => {
            let tempString
            let tempSprite
            if (object.getData('orientation') === (TOP_RIGHT || TOP_LEFT)) {
                tempString = "-"+"front"
            } else {
                tempString = "-"+"back"
            }

            // @ts-ignore
            tempObject = matter.add.image(
                ConvertXCartesianToIsometric(object.x, object.y),
                ConvertYCartesianToIsometric(object.x, object.y),
                object.name+tempString,
                null
            ).setBody(colliders[object.name+tempString])
            // @ts-ignore
            tempObject.setDepth(tempObject.y - tempObject.height /2)  // Définit la profondeur du sprite
            
        }
    );

    map.filterObjects('WorldCollider', (obj) => obj.name === 'top-left').forEach((topLeft)=>(
        matter.add.rectangle(
            ConvertXCartesianToIsometric(topLeft.x, topLeft.y)-ConvertXCartesianToIsometric(1100, 750),
            ConvertYCartesianToIsometric(topLeft.x, topLeft.y)+ConvertXCartesianToIsometric(602, 250),
            topLeft.width/1.5,
            topLeft.height+50,
            { angle:1.05, label: "collision", isStatic:true }
        )
    ));

    map.filterObjects('WorldCollider', (obj) => obj.name === 'top-right').forEach((topRight)=>(
        matter.add.rectangle(
            ConvertXCartesianToIsometric(topRight.x, topRight.y)-ConvertXCartesianToIsometric(35, 700),
            ConvertYCartesianToIsometric(topRight.x, topRight.y)+ConvertYCartesianToIsometric(700, 35),
            topRight.width+50,
            topRight.height/2,
            { angle:0.52, label: "collision", isStatic:true } 
        )
    ));

    map.filterObjects('WorldCollider', (obj) => obj.name === 'bottom-right').forEach((bottomRight)=>(
        matter.add.rectangle(
            ConvertXCartesianToIsometric(bottomRight.x, bottomRight.y)-ConvertXCartesianToIsometric(1250, 650),
            ConvertYCartesianToIsometric(bottomRight.x, bottomRight.y)+ConvertXCartesianToIsometric(630, 300),
            bottomRight.width,
            bottomRight.height,
            { angle:1.05, label: "collision", isStatic:true } 
        )
    ));

    map.filterObjects('WorldCollider', (obj) => obj.name === 'bottom-left').forEach((bottomLeft)=>(
        matter.add.rectangle(
            ConvertXCartesianToIsometric(bottomLeft.x, bottomLeft.y)-ConvertXCartesianToIsometric(-85, 700),
            ConvertYCartesianToIsometric(bottomLeft.x, bottomLeft.y)+ConvertYCartesianToIsometric(700, -85),
            bottomLeft.width+50,
            bottomLeft.height/2,
            { angle:0.52, label: "collision", isStatic:true } 
        )
    ));

    return spawnPoint
}