//@ts-check
import Phaser from "phaser";
import { LEVEL_MAP, MAX_LIVES} from "../helpers/constants";

export default class TexturesLoader extends Phaser.Scene {

    constructor() {
        super('TexturesLoader')
    }

    preload() {
        this.load.atlas('player', 'assets/spritesheet/player.png', 'assets/spritesheet/player.json')
        this.load.atlas('objects', 'assets/spritesheet/objects.png', 'assets/spritesheet/objects.json')
        this.load.atlas('boss', 'assets/spritesheet/boss.png', 'assets/spritesheet/boss.json')
        this.load.atlas('indicators', 'assets/spritesheet/indicators.png', 'assets/spritesheet/indicators.json')
        this.load.atlas('doors', 'assets/spritesheet/doors.png', 'assets/spritesheet/doors.json')
        this.load.atlas('levers', 'assets/spritesheet/levers.png', 'assets/spritesheet/levers.json')

        this.load.image('life-full', 'assets/sprites/ui/LifeFull.png')
        this.load.image('life-empty', 'assets/sprites/ui/LifeEmpty.png')

        this.load.atlas('purple-anim', 'assets/spritesheet/purple.png', 'assets/spritesheet/purple.json')
        this.load.atlas('green-anim', 'assets/spritesheet/green.png', 'assets/spritesheet/green.json')
        this.load.atlas('red-anim', 'assets/spritesheet/red.png', 'assets/spritesheet/red.json')

        this.load.json('colliders', 'assets/colliders/colliders.json') // Ficher JSON contenant toutes les collisions créés par PhysicsEditor

        this.load.image('checkpoint', 'assets/sprites/props/candyshop.png');
        this.load.image('wardrobe-front', 'assets/sprites/props/wardrobe-front.png');
        this.load.image('wardrobe-back', 'assets/sprites/props/wardrobe-back.png');
        this.load.image("lever-on", 'assets/sprites/ui/green-lever.png');
        this.load.image("lever-off", 'assets/sprites/ui/red-lever.png');

        this.load.image("exit-door", "assets/sprites/proto/exit-door.png");

        this.load.image('night-filter', "assets/filters/filtre-resized.png")
        this.load.image('vignette', "assets/filters/vignette-resized.png")

        this.load.image("floor", "assets/tiles/floor.png");
        this.load.image("wall", "assets/tiles/wall.png");
    }

    create() {
        this.scene.start(LEVEL_MAP, {remainingLife: MAX_LIVES, level: 0})
    }
}