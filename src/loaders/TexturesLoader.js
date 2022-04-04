//@ts-check
import Phaser from "phaser";
import { LEVEL_MAP, MAX_LIVES} from "../helpers/constants";

export default class TexturesLoader extends Phaser.Scene {

    constructor() {
        super('TexturesLoader')
    }

    preload() {
        this.load.atlas('player', 'assets/spritesheet/player.png', 'assets/spritesheet/player.json')

        this.load.image('purple-bottom-right', 'assets/sprites/phantoms/purple/bottom-right.png')
        this.load.image('purple-top-right', 'assets/sprites/phantoms/purple/top-right.png')
        this.load.image('purple-bottom-left', 'assets/sprites/phantoms/purple/bottom-left.png')
        this.load.image('purple-top-left', 'assets/sprites/phantoms/purple/top-left.png')

        this.load.image('green-bottom-right', 'assets/sprites/phantoms/green/bottom-right.png')
        this.load.image('green-top-right', 'assets/sprites/phantoms/green/top-right.png')
        this.load.image('green-bottom-left', 'assets/sprites/phantoms/green/bottom-left.png')
        this.load.image('green-top-left', 'assets/sprites/phantoms/green/top-left.png')

        this.load.image('red-bottom-right', 'assets/sprites/phantoms/red/bottom-right.png')
        this.load.image('red-top-right', 'assets/sprites/phantoms/red/top-right.png')
        this.load.image('red-bottom-left', 'assets/sprites/phantoms/red/bottom-left.png')
        this.load.image('red-top-left', 'assets/sprites/phantoms/red/top-left.png')

        this.load.atlas('purple-front', 'assets/spritesheet/purple-front.png', 'assets/spritesheet/purple-front.json')
        this.load.atlas('purple-back', 'assets/spritesheet/purple-back.png', 'assets/spritesheet/purple-back.json')
        this.load.atlas('green-front', 'assets/spritesheet/green-front.png', 'assets/spritesheet/green-front.json')
        this.load.atlas('green-back', 'assets/spritesheet/green-back.png', 'assets/spritesheet/green-back.json')
        this.load.atlas('red-front', 'assets/spritesheet/red-front.png', 'assets/spritesheet/red-front.json')
        this.load.atlas('red-back', 'assets/spritesheet/red-back.png', 'assets/spritesheet/red-back.json')

        this.load.json('colliders', 'assets/colliders/colliders.json') // Ficher JSON contenant toutes les collisions créés par PhysicsEditor

        this.load.image('checkpoint', 'assets/sprites/props/candyshop.png');
        this.load.image('wardrobe-front', 'assets/sprites/props/wardrobe-front.png');
        this.load.image('wardrobe-back', 'assets/sprites/props/wardrobe-back.png');
        this.load.image('cone', 'assets/sprites/proto/Bouton.png');
        this.load.image('bouton', 'assets/sprites/proto/Bouton.png');

        this.load.image("exit-door", "assets/sprites/proto/exit-door.png");

        this.load.image("floor", "assets/tiles/floor.png");
        this.load.image("wall", "assets/tiles/wall.png");
    }

    create() {
        console.log('loaded: ' + 'textures')

        this.scene.start(LEVEL_MAP, {remainingLife: MAX_LIVES, level: 0})
    }
}