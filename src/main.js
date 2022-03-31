import Phaser from "phaser";
import PhaserMatterCollisionPlugin from "phaser-matter-collision-plugin";

import StartScene from "./scenes/startScene";
import SecondScene from "./scenes/secondScene";
import Game from "./Game";

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

game.scene.add('Game', Game);
game.scene.add('StartScene', StartScene);
game.scene.add('SecondScene', SecondScene);

game.scene.start('StartScene');