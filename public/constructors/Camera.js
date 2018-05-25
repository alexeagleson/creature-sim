const Camera = function() {
  this.updatePosition = function() {
    const displayScreenWidth = Math.min(MAIN_DISPLAY_TILE_WIDTH, World.player.WorldMap.mapWidth);
    const displayScreenHeight = Math.min(MAIN_DISPLAY_TILE_HEIGHT, World.player.WorldMap.mapHeight);

    this.x = this.computeCoord(World.player.WorldTile.x, displayScreenWidth, World.player.WorldMap.mapWidth);
    this.y = this.computeCoord(World.player.WorldTile.y, displayScreenHeight, World.player.WorldMap.mapHeight);
  };

  this.computeCoord = function(playerPosition, screenSize, mapSize) {
    const halfScreenSize = Math.floor(screenSize / 2);
    if (playerPosition < halfScreenSize) {
      return 0;
    } else if (playerPosition >= mapSize - halfScreenSize) {
      return mapSize - screenSize;
    } else {
      return playerPosition - halfScreenSize;
    }
  };

  this.getTilePixelCoords = function(worldTile) {
    return [(worldTile.x - World.Camera.x) * TILE_SIZE, (worldTile.y - World.Camera.y) * TILE_SIZE];
  };

  this.getObjectPixelCoords = function(worldObject) {
    return this.getTilePixelCoords(worldObject.WorldTile);
  };
};
