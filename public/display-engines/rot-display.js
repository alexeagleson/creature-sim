function initializeRotDisplay() {
  World.rotDisplay = new ROT.Display({
    width: ROT_TILE_WIDTH,
    height: ROT_TILE_HEIGHT,
    fg: HEX_WHITE,
    bg: HEX_BLACK,
    fontSize: ROT_FONT_SIZE,
    forceSquareRatio: true,
    fontFamily: FONT_FAMILY
  });

  World.displayCanvas = World.rotDisplay.getContainer();
  document.body.append(World.displayCanvas);
  World.Camera = new Camera();
  World.Camera.updatePosition();
};

function rotUpdate() {
  for (let i = 0; i < ROT_TILE_WIDTH; i++) {
    for (let j = 0; j < ROT_TILE_HEIGHT; j++) {
      World.rotDisplay.draw(i,  j, World.player.WorldMap.tileMap[(i + World.Camera.x) + ',' + (j + World.Camera.y)].char);
    }
  }

  World.allRotObjects.forEach((object) => {
    World.rotDisplay.draw(object.WorldTile.x - World.Camera.x, object.WorldTile.y - World.Camera.y, object.char, object.RotObject.fgColour, object.RotObject.bgColour);
  });

  World.rotDisplay.drawText(2, 2, millisecondsToHHMMSS(World.Time.millisecondsSinceDayStart()), ROT_TILE_WIDTH);
};
