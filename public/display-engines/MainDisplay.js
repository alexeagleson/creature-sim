const MainDisplay = function() {
  this.canvas = null;
  this.displayScreenTileWidth = null;
  this.displayScreenTileHeight = null;

  this.setRenderScreenDimensions = function() {
    this.displayScreenTileWidth = isEngine('RotJs') ? Math.min(MAIN_DISPLAY_TILE_WIDTH, World.player.WorldMap.mapWidth) : World.player.WorldMap.mapWidth;
    this.displayScreenTileHeight = isEngine('RotJs') ? Math.min(MAIN_DISPLAY_TILE_HEIGHT, World.player.WorldMap.mapHeight) : World.player.WorldMap.mapHeight;
  };

  this.renderAll = function() {
    // Run only once for Phaser on scene create, run on every update loop for RotJs
    this.renderTiles();
    this.renderObjects();
  };

  this.renderTiles = function() {
    for (let i = 0; i < this.displayScreenTileWidth; i++) {
      for (let j = 0; j < this.displayScreenTileHeight; j++) {
        this.displayEngineHandler.drawTile([i, j]);
      }
    }
  };

  this.renderObjects = function() {
    World.allObjects.filter(isOnMapOfObject.bind(World.player)).forEach((object) => {
      this.displayEngineHandler.drawObject(object);
    });
  };

  this.setRenderScreenDimensions();
  this.displayEngineHandler = isEngine('Phaser') ? new PhaserDisplay(this) : new RotJsDisplay(this);
  this.displayEngineHandler.initialize();
};
