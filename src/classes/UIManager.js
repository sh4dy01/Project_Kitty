//@ts-check
import Phaser from "phaser";

export default class UIManager{
    /**
     * @param {Number} level
     * @param {Number} currentLife
    */
    constructor(level, currentLife){
        this.level = level;
        this.currentLife = currentLife
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

}