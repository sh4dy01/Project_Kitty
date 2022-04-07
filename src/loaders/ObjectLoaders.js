//@ts-check
import Phaser from "phaser";
import BossManager from "../classes/BossManager";

import EnemyManager from "../classes/EnemyManager";
import { ConvertXCartesianToIsometric, ConvertYCartesianToIsometric } from "../helpers/CartesianToIsometric";
import { ChangeDepth } from "../helpers/Utilities";
import { BOTTOM_LEFT, BOTTOM_RIGHT, GREEN, PURPLE, RED, TOP_LEFT, TOP_RIGHT } from "../helpers/Constants";

/**
 * @param {EnemyManager[]} enemiesAIManager
 * @param {Phaser.Physics.Matter.Sprite[]} enemies
 * @param {Phaser.Physics.Matter.MatterPhysics} matter
 * @param {Phaser.Time.Clock} time
 * @param {any} colliders
 * @param {Phaser.Tilemaps.Tilemap} map
 * @param {Boolean[]} [leversUI]
 * @param {Phaser.GameObjects.Image[]} [levers]
 * @param {Phaser.Physics.Matter.Image[]} [boxes]
 * @param {Phaser.GameObjects.GameObject} [entrance]

 */
export function LoadAllObjects(map, enemiesAIManager, enemies, matter, time, colliders, leversUI, levers, boxes, entrance) {
    /** @type {Phaser.Physics.Matter.Sprite | Phaser.Physics.Matter.Image} */
    let tempObject = null;
    const floorTileset = map.addTilesetImage("floor", "floor");  // Affiche les tiles du sol
    const wallTileset = map.addTilesetImage("wall", "wall");  // Affiches les tiles des murs

    map.createLayer("floor", floorTileset); // Créé un layer pour le sol
    map.createLayer("wall", wallTileset); // Créé un layer pour les murs

    /// --- Create all the enemies with their AI and animations --- //
    if(map.createFromObjects('Enemies', {}) != null){
        map.createFromObjects('Enemies', {}).forEach(
            /** @param {Phaser.GameObjects.Sprite} enemy */
            (enemy, index)=>{
                if (enemy.name !== 'boss') {
                    enemiesAIManager.push(new EnemyManager(enemy.getData('direction'), enemy.name, enemy.getData('orientation'))) // Ajoute son manager

                enemies.push(matter.add.sprite( // Ajoute le sprite de chaque ennemi dans le jeu
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

                    // case RED:
                    //     time.addEvent({ // Ajoute l'IA RED
                    //         delay: enemy.getData('speed'),
                    //         callback: enemiesAIManager[index].MoveEnemyRed,
                    //         args: [enemies[index], enemiesAIManager[index], colliders],
                    //         loop: true,
                    //     })
                    // break;

                    case 'boss':
                       console.log('boss added');
                    break;
                
                    default:
                        console.log('wrong name');
                    break;
                }}
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
            let orientation

            if (object.name === 'way' || object.name === 'exit') {
                tempObject = matter.add.image(
                    ConvertXCartesianToIsometric(object.x, object.y),
                    ConvertYCartesianToIsometric(object.x, object.y),
                    'indicators',
                    object.name+'-'+object.getData('orientation')+".png",
                    {isSensor: true}
                ).setScale(0.3).setDepth(tempObject.y)
            } else if (object.name === 'box') {
                tempObject = matter.add.image(
                    ConvertXCartesianToIsometric(object.x, object.y),
                    ConvertYCartesianToIsometric(object.x, object.y),
                    'objects',
                    object.name+'-face.png'
                )
                tempObject.setDepth(tempObject.y),
                tempObject.setBody(colliders.box)
                
                boxes.push(tempObject);
            } else {
                if (object.getData('orientation') === TOP_RIGHT || object.getData('orientation') === TOP_LEFT) {
                    orientation = "-face"
                } else if (object.getData('orientation') === BOTTOM_RIGHT || object.getData('orientation') === BOTTOM_LEFT) {
                    orientation = "-back"
                }
    
                tempObject = matter.add.image(
                    ConvertXCartesianToIsometric(object.x, object.y),
                    ConvertYCartesianToIsometric(object.x, object.y),
                    'objects',
                    object.name+orientation+".png"
                )
                if ((object.getData('orientation') === TOP_RIGHT || object.getData('orientation') === BOTTOM_LEFT) && colliders[object.name+'-right'] != null) {
                    tempObject.setBody(colliders[object.name+"-right"])
                } else if ((object.getData('orientation') === TOP_LEFT || object.getData('orientation') === BOTTOM_RIGHT) && colliders[object.name+'-left'] != null) {
                    tempObject.setBody(colliders[object.name+'-left'])
                } else {
                    tempObject.setBody(colliders[object.name])
                }
                if (object.getData('orientation') === (TOP_LEFT || BOTTOM_RIGHT)) {
                    tempObject.setFlipX(true);
                }
            }
           
            ChangeDepth(tempObject)
        }
    );

    AddMapColliders(map, matter)
    AddTheLevers(map, matter, leversUI, levers)
}

 /**
 * @param {Phaser.Tilemaps.Tilemap} map
 * @param {Phaser.Physics.Matter.MatterPhysics} matter
 * @param {Boolean[]} leversUI
 * @param {Phaser.GameObjects.Image[]} levers
 */
 export function AddTheLevers(map, matter, leversUI, levers) {
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
            'levers',
            "red-lever.png"
        ).setCircle(60, {label: 'lever'+index, isSensor: true}),
        ChangeDepth(tempObject)

        leversUI.push(false)
        levers.push(tempObject)
    });
}

