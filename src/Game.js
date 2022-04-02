//@ts-check
import Phaser from "phaser";
import EnemyAILinear from "./classes/enemy";
import PlayerManager from "./classes/player"
import UIManager from "./classes/UIManager";
import TilesLoader from "./helpers/tilesLoader";
import { ConvertXCartesianToIsometric, ConvertYCartesianToIsometric } from "./helpers/cartesianToIsometric";
import Enemy from "./classes/enemy";
import { SceneManager } from "./classes/sceneManager";
import { CheckButton, CheckHitBoxes, CheckNextLevel } from "./classes/collisionManager";
import { GREEN } from "./helpers/constants";

export default class Game extends Phaser.Scene {

    constructor(){
        super('game')
    }
    
    /**
     * @param {{ key: String; remainingLife: Number}} data
    */
    init(data) {
        this.currentLevel = data.key;
        this.currentLives = data.remainingLife;

        this.sceneManager = new SceneManager(this.scene, this.currentLevel, this.scene.getIndex(this.currentLevel), this.cameras.main);
        this.UIManager = new UIManager(this.currentLevel);
        this.playerManager = new PlayerManager(this.currentLives, this.sceneManager);
        this.tilesLoader = new TilesLoader();

        /**
         * @type {Phaser.GameObjects.Container[]}
        */
        this.enemies = [];

        /**
         * @type {EnemyAILinear[]}
        */
        this.enemiesAI = [];

        /**
         * @type {Phaser.Time.TimerEvent[]}
        */
        this.enemiesAIManager = [];
        /**
         * @type {MatterJS.BodyType[]}
        */
        this.safeZones = [];
        /**
         * @type {MatterJS.BodyType[]}
        */
        this.worldCollider = [];
    }

    preload() {
        this.load.image('player-up-left', 'assets/sprites/cat/up-left.png');
        this.load.image('player-down-right', 'assets/sprites/cat/down-right.png');
        this.load.image('player-down', 'assets/sprites/cat/down.png');
        this.load.image('player-right', 'assets/sprites/cat/right.png');
        this.load.image('player-up', 'assets/sprites/cat/up.png');

        this.load.image('green-bottom-right', 'assets/sprites/phantoms/green/bottom-right.png')
        this.load.image('green-top-right', 'assets/sprites/phantoms/green/top-right.png')

        this.load.json('colliders', 'assets/colliders/colliders.json')

        this.load.image('cone', 'assets/sprites/proto/Bouton.png');
        this.load.image('bouton', 'assets/sprites/proto/Bouton.png');

        this.load.image("exit-door", "assets/sprites/proto/exit-door.png");
    }

    create() {
        this.cameras.main.fadeIn(1000, 0, 0, 0);
        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_IN_COMPLETE, (cam, effect) => {
            this.playerManager.canMove = true
        })
        this.matter.world.disableGravity();

        const colliders = this.cache.json.get('colliders');

        // createPhantomAnims(this.anims);

        this.cursors = this.input.keyboard.createCursorKeys(); // Assigne les touches prédéfinis (flèches directionnelles, shift, alt, espace)

        const map = this.add.tilemap(this.currentLevel);  // Ajoute les emplacements de chaque tile
        const floorTileset = map.addTilesetImage("floor", "floor");  // Ajoutes les tiles du sol
        const wallTileset = map.addTilesetImage("wall", "wall");  // Ajoutes les tiles des murs

        map.createLayer("floor", floorTileset); // Créé un layer pour le sol
        map.createLayer("wall", wallTileset); // Créé un layer pour les murs

        const start = map.filterObjects('PlayerPoints', obj => obj.name === 'SpawnPoint')[0];
        const end = map.filterObjects('PlayerPoints', obj => obj.name === 'NextLevel')[0];
        this.nextLevel = this.matter.add.sprite(
            ConvertXCartesianToIsometric(end.x, end.y),
            ConvertYCartesianToIsometric(end.x, end.y),
            "exit-door",
            0
        );
        this.nextLevel.setBody(colliders.exit_door)

        this.player = this.matter.add.sprite(0, 0, 'player-up-left').setFlipX(true);
        this.player.setBody(colliders.player)
        this.player.setPosition(
            ConvertXCartesianToIsometric(start.x, start.y), 
            ConvertYCartesianToIsometric(start.x, start.y)
        ); 
        this.player.setFixedRotation();
        
        this.playerInfoText = this.add.text(0, 0, 'Character position: ');
        this.playerInfoText.setScrollFactor(0);
                
        this.cameras.main.startFollow(this.player, false, 0.1, 0.1); // Permet que la caméra suit le joueur

        this.cone = this.matter.add.sprite(200, 250, "cone");
        this.cone.setPolygon(130,3, { 
            label: "cone"
        })
        this.cone.isSensor();
        this.cone.setSensor(true);
        this.cone.setFixedRotation();

        this.enemiesLayer = map.createFromObjects('EnemiesLinear', {
            name: 'EnemyLinear'
        })

        this.matter.add.sprite(-4048, 4245, 'green-bottom-right')

        /**
            * @type {Phaser.GameObjects.Container}
        */
         let tempContainer

        /**
            * @type {Enemy}
        */
        let tempSprite

        /**
            * @type {Phaser.GameObjects.GameObject}
        */
         let tempGameObject

        /**
            * @type {MatterJS.BodyType}
        */
        let tempCollider

