//@ts-check
import Phaser from "phaser";
import CollisionManager from "./classes/collisionManager";
import EnemyAIManager from "./classes/enemy";
import Player from "./classes/player"
import SceneManager from "./classes/sceneManager";
import UIManager from "./classes/UIManager";
import TilesLoader from "./helpers/tilesLoader";
import { ConvertXCartesianToIsometric, ConvertYCartesianToIsometric } from "./helpers/cartesianToIsometric";

export default class Game extends Phaser.Scene {

    constructor(){
        super('game')
    }
    
    /**
     * @param {{ key: String; }} data
     */
    init(data) {
        this.sceneMapName = data.key;

        this.UIManager = new UIManager(this.sceneMapName);
        this.sceneManager = new SceneManager(this.scene.manager, this.scene.getIndex(this.sceneMapName));
        this.playerInteractions = new Player(this.sceneManager, this.matter.world, this.cameras.main);
        this.collisionManager = new CollisionManager();
        this.tilesLoader = new TilesLoader();

        /**
         * @type {Phaser.Physics.Matter.Sprite[]}
         */
        this.enemies = [];
    }

    preload() {
        this.load.image('player-up-left', 'assets/sprites/cat/up-left.png');
        this.load.image('player-down-right', 'assets/sprites/cat/down-right.png');
        this.load.image('player-down', 'assets/sprites/cat/down.png');
        this.load.image('player-right', 'assets/sprites/cat/right.png');
        this.load.image('player-up', 'assets/sprites/cat/up.png');

        this.load.image('EnemyLinear', 'assets/sprites/car_2.png')
        this.load.image('cone', 'assets/sprites/bouton/Bouton.png');
        this.load.image('bouton', 'assets/sprites/bouton/Bouton.png');

        this.load.image("exit-door", "assets/sprites/exit-door.png");
    }

    create() {
        this.cameras.main.fadeIn(1000, 0, 0, 0);

        this.matter.world.disableGravity();

        this.cursors = this.input.keyboard.createCursorKeys(); // Assigne les touches prédéfinis (flèches directionnelles, shift, alt, espace)

        const map = this.add.tilemap(this.sceneMapName);  // Ajoute les emplacements de chaque tile
        const floorTileset = map.addTilesetImage("floor", "floor");  // Ajoutes les tiles du sol
        const wallTileset = map.addTilesetImage("wall", "wall");  // Ajoutes les tiles des murs

        map.createLayer("floor", floorTileset); // Créé un layer pour le sol
        const wallLayer = map.createLayer("wall", wallTileset); // Créé un layer pour les murs
        wallLayer.setCollisionByProperty({ collides: true });
        this.matter.world.convertTilemapLayer(wallLayer);

        const debugGraphics = this.add.graphics().setAlpha(0.7);
        wallLayer.renderDebug(debugGraphics, {
            tileColor: null,
            collidingTileColor: new Phaser.Display.Color(243, 234, 48, 255),
            faceColor: new Phaser.Display.Color(40, 39, 37, 255)
        })

        const start = map.filterObjects('PlayerPoints', obj => obj.name === 'SpawnPoint')[0];
        const end = map.filterObjects('PlayerPoints', obj => obj.name === 'NextLevel')[0];
        this.nextLevel = this.matter.add.sprite(
            ConvertXCartesianToIsometric(end.x, end.y),
            ConvertYCartesianToIsometric(end.x, end.y),
            "exit-door",
            0
        );
        this.nextLevel.setRectangle(end.width, end.height, {label: "NextLevel"});
        this.nextLevel.isSensor();
        this.nextLevel.setSensor(true);
        this.nextLevel.setFixedRotation();
        this.nextLevel.setStatic(true);

        this.player = this.matter.add.sprite(0, 0, 'player-up-left').setFlipX(true);
        this.player.setRectangle(this.player.width/1.5, this.player.height/2.5, {label: "player"})
        this.player.setPosition(
            ConvertXCartesianToIsometric(start.x, start.y), 
            ConvertYCartesianToIsometric(start.x, start.y)
        ); 
        this.player.setFixedRotation();
        this.player.setCollisionCategory(this.matter.world.nextCategory());
        this.player.setCollidesWith(1);

        this.playerInfoText = this.add.text(0, 0, 'Character position: ');
        this.playerInfoText.setScrollFactor(0);
        
        console.log('matter body physics: ', this.matter.world.getAllBodies());
        
        this.cameras.main.startFollow(this.player, false, 0.1, 0.1); // Permet que la caméra suit le joueur

        this.cone = this.matter.add.sprite(200, 250, "cone");
        this.cone.setPolygon(130,3, { 
            label: "cone"
        })
        this.cone.isSensor();
        this.cone.setSensor(true);
        this.cone.setFixedRotation();

        map.filterObjects('Enemies', obj => obj.name === 'EnemyLinear').forEach((enemy)=>(
                this.enemies.push(this.matter.add.sprite(
                    ConvertXCartesianToIsometric(enemy.x, enemy.y),
                    ConvertYCartesianToIsometric(enemy.x, enemy.y),
                    "EnemyLinear"
                )
            )
        ))

        this.enemies.forEach((enemy)=>(
            enemy.setStatic(true),
            this.field = this.matter.add.polygon(enemy.x-50, enemy.y+50, 3, 100, { isSensor:true, angle: 0.33, label: "field" })
        ))
        
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
            this.collisionManager.CheckButton(this.matter.world)
        }

        this.playerInteractions.CheckNextLevel(this.matter.world, this.cameras.main);
    }

    update() {
        this.playerInteractions.CheckPlayerInputs(this.player, this.cursors);
        this.playerInteractions.UseButton(this.cursors, this.player.body);
        this.UIManager.UpdatePlayerInfoText(this.playerInfoText, this.player, this.playerInteractions.canLoadNextScene);
    }
}