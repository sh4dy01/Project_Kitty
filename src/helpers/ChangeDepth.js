import Phaser from "phaser"
import { OFFSET_DEPTH } from "./constants"

/** 
 * @param {Phaser.Physics.Matter.Sprite | Phaser.Physics.Matter.Image} object
 * */
export function ChangeDepth(object) {
    object.setDepth(object.y - OFFSET_DEPTH)
}