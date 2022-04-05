//@ts-check
import Phaser from "phaser";
import { MAX_LIVES, UI_LIFE_OFFSET, UI_LIFE_SIZE } from "../helpers/constants";

export default class UIManager{
    /**
     * @param {Number} level
     * @param {Number} currentLife
     * @param {Phaser.GameObjects.GameObjectFactory} add
     * @param {number} gameWidth
     * @param {number} gameHeight
     */
    constructor(level, currentLife, add, gameWidth, gameHeight){
        this.level = level;
        this.currentLife = currentLife
        this.add = add
        this.gameWidth = gameWidth
        this.gameHeight = gameHeight
    }

    /**
     * @param {Phaser.GameObjects.Text} playerInfoText
     * @param {Phaser.Physics.Matter.Sprite} player
     * @param {Boolean} canLoadNextScene
     * @param {Boolean} isSafe
     */
    UpdatePlayerInfoText(playerInfoText, player, canLoadNextScene, isSafe) {
        playerInfoText.setText([
            'Character position: ' + 'x: ' + player.x.toFixed(2) + ' y: ' + player.y.toFixed(2),
            'Player Speed: ' + 'x: ' + player.body.velocity.x + ' y: ' + player.body.velocity.y, 
            'Level: ' + this.level, 
            'Exit: ' + canLoadNextScene, 
            'Lives: ' + this.currentLife, 
            'isSafe: ' + isSafe
        ])
    }

    UpdateLife() {
        for (let i = 0; i < this.currentLife; i++) {
            this.add.image(50 + UI_LIFE_OFFSET*i, this.gameHeight-40, 'life-full').setScrollFactor(0).setScale(UI_LIFE_SIZE).setDepth(9999)
        }
        if (this.currentLife < MAX_LIVES) {
            for (let i = this.currentLife; i < MAX_LIVES; i++) {
                this.add.image(50 + UI_LIFE_OFFSET*i, this.gameHeight-40, 'life-empty').setScrollFactor(0).setScale(UI_LIFE_SIZE).setDepth(9999)
            }
        }
    }

    AddFilters() {
        this.add.image(this.gameWidth/2, this.gameHeight/2, 'night-filter').setScrollFactor(0).setDepth(9998).setScale(1.05)
        this.add.image(this.gameWidth/2, this.gameHeight/2, 'vignette').setScrollFactor(0).setDepth(9998).setScale(1.05)
    }

}