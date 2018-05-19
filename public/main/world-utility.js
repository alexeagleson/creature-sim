function addObjectToUniverse(object) {
  World.allObjects.set(object.uniqueID, object);
};

function pixelToTile(pixelCoordsArray) {
  const tileX = Math.floor(pixelCoordsArray[0] / TILE_SIZE);
  const tileY = Math.floor(pixelCoordsArray[1] / TILE_SIZE);
  return([tileX, tileY]);
};

function getRandomFreeTile(worldMap) {
  let randomTile = null;
  for (let i = 0; i < 9999; i++) {
    const randomX = randBetween(0, worldMap.mapWidth - 1);
    const randomY = randBetween(0, worldMap.mapHeight - 1);
    if (!worldMap.getTile([randomX, randomY]).wall) {
      randomTile = worldMap.getTile([randomX, randomY]);
      break;
    }
  }
  if (!randomTile) {
    displayError(`No available empty tile found in ${worldMap.name}.`);
  }
  return randomTile;
};

function withinMapBounds(worldMap, coords) {
  if (coords[0] < 0 || coords[0] >= worldMap.mapWidth) { return false; }
  if (coords[1] < 0 || coords[1] >= worldMap.mapHeight) { return false; }
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
