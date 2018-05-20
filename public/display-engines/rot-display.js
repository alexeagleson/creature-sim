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
  initializeCamera();
};

function rotUpdate() {
  for (let i = 0; i < ROT_TILE_WIDTH; i++) {
    for (let j = 0; j < ROT_TILE_HEIGHT; j++) {
      World.rotDisplay.draw(i,  j, World.player.WorldMap.tileMap[(i + World.Camera.x) + ',' + (j + World.Camera.y)].char);
    }
  }

  World.allRotObjects.forEach((rotObject) => {
    World.rotDisplay.draw(rotObject.WorldTile.x - World.Camera.x, rotObject.WorldTile.y - World.Camera.y, rotObject.char, rotObject.fgColour, rotObject.bgColour);
  });

  World.rotDisplay.drawText(2, 2, millisecondsToHHMMSS(millisecondsSinceDayStart()), ROT_TILE_WIDTH);
};

function initializeCamera() {
  World.Camera = new Camera();
  World.Camera.updatePosition();
};

const Camera = function() {
  this.updatePosition = function() {
    this.x = this.computeCoord(World.player.WorldTile.x, ROT_TILE_WIDTH, World.player.WorldMap.mapWidth);
    this.y = this.computeCoord(World.player.WorldTile.y, ROT_TILE_HEIGHT, World.player.WorldMap.mapHeight);
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
};