/**
 * @param {Phaser.Tilemaps.Tilemap} map
 * @param {any} colliders
 * @param {Phaser.Physics.Matter.MatterPhysics} matter
 * @param {Phaser.Time.Clock} time
 * @param {BossManager} bossManager
*/
export function AddBoss(map, colliders, matter, time, bossManager) {
    // --- Créer le point de spawn du  BOSS --- //
    /** @param {Phaser.GameObjects.Sprite} boss */
    const Boss = map.filterObjects('Enemies', (obj) => obj.name === 'boss')[0]; // Récupère l'emplacement de spawn du joueur depuis Tiled

    let tempObject = matter.add.sprite( // Ajoute le sprite dans le jeu
        ConvertXCartesianToIsometric(Boss.x, Boss.y),
        ConvertYCartesianToIsometric(Boss.x, Boss.y),
        "boss",
        "bottom-left.png",
        { label: "boss", isSensor: true }
    ).setScale(2).setFixedRotation()
    
    time.addEvent({
        callback: bossManager.MoveBoss,
        args: [tempObject, bossManager , colliders],
        loop: true
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
            { angle:1.05, label: "topLeft", isStatic:true }
        )
    ));

    map.filterObjects('WorldCollider', (obj) => obj.name === 'topRight').forEach(
        (collider)=>(
        matter.add.rectangle(
            ConvertXCartesianToIsometric(collider.x, collider.y),
            ConvertYCartesianToIsometric(collider.x, collider.y),
            collider.width,
            collider.height,
            { angle:0.52, label: "topRight", isStatic:true } 
        )
    ));

    map.filterObjects('WorldCollider', (obj) => obj.name === 'bottomRight').forEach(
        (collider)=>(
        matter.add.rectangle(
            ConvertXCartesianToIsometric(collider.x, collider.y),
            ConvertYCartesianToIsometric(collider.x, collider.y),
            collider.width,
            collider.height,
            { angle:1.05, label: "bottomRight", isStatic:true } 
        )
    ));

    map.filterObjects('WorldCollider', (obj) => obj.name === 'bottomLeft').forEach(
        (collider)=>(
        matter.add.rectangle(
            ConvertXCartesianToIsometric(collider.x, collider.y),
            ConvertYCartesianToIsometric(collider.x, collider.y),
            collider.width,
            collider.height,
            { angle:0.52, label: "bottomLeft", isStatic:true } 
        )
    ));
}
