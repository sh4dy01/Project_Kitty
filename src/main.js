import Phaser from "phaser";

import StartLevel from "./scenes/startScene";
import SecondScene from "./scenes/secondScene";
import Game from "./Game";
import { START_LEVEL } from "./helpers/constants";


// Initialize Phaser
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#2d2d2d',
    dom: {
        createContainer: true
    },
    physics: {
        default: "matter",
        matter: {
            gravity: { y: 0},
            debug: true,
        },
    },
    fps: {
        target: 60,
        forceSetTimeOut: true
    },
};

const game = new Phaser.Game(config);

game.scene.add('Game', Game); // Add the Game scene
game.scene.add(START_LEVEL, StartLevel); // Add the StartScene scene
game.scene.add('SecondScene', SecondScene); // Add the SecondScene scene

game.scene.start(START_LEVEL); // Start the StartScene scene