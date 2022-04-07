//@ts-check
import Phaser from "phaser";
import { UpdateLeverTexture } from "../helpers/Utilities";
import { MAX_LIVES, UI_LEVER_OFFSET, UI_LEVER_SIZE, UI_LIFE_OFFSET, UI_LIFE_SIZE, UI_Y_OFFSET } from "../helpers/Constants";

export default class UIManager{
    /**
     * @param {Number} level
     * @param {Number} currentLife
     * @param {Phaser.GameObjects.GameObjectFactory} add
     * @param {number} gameWidth
     * @param {number} gameHeight
     * @param {Boolean[]} leversUI
     * @param {Phaser.GameObjects.Image[]} leversSprite

     */
    constructor(level, currentLife, add, gameWidth, gameHeight, leversUI, leversSprite){
        this.level = level;
        this.currentLife = currentLife
        this.add = add
        this.gameWidth = gameWidth
        this.gameHeight = gameHeight

        this.leversStatus = leversUI
        /**@type {Phaser.GameObjects.Image[]} */
        this.leversUIImage = []
        this.leversSprite = leversSprite
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

    /**
     * @param {string | number} index
     */
    UpdateLeversUI(index) {
        this.leversStatus[index] = true
        this.leversUIImage[index].setTexture('levers', 'lever_ui_on.png')
        UpdateLeverTexture(this.leversSprite[index]);
    }

    AddLeversUI() {
        for (let i = 0; i < this.leversStatus.length; i++) {
            if (this.leversStatus[i] === false) {
                this.leversUIImage.push(this.add.image(50 + UI_LIFE_OFFSET*i, this.gameHeight-100, 'levers', 'lever_ui_off.png').setScrollFactor(0).setDepth(9999).setScale(UI_LEVER_SIZE))
            } else {
                this.leversUIImage.push(this.add.image(50 + UI_LIFE_OFFSET*i, this.gameHeight-100, 'levers', 'lever_ui_on.png').setScrollFactor(0).setDepth(9999).setScale(UI_LEVER_SIZE))
            }
        }
    }

    AddFilters() {
        this.add.image(this.gameWidth/2, this.gameHeight/2, 'night-filter').setScrollFactor(0).setDepth(99998).setScale(1.05)
        this.add.image(this.gameWidth/2, this.gameHeight/2, 'vignette').setScrollFactor(0).setDepth(99998).setScale(1.05)
    }
}