const playGame = new Phaser.Class({
  Extends: Phaser.Scene,

  initialize: function playGame() {
    Phaser.Scene.call(this, {key: "PlayGame"});
  },

  preload: function() {
    this.load.image("Squirrel", "https://kalospace.com/gameassets/active_game_assets/sprites/32x32/Squirrel.png");
    this.load.image("Acorn", "https://kalospace.com/gameassets/active_game_assets/sprites/32x32/Acorn.png");
    this.load.image("Rabbit", "https://kalospace.com/gameassets/active_game_assets/sprites/32x32/Rabbit.png");
    this.load.image("Carrot", "https://kalospace.com/gameassets/active_game_assets/sprites/32x32/Carrot.png");
    this.load.image("Floor_Grass", "https://kalospace.com/gameassets/active_game_assets/sprites/32x32/Floor_Grass.png");
    this.load.image("Floor_Ice", "https://kalospace.com/gameassets/active_game_assets/sprites/32x32/Floor_Ice.png");
    this.load.image("Tree", "https://kalospace.com/gameassets/active_game_assets/sprites/32x64/Tree.png");
  },

  create: function() {
    World.MainDisplay.displayEngineHandler.mainScene = this;
    World.MainDisplay.renderAll();
    initializeUiTimeAndCamera();
  },

  update: function() {
      if (!World.worldPaused) { mainLoop(); }
  }
});

const PhaserDisplay = function(mainDisplay) {
  this.owner = mainDisplay;
  this.mainScene = null;

  this.initialize = function() {
    this.engine = new Phaser.Game({
      type: Phaser.WEBGL,
      width: SCREEN_WIDTH,
      height: SCREEN_HEIGHT,
      backgroundColor: "#000044",
      scene: [playGame]
    });
    this.owner.canvas = this.engine.canvas;
  };

  this.drawTile = function(screenTileCoords) {
    const worldTile = World.player.WorldMap.getTile(screenToActual(screenTileCoords));
    const pixelCoords = tileToPixel(worldTile.myCoords());

    if (worldTile.char === '#') {
      this.mainScene.add.sprite(pixelCoords[0], pixelCoords[1], 'Floor_Grass', 0);
      this.mainScene.add.sprite(pixelCoords[0], pixelCoords[1], 'Tree', 0).depth = 0.5;
    } else {
      this.mainScene.add.sprite(pixelCoords[0], pixelCoords[1], 'Floor_Grass', 0);
    }
  };

  this.drawObject = function(worldObject) {
    const pixelCoords = tileToPixel(worldObject.myCoords());
    worldObject.PhaserObject.sprite = this.mainScene.add.sprite(pixelCoords[0], pixelCoords[1], worldObject.PhaserObject.spriteFilename, 0);
  };

  this.stopDisplayEngine = function() {
    this.engine.scene.stop();
  };
};
