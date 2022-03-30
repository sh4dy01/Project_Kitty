//@ts-check
import Phaser from "phaser";

export default class startScene extends Phaser.Scene {

    init() {
        this.walkSpeed = 1;
        this.runSpeed = 10;
        this.playerSpeed = this.walkSpeed;
        this.canLoadNextScene = true;
        this.lives = 3;
    }

    preload() {
        this.load.image('player', 'assets/sprites/cat-proto.png');
        this.load.image("floor", "assets/tiles/floor.png");
        this.load.image("exit-door", "assets/sprites/exit-door.png");

        this.load.tilemapTiledJSON("map", "assets/tiledmap/testmap2.json");  
        console.log("scene 1");
    }

    create() {
        this.cameras.main.fadeIn(1000, 0, 0, 0);
        this.matter.world.disableGravity();

        this.cursors = this.input.keyboard.createCursorKeys(); // Assigne les touches prédéfinis (flèches directionnelles, shift, alt, espace)

        const map = this.add.tilemap("map");  // Ajoute les coordonnées de chaque tile
        const floorTileset = map.addTilesetImage("floor", "floor");  // Ajoutes les tiles
        const floor = map.createLayer("floor", floorTileset); // Créé un layer pour le sol
        // const walls = map.createLayer("walls", tileset); // Créé un layer pour les murs

        const start = map.filterObjects('PlayerPoints', obj => obj.name === 'SpawnPoint')[0];
        const end = map.filterObjects('PlayerPoints', obj => obj.name === 'NextLevel')[0];

        this.nextLevel = this.matter.add.sprite(
            this.ConvertXCartesianToIsometric(end.x, end.y),
            this.ConvertYCartesianToIsometric(end.x, end.y),
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
            this.ConvertXCartesianToIsometric(start.x, start.y), 
            this.ConvertYCartesianToIsometric(start.x, start.y)
        ); 
        this.playerInfoText = this.add.text(0, 0, 'Character position: ');
        this.playerInfoText.setScrollFactor(0);

        this.cameras.main.startFollow(this.player, false, 0.1, 0.1); // Permet que la caméra suit le joueur
    }

    update() {
        this.CheckPlayerInputs();
        this.CheckHitBoxes();
        this.playerInfoText.setText([
            'Character position: ' + 'x: ' + this.player.x.toFixed(2) + ' y: ' + this.player.x.toFixed(2),
            'Lives: ' + this.lives, 
            'Scene: ' + this.scene.key, 
        ])
    }

    CheckPlayerInputs(){
        this.player.setVelocity(0);

        if (this.cursors.shift.isDown) {
            this.playerSpeed = this.runSpeed;
        } else {
            this.playerSpeed = this.walkSpeed;
        }
        
        if (this.cursors.up.isDown) {
            this.player.setVelocityY(-this.playerSpeed);
        } 
        else if (this.cursors.down.isDown) {
            this.player.setVelocityY(this.playerSpeed);
        }

        if (this.cursors.right.isDown) {
            this.player.setVelocityX(this.playerSpeed);
        } 
        else if (this.cursors.left.isDown) {
            this.player.setVelocityX(-this.playerSpeed);
        }
    }

    CheckHitBoxes() {
        if (this.canLoadNextScene) {
            this.matter.world.on("collisionstart", (event, bodyA, bodyB) => {
                if((bodyA.label == "player" && bodyB.label == "nextLevel") == (bodyB.label == "nextLevel" && bodyA.label == "player")) {
                    this.canLoadNextScene = false;
                    this.cameras.main.fadeOut(1000, 0, 0, 0)
                    this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
                        this.scene.start('secondScene');
                    })
                }
            })
        }
    }

    ConvertXCartesianToIsometric(x, y) {
        var tempX = x - y;

        return tempX
    }

    ConvertYCartesianToIsometric(x, y) {
        var tempY = (x + y) / 2;

        return tempY
    }
}