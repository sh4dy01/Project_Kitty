import Phaser from 'phaser'

export default class EnemiRed extends Phaser.Physics.Matter.Sprite
{
	constructor(scene, x, y, texture, frame, player)
	{
		super(scene, x, y, texture, frame)

        this.speed = 1
        this.player = player
        scene.add.existing(this)
	}

    update() {
        this.physics.moveToObject(this, player, 100);
    }
}