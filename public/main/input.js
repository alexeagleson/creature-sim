import { endSim } from './../main/app';

import { displayNamesOfObjects } from './../../src/components/HoveringText';

import { directionTextToCoords } from './../main/general-utility';
import { screenToActual, pixelToTile, withinMapBounds } from './../main/world-utility';
import { isNotObject, isInInventoryOf } from './../main/filters';

function mousemoveHandler(mousemoveEvent) {
  const hoverTileCoords = screenToActual(pixelToTile([mousemoveEvent.offsetX, mousemoveEvent.offsetY]));
  if (!withinMapBounds(World.player.WorldMap, hoverTileCoords)) { return; }

  const objectsAtCoords = World.player.WorldMap.getTile(hoverTileCoords).objectsOnTile();
  displayNamesOfObjects(objectsAtCoords);
}

function pointerdownHandler(pointerEvent) {
  const clickedTileCoords = screenToActual(pixelToTile([pointerEvent.offsetX, pointerEvent.offsetY]));
  if (!withinMapBounds(World.player.WorldMap, clickedTileCoords)) { return; }

  World.ReactUI.SelectObject.hide();
  World.ReactUI.SelectAction.hide();

  const objectsAtCoords = World.player.WorldMap.getTile(clickedTileCoords).objectsOnTile().filter(isNotObject.bind(World.player));

  if (objectsAtCoords.length > 0) {
    World.ReactUI.SelectObject.prompt(objectsAtCoords);
  } else {
    World.player.Pathing.createPath({ pathTo: clickedTileCoords });
    World.player.Pathing.movePath();
  }
}

function keydownHandler(keyboardEvent) {
  if (keyboardEvent.key === 'q') {
    endSim();
  } else if (keyboardEvent.key === 'e') {
    const nearbyObjectToAttack = World.allObjectsDestructible.filter(object => World.player.Combat.canIAttackObject(object)).filter(isNotObject.bind(World.player));
    if (nearbyObjectToAttack.length > 0) {
      World.player.Combat.attackObject(nearbyObjectToAttack[0]);
    }
  } else if (keyboardEvent.key === 'r') {
    // World.ReactUI.SelectObject.prompt(World.allObjects.filter(isInInventoryOf.bind(World.player)));
  } else if (keyboardEvent.key === 't') {
    World.ReactUI.EventLog.toggle();
  } else if (keyboardEvent.key === 'f') {
    World.player.myTile().wall = true;
    World.player.myTile().char = '#';
  } else if (keyboardEvent.key === 'ArrowUp') {
    World.player.Moving.moveRelative(directionTextToCoords('up'));
  } else if (keyboardEvent.key === 'ArrowDown') {
    World.player.Moving.moveRelative(directionTextToCoords('down'));
  } else if (keyboardEvent.key === 'ArrowLeft') {
    World.player.Moving.moveRelative(directionTextToCoords('left'));
  } else if (keyboardEvent.key === 'ArrowRight') {
    World.player.Moving.moveRelative(directionTextToCoords('right'));
  }
}

export default function initializeInput() {
  window.addEventListener('keydown', keydownHandler);
  World.MainDisplay.canvas.addEventListener('pointerdown', pointerdownHandler);
  World.MainDisplay.canvas.addEventListener('mousemove', mousemoveHandler);
}
