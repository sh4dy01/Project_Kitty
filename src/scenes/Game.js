//@ts-check
import Phaser from "phaser";

import PlayerManager from "../classes/PlayerManager"
import SceneManager from "../classes/SceneManager";
import { CheckButton, CheckHitBoxes } from "../classes/CollisionManager";
import { CreatePurplePhantomAnims, CreateGreenPhantomAnims, CreateRedPhantomAnims } from "../animations/PhantomsAnimations";
import EnemyManager from "../classes/EnemyManager";
import UIManager from "../classes/UIManager";

import { ConvertXCartesianToIsometric, ConvertYCartesianToIsometric } from "../helpers/CartesianToIsometric";
import { AddBoss, AddTheSpawnPoint, LoadAllObjects as AddAllObjectsFromTiled } from "../loaders/ObjectLoaders";
import { GREEN, GREEN_SIZE, MAX_LIVES, PLAYER_SIZE, PURPLE, RED, UI_LEVER_OFFSET, UI_LIFE_OFFSET, UI_LIFE_SIZE, UI_LEVER_SIZE } from "../helpers/constants";
import { CreatePlayerAnims } from "../animations/PlayerAnimations";
import { ChangeDepth } from "../helpers/ChangeDepth";
import BossManager from "../classes/BossManager";


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
        /**
         * @type {Phaser.Physics.Matter.Sprite[]}
        */
            this.enemies = [];

        /**
         * @type {Boolean[]}
        */
            this.levers = [];
    
        /**
         * @type {EnemyManager[]}
        */
        this.enemiesAIManager = [];

        this.sceneManager = new SceneManager(this.scene, this.currentLevel, this.cameras.main);
        this.UIManager = new UIManager(this.currentLevel, data.remainingLife, this.add, this.scale.width, this.scale.height, this.levers);
        this.playerManager = new PlayerManager(this.currentLives, this.sceneManager, this.UIManager);
    }

    create() {
        const map = this.add.tilemap("map");  // Ajoute les emplacements des tiles dans le jeu
        const colliders = this.cache.json.get('colliders'); // Récupère toutes les collisions pour les sprites
        const spawnPoint = AddTheSpawnPoint(map, colliders, this.matter)
        
        this.cameras.main.fadeIn(2000, 0, 0, 0);
        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_IN_COMPLETE, () => {
            this.playerManager.canMove = true
        })

        this.cursors = this.input.keyboard.createCursorKeys(); // Assigne les touches prédéfinis (flèches directionnelles, shift, alt, espace)
        this.matter.world.disableGravity();
        this.playerManager.colliders = colliders

        AddAllObjectsFromTiled(map, this.enemiesAIManager, this.enemies, this.matter, this.time, colliders, this.levers)

        // --- AJOUTE LES ANIMATIONS  --- //
        CreatePurplePhantomAnims(this.anims, PURPLE);
        CreateGreenPhantomAnims(this.anims, GREEN);
        CreateRedPhantomAnims(this.anims, RED);
        CreatePlayerAnims(this.anims);

        this.player = this.matter.add.sprite(
            spawnPoint.x, 
            spawnPoint.y, 
            'player', 
            'back-left-up 1.png'
        ).setFlipX(true).setScale(PLAYER_SIZE);
        this.player.setBody(colliders.player_top_right)
        this.player.setFixedRotation()
        ChangeDepth(this.player)
        
        this.cameras.main.startFollow(this.player, false, 0.05, 0.05); // Permet que la caméra suit le joueur

        CheckHitBoxes(this.matter.world, this.playerManager, this.sceneManager, this.player);
        CheckButton(this.matter.world, this.playerManager)
        
        // this.add.image(0, 0, )
        this.UIManager.AddFilters()
        this.UIManager.UpdateLife()
        this.UIManager.AddLeversUI()

        this.debugPlayerInfoText = this.add.text(0, 0, 'Character position: ').setScrollFactor(0); // to remove
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
        this.UIManager.UpdatePlayerInfoText(this.debugPlayerInfoText, this.player, this.playerManager.canLoadNextScene, this.playerManager.isSafe);
    }
}