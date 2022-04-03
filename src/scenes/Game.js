//@ts-check
import Phaser from "phaser";

import PlayerManager from "../classes/PlayerManager"
import SceneManager from "../classes/SceneManager";
import { CheckButton, CheckHitBoxes } from "../classes/CollisionManager";
import { CreatePurplePhantomAnims, CreateGreenPhantomAnims, CreateRedPhantomAnims } from "../animations/PhantomsAnimations";
import EnemyManager from "../classes/EnemyManager";
import UIManager from "../classes/UIManager";

import { ConvertXCartesianToIsometric, ConvertYCartesianToIsometric } from "../helpers/CartesianToIsometric";
import { LoadAllObjects } from "../loaders/ObjectLoaders";
import { GREEN, PURPLE, RED } from "../helpers/constants";


export default class Game extends Phaser.Scene {

    constructor(){
        super('game')
    }
    
    /**
     * @param {{ level: Number; remainingLife: Number}} data
    */
    init(data) {
        this.currentLevel = data.level;
        this.currentLives = data.remainingLife;

        this.sceneManager = new SceneManager(this.scene, this.currentLevel, this.cameras.main);
        this.UIManager = new UIManager(this.currentLevel, data.remainingLife);
        this.playerManager = new PlayerManager(this.currentLives, this.sceneManager);
        this.UIManager = new UIManager(this.currentLevel, this.currentLives)

        /**
         * @type {Phaser.Physics.Matter.Sprite[]}
        */
        this.enemies = [];

        /**
         * @type {EnemyManager[]}
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
        
    }

    create() {
        this.cameras.main.fadeIn(2000, 0, 0, 0);
        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_IN_COMPLETE, () => {
            this.playerManager.canMove = true
        })

        this.matter.world.disableGravity();

        const colliders = this.cache.json.get('colliders'); // Récupère toutes les collisions pour les sprites
        const spawnPoint = LoadAllObjects(this.add, this.enemiesAIManager, this.enemies, this.matter, this.time, colliders)

        // --- AJOUTE LES ANIMATIONS  --- //
        CreatePurplePhantomAnims(this.anims, PURPLE);
        CreateGreenPhantomAnims(this.anims, GREEN);
        CreateRedPhantomAnims(this.anims, RED);

        this.cursors = this.input.keyboard.createCursorKeys(); // Assigne les touches prédéfinis (flèches directionnelles, shift, alt, espace)
                

        let testPhantom
        testPhantom = this.matter.add.sprite(-3890, 3815, 'red-bottom-right')
        testPhantom.setBody(colliders.red_bottom_right)
        testPhantom = this.matter.add.sprite(-3990, 3915, 'green-bottom-right')
        testPhantom.setBody(colliders.green_bottom_right)
        testPhantom.setScale(0.6)
        testPhantom = this.matter.add.sprite(-4100, 4015, 'purple-bottom-right')
        testPhantom.setBody(colliders.purple_bottom_right)

        this.player = this.matter.add.sprite(0, 0, 'player-up-left').setFlipX(true);
        this.player.setBody(colliders.player)
        this.player.setPosition(
            ConvertXCartesianToIsometric(spawnPoint.x, spawnPoint.y),
            ConvertYCartesianToIsometric(spawnPoint.x, spawnPoint.y)
        ); 
        this.player.setFixedRotation();
        
        this.playerInfoText = this.add.text(0, 0, 'Character position: ');
        this.playerInfoText.setScrollFactor(0);
        this.cameras.main.startFollow(this.player, false, 0.05, 0.05); // Permet que la caméra suit le joueur

        CheckHitBoxes(this.matter.world, this.playerManager, this.sceneManager, this.player);
        CheckButton(this.matter.world, this.playerManager)
    }

    update(t, dt) {
        if (!this.cursors || !this.player || !this.playerManager.canMove) {
            return
        }

        this.playerManager.CheckPlayerInputs(this.player, this.cursors);
        this.playerManager.UseButton(this.cursors, this.matter.world, this.player);
        this.UIManager.UpdatePlayerInfoText(this.playerInfoText, this.player, this.playerManager.canLoadNextScene, this.playerManager.isSafe);
    }
}