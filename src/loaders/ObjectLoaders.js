//@ts-check
import Phaser from "phaser";
import BossManager from "../classes/BossManager";

import EnemyManager from "../classes/EnemyManager";
import { ConvertXCartesianToIsometric, ConvertYCartesianToIsometric } from "../helpers/CartesianToIsometric";
import { ChangeDepth } from "../helpers/ChangeDepth";
import { BOTTOM, GREEN, GREEN_SIZE, PURPLE, RED, TOP_LEFT, TOP_RIGHT } from "../helpers/constants";

/**
 * @param {EnemyManager[]} enemiesAIManager
 * @param {Phaser.Physics.Matter.Sprite[]} enemies
 * @param {Phaser.Physics.Matter.MatterPhysics} matter
 * @param {Phaser.Time.Clock} time
 * @param {any} colliders
 * @param {Phaser.Tilemaps.Tilemap} map
 * @param {Boolean[]} levers
 */
export function LoadAllObjects(map, enemiesAIManager, enemies, matter, time, colliders, levers) {
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
    ChangeDepth(tempObject);

    /// --- Create all the enemies with their AI and animations --- //
if(map.createFromObjects('Enemies', {}) != null){
    map.createFromObjects('Enemies', {}).forEach(
        /** @param {Phaser.GameObjects.Sprite} enemy */
        (enemy, index)=>{

            enemiesAIManager.push(new EnemyManager(enemy.getData('direction'), enemy.name, enemy.getData('orientation'))) // Ajoute son manager

            enemies.push(matter.add.sprite( // Ajoute le sprite dans le jeu
                ConvertXCartesianToIsometric(enemy.x, enemy.y),
                ConvertYCartesianToIsometric(enemy.x, enemy.y),
                enemy.name+'-anim',
                enemy.getData('direction')
            ))
            
            switch (enemy.name) {
                case PURPLE:
                    time.addEvent({ // Ajoute l'IA PURPLE
                        delay: enemy.getData('speed'),
                        callback: enemiesAIManager[index].MoveEnemyPurple,
                        args: [enemies[index], enemiesAIManager[index], colliders],
                        loop: true,
                    })
                break;

                case GREEN:
                    time.addEvent({ // Ajoute l'IA GREEN
                        delay: enemy.getData('speed'),
                        callback: enemiesAIManager[index].MoveEnemyGreen,
                        args: [enemies[index], enemiesAIManager[index], colliders],
                        loop: true,
                    })
                break;

                case RED:
                    time.addEvent({ // Ajoute l'IA RED
                        delay: enemy.getData('speed'),
                        callback: enemiesAIManager[index].MoveEnemyRed,
                        args: [enemies[index], enemiesAIManager[index], colliders],
                        loop: true,
                    })
                break;
            
                default:
                    console.log('wrong name');
                break;
            }
        }
    )
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
    AddTheLevers(map, matter, levers)
}

/**
 * @param {Phaser.Tilemaps.Tilemap} map
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
 * @param {Boolean[]} levers
 */
 export function AddTheLevers(map, matter, levers) {
     /** @type {Phaser.GameObjects.Image} */
    let tempObject

    // --- Créer les leviers des maps --- ///
    map.createFromObjects('Interactions', {}).forEach(
        /** @param {Phaser.GameObjects.Image} lever*/
        (lever, index) => {
        // @ts-ignore
        tempObject = matter.add.image(
            ConvertXCartesianToIsometric(lever.x, lever.y), 
            ConvertYCartesianToIsometric(lever.x, lever.y), 
            'lever-off'
        ).setCircle(60, {label: 'lever'+index, isSensor: true}),
        ChangeDepth(tempObject)

        levers.push(false)
    });

}

const bossAImanager = []
export function AddBoss(map, colliders, matter, time) {
    // --- Créer le point de spawn du joueur --- ///
    /** @param {Phaser.GameObjects.Sprite} boss */
    const Boss = map.filterObjects('Enemies', (obj) => obj.name === 'boss')[0]; // Récupère l'emplacement de spawn du joueur depuis Tiled

    let tempObject = null
    tempObject = matter.add.sprite( // Ajoute le sprite dans le jeu
        ConvertXCartesianToIsometric(Boss.x, Boss.y),
        ConvertYCartesianToIsometric(Boss.x, Boss.y),
        "boss"
    )
    ChangeDepth(tempObject);

    time.addEvent({
        //callback: BossManager.MoveBoss,
        args: [Boss[1], bossAImanager, colliders],
        loop: true,
    })
}


/**
 * @param {Phaser.Tilemaps.Tilemap} map
 * @param {Phaser.Physics.Matter.MatterPhysics} matter
 */
function AddMapColliders(map, matter) {
    map.filterObjects('WorldCollider', (obj) => obj.name === 'topLeft').forEach(
        (collider)=>(
        matter.add.rectangle(
            ConvertXCartesianToIsometric(collider.x, collider.y),
            ConvertYCartesianToIsometric(collider.x, collider.y),
            collider.width,
            collider.height,
            { angle:1.05, label: "collision", isStatic:true }
        )
    ));

    map.filterObjects('WorldCollider', (obj) => obj.name === 'topRight').forEach(
        (collider)=>(
        matter.add.rectangle(
            ConvertXCartesianToIsometric(collider.x, collider.y),
            ConvertYCartesianToIsometric(collider.x, collider.y),
            collider.width,
            collider.height,
            { angle:0.52, label: "collision", isStatic:true } 
        )
    ));

    map.filterObjects('WorldCollider', (obj) => obj.name === 'bottomRight').forEach(
        (collider)=>(
        matter.add.rectangle(
            ConvertXCartesianToIsometric(collider.x, collider.y),
            ConvertYCartesianToIsometric(collider.x, collider.y),
            collider.width,
            collider.height,
            { angle:1.05, label: "collision", isStatic:true } 
        )
    ));

    map.filterObjects('WorldCollider', (obj) => obj.name === 'bottomLeft').forEach(
        (collider)=>(
        matter.add.rectangle(
            ConvertXCartesianToIsometric(collider.x, collider.y),
            ConvertYCartesianToIsometric(collider.x, collider.y),
            collider.width,
            collider.height,
            { angle:0.52, label: "collision", isStatic:true } 
        )
    ));
}
