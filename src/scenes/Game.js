//@ts-check
import Phaser from "phaser";

import PlayerManager from "../classes/PlayerManager"
import SceneManager from "../classes/SceneManager";
import { CheckButton, CheckHitBoxes } from "../classes/CollisionManager";
import { CreatePurplePhantomAnims, CreateGreenPhantomAnims, CreateRedPhantomAnims } from "../animations/PhantomsAnimations";
import EnemyManager from "../classes/EnemyManager";
import UIManager from "../classes/UIManager";

import { ConvertXCartesianToIsometric, ConvertYCartesianToIsometric } from "../helpers/CartesianToIsometric";
import { AddTheSpawnPoint, LoadAllObjects as AddAllObjectsFromTiled } from "../loaders/ObjectLoaders";
import { GREEN, GREEN_SIZE, MAX_LIVES, PLAYER_SIZE, PURPLE, RED } from "../helpers/constants";
import { CreatePlayerAnims } from "../animations/PlayerAnimations";
import { ChangeDepth } from "../helpers/ChangeDepth";


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

        this.lives = [];

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

    create() {
        const map = this.add.tilemap("map");  // Ajoute les emplacements des tiles dans le jeu

        this.cameras.main.fadeIn(2000, 0, 0, 0);
        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_IN_COMPLETE, () => {
            this.playerManager.canMove = true
        })

        this.cursors = this.input.keyboard.createCursorKeys(); // Assigne les touches prédéfinis (flèches directionnelles, shift, alt, espace)

        if(this.playerManager.currentLives == MAX_LIVES){
            for(var i=0; i<this.playerManager.currentLives; i++){
                    this.lives.push(true);
                }
            }
        else if(this.playerManager.currentLives < MAX_LIVES){
            this.NotTrue = MAX_LIVES - this.playerManager.currentLives;
            for(var i=0; i<this.playerManager.currentLives; i++){
                this.lives.push(true);
            }
            for(var h = 0;this.NotTrue>h; h++){
                this.lives.push(false)
            }
        }
        console.log(this.lives);

        this.matter.world.disableGravity();

        const colliders = this.cache.json.get('colliders'); // Récupère toutes les collisions pour les sprites
        this.playerManager.colliders = colliders

        AddAllObjectsFromTiled(map, this.enemiesAIManager, this.enemies, this.matter, this.time, colliders)

        // --- AJOUTE LES ANIMATIONS  --- //
        CreatePurplePhantomAnims(this.anims, PURPLE);
        CreateGreenPhantomAnims(this.anims, GREEN);
        CreateRedPhantomAnims(this.anims, RED);
        CreatePlayerAnims(this.anims);
                
        let testPhantom
        testPhantom = this.matter.add.sprite(-3890, 3815, 'red-bottom-right')
        testPhantom.setBody(colliders.red_bottom_right)
        ChangeDepth(testPhantom)
        
        testPhantom = this.matter.add.sprite(-3990, 3915, 'green-bottom-right')
        testPhantom.setBody(colliders.green_bottom_right)
        testPhantom.setScale(GREEN_SIZE)
        ChangeDepth(testPhantom)

        testPhantom = this.matter.add.sprite(-4100, 4015, 'purple-bottom-right')
        testPhantom.setBody(colliders.purple_bottom_right)
        ChangeDepth(testPhantom)

        const spawnPoint = AddTheSpawnPoint(map, colliders, this.matter)
        this.player = this.matter.add.sprite(
            spawnPoint.x, 
            spawnPoint.y, 
            'player', 
            'back-left-up 1.png'
        ).setFlipX(true);
        this.player.setBody(colliders.player_top_right)
        this.player.setScale(PLAYER_SIZE)
        this.player.setFixedRotation();
        ChangeDepth(this.player)
        
        this.playerInfoText = this.add.text(0, 0, 'Character position: ');
        this.playerInfoText.setScrollFactor(0);

        this.cameras.main.startFollow(this.player, false, 0.05, 0.05); // Permet que la caméra suit le joueur

        // this.Vignette = this.game.renderer.addPipeline('Vignette', new Vignette(this.game));
        // this.cameras.main.setPostPipeline(BlurPostFX)

        CheckHitBoxes(this.matter.world, this.playerManager, this.sceneManager, this.player);
        CheckButton(this.matter.world, this.playerManager)
    }

    update(t, dt) {
        if (!this.cursors || !this.player || !this.playerManager.canMove) {
            this.player.setVelocity(0);

            return
        }

        this.enemies.forEach(enemy => {
            ChangeDepth(enemy)
        });
        this.playerManager.CheckPlayerInputs(this.player, this.cursors);
        this.playerManager.UseButton(this.cursors, this.matter.world, this.player);
        this.UIManager.UpdatePlayerInfoText(this.playerInfoText, this.player, this.playerManager.canLoadNextScene, this.playerManager.isSafe);
    }
}