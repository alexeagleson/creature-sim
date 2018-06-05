import WorldObject from './../constructors/WorldObject';
import WorldMap from './../constructors/WorldMap';
import WorldTile from './../constructors/WorldTile';

import createWorldMap from './../content/content-WorldMap';

import { randBetween, displayError } from './../main/general-utility';

export function pixelToTile(pixelCoordsArray) {
  const tileX = Math.floor(pixelCoordsArray[0] / ScreenCs.TILE_SIZE);
  const tileY = Math.floor(pixelCoordsArray[1] / ScreenCs.TILE_SIZE);
  return ([tileX, tileY]);
}

export function tileToPixel(tileCoordsArray) {
  const pixelOffset = Math.floor(ScreenCs.TILE_SIZE / 2);
  return [tileCoordsArray[0] * ScreenCs.TILE_SIZE + pixelOffset, tileCoordsArray[1] * ScreenCs.TILE_SIZE + pixelOffset];
}

export function screenToActual(coords) {
  const cameraX = World.Camera.tileX ? World.Camera.tileX : 0;
  const cameraY = World.Camera.tileY ? World.Camera.tileY : 0;
  return [coords[0] + cameraX, coords[1] + cameraY];
}

export function actualToScreen(coords) {
  const cameraX = World.Camera.tileX ? World.Camera.tileX : 0;
  const cameraY = World.Camera.tileY ? World.Camera.tileY : 0;
  return [coords[0] - cameraX, coords[1] - cameraY];
}

export function getRandomFreeTile(WorldMap) {
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
}

export function withinMapBounds(WorldMap, coords) {
  if (coords[0] < 0 || coords[0] >= WorldMap.mapWidth) { return false; }
  if (coords[1] < 0 || coords[1] >= WorldMap.mapHeight) { return false; }
  return true;
}

export function onSameMap(worldObject1, worldObject2) {
  if (!worldObject1.WorldTile || !worldObject2.WorldTile) { return false; }
  if (!worldObject1.WorldMap || !worldObject2.WorldMap) { return false; }
  return worldObject1.WorldMap === worldObject2.WorldMap;
}

function onSameTile(worldObject1, worldObject2) {
  if (!onSameMap(worldObject1, worldObject2)) { return false; }
  if (!worldObject1.WorldTile || !worldObject2.WorldTile) { return false; }
  return worldObject1.WorldTile === worldObject2.WorldTile;
}

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
}

export function distanceTo(coordsFrom, coordsTo) {
  const dx = Math.abs(coordsTo[0] - coordsFrom[0]);
  const dy = Math.abs(coordsTo[1] - coordsFrom[1]);
  return(Math.sqrt((dx * dx) + (dy * dy)));
}

export function pauseSim() {
  World.worldPaused = true;
}

export function resumeSim() {
  World.worldPaused = false;
}

export function convertToCoords(argument) {
  if (argument instanceof WorldObject) {
    if (argument.WorldMap && argument.WorldTile) { return [argument.WorldTile.x, argument.WorldTile.y]; }
  }
  if (argument instanceof WorldTile) {
    return [argument.x, argument.y];
  }
  if (typeof argument === 'object') {
    // If argument passed was already in coords format
    if (argument.length === 2) { return argument; }
  }
  return displayError(`Could not convert to coords: ${argument} or ${argument.name}`);
}

export function isEngine(engineName) {
  if (engineName.toLowerCase() === ScreenCs.RENDER_ENGINE.toLowerCase()) { return true; }
  return false;
}

export function convertToMap(argument) {
  let foundMap = null;
  if (argument instanceof WorldMap) { foundMap = argument; }
  if (argument instanceof WorldObject) { foundMap = argument.WorldMap; }
  if (argument instanceof WorldTile) { foundMap = argument.WorldMap; }
  if (typeof argument === 'number') { foundMap = World.allMapsMap.get(argument); }
  if (typeof argument === 'string') { 
    foundMap = World.allMaps.find(worldMap => worldMap.name === argument);
    if (!foundMap) { foundMap = createWorldMap(argument); }
  }

  if (foundMap) { return foundMap; }
  return null;
}