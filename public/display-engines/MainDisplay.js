const MainDisplay = function() {
  this.canvas = null;
  this.displayScreenTileWidth = null;
  this.displayScreenTileHeight = null;

  this.setRenderScreenDimensions = function() {
    this.displayScreenTileWidth = Math.min(MAIN_DISPLAY_TILE_WIDTH, World.player.WorldMap.mapWidth);
    this.displayScreenTileHeight = Math.min(MAIN_DISPLAY_TILE_HEIGHT, World.player.WorldMap.mapHeight);
  };

  this.renderAll = function() {
    if (RENDER_ENGINE === 'RotJs') { this.renderTiles(); }
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
    World.allObjects.forEach((object) => {
      if (!object.onMapOf(World.player)) { return null; }
      this.displayEngineHandler.drawObject(object);
    });
  };

  this.setRenderScreenDimensions();
  this.displayEngineHandler = RENDER_ENGINE === 'Phaser' ? new PhaserDisplay(this) : new RotJsDisplay(this);
  this.displayEngineHandler.initialize();
};
