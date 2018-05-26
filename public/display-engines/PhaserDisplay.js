const playGame = new Phaser.Class({
  Extends: Phaser.Scene,

  initialize: function playGame() {
    Phaser.Scene.call(this, {key: "PlayGame"});
  },

  preload: function() {
    this.load.image("Squirrel", "https://kalospace.com/gameassets/active_game_assets/sprites/32x32/Squirrel.png");
    this.load.image("Acorn", "https://kalospace.com/gameassets/active_game_assets/sprites/32x32/Acorn.png");
    this.load.image("Rabbit", "https://kalospace.com/gameassets/active_game_assets/sprites/32x32/Rabbit.png");
    this.load.image("Floor_Grass", "https://kalospace.com/gameassets/active_game_assets/sprites/32x32/Floor_Grass.png");
    this.load.image("Floor_Ice", "https://kalospace.com/gameassets/active_game_assets/sprites/32x32/Floor_Ice.png");
  },

  create: function() {
    World.MainDisplay.displayEngineHandler.mainScene = this;

    for (let i = 0; i < World.player.WorldMap.mapWidth; i++) {
      for (let j = 0; j < World.player.WorldMap.mapHeight; j++) {
        World.MainDisplay.displayEngineHandler.drawTile([i, j]);
      }
    }

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
      if (!worldTile.sprite) { worldTile.sprite = this.mainScene.add.sprite(pixelCoords[0], pixelCoords[1], 'Floor_Ice', 0); }
    } else {
      if (!worldTile.sprite) { worldTile.sprite = this.mainScene.add.sprite(pixelCoords[0], pixelCoords[1], 'Floor_Grass', 0); }
    }
    worldTile.depth = 0;
  };

  this.drawObject = function(worldObject) {
    const pixelCoords = tileToPixel(worldObject.myCoords());
    if (!worldObject.PhaserObject.sprite) { worldObject.PhaserObject.sprite = this.mainScene.add.sprite(pixelCoords[0], pixelCoords[1], worldObject.PhaserObject.spriteFilename, 0); }
    worldObject.PhaserObject.sprite.x = pixelCoords[0];
    worldObject.PhaserObject.sprite.y = pixelCoords[1];
    worldObject.PhaserObject.sprite.depth = 1;
  };

  this.stopDisplayEngine = function() {
    this.engine.scene.stop();
  };
};
