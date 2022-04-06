//@ts-check
import Phaser from "phaser";

import PlayerManager from "../classes/PlayerManager"
import SceneManager from "../classes/SceneManager";
import CollisionManager from "../classes/CollisionManager";
import { CreatePurplePhantomAnims, CreateGreenPhantomAnims, CreateRedPhantomAnims } from "../animations/PhantomsAnimations";
import EnemyManager from "../classes/EnemyManager";
import UIManager from "../classes/UIManager";

import { ConvertXCartesianToIsometric, ConvertYCartesianToIsometric } from "../helpers/CartesianToIsometric";
import { AddBoss, LoadAllObjects as AddAllObjectsFromTiled } from "../loaders/ObjectLoaders";
import { GREEN, GREEN_SIZE, MAX_LIVES, PLAYER_SIZE, PURPLE, RED, UI_LEVER_OFFSET, UI_LIFE_OFFSET, UI_LIFE_SIZE, UI_LEVER_SIZE, PAUSE_SCREEN } from "../helpers/constants";
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
        this.leversUI = [];
        /**
         * @type {Phaser.GameObjects.Image[]}
        */
        this.levers = [];

        this.spawnPoint = null
        this.boss = null
        this.bossManager = new BossManager()
        /**
         * @type {EnemyManager[]}
        */
        this.enemiesAIManager = [];
        this.sceneManager = new SceneManager(this.scene, this.currentLevel, this.cameras.main);
        this.UIManager = new UIManager(this.currentLevel, data.remainingLife, this.add, this.scale.width, this.scale.height, this.leversUI, this.levers);
        this.playerManager = new PlayerManager(this.currentLives, this.sceneManager, this.UIManager);
        this.collisionManager = new CollisionManager(this.matter.world, this.playerManager, this.sceneManager, )
    }

    create() {
        const map = this.add.tilemap("map"+this.currentLevel);  // Ajoute les emplacements des tiles dans le jeu
        const colliders = this.cache.json.get('colliders'); // Récupère toutes les collisions pour les sprites

        if (this.currentLevel === 8) {
            this.boss = AddBoss(map, colliders, this.matter, this.time, this.bossManager)
        }

        this.cameras.main.fadeIn(2000, 0, 0, 0);
        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_IN_COMPLETE, () => {
            this.playerManager.canMove = true
        })

        this.cursors = this.input.keyboard.createCursorKeys(); // Assigne les touches prédéfinis (flèches directionnelles, shift, alt, espace)
        this.pauseKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC); // Touche pour mettre le jeu en PAUSE

        this.matter.world.disableGravity();
        this.playerManager.colliders = colliders

        AddAllObjectsFromTiled(map, this.enemiesAIManager, this.enemies, this.matter, this.time, colliders, this.leversUI, this.levers)

        // --- AJOUTE LES ANIMATIONS  --- //
        CreatePurplePhantomAnims(this.anims, PURPLE);
        CreateGreenPhantomAnims(this.anims, GREEN);
        CreateRedPhantomAnims(this.anims, RED);
        CreatePlayerAnims(this.anims);

        /**@type {Phaser.Physics.Matter.Image} */
        let tempObject 
        map.createFromObjects('PlayerPoints', {}).forEach(
            /** @param {Phaser.Physics.Matter.Image} point */ 
            (point)=>{
            tempObject = this.matter.add.image(
                ConvertXCartesianToIsometric(point.x, point.y),
                ConvertYCartesianToIsometric(point.x, point.y),
                "playerPoints",
                point.name+".png"
            )
            tempObject.setBody(colliders[point.name+'-'+point.getData('orientation')])
            ChangeDepth(tempObject);
            if (point.getData('orientation') === 'left') {
                tempObject.setFlipX(true)
            }
            if (point.name === "SpawnPoint") {
                this.spawnPoint = tempObject
            } else if (point.name === "NextLevel") {
                this.playerManager.exitDoor = tempObject
            }}
        );

        this.player = this.matter.add.sprite(
            this.spawnPoint.x, 
            this.spawnPoint.y, 
            'player', 
            'back-left-up 1.png'
        ).setFlipX(true).setScale(PLAYER_SIZE);
        this.player.setBody(colliders.player_top_right)
        this.player.setFixedRotation()
        ChangeDepth(this.player)
        this.player.setFixedRotation()

        this.cameras.main.startFollow(this.player, false, 0.05, 0.05); // Permet que la caméra suit le joueur

        this.collisionManager.CheckHitBoxes(this.playerManager, this.player);
        this.collisionManager.CheckButton(this.UIManager.leversStatus.length);
        this.collisionManager.CheckCollideWorld(map, colliders, this.matter, this.time, this.bossManager);
        
        this.UIManager.AddFilters()
        this.UIManager.UpdateLife()
        this.UIManager.AddLeversUI()
        this.playerManager.CheckIfAllPressed(this.matter.world, this.player)

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
        if (this.pauseKey.isDown) {
            this.scene.pause();
            this.scene.launch(PAUSE_SCREEN)
        }
        this.playerManager.CheckPlayerInputs(this.player, this.cursors);
        if (this.playerManager.canPress) {
            this.playerManager.UseButton(this.cursors, this.matter.world, this.player);
        }
        this.UIManager.UpdatePlayerInfoText(this.debugPlayerInfoText, this.player, this.playerManager.canLoadNextScene, this.playerManager.isSafe);
    }
}