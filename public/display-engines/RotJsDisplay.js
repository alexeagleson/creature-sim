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

  this.drawTile = function(screenTileCoords) {
    const worldTile = World.player.WorldMap.getTile(screenToActual(screenTileCoords));
    this.engine.draw(screenTileCoords[0], screenTileCoords[1], worldTile.char);
  };

  this.drawObject = function(worldObject) {
    const screenTileCoords = actualToScreen(convertToCoords(worldObject));
    this.engine.draw(screenTileCoords[0], screenTileCoords[1], worldObject.char, worldObject.RotJsObject.fgColour, worldObject.RotJsObject.bgColour);
  };

  this.destroyAllSprites = function() {
  };

  this.stopDisplayEngine = function() {
  };
};
