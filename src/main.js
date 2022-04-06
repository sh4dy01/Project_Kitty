import Phaser from "phaser";

import Game from "./scenes/Game";
import PauseScreen from "./scenes/Pause";
import { LEVEL_MAP, PAUSE_SCREEN, TEXTURES_LOADER} from "./helpers/constants";
import TexturesLoader from "./loaders/TexturesLoader";
import LevelLoader from "./loaders/LevelLoader";

// Initialize Phaser
const config = {
    type: Phaser.AUTO,
    width: 1280,
    height: 720,
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
    autoCenter: true,
    canvas: document.querySelector('canvas')
};

const game = new Phaser.Game(config);

game.scene.add(TEXTURES_LOADER, TexturesLoader); // Add the Game scene
game.scene.add(LEVEL_MAP, LevelLoader); // Add the StartScene scene
game.scene.add(PAUSE_SCREEN, PauseScreen); // Add the StartScene scene
game.scene.add('Game', Game); // Add the Game scene

game.scene.start(TEXTURES_LOADER); // Start the StartScene scene