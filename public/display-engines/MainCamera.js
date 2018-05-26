const MainCamera = function() {
  this.tileX = null;
  this.tileY = null;

  this.updatePosition = function() {
    const displayScreenWidth = Math.min(MAIN_DISPLAY_TILE_WIDTH, World.player.WorldMap.mapWidth);
    const displayScreenHeight = Math.min(MAIN_DISPLAY_TILE_HEIGHT, World.player.WorldMap.mapHeight);
    this.tileX = this.computeTileCoord(World.player.WorldTile.x, displayScreenWidth, World.player.WorldMap.mapWidth);
    this.tileY = this.computeTileCoord(World.player.WorldTile.y, displayScreenHeight, World.player.WorldMap.mapHeight);
    if (RENDER_ENGINE === 'Phaser') { this.updatePhaserCameraPosition(); }
  };

  this.updatePhaserCameraPosition = function() {
    const pixelPosition = tileToPixel([this.tileX, this.tileY]);
    const pixelOffset = Math.floor(TILE_SIZE / 2);
    World.MainDisplay.displayEngineHandler.mainScene.cameras.main.setScroll(pixelPosition[0] - pixelOffset, pixelPosition[1] - pixelOffset);
  };

  this.computeTileCoord = function(playerPosition, screenSize, mapSize) {
    const halfScreenSize = Math.floor(screenSize / 2);
    if (playerPosition < halfScreenSize) {
      return 0;
    } else if (playerPosition >= mapSize - halfScreenSize) {
      return mapSize - screenSize;
    } else {
      return playerPosition - halfScreenSize;
    }
  };

  this.updatePosition();
};

function convertTileCoordsToScreen(tileCoords) {
  return([tileCoords[0] + World.Camera.tileX, tileCoords[1] + World.Camera.tileY]);
};
