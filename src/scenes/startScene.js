//@ts-check
import Phaser from "phaser";
import CollisionManager from "../classes/collisionManager";
import PlayerMovement from "../classes/player"
import SceneManager from "../classes/sceneManager";
import UIManager from "../classes/UIManager";
import { ConvertXCartesianToIsometric, ConvertYCartesianToIsometric } from "../helpers/cartesianToIsometric";
import { LoadTilesAssets } from "../classes/tilesLoader";

export default class StartScene extends Phaser.Scene {

    constructor(config){
        super(config)

        this.mapPath = "assets/tiledmap/testmap2.json";
    }

    init() {
        this.playerMovement = new PlayerMovement;
        this.UIManager = new UIManager;
        this.sceneManager = new SceneManager(this.scene.manager, this.scene.getIndex());
        this.collisionManager = new CollisionManager(this.sceneManager);

        this.canLoadNextScene = true;
    }

    preload() {
        this.load.image('player', 'assets/sprites/cat-proto.png');
        this.load.image("floor", "assets/tiles/floor.png");
        this.load.image("exit-door", "assets/sprites/exit-door.png");

        this.load.tilemapTiledJSON("map", this.mapPath)
    }

    create() {
        this.cameras.main.fadeIn(1000, 0, 0, 0);
        this.matter.world.disableGravity();

        this.cursors = this.input.keyboard.createCursorKeys(); // Assigne les touches prédéfinis (flèches directionnelles, shift, alt, espace)

        this.map = LoadTilesAssets(this.add);

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

        /*const colliders = mapLevel.createFromObjects("collider", {name: 'collider'});
        console.log(colliders)
        colliders.forEach(collider => {
            this.physics.world.enable(collider);
        })*/ // Les collisions à travailler

        this.player = this.matter.add.sprite(0, 0, 'player');
        this.player.setRectangle(this.player.width, this.player.height, {label: "player"})
        this.player.setPosition(
            ConvertXCartesianToIsometric(start.x, start.y), 
            ConvertYCartesianToIsometric(start.x, start.y)
        ); 

        this.playerInfoText = this.add.text(0, 0, 'Character position: ');
        this.playerInfoText.setScrollFactor(0);
        
        this.cameras.main.startFollow(this.player, false, 0.1, 0.1); // Permet que la caméra suit le joueur
    }

    update() {
        this.playerMovement.CheckPlayerInputs(this.player, this.cursors);
        this.collisionManager.CheckHitBoxes(this.canLoadNextScene, this.matter.world, this.cameras.main);
        this.UIManager.UpdatePlayerInfoText(this.playerInfoText, this.player, this.scene);
    }
}