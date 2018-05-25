const MainDisplay = function() {
  this.canvas = null;
  this.displayScreenTileWidth = null;
  this.displayScreenTileHeight = null;

  this.displayEngineHandler = RENDER_ENGINE === 'Phaser' ? new PhaserDisplay(this) : new RotJsDisplay(this);
  this.displayEngineHandler.initialize();
  this.displayEngineHandler.go();

  this.renderAll = function() {
    this.renderTiles();
    this.renderObjects();
  };

  this.renderTiles = function() {
    for (let i = 0; i < this.displayScreenTileWidth; i++) {
      for (let j = 0; j < this.displayScreenTileHeight; j++) {
        this.displayEngineHandler.drawTileAt(World.player.WorldMap.tileMap[(i + World.Camera.x) + ',' + (j + World.Camera.y)], [i, j]);
      }
    }
  };

  this.renderObjects = function() {
    World.allObjects.forEach((object) => {
      if (!object.onMapOf(World.player)) { return null; }
      this.displayEngineHandler.drawObjectAt(object, [object.WorldTile.x - World.Camera.x, object.WorldTile.y - World.Camera.y]);
    });
  };
};
