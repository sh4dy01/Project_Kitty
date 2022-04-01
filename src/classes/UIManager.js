//@ts-check
import Phaser from "phaser";

export default class UIManager{
    /**
     * @param {String} sceneName
    */
    constructor(sceneName){
        this.sceneName = sceneName;
    }

    /**
     * @param {Phaser.GameObjects.Text} playerInfoText
     * @param {Phaser.Physics.Matter.Sprite} player
     * @param {Boolean} canLoadNextScene
     * @param {Number} currentLives
     * @param {Boolean} isSafe
     */
    UpdatePlayerInfoText(playerInfoText, player, canLoadNextScene, currentLives, isSafe) {
        playerInfoText.setText([
            'Character position: ' + 'x: ' + player.x.toFixed(2) + ' y: ' + player.y.toFixed(2),
            'Player Speed: ' + 'x: ' + player.body.velocity.x + ' y: ' + player.body.velocity.y, 
            'Scene: ' + this.sceneName, 
            'Exit: ' + canLoadNextScene, 
            'Lives: ' + currentLives, 
            'isSafe: ' + isSafe
        ])
    }

}