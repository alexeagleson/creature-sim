const RotJsDisplay = function(mainDisplay) {
  this.owner = mainDisplay;

  this.initialize = function() {
    this.engine = new ROT.Display({
      width: MAIN_DISPLAY_TILE_WIDTH,
      height: MAIN_DISPLAY_TILE_HEIGHT,
      fg: HEX_WHITE,
      bg: HEX_BLACK,
      fontSize: ROT_FONT_SIZE,
      forceSquareRatio: true,
      fontFamily: FONT_FAMILY
    });
    this.owner.canvas = this.engine.getContainer();
  };

  this.go = function() {
    beginSim();
  };

  this.setRenderScreenDimensions = function() {
    this.owner.displayScreenTileWidth = Math.min(MAIN_DISPLAY_TILE_WIDTH, World.player.WorldMap.mapWidth);
    this.owner.displayScreenTileHeight = Math.min(MAIN_DISPLAY_TILE_HEIGHT, World.player.WorldMap.mapHeight);
  };

  this.drawTileAt = function(worldTile, coords) {
    this.engine.draw(coords[0], coords[1], worldTile.char);
  };

  this.drawObjectAt = function(worldObject, coords) {
    this.engine.draw(coords[0], coords[1], worldObject.char, worldObject.RotJS.fgColour, worldObject.RotJS.bgColour);
  };

  this.stopDisplayEngine = function() {
  };

  this.setRenderScreenDimensions();
};
