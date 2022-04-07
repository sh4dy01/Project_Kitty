//@ts-check
import Phaser from "phaser";

import { CreatePlayerAnims } from "../animations/PlayerAnimations";
import PlayerManager from "../classes/PlayerManager";
import SceneManager from "../classes/SceneManager";
import UIManager from "../classes/UIManager";
import { MAX_LIVES, OFFSET_ORIENTATION, PAUSE_SCREEN, PLAYER_SIZE, TEXTURES_LOADER } from "../helpers/Constants";
import { ChangeDepth } from "../helpers/Utilities";
import SoundsLoader from "../loaders/SoundsLoader";

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

        this.ambient = this.sound.add('ambiant_sfx')
    }

    preload() {
        this.load.atlas('player', 'assets/spritesheet/player.png', 'assets/spritesheet/player.json')
        this.load.json('colliders', 'assets/colliders/colliders.json') // Ficher JSON contenant toutes les collisions créés par PhysicsEditor
        this.load.image('intro', 'assets/sprites/intro/scene_depart.png')
    }

    create() {
        this.ambient.play()

        this.matter.world.setBounds()
        this.matter.world.disableGravity();

        this.cameras.main.zoom = 1.2

        this.add.image(this.scale.width/2, this.scale.height/2, 'intro')
        this.matter.add.rectangle(this.scale.width/2-100, this.scale.height/2-80, 200, 50, {isSensor: true, angle: 2.6, label: 'NextLevel'})
        
        CreatePlayerAnims(this.anims);

        this.cameras.main.fadeIn(2000, 0, 0, 0);
        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_IN_COMPLETE, () => {
            this.playerManager.canMove = true
        })

        this.player = this.matter.add.sprite(
            this.scale.width-150,
            this.scale.height-100, 
            'player', 
            'back-left-up 1.png',
            {isSensor: true, label: 'player'}
        ).setScale(0.2);
        ChangeDepth(this.player)
        this.player.setFixedRotation()

        this.playerManager.canLoadNextScene = true
        this.playerManager.walkSpeed = 0.6

        this.cursors = this.input.keyboard.createCursorKeys(); // Assigne les touches prédéfinis (flèches directionnelles, shift, alt, espace)

        this.matter.world.on("collisionstart", (event, bodyA, bodyB) => {
            if((bodyA.label == "player" && bodyB.label == "NextLevel") || (bodyA.label == "NextLevel" && bodyB.label == "player")) {
                this.playerManager.StopPlayerMovement(this.player)
                this.cameras.main.fadeOut(2000, 0, 0, 0)
                this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
                    this.scene.start(TEXTURES_LOADER);
                    this.sound.stopAll()
                })
            }
        })
    }

    update() {
        if (!this.cursors || !this.player || !this.playerManager.canMove) {
            this.player.setVelocity(0);

            return
        }
        
        if (this.cursors.up.isDown || this.cursors.left.isDown ) {
            this.player.play('playerTopLeft', true) 
            this.player.setVelocity(-this.playerManager.walkSpeed - OFFSET_ORIENTATION * this.playerManager.walkSpeed, -this.playerManager.walkSpeed);
        } else if (this.cursors.down.isDown || this.cursors.right.isDown) {
            this.player.setVelocity(this.playerManager.walkSpeed + OFFSET_ORIENTATION * this.playerManager.walkSpeed, this.playerManager.walkSpeed );
            this.player.play('playerBottomRight', true)
        } else {
            this.player.setVelocity(0);
            this.player.stop()
        }
    }
}
