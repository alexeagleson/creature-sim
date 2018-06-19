import WorldObject from './../constructors/WorldObject';
import WorldMap, { getAvailableTile } from './../constructors/WorldMap';
import WorldTile from './../constructors/WorldTile';
import { shortestMapPath } from './../constructors/MapNodeTree';

import createWorldMap from './../content/content-WorldMap';

import { randBetween, displayError } from './../main/general-utility';

import { hideMenusAndResume } from './../ui/components/WorldUI.jsx';

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

export function canvasPixelOffset(pixelCoordsArray) {
  const canvasOffsetObject = document.getElementById('canvas-wrapper-id').getBoundingClientRect();
  const canvasOffsetX = canvasOffsetObject.x;
  const canvasOffsetY = canvasOffsetObject.y;
  return [pixelCoordsArray[0] + canvasOffsetX, pixelCoordsArray[1] + canvasOffsetY]; 
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
  }
  return 'nodir';
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
  if (argument instanceof WorldMap) {
    return convertToCoords(getAvailableTile({ worldMap: argument }))
  }
  if (typeof argument === 'object') {
    // If argument passed was already in coords format
    if (argument.length === 2) { return argument; }
  }
  return displayError(`Could not convert to coords: ${argument}.`);
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

export function getAllActivePrototypes(worldObject) {
  const allPrototypes = [];
  if (worldObject.Combat) allPrototypes.push(worldObject.Combat);
  if (worldObject.Consumable) allPrototypes.push(worldObject.Consumable);
  if (worldObject.Consumer) allPrototypes.push(worldObject.Consumer);
  if (worldObject.DecisionAI) allPrototypes.push(worldObject.DecisionAI);
  if (worldObject.Destructible) allPrototypes.push(worldObject.Destructible);
  if (worldObject.Equipment) allPrototypes.push(worldObject.Equipment);
  if (worldObject.Equipper) allPrototypes.push(worldObject.Equipper);
  if (worldObject.Inventory) allPrototypes.push(worldObject.Inventory);
  if (worldObject.Item) allPrototypes.push(worldObject.Item);
  if (worldObject.Living) allPrototypes.push(worldObject.Living);
  if (worldObject.Moving) allPrototypes.push(worldObject.Moving);
  if (worldObject.Pathing) allPrototypes.push(worldObject.Pathing);
  if (worldObject.PhaserObject) allPrototypes.push(worldObject.PhaserObject);
  if (worldObject.Portal) allPrototypes.push(worldObject.Portal);
  if (worldObject.RotJsObject) allPrototypes.push(worldObject.RotJsObject);
  if (worldObject.Social) allPrototypes.push(worldObject.Social);
  if (worldObject.Temperature) allPrototypes.push(worldObject.Temperature);
  if (worldObject.TurnTaking) allPrototypes.push(worldObject.TurnTaking);
  return allPrototypes;
}

export function getActivePrototypesByName(worldObject, namesArray) {
  const allPrototypes = [];
  namesArray.forEach((protoypeName) => {
    if (worldObject.Combat && protoypeName.toLowerCase() === 'Combat'.toLowerCase()) allPrototypes.push(worldObject.Combat);
    if (worldObject.Consumable && protoypeName.toLowerCase() === 'Consumable'.toLowerCase()) allPrototypes.push(worldObject.Consumable);
    if (worldObject.Consumer && protoypeName.toLowerCase() === 'Consumer'.toLowerCase()) allPrototypes.push(worldObject.Consumer);
    if (worldObject.DecisionAI && protoypeName.toLowerCase() === 'DecisionAI'.toLowerCase()) allPrototypes.push(worldObject.DecisionAI);
    if (worldObject.Destructible && protoypeName.toLowerCase() === 'Destructible'.toLowerCase()) allPrototypes.push(worldObject.Destructible);
    if (worldObject.Equipment && protoypeName.toLowerCase() === 'Equipment'.toLowerCase()) allPrototypes.push(worldObject.Equipment);
    if (worldObject.Equipper && protoypeName.toLowerCase() === 'Equipper'.toLowerCase()) allPrototypes.push(worldObject.Equipper);
    if (worldObject.Inventory && protoypeName.toLowerCase() === 'Inventory'.toLowerCase()) allPrototypes.push(worldObject.Inventory);
    if (worldObject.Item && protoypeName.toLowerCase() === 'Item'.toLowerCase()) allPrototypes.push(worldObject.Item);
    if (worldObject.Living && protoypeName.toLowerCase() === 'Living'.toLowerCase()) allPrototypes.push(worldObject.Living);
    if (worldObject.Moving && protoypeName.toLowerCase() === 'Moving'.toLowerCase()) allPrototypes.push(worldObject.Moving);
    if (worldObject.Pathing && protoypeName.toLowerCase() === 'Pathing'.toLowerCase()) allPrototypes.push(worldObject.Pathing);
    if (worldObject.PhaserObject && protoypeName.toLowerCase() === 'PhaserObject'.toLowerCase()) allPrototypes.push(worldObject.PhaserObject);
    if (worldObject.Portal && protoypeName.toLowerCase() === 'Portal'.toLowerCase()) allPrototypes.push(worldObject.Portal);
    if (worldObject.RotJsObject && protoypeName.toLowerCase() === 'RotJsObject'.toLowerCase()) allPrototypes.push(worldObject.RotJsObject);
    if (worldObject.Social && protoypeName.toLowerCase() === 'Social'.toLowerCase()) allPrototypes.push(worldObject.Social);
    if (worldObject.Temperature && protoypeName.toLowerCase() === 'Temperature'.toLowerCase()) allPrototypes.push(worldObject.Temperature);
    if (worldObject.TurnTaking && protoypeName.toLowerCase() === 'TurnTaking'.toLowerCase()) allPrototypes.push(worldObject.TurnTaking);
  });
  return allPrototypes;
}

