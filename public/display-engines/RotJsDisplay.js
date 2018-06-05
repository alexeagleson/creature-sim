import { screenToActual, actualToScreen, convertToCoords } from './../main/world-utility';

export default function RotJsDisplay(mainDisplay) {
  this.owner = mainDisplay;

  this.initialize = () => {
    this.engine = new ROT.Display({
      width: ScreenCs.SCREEN_TILE_WIDTH,
      height: ScreenCs.SCREEN_TILE_HEIGHT,
      fg: Colours.HEX_WHITE,
      bg: Colours.HEX_BLACK,
      fontSize: ScreenCs.ROT_FONT_SIZE,
      forceSquareRatio: true,
      fontFamily: Colours.FONT_FAMILY,
    });
    this.owner.canvas = this.engine.getContainer();
  };

  this.drawTile = (screenTileCoords) => {
    const worldTile = World.player.WorldMap.getTile(screenToActual(screenTileCoords));
    this.engine.draw(screenTileCoords[0], screenTileCoords[1], worldTile.char);
  };

  this.drawObject = (worldObject) => {
    const screenTileCoords = actualToScreen(convertToCoords(worldObject));
    this.engine.draw(screenTileCoords[0], screenTileCoords[1], worldObject.char, worldObject.RotJsObject.fgColour, worldObject.RotJsObject.bgColour);
  };

  this.destroyAllSprites = () => {};

  this.stopDisplayEngine = () => {};
};
