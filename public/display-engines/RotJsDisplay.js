import { screenToActual, actualToScreen, toCoords } from './../main/world-utility';

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

    const fgColour = worldTile.char === '♠' 
      ? Colours.HEX_GREEN
      : worldTile.char === '♣'
        ? Colours.HEX_DARK_GREEN
        : worldTile.char === '.'
          ? Colours.HEX_DARKER_GREEN
          : Colours.HEX_BLUE;
    this.engine.draw(screenTileCoords[0], screenTileCoords[1], worldTile.char, fgColour);
  };

  this.drawObject = (worldObject) => {
    const screenTileCoords = actualToScreen(toCoords(worldObject));
    // Debug
    let debugFgColour = worldObject.RotJsObject.fgColour;
    if (worldObject === World.ReactUI.HudTarget.targetObject) debugFgColour = Colours.HEX_YELLOW;
    this.engine.draw(screenTileCoords[0], screenTileCoords[1], worldObject.char, debugFgColour, worldObject.RotJsObject.bgColour);
  };

  this.destroyAllSprites = () => {
    for (let i = 0; i < this.owner.displayScreenTileWidth; i += 1) {
      for (let j = 0; j < this.owner.displayScreenTileHeight; j += 1) {
        // Clear the screen before map transition
        this.engine.draw(i, j, ' ');
      }
    }
  };

  this.stopDisplayEngine = () => {};
}
