//@ts-check
import Phaser from "phaser";
import { LEVEL_MAP, MAX_LIVES} from "../helpers/Constants";

export default class TexturesLoader extends Phaser.Scene {

    constructor() {
        super('TexturesLoader')
    }

    preload() {
        this.load.atlas('player', 'assets/spritesheet/player.png', 'assets/spritesheet/player.json')
        this.load.atlas('objects', 'assets/spritesheet/objects.png', 'assets/spritesheet/objects.json')
        this.load.atlas('boss', 'assets/spritesheet/boss.png', 'assets/spritesheet/boss.json')
        this.load.atlas('indicators', 'assets/spritesheet/indicators.png', 'assets/spritesheet/indicators.json')
        this.load.atlas('playerPoints', 'assets/spritesheet/playerPoints.png', 'assets/spritesheet/playerPoints.json')
        this.load.atlas('levers', 'assets/spritesheet/levers.png', 'assets/spritesheet/levers.json')
        this.load.atlas('ui', 'assets/spritesheet/ui.png', 'assets/spritesheet/ui.json')

        this.load.atlas('purple-anim', 'assets/spritesheet/purple.png', 'assets/spritesheet/purple.json')
        this.load.atlas('green-anim', 'assets/spritesheet/green.png', 'assets/spritesheet/green.json')
        this.load.atlas('red-anim', 'assets/spritesheet/red.png', 'assets/spritesheet/red.json')

        this.load.json('colliders', 'assets/colliders/colliders.json') // Ficher JSON contenant toutes les collisions créés par PhysicsEditor

        this.load.image('night-filter', "assets/filters/filtre-resized.png")
        this.load.image('vignette', "assets/filters/vignette-resized.png")
        this.load.image('pause-screen', 'assets/sprites/ui/pause-screen.png')

        this.load.image("floor", "assets/tiles/floor.png");
        this.load.image("wall", "assets/tiles/walls.png");
        this.load.image("wall2", "assets/tiles/walls2.png");
    }

    create() {
        this.scene.start(LEVEL_MAP, {remainingLife: MAX_LIVES, level: 0})
    }
}