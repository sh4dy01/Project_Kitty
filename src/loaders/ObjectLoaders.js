//@ts-check
import Phaser from "phaser";
import BossManager from "../classes/BossManager";

import EnemyManager from "../classes/EnemyManager";
import { ConvertXCartesianToIsometric, ConvertYCartesianToIsometric } from "../helpers/CartesianToIsometric";
import { ChangeDepth } from "../helpers/Utilities";
import { BOTTOM_LEFT, BOTTOM_RIGHT, GREEN, PURPLE, RED, TOP_LEFT, TOP_RIGHT } from "../helpers/Constants";

export default class ObjectsLoader {
    /**
     * @param {Phaser.Tilemaps.Tilemap} map
     * @param {Phaser.Physics.Matter.MatterPhysics} matter
     * @param {any} colliders
     * @param {Phaser.Time.Clock} time
     * @param {Phaser.Physics.Matter.Image[]} boxes
     * @param {Phaser.GameObjects.Image[]} levers
     * @param {Boolean[]} leversUI
     * @param {Phaser.Physics.Matter.Sprite[]} enemies
     * @param {EnemyManager[]} enemiesAI
     */
    constructor(map, matter, colliders, time, boxes, levers, leversUI, enemies, enemiesAI) {
        this.map = map
        this.matter = matter
        this.colliders = colliders
        this.time = time
        this.boxes = boxes
        this.levers = levers
        this.leversUI = leversUI
        this.enemies = enemies
        this.enemiesAIManager = enemiesAI
    }

    AddLayers() {
        const floorTileset = this.map.addTilesetImage("floor", "floor");  // Affiche les tiles du sol
        const wallTileset = this.map.addTilesetImage("wall", "wall");  // Affiches les tiles des murs
        const wallTileset2 = this.map.addTilesetImage("wall2", "wall2");  // Affiches les tiles des murs

        this.map.createLayer("floor", floorTileset); // Créé un layer pour le sol
        this.map.createLayer("wall", [wallTileset, wallTileset2]); // Créé un layer pour les murs

    }

    AddSafeZones() {
        // --- Créer les différentes safezones du niveau --- //
        this.map.filterObjects('SafeZones', (obj) => obj.name === 'SafeZone').forEach(
            (safezone)=>{
            this.matter.add.rectangle(
                ConvertXCartesianToIsometric(safezone.x, safezone.y)+(safezone.width-safezone.height)/2,
                ConvertYCartesianToIsometric(safezone.x, safezone.y)+safezone.height/2,
                safezone.width,
                safezone.height,
                { isSensor:true, angle:0.52, label: "safezone", isStatic: true }
            )}
        )
    }

    AddObstacles() {
        // --- Créer les différents obstacles --- //
        let tempObject
        this.map.createFromObjects('Obstacles', {}).forEach(
            /** @param {Phaser.Physics.Matter.Sprite} object */
            (object) => {
                let orientation

                if (object.name === 'way' || object.name === 'exit' || object.name === 'toilet') {
                    tempObject = this.matter.add.image(
                        ConvertXCartesianToIsometric(object.x, object.y),
                        ConvertYCartesianToIsometric(object.x, object.y),
                        'indicators',
                        object.name+'-'+object.getData('orientation')+".png",
                        {isSensor: true}
                    )
                    tempObject.setScale(0.2)
                    tempObject.setDepth(tempObject.y)
                } else if (object.name === 'box') {
                    tempObject = this.matter.add.image(
                        ConvertXCartesianToIsometric(object.x, object.y),
                        ConvertYCartesianToIsometric(object.x, object.y),
                        'objects',
                        object.name+'-face.png'
                    )
                    tempObject.setBody(this.colliders.box)
                    tempObject.setFixedRotation();
                    ChangeDepth(object)

                    this.boxes.push(tempObject);
                } else {
                    if (object.getData('orientation') === TOP_RIGHT || object.getData('orientation') === TOP_LEFT) {
                        orientation = "-face"
                    } else if (object.getData('orientation') === BOTTOM_RIGHT || object.getData('orientation') === BOTTOM_LEFT) {
                        orientation = "-back"
                    }
        
                    tempObject = this.matter.add.image(
                        ConvertXCartesianToIsometric(object.x, object.y),
                        ConvertYCartesianToIsometric(object.x, object.y),
                        'objects',
                        object.name+orientation+".png"
                    )
                    if ((object.getData('orientation') === TOP_RIGHT || object.getData('orientation') === BOTTOM_LEFT) && this.colliders[object.name+'-right'] != null) {
                        tempObject.setBody(this.colliders[object.name+"-right"])
                    } else if ((object.getData('orientation') === TOP_LEFT || object.getData('orientation') === BOTTOM_RIGHT) && this.colliders[object.name+'-left'] != null) {
                        tempObject.setBody(this.colliders[object.name+'-left'])
                    } else {
                        tempObject.setBody(this.colliders[object.name])
                    }
                    if (object.getData('orientation') === TOP_LEFT || object.getData('orientation') === BOTTOM_RIGHT) {
                        tempObject.setFlipX(true);
                    }
                }
            
                tempObject.setDepth(tempObject.y)
            }
        );
    }
    /**
     * @param {Phaser.Physics.Matter.Sprite} player
    */
    AddEnemies(player, playerManager) {
        /// --- Create all the enemies with their AI and animations --- //
        if(this.map.createFromObjects('Enemies', {}) != null){
            this.map.createFromObjects('Enemies', {}).forEach(
                /** @param {Phaser.GameObjects.Sprite} enemy */
                (enemy, index)=>{
                    this.enemiesAIManager.push(new EnemyManager(enemy.getData('direction'), enemy.name, this.colliders, enemy.getData('orientation'))) // Ajoute son manager
                    let tempString 
                    let tempObject
                    if (enemy.getData('direction') === TOP_LEFT || enemy.getData('direction') === TOP_RIGHT) {
                        tempString = '-back'
                    } else {
                        tempString = '-face'
                    }
                    tempObject = this.matter.add.sprite( // Ajoute le sprite de chaque ennemi dans le jeu
                        ConvertXCartesianToIsometric(enemy.x, enemy.y),
                        ConvertYCartesianToIsometric(enemy.x, enemy.y),
                        enemy.name+'-anim',
                        enemy.name+tempString+'_0.png'
                    )
                    tempObject.setBody(this.colliders[enemy.name+'_'+enemy.getData('direction')])
                    this.enemies.push(tempObject)
                    
                    switch (enemy.name) {
                        case PURPLE:
                            this.time.addEvent({ // Ajoute l'IA PURPLE
                                delay: enemy.getData('speed'),
                                callback: this.enemiesAIManager[index].MoveEnemyPurple,
                                args: [this.enemies[index], this.enemiesAIManager[index], this.colliders],
                                loop: true,
                            })
                        break;

                        case GREEN:
                            this.time.addEvent({ // Ajoute l'IA GREEN
                                delay: enemy.getData('speed'),
                                callback: this.enemiesAIManager[index].MoveEnemyGreen,
                                args: [this.enemies[index], this.enemiesAIManager[index], this.colliders],
                                loop: true,
                            })
                        break;

                        case RED:
                            this.time.addEvent({ // Ajoute l'IA RED
                                callback: this.enemiesAIManager[index].MoveEnemyRed,
                                args: [this.enemies[index], this.enemiesAIManager[index], player, playerManager],
                                loop: true,
                            })
                        break;

                        case 'boss':
                        console.log('boss added');
                        break;
                    
                        default:
                            console.log('wrong name');
                        break;
                    }
                }
            )
        }
    }

    AddTheLevers() {
        /** @type {Phaser.GameObjects.Image} */
        let tempObject

        // --- Créer les leviers des maps --- ///
        this.map.createFromObjects('Interactions', {}).forEach(
            /** @param {Phaser.GameObjects.Image} lever*/
            (lever, index) => {
            // @ts-ignore
            tempObject = this.matter.add.image(
                ConvertXCartesianToIsometric(lever.x, lever.y), 
                ConvertYCartesianToIsometric(lever.x, lever.y), 
                'levers',
                "red-lever.png"
            ).setCircle(60, {label: 'lever'+index, isSensor: true}),
            tempObject.setDepth(tempObject.y)

            this.leversUI.push(false)
            this.levers.push(tempObject)
        });
    }

    /**
     * @param {BossManager} bossManager
    */
    AddBoss(bossManager) {
        // --- Créer le point de spawn du  BOSS --- //
        /** @param {Phaser.GameObjects.Sprite} boss */
        const Boss = this.map.filterObjects('Enemies', (obj) => obj.name === 'boss')[0]; // Récupère l'emplacement de spawn du joueur depuis Tiled

        let tempObject = this.matter.add.sprite( // Ajoute le sprite dans le jeu
            ConvertXCartesianToIsometric(Boss.x, Boss.y),
            ConvertYCartesianToIsometric(Boss.x, Boss.y),
            "boss",
            "bottom-left.png",
            { label: "boss", isSensor: true }
        ).setScale(2).setFixedRotation()
        tempObject.setDepth(tempObject.y)
        this.time.addEvent({
            callback: bossManager.MoveBoss,
            args: [tempObject, bossManager , this.colliders],
            loop: true
        })
    }

    AddMapColliders() {
        this.map.filterObjects('WorldCollider', (obj) => obj.name === 'topLeft').forEach(
            (collider)=>(
                this.matter.add.rectangle(
                    ConvertXCartesianToIsometric(collider.x, collider.y),
                    ConvertYCartesianToIsometric(collider.x, collider.y),
                    collider.width,
                    collider.height,
                    { angle:1.05, label: "topLeft", isStatic:true }
                )
            )
        );

        this.map.filterObjects('WorldCollider', (obj) => obj.name === 'topRight').forEach(
            (collider)=>(
                this.matter.add.rectangle(
                    ConvertXCartesianToIsometric(collider.x, collider.y),
                    ConvertYCartesianToIsometric(collider.x, collider.y),
                    collider.width,
                    collider.height,
                    { angle:0.52, label: "topRight", isStatic:true } 
                )
            )
        );

        this.map.filterObjects('WorldCollider', (obj) => obj.name === 'bottomRight').forEach(
            (collider)=>(
                this.matter.add.rectangle(
                    ConvertXCartesianToIsometric(collider.x, collider.y),
                    ConvertYCartesianToIsometric(collider.x, collider.y),
                    collider.width,
                    collider.height,
                    { angle:1.05, label: "bottomRight", isStatic:true } 
                )
            )
        );

        this.map.filterObjects('WorldCollider', (obj) => obj.name === 'bottomLeft').forEach(
            (collider)=>(
                this.matter.add.rectangle(
                    ConvertXCartesianToIsometric(collider.x, collider.y),
                    ConvertYCartesianToIsometric(collider.x, collider.y),
                    collider.width,
                    collider.height,
                    { angle:0.52, label: "bottomLeft", isStatic:true } 
                )
            )
        );
    }
}