        this.enemiesLayer.forEach(
            /**
                * @param {Phaser.GameObjects.Sprite} enemy
            */
            (enemy)=>{
                
                tempSprite = new Enemy(
                    {world: this.matter.world,
                    x: ConvertXCartesianToIsometric(enemy.x, enemy.y),
                    y: ConvertYCartesianToIsometric(enemy.x, enemy.y),
                    texture: "green-bottom-right"},
                    // enemy.getData('direction'),
                    'right',
                    colliders.green
                ),
                tempCollider = this.matter.add.polygon(
                    ConvertXCartesianToIsometric(enemy.x, enemy.y)- 50, 
                    ConvertYCartesianToIsometric(enemy.x, enemy.y) + 50, 
                    3, 
                    100, 
                    { isSensor:true, angle: 0.33, label: "field" }
                ),
                console.log(tempGameObject);

                console.log(tempCollider),
                tempContainer = new Phaser.GameObjects.Container(
                    this, 
                    ConvertXCartesianToIsometric(enemy.x, enemy.y),
                    ConvertYCartesianToIsometric(enemy.x, enemy.y),
                    [tempSprite])
                console.log(tempContainer);
            }
        )
        
        // this.enemies.forEach(
        //     (enemy)=>{
        //         this.time.addEvent({
        //             delay: 2000,
        //             callback: enemy.getAt(0).MoveTheEnemyLinear,
        //             args: [enemy],
        //             loop: true
        //         })
        //     }
        // )
        // this.matter.add.polygon()
        let tempEnemyAI;
        // this.enemies.forEach(
        //     /**
        //      * @param {Phaser.GameObjects.Sprite} enemy
        //      * @param {Number} index
        //     */
        //     (enemy, index)=>(
        //         // enemy.setTexture('EnemyLinear'),
        //         // tempX = enemy.x,
        //         // enemy.x = ConvertXCartesianToIsometric(tempX, enemy.y),
        //         // enemy.y = ConvertYCartesianToIsometric(tempX, enemy.y),
        //         // this.matter.add.polygon(enemy.x - 50, enemy.y + 50, 3, 100, { isSensor:true, angle: 0.33, label: "field" }),
        //         // tempEnemyAI = new EnemyAILinear(),
        //         // this.enemiesAI.push(tempEnemyAI),
        //         // this.time.addEvent({
        //         //     delay: 2000,
        //         //     callback: this.enemiesAI[index].MoveTheEnemyLinear,
        //         //     args: [enemy, 1, enemy.getData('direction')],
        //         //     loop: true
        //         // })
        //     )
        // )

        const boutonColor = new Phaser.Display.Color(155, 0, 0);
        const button = map.filterObjects('Interactions', obj => obj.name === 'Button')[0];
        if (button) {
            this.boutonShow = this.add.circle(400, 300, 60, boutonColor.color);
            this.boutonShow.setPosition(
                ConvertXCartesianToIsometric(button.x, button.y), 
                ConvertYCartesianToIsometric(button.x, button.y)
            ); 
            this.boutonHit = this.matter.add.sprite(0,0, "boutonHit", 0)
            this.boutonHit.setCircle(60, { label:"boutonHit" })
            this.boutonHit.isSensor();
            this.boutonHit.setSensor(true);
            this.boutonHit.setPosition(
                ConvertXCartesianToIsometric(button.x, button.y), 
                ConvertYCartesianToIsometric(button.x, button.y)
            ); 
            this.button = this.matter.add.sprite(0, 0, "bouton", 0, { label:"bouton" });
            this.button.setPosition(
                ConvertXCartesianToIsometric(button.x, button.y), 
                ConvertYCartesianToIsometric(button.x, button.y)
            ); 
            this.button.setStatic(true);
            
            CheckButton(this.matter.world)
        }

        map.filterObjects('SafeZones', obj => obj.name === 'SafeZone').forEach((SafeZoneObject)=>(
            this.safeZones.push(this.matter.add.rectangle(
                ConvertXCartesianToIsometric(SafeZoneObject.x, SafeZoneObject.y)+(SafeZoneObject.width-SafeZoneObject.height)/2,
                ConvertYCartesianToIsometric(SafeZoneObject.x, SafeZoneObject.y)+SafeZoneObject.height/2,
                SafeZoneObject.width,
                SafeZoneObject.height,
                { isSensor:true, angle:0.52, label: "safezone", isStatic: true }
            ))
        ))      
        
        map.filterObjects('WorldCollider', obj => obj.name === 'topLeft').forEach((topLeft)=>(
            this.worldCollider.push(this.matter.add.rectangle(
                ConvertXCartesianToIsometric(topLeft.x, topLeft.y)-ConvertXCartesianToIsometric(1065, 650),
                ConvertYCartesianToIsometric(topLeft.x, topLeft.y)+ConvertXCartesianToIsometric(600, 200),
                topLeft.width/2,
                topLeft.height+50,
                { angle:1.05, label: "collision", isStatic:true }
            ))
        ))

        map.filterObjects('WorldCollider', obj => obj.name === 'topRight').forEach((topRight)=>(
            this.worldCollider.push(this.matter.add.rectangle(
                ConvertXCartesianToIsometric(topRight.x, topRight.y)-ConvertXCartesianToIsometric(38, 800),
                ConvertYCartesianToIsometric(topRight.x, topRight.y)+ConvertYCartesianToIsometric(800, 38),
                topRight.width,
                topRight.height/2,
                { angle:0.52, label: "collision", isStatic:true } 
            ))
        ))
           
        CheckHitBoxes(this.matter.world, this.playerManager, this.sceneManager, this.player);
    }

    update(t, dt) {
        if (!this.cursors || !this.player || !this.playerManager.canMove) {
            return
        }

        this.playerManager.CheckPlayerInputs(this.player, this.cursors);
        this.playerManager.UseButton(this.cursors, this.player.body, this.matter.world, this.player);
        this.UIManager.UpdatePlayerInfoText(this.playerInfoText, this.player, this.playerManager.canLoadNextScene, this.playerManager.currentLives, this.playerManager.isSafe);
    }
}