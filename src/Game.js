//@ts-check
import Phaser from "phaser";
import CollisionManager from "./classes/collisionManager";
import PlayerMovement from "./classes/player"
import SceneManager from "./classes/sceneManager";
import UIManager from "./classes/UIManager";
import { ConvertXCartesianToIsometric, ConvertYCartesianToIsometric } from "./helpers/cartesianToIsometric";
import { LoadTilesAssets } from "./helpers/tilesLoader";

export default class Game extends Phaser.Scene {

    constructor(){
        super('game')
    }

    init(data) {
        this.sceneMapName = data.key;
        this.playerMovement = new PlayerMovement;
        this.UIManager = new UIManager(this.sceneMapName);
        this.sceneManager = new SceneManager(this.scene.manager, this.scene.getIndex());
        this.collisionManager = new CollisionManager(this.sceneManager);

        this.canLoadNextScene = true;
    }

    preload() {
        this.load.image('player-up-left', 'assets/sprites/cat/up-left.png');
        this.load.image('player-down-right', 'assets/sprites/cat/down-right.png');
        this.load.image('player-down', 'assets/sprites/cat/down.png');
        this.load.image('player-right', 'assets/sprites/cat/right.png');
        this.load.image('player-up', 'assets/sprites/cat/up.png');

        this.load.image('cone', 'assets/sprites/bouton/Bouton.png');
        this.load.image('bouton', 'assets/sprites/bouton/Bouton.png');

        this.load.image("exit-door", "assets/sprites/exit-door.png");
    }

    create() {
        this.cameras.main.fadeIn(1000, 0, 0, 0);

        this.matter.world.disableGravity();

        this.cursors = this.input.keyboard.createCursorKeys(); // Assigne les touches prédéfinis (flèches directionnelles, shift, alt, espace)

        this.map = LoadTilesAssets(this.add, this.matter, this.sceneMapName);

        const start = this.map.filterObjects('PlayerPoints', obj => obj.name === 'SpawnPoint')[0];
        const end = this.map.filterObjects('PlayerPoints', obj => obj.name === 'NextLevel')[0];

        this.nextLevel = this.matter.add.sprite(
            ConvertXCartesianToIsometric(end.x, end.y),
            ConvertYCartesianToIsometric(end.x, end.y),
            "exit-door",
            0
        );
        this.nextLevel.setRectangle(end.width, end.height, {label: "nextLevel"});
        this.nextLevel.isSensor();
        this.nextLevel.setSensor(true);
        this.nextLevel.setFixedRotation();

        this.player = this.matter.add.sprite(0, 0, 'player-up-left').setFlipX(true);
        this.player.setRectangle(this.player.width, this.player.height, {label: "player"})
        this.player.setPosition(
            ConvertXCartesianToIsometric(start.x, start.y), 
            ConvertYCartesianToIsometric(start.x, start.y)
        ); 
        this.player.setFixedRotation();

        this.playerInfoText = this.add.text(0, 0, 'Character position: ');
        this.playerInfoText.setScrollFactor(0);
        
        this.player.setCollisionCategory(this.matter.world.nextCategory());
        this.player.setCollidesWith(1);
            
        console.log(this.matter.world.getAllBodies());
        
        this.cameras.main.startFollow(this.player, false, 0.1, 0.1); // Permet que la caméra suit le joueur

        this.cone = this.matter.add.sprite(200, 250, "cone");
        this.cone.setPolygon(130,3, { 
            label: "cone"
        })
        this.cone.isSensor();
        this.cone.setSensor(true);
        this.cone.setFixedRotation();

        const boutonColor = new Phaser.Display.Color(155, 0, 0);

        const button = this.map.filterObjects('Interactions', obj => obj.name === 'Button')[0];
        const linearEnemies = this.map.filterObjects('Enemies', obj => obj.name === 'EnemyLinear');
        
        
        
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

        this.collisionManager.CheckHitBoxes(this.canLoadNextScene, this.matter.world, this.cameras.main);
        this.collisionManager.CheckButton(this.matter.world, this.player.body)
    }

    update() {
        this.playerMovement.CheckPlayerInputs(this.player, this.cursors);
        this.UIManager.UpdatePlayerInfoText(this.playerInfoText, this.player);
        this.playerMovement.UseButton(this.cursors, this.player.body);
    }
}