//@ts-check
import Phaser from "phaser";

import EnemyManager from "../classes/EnemyManager";
import { ConvertXCartesianToIsometric, ConvertYCartesianToIsometric } from "../helpers/CartesianToIsometric";
import { ChangeDepth } from "../helpers/ChangeDepth";
import { TOP_LEFT, TOP_RIGHT } from "../helpers/constants";

/**
 * @param {EnemyManager[]} enemiesAIManager
 * @param {Phaser.Physics.Matter.Sprite[]} enemies
 * @param {Phaser.Physics.Matter.MatterPhysics} matter
 * @param {Phaser.Time.Clock} time
 * @param {any} colliders
 * @param {Phaser.Tilemaps.Tilemap} map
 */
export function LoadAllObjects(map, enemiesAIManager, enemies, matter, time, colliders) {
    /** @type {Phaser.Physics.Matter.Sprite | Phaser.Physics.Matter.Image} */
    let tempObject = null;

    const floorTileset = map.addTilesetImage("floor", "floor");  // Affiche les tiles du sol
    const wallTileset = map.addTilesetImage("wall", "wall");  // Affiches les tiles des murs

    map.createLayer("floor", floorTileset); // Créé un layer pour le sol
    map.createLayer("wall", wallTileset); // Créé un layer pour les murs

    const nextLevelPoint = map.filterObjects('PlayerPoints', obj => obj.name === 'NextLevel')[0]; // Récupère l'emplacement du prochain niveau depuis Tiled
    tempObject = matter.add.image(
        ConvertXCartesianToIsometric(nextLevelPoint.x, nextLevelPoint.y),
        ConvertYCartesianToIsometric(nextLevelPoint.x, nextLevelPoint.y),
        "exit-door"
    )
    tempObject.setBody(colliders.exit_door) // Ajoute la collision
    ChangeDepth(tempObject)

    /// --- Create all the enemies with their AI and animations --- //
    map.createFromObjects('Enemies', {}).forEach(
        /** @param {Phaser.GameObjects.Sprite} enemy */
        (enemy, index)=>{

            enemiesAIManager.push(new EnemyManager(enemy.getData('direction'), enemy.getData('phantom'))), // Ajoute son manager

            enemies.push(matter.add.sprite( // Ajoute le sprite dans le jeu
                ConvertXCartesianToIsometric(enemy.x, enemy.y),
                ConvertYCartesianToIsometric(enemy.x, enemy.y),
                enemy.getData('phantom')+'-'+enemy.getData('direction')
            )),

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
        tempObject = matter.add.image(
            ConvertXCartesianToIsometric(button.x, button.y), 
            ConvertYCartesianToIsometric(button.x, button.y), 
            "bouton", 
            null
        )
        tempObject.setCircle(60, {label: 'bouton'})
        tempObject.setSensor(true);
        ChangeDepth(tempObject)
    }

    // --- Créer les différentes safezones du niveau --- //
    map.createFromObjects('SafeZones', {}).forEach(
        /** @param {Phaser.Physics.Matter.Sprite} safeZone */ 
        (safeZone)=>{
        matter.add.rectangle(
            ConvertXCartesianToIsometric(safeZone.x, safeZone.y)+(safeZone.width-safeZone.height)/2,
            ConvertYCartesianToIsometric(safeZone.x, safeZone.y)+safeZone.height/2,
            safeZone.width,
            safeZone.height,
            { isSensor:true, angle:0.52, label: "safezone", isStatic: true }
        )}
    )

    // --- Créer les différents obstacles --- //
    map.createFromObjects('Obstacles', {}).forEach(
        /** @param {Phaser.Physics.Matter.Sprite} object */
        (object) => {
            let tempString
            if (object.getData('orientation') === (TOP_RIGHT || TOP_LEFT)) {
                tempString = "-"+"front"
            } else {
                tempString = "-"+"back"
            }

            tempObject = matter.add.image(
                ConvertXCartesianToIsometric(object.x, object.y),
                ConvertYCartesianToIsometric(object.x, object.y),
                object.name+tempString,
                null
            )
            tempObject.setBody(colliders[object.name+tempString])
            ChangeDepth(tempObject)     
        }
    );

    AddMapColliders(map, matter)
}

/**
 * @param {{filterObjects: (arg0: string, arg1: (obj: any) => boolean) => any[];}} map
 * @param {any} colliders
 * @param {Phaser.Physics.Matter.MatterPhysics} matter
 */
export function AddTheSpawnPoint(map, colliders, matter) {
    // --- Créer le point de spawn du joueur --- ///
    const spawnPoint = map.filterObjects('PlayerPoints', (obj) => obj.name === 'SpawnPoint')[0]; // Récupère l'emplacement de spawn du joueur depuis Tiled

    /** @type {Phaser.Physics.Matter.Image} */
    let tempObject = matter.add.image(
        ConvertXCartesianToIsometric(spawnPoint.x, spawnPoint.y),
        ConvertYCartesianToIsometric(spawnPoint.x, spawnPoint.y),
        'checkpoint'
    )
    tempObject.setBody(colliders.checkPoint)
    ChangeDepth(tempObject)

    return tempObject
}

/**
 * @param {Phaser.Tilemaps.Tilemap} map
 * @param {Phaser.Physics.Matter.MatterPhysics} matter
 */
function AddMapColliders(map, matter) {
    map.filterObjects('WorldCollider', (obj) => obj.name === 'topLeft').forEach(
        (collider)=>(
        matter.add.rectangle(
            ConvertXCartesianToIsometric(collider.x, collider.y)-ConvertXCartesianToIsometric(1100, 750),
            ConvertYCartesianToIsometric(collider.x, collider.y)+ConvertXCartesianToIsometric(602, 250),
            collider.width/2,
            collider.height+50,
            { angle:1.05, label: "collision", isStatic:true }
        )
    ));

    map.filterObjects('WorldCollider', (obj) => obj.name === 'topRight').forEach(
        (collider)=>(
        matter.add.rectangle(
            ConvertXCartesianToIsometric(collider.x, collider.y)-ConvertXCartesianToIsometric(35, 700),
            ConvertYCartesianToIsometric(collider.x, collider.y)+ConvertYCartesianToIsometric(700, 35),
            collider.width+50,
            collider.height/2,
            { angle:0.52, label: "collision", isStatic:true } 
        )
    ));

    map.filterObjects('WorldCollider', (obj) => obj.name === 'bottomRight').forEach(
        (collider)=>(
        matter.add.rectangle(
            ConvertXCartesianToIsometric(collider.x, collider.y)-ConvertXCartesianToIsometric(1250, 650),
            ConvertYCartesianToIsometric(collider.x, collider.y)+ConvertXCartesianToIsometric(630, 300),
            collider.width/2,
            collider.height+50,
            { angle:1.05, label: "collision", isStatic:true } 
        )
    ));

    map.filterObjects('WorldCollider', (obj) => obj.name === 'bottomLeft').forEach(
        (collider)=>(
        matter.add.rectangle(
            ConvertXCartesianToIsometric(collider.x, collider.y)-ConvertXCartesianToIsometric(-85, 700),
            ConvertYCartesianToIsometric(collider.x, collider.y)+ConvertYCartesianToIsometric(700, -85),
            collider.width+50,
            collider.height/2,
            { angle:0.52, label: "collision", isStatic:true } 
        )
    ));
}
