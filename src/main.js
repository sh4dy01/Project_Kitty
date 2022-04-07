import Phaser from "phaser";

import Game from "./scenes/Game";
import PauseScreen from "./scenes/Pause";
import { LEVEL_MAP, PAUSE_SCREEN, TEXTURES_LOADER, INTRO_SCREEN, SOUNDS_LOADER, OUTRO_SCREEN, CREDITS_SCREEN} from "./helpers/Constants";
import TexturesLoader from "./loaders/TexturesLoader";
import LevelLoader from "./loaders/LevelLoader";
import IntroScreen from "./scenes/Intro";
import SoundsLoader from "./loaders/SoundsLoader";
import OutroScreen from "./scenes/Outro";
import CreditsScreen from "./scenes/Credits";

// Initialize Phaser
const config = {
    type: Phaser.AUTO,
    width: 1280,
    height: 720,
    parent: 'game_section',
    physics: {
        default: "matter",
        matter: {
            gravity: { y: 0},
            debug: true
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

game.scene.add(SOUNDS_LOADER, SoundsLoader); // Add the SoundsLoader scene
game.scene.add(INTRO_SCREEN, IntroScreen); // Add the StartScene scene
game.scene.add(TEXTURES_LOADER, TexturesLoader); // Add the textures loader scene

game.scene.add(LEVEL_MAP, LevelLoader); // Add the level scene
game.scene.add(PAUSE_SCREEN, PauseScreen); // Add the PauseScene scene
game.scene.add('Game', Game); // Add the Game scene
game.scene.add(OUTRO_SCREEN, OutroScreen); // Add the Outro scene
game.scene.add(CREDITS_SCREEN, CreditsScreen); // Add the Credits scene



game.scene.start(CREDITS_SCREEN); 