const config = {
    width: 1000,
    height: 800,
    type: Phaser.AUTO,
    physics: {
        default: 'arcade',
    },
    scene:{
        preload: preload,
        create: create,
        update: update,
        render: render,
    }
}


var game = new Phaser.Game(config)

function preload(){
    this.load.image('cara', 'img/test.png')
    this.load.image('vis', 'img/cone.png')
}

var cara;
var vis;

function create(){
    game.physics.startSystem(Phaser.Physics.ARCADE);

    cara = game.add.sprite(500,500, 'cara')
    cara.name = 'cara'
    cara.body.collideWorldBounds = true

    cursors = this.input.keyboard.createCursorKeys()
    
    vis = game.add.sprite(300,600, 'vis')
    vis.name = 'vis '
    vis.body.setSize(100,50,50,25);
    vis.body.immovable = true;
    game.physics.enable([vis,cara], Phaser.Physics.ARCADE);

}

function update(){
    game.physics.arcade.collide(vis, cara, collisionHandler, null, this);

    cara.setVelocityX(0)
    cara.setVelocityY(0)


    if(cursors.up.isDown){
        cara.setVelocity(100, -100)
    }
    if(cursors.right.isDown){
        cara.setVelocity(100, 100)
    }
    if(cursors.left.isDown){
        cara.setVelocity(-100, -100)
    }

    if(cursors.down.isDown){
        cara.setVelocity(-100, 100)
    }


}


function collisionHandler (obj1, obj2) {
    game.stage.backgroundColor = '#992d2d';
}


function render() {

    game.debug.bodyInfo(sprite1, 32, 32);

    game.debug.body(sprite1);
    game.debug.body(sprite2);

}
