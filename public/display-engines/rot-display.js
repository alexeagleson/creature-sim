function rotInitialize() {
  Game.currentMap = new WorldMap();
  Game.currentMap.generateCellularMap();

  Game.rotDisplay = new ROT.Display({
    width: ROT_TILE_WIDTH,
    height: ROT_TILE_HEIGHT,
    fg: HEX_WHITE,
    bg: HEX_BLACK,
    fontSize: ROT_FONT_SIZE,
    forceSquareRatio: false,
    fontFamily: 'dejavu sans mono, consolas, monospace'
  });

  Game.displayCanvas = Game.rotDisplay.getContainer();
  document.body.append(Game.displayCanvas);
};

function rotUpdate() {
  for (let i = 0; i < Game.currentMap.mapWidth; i++) {
    for (let j = 0; j < Game.currentMap.mapHeight; j++) {
      Game.rotDisplay.draw(i,  j, Game.currentMap.tileMap[i + "," + j].char);
    }
  }

  Game.allRotObjects.forEach((rotObject) => {
    Game.rotDisplay.draw(rotObject.tileX,  rotObject.tileY, rotObject.char, rotObject.fgColour, rotObject.bgColour);
  });
};
