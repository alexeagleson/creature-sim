const playGame = new Phaser.Class({
  Extends: Phaser.Scene,

  initialize: function playGame() {
    Phaser.Scene.call(this, {key: 'PlayGame'});
  },

  preload: function() {
    // 32x32
    this.load.spritesheet('Squirrel', 'https://kalospace.com/gameassets/active_game_assets/sprites/32x32/Squirrel.png', {frameWidth: TILE_SIZE, frameHeight: TILE_SIZE});
    this.load.spritesheet('Acorn', 'https://kalospace.com/gameassets/active_game_assets/sprites/32x32/Acorn.png', {frameWidth: TILE_SIZE, frameHeight: TILE_SIZE});
    this.load.spritesheet('Rabbit', 'https://kalospace.com/gameassets/active_game_assets/sprites/32x32/Rabbit.png', {frameWidth: TILE_SIZE, frameHeight: TILE_SIZE});
    this.load.spritesheet('Carrot', 'https://kalospace.com/gameassets/active_game_assets/sprites/32x32/Carrot.png', {frameWidth: TILE_SIZE, frameHeight: TILE_SIZE});
    this.load.spritesheet('Floor_Grass', 'https://kalospace.com/gameassets/active_game_assets/sprites/32x32/Floor_Grass.png', {frameWidth: TILE_SIZE, frameHeight: TILE_SIZE});
    this.load.spritesheet('Floor_Ice', 'https://kalospace.com/gameassets/active_game_assets/sprites/32x32/Floor_Ice.png', {frameWidth: TILE_SIZE, frameHeight: TILE_SIZE});
    this.load.spritesheet('Trash', 'https://kalospace.com/gameassets/active_game_assets/sprites/32x32/Trash.png', {frameWidth: TILE_SIZE, frameHeight: TILE_SIZE});
    this.load.spritesheet('Hotdog1', 'https://kalospace.com/gameassets/active_game_assets/sprites/32x32/Hotdog1.png', {frameWidth: TILE_SIZE, frameHeight: TILE_SIZE});

    // 32x64
    this.load.spritesheet('Tree', 'https://kalospace.com/gameassets/active_game_assets/sprites/32x64/Tree.png', {frameWidth: TILE_SIZE, frameHeight: TILE_SIZE * 2});
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
      backgroundColor: '#000044',
      scene: [playGame]
    });
    this.owner.canvas = this.engine.canvas;
  };

  this.drawTile = function(tileCoords) {
    const worldTile = World.player.WorldMap.getTile(tileCoords);
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
    worldObject.PhaserObject.sprite = this.mainScene.add.sprite(pixelCoords[0], pixelCoords[1], worldObject.PhaserObject.spriteFilename, worldObject.PhaserObject.defaultFrameNumber);
  };

  this.destroyAllSprites = function() {
    World.allObjects.forEach((object) => {
      if (object.PhaserObject) { object.PhaserObject.destroySprite(); }
    });
  };

  this.stopDisplayEngine = function() {
    this.engine.scene.stop();
  };
};
