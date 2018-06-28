import { getInventory } from './../constructors/WorldObject';
import { endSim } from './../main/app';
import { directionTextToCoords } from './../main/general-utility';
import { screenToActual, pixelToTile, withinMapBounds } from './../main/world-utility';
import { isNotObject, isOnMapOfObject } from './../main/filters';
import { displayNamesOfObjects } from './../ui/components/HoveringText';
import { hideMenusAndResume } from './../ui/components/WorldUI.jsx';
import { newDijkstra } from './../worldobject-prototypes/Pathing';

function mousemoveHandler(mousemoveEvent) {
  const hoverTileCoords = screenToActual(pixelToTile([mousemoveEvent.offsetX, mousemoveEvent.offsetY]));
  if (!withinMapBounds(World.player.WorldMap, hoverTileCoords)) { return; }

  const objectsAtCoords = World.player.WorldMap.getTile(hoverTileCoords).objectsOnTile;
  displayNamesOfObjects(objectsAtCoords);
}

function pointerdownHandler(pointerEvent) {
  hideMenusAndResume();
  if (World.worldPaused) return;
  const clickedTileCoords = screenToActual(pixelToTile([pointerEvent.offsetX, pointerEvent.offsetY]));
  if (!withinMapBounds(World.player.WorldMap, clickedTileCoords)) { return; }

  const objectsAtCoords = World.player.WorldMap.getTile(clickedTileCoords).objectsOnTile.filter(isNotObject.bind(World.player));
  if (objectsAtCoords.length > 0) {
    World.ReactUI.SelectObject.prompt(objectsAtCoords);
  } else {
    World.player.Pathing.createPathTo(World.player.WorldMap.getTile(clickedTileCoords), World.player, 'astar');
    World.player.Pathing.movePath();
    World.player.Pathing.movePath();
  }
}

function keydownHandler(keyboardEvent) {
  if (World.worldPaused) return;
  if (keyboardEvent.key === 'q') {
    endSim();
  } else if (keyboardEvent.key === 'e') {
    const nearbyObjectToAttack = World.allObjectsDestructible.filter(object => World.player.Combat.canIAttackObject(object)).filter(isNotObject.bind(World.player));
    if (nearbyObjectToAttack.length > 0) {
      World.player.Combat.attackObject(nearbyObjectToAttack[0]);
    }
  } else if (keyboardEvent.key === 'r') {
    World.ReactUI.SelectObject.prompt(getInventory(World.player));
  } else if (keyboardEvent.key === 't') {
    World.ReactUI.EventLog.toggle();
  } else if (keyboardEvent.key === 'f') {
    World.ReactUI.SelectObject.prompt(World.allObjectsDecisionAI.filter(isNotObject.bind(World.player)));
  } else if (keyboardEvent.key === 'x') {
    World.disableAI = !World.disableAI;
  } else if (keyboardEvent.key === 'z') {
    null;    
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

function buttonPressed(button) {
  if (typeof button === 'object') return button.pressed;
  return button === 1.0;
}

export function pollGamepad() {
  if (World.worldPaused) return;
  const gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads : []);
  if (gamepads) {
    const gp = gamepads[0];
    if (gp) {
      if (buttonPressed(gp.buttons[12])) {
        if (World.player.TurnTaking.checkForTurnReady()) { 
          World.player.Moving.moveRelative(directionTextToCoords('up'));
          World.player.TurnTaking.turnOver();
        }
      }
      if (buttonPressed(gp.buttons[13])) {
        if (World.player.TurnTaking.checkForTurnReady()) { 
          World.player.Moving.moveRelative(directionTextToCoords('down'));
          World.player.TurnTaking.turnOver();
        }
      }
      if (buttonPressed(gp.buttons[14])) {
        if (World.player.TurnTaking.checkForTurnReady()) { 
          World.player.Moving.moveRelative(directionTextToCoords('left'));
          World.player.TurnTaking.turnOver();
        }
      }
      if (buttonPressed(gp.buttons[15])) {
        if (World.player.TurnTaking.checkForTurnReady()) { 
          World.player.Moving.moveRelative(directionTextToCoords('right'));
          World.player.TurnTaking.turnOver();
        }
      }
      if (buttonPressed(gp.buttons[2])) {
        if (World.player.TurnTaking.checkForTurnReady()) { 
          const nearbyObjectToAttack = World.allObjectsDestructible.filter(object => World.player.Combat.canIAttackObject(object)).filter(isNotObject.bind(World.player));
          if (nearbyObjectToAttack.length > 0) {
            World.player.Combat.attackObject(nearbyObjectToAttack[0]);
          }
          World.player.TurnTaking.turnOver();
        }
      }
    }
  }
}

export default function initializeInput() {
  window.addEventListener('keydown', keydownHandler);
  World.MainDisplay.canvas.addEventListener('pointerdown', pointerdownHandler);
  World.MainDisplay.canvas.addEventListener('mousemove', mousemoveHandler);
}
