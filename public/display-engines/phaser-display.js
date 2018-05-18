let game = null;
let lastSprite = null

const phaserInitialize = function() {
    var gameConfig = {
        type: Phaser.WEBGL,
        width: 640,
        height: 480,
        backgroundColor: "#000044",
        // array with all game scenes, just one: playGame
        scene: [playGame]
    };

    game = new Phaser.Game(gameConfig);
};

const playGame = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize:
    function playGame(){
        Phaser.Scene.call(this, {key: "PlayGame"});
    },

    preload: function(){
        this.load.image("crate", "https://kalospace.com/gameassets/active_game_assets/sprites/32x32/Box.png");
    },

    create: function(){

        // waiting for user input
        this.input.on("pointerdown", function(pointer) {
          console.log(lastSprite);

          if (lastSprite) {
            lastSprite.destroy();
          }

          lastSprite = this.add.sprite(pointer.x, pointer.y, 'crate', 0);

          console.log(lastSprite);
          console.log(this);


        }, this);
    }
});
