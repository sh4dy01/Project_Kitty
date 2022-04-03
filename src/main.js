import Phaser from "phaser";

import Game from "./Game";
import { LEVEL_MAP} from "./helpers/constants";
import LevelLoader from "./scenes/LevelLoader";

// Initialize Phaser
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
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
game.scene.add(LEVEL_MAP, LevelLoader); // Add the StartScene scene

game.scene.start(LEVEL_MAP, {remainingLife: 0, level: 0}); // Start the StartScene scene