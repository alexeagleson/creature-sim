function initializeRotDisplay() {
  World.rotDisplay = new ROT.Display({
    width: ROT_TILE_WIDTH,
    height: ROT_TILE_HEIGHT,
    fg: HEX_WHITE,
    bg: HEX_BLACK,
    fontSize: ROT_FONT_SIZE,
    forceSquareRatio: true,
    fontFamily: 'dejavu sans mono, consolas, monospace'
  });

  World.displayCanvas = World.rotDisplay.getContainer();
  document.body.append(World.displayCanvas);
};

function rotUpdate() {
  for (let i = 0; i < World.currentMap.mapWidth; i++) {
    for (let j = 0; j < World.currentMap.mapHeight; j++) {
      World.rotDisplay.draw(i,  j, World.currentMap.tileMap[i + ',' + j].char);
    }
  }

  World.allRotObjects.forEach((rotObject) => {
    World.rotDisplay.draw(rotObject.tile.x,  rotObject.tile.y, rotObject.char, rotObject.fgColour, rotObject.bgColour);
  });

  World.rotDisplay.drawText(2, 2, millisecondsToHHMMSS(millisecondsSinceDayStart()), ROT_TILE_WIDTH);
};