export function getValidContextActions(objectActivating, objectBeingActivated) {
  if (!objectActivating || !objectBeingActivated) { return displayError(`${objectActivating.name} or ${objectBeingActivated.name} not defined in getValidContextActions.`); }

  let validActions = {
    consume: null,
    pickUp: null,
    speak: null,
    attack: null,
    examine: null,
    equip: null,
    drop: null,
    activate: null,
  };

  if (objectActivating.Consumer) {
    if (objectActivating.Consumer.canIConsumeObject(objectBeingActivated)) {
      validActions.consume = () => {
        objectActivating.Consumer.consume(objectBeingActivated);
        hideMenusAndResume();
      };
    }
  }

  if (objectActivating.Inventory) {
    if (objectActivating.Inventory.canIAddToInventory(objectBeingActivated)) {
      validActions.pickUp = () => {
        objectActivating.Inventory.addToInventory(objectBeingActivated);
        hideMenusAndResume();
      };
    }
  }

  if (objectActivating.Social) {
    if (objectActivating.Social.canISpeakTo(objectBeingActivated)) {
      validActions.speak = () => {
        objectActivating.Social.speak(objectBeingActivated);
        hideMenusAndResume();
      };
    }
  }

  if (objectActivating.Combat) {
    if (objectActivating.Combat.canIAttackObject(objectBeingActivated)) {
      validActions.attack = () => {
        objectActivating.Combat.attackObject(objectBeingActivated);
        hideMenusAndResume();
      };
    }
  }

  if (objectActivating.Living) {
    if (objectActivating.Living.canIExamineObject(objectBeingActivated)) {
      validActions.examine = () => {
        objectActivating.Living.examineObject(objectBeingActivated);
        hideMenusAndResume();
      };
    }
  }

  if (objectActivating.Equipper) {
    if (!objectActivating.Equipper.currentEquipment && objectActivating.Equipper.canIEquipObject(objectBeingActivated)) {
      validActions.equip = () => {
        objectActivating.Equipper.equip(objectBeingActivated);
        hideMenusAndResume();
      };
    }
  }

  if (objectActivating.Equipper) {
    if (objectActivating.Equipper.currentEquipment) {
      validActions.unequip = () => {
        objectActivating.Equipper.unequip();
        hideMenusAndResume();
      };
    }
  }

  if (objectActivating.Inventory) {
    if (objectActivating.Inventory.canIRemoveFromInventory(objectBeingActivated)) {
      validActions.drop = () => {
        objectActivating.Inventory.removeFromInventory(objectBeingActivated);
        hideMenusAndResume();
      };
    }
  }

  validActions.activate = null;

  return validActions;
}

export function estimateTotalDistance(componentA, componentB) {
  const mapFrom = convertToMap(componentA);
  const mapTo = convertToMap(componentB);

  const mapPath = shortestMapPath(mapFrom, mapTo);
  let totalDistance = 0;
  mapPath.forEach((mapID) => {
    const mapObject = convertToMap(mapID);
    totalDistance += Math.sqrt((mapObject.mapWidth * mapObject.mapWidth) + (mapObject.mapHeight * mapObject.mapHeight)) / 2;
  });
  console.log(totalDistance);
}
