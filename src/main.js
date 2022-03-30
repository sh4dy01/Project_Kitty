import Phaser from "phaser";
import PhaserMatterCollisionPlugin from "phaser-matter-collision-plugin";

import gameScene from "./scenes/gameScene";
import secondScene from "./scenes/secondScene";

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#2d2d2d',
    physics: {
        default: "matter",
        matter: {
            gravity: { y: 0},
            debug: true,
        },
    },
    plugins: {
        scene: [
            {
              plugin: PhaserMatterCollisionPlugin,
              key: "matterCollision",
              mapping: "matterCollision"
            }
          ]
    },
};

const game = new Phaser.Game(config);

game.scene.add('startScene', gameScene);
game.scene.add('secondScene', secondScene);

game.scene.start('startScene');