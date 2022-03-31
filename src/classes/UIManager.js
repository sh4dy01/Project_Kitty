//@ts-check
import Phaser from "phaser";

export default class UIManager{
    constructor(){

    }
    /**
     * @param {Phaser.GameObjects.Text} playerInfoText
     * @param {Phaser.Physics.Matter.Sprite} player
     * @param {Phaser.Scenes.ScenePlugin} scene
    */
    UpdatePlayerInfoText(playerInfoText, player, scene) {
        playerInfoText.setText([
            'Character position: ' + 'x: ' + player.x.toFixed(2) + ' y: ' + player.y.toFixed(2),
            'Player Speed: ' + 'x: ' + player.body.velocity.x + ' y: ' + player.body.velocity.y, 
            'Scene: ' + scene.key, 
        ])
    }

}