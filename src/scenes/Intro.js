//@ts-check
import Phaser from "phaser";
import { CreatePlayerAnims } from "../animations/PlayerAnimations";
import PlayerManager from "../classes/PlayerManager";
import SceneManager from "../classes/SceneManager";
import UIManager from "../classes/UIManager";
import { MAX_LIVES, PAUSE_SCREEN, PLAYER_SIZE } from "../helpers/Constants";
import { ChangeDepth } from "../helpers/Utilities";

export default class IntroScreen extends Phaser.Scene {
    constructor() {
        super('IntroScreen')
    }

    init() {
        this.currentLevel = -1
        this.currentLives = MAX_LIVES

        this.sceneManager = new SceneManager(this.scene, this.currentLevel, this.cameras.main);
        this.UIManager = new UIManager(this.currentLevel, this.currentLives, this.add, this.scale.width, this.scale.height);
        this.playerManager = new PlayerManager(this.currentLives, this.sceneManager, this.UIManager);
    }

    preload() {
        this.load.atlas('player', 'assets/spritesheet/player.png', 'assets/spritesheet/player.json')
        this.load.json('colliders', 'assets/colliders/colliders.json') // Ficher JSON contenant toutes les collisions créés par PhysicsEditor
    }

    create() {
        const colliders = this.cache.json.get('colliders');

        CreatePlayerAnims(this.anims);

        this.cameras.main.fadeIn(2000, 0, 0, 0);
        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_IN_COMPLETE, () => {
            this.playerManager.canMove = true
        })

        this.player = this.matter.add.sprite(
            0, 
            0, 
            'player', 
            'back-left-up 1.png'
        ).setScale(PLAYER_SIZE);
        this.player.setBody(colliders.player_top_right)
        this.player.setFixedRotation()
        ChangeDepth(this.player)
        this.player.setFixedRotation()

        this.cursors = this.input.keyboard.createCursorKeys(); // Assigne les touches prédéfinis (flèches directionnelles, shift, alt, espace)
        this.pauseKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC); // Touche pour mettre le jeu en PAUSE

        this.matter.world.disableGravity();

        this.cameras.main.startFollow(this.player, false, 0.05, 0.05); // Permet que la caméra suit le joueur
    }

    update() {
        if (!this.cursors || !this.player || !this.playerManager.canMove) {
            this.player.setVelocity(0);

            return
        }
        
        if (this.pauseKey.isDown) {
            this.scene.pause();
            this.scene.launch(PAUSE_SCREEN, {sceneToResume: this})
        }
        this.playerManager.CheckPlayerInputs(this.player, this.cursors);
    }
}