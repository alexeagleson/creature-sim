function addObjectToUniverse(object) {
  World.allObjects.set(object.uniqueID, object);
};

function pixelToTile(pixelCoordsArray) {
  const tileX = Math.floor(pixelCoordsArray[0] / TILE_SIZE) + World.Camera.tileX;
  const tileY = Math.floor(pixelCoordsArray[1] / TILE_SIZE) + World.Camera.tileY;
  return([tileX, tileY]);
};

function tileToPixel(worldTile) {
  const pixelOffset = RENDER_ENGINE === 'Phaser' ? Math.floor(TILE_SIZE / 2) : 0;
  return [worldTile.x * TILE_SIZE + pixelOffset, worldTile.y * TILE_SIZE + pixelOffset];
};


function getRandomFreeTile(WorldMap) {
  let randomTile = null;
  for (let i = 0; i < 9999; i++) {
    const randomX = randBetween(0, WorldMap.mapWidth - 1);
    const randomY = randBetween(0, WorldMap.mapHeight - 1);
    if (!WorldMap.getTile([randomX, randomY]).wall) {
      randomTile = WorldMap.getTile([randomX, randomY]);
      break;
    }
  }
  if (!randomTile) {
    displayError(`No available empty tile found in ${WorldMap.name}.`);
  }
  return randomTile;
};

function withinMapBounds(WorldMap, coords) {
  if (coords[0] < 0 || coords[0] >= WorldMap.mapWidth) { return false; }
  if (coords[1] < 0 || coords[1] >= WorldMap.mapHeight) { return false; }
  return true;
};

function directionTo(coordsFrom, coordsTo) {
  const dx = coordsTo[0] - coordsFrom[0];
  const dy = coordsTo[1] - coordsFrom[1];
  const angle = dx != 0 ? Math.abs(dy / dx) : 9999;

  if (dy < 0 && angle > 1) {
    return 'up';
  } else if (dy > 0 && angle > 1) {
    return 'down';
  } else if (dx > 0 && angle <= 1) {
    return 'right';
  } else if (dx < 0 && angle <= 1) {
    return 'left';
  } else {
    return 'nodir';
  }
};

function distanceTo(coordsFrom, coordsTo) {
  const dx = Math.abs(coordsTo[0] - coordsFrom[0]);
  const dy = Math.abs(coordsTo[1] - coordsFrom[1]);
  return(Math.sqrt((dx * dx) + (dy * dy)));
};

function getObjectsAtCoordinates(clickedTileCoords) {
  const clickedObjects = [];
  World.allObjects.forEach((object) => {
    if (object === World.player) { return null; }
    if (!object.onAnyMap()) { return null; }

    if (object.WorldTile.x === clickedTileCoords[0] && object.WorldTile.y === clickedTileCoords[1]) {
      clickedObjects.push(object);
    }
  });
  return clickedObjects;
}

function pauseSim() {
  World.worldPaused = true;
};

function resumeSim() {
  World.worldPaused = false;
};
