import Phaser from "phaser";

import startScene from "./scenes/startScene";

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 0},
            debug: true,
        },
    },
};

const game = new Phaser.Game(config);

game.scene.add('startScene', startScene);

game.scene.start('startScene');