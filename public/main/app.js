import createWorldObject from './../content/content-WorldObject';
import { generateAllMaps } from './../content/content-WorldMap';

import MapNodeTree from './../constructors/MapNodeTree';
import Time from './../constructors/Time';
import MainDisplay from './../display-engines/MainDisplay';
import MainCamera from './../display-engines/MainCamera';
import AllSounds from './../main/audio';

import initializeInput, { pollGamepad } from './../main/input';
import { toMap, isEngine } from './../main/world-utility';
import { isOnAMap, isNotObject } from './../main/filters';

import buildUI from './../ui/app.jsx';

let turnSpeedInterval = 0;
let oneTenthSecondInterval = 0;
let oneSecondInterval = 0;

function initializeWorld() {
  World.MapNodeTree = new MapNodeTree();
  World.player = createWorldObject('Player');
  World.player.placeOnMap({ worldMap: toMap('Home') });
}

export function initializeInputimeAndCamera() {
  initializeInput();
  World.Camera = new MainCamera();
  World.Time = new Time();
  World.AllSounds = new AllSounds();
  document.getElementById('canvas-wrapper-id').append(World.MainDisplay.canvas);
}

export function mainLoop() {
  if (World.gamepadAllowed) pollGamepad();

  if (World.Time.millisecondsElapsed > turnSpeedInterval + ProtoCs.TURN_SPEED) {
    World.allObjectsTurnTaking.filter(isOnAMap).filter(isNotObject.bind(World.player)).forEach((object) => {
      if (object.TurnTaking.checkForTurnReady()) {
        object.TurnTaking.takeTurn();
        if (object.updateDialoguePosition) { object.updateDialoguePosition(); }
      }
    });
    turnSpeedInterval = World.Time.millisecondsElapsed;
  }

  if (World.Time.millisecondsElapsed > oneTenthSecondInterval + 100) {
    if (World.ReactUI.HudPlayer) { World.ReactUI.HudPlayer.updateState(); }
    if (World.ReactUI.HudTarget) { World.ReactUI.HudTarget.updateState(); }
    World.ReactUI.EventLog.updateState();
    oneTenthSecondInterval = World.Time.millisecondsElapsed;
  }

  if (World.Time.millisecondsElapsed > oneSecondInterval + 1000) {
    World.allObjectsLiving.forEach(object => object.Living.adjustStamina((World.Time.millisecondsElapsed - oneSecondInterval)));
    World.allObjectsTemperature.forEach(object => object.Temperature.adjustTemperature((World.Time.millisecondsElapsed - oneSecondInterval)));
    World.allObjectsConsumer.forEach((object) => {
      object.Consumer.adjustHunger((World.Time.millisecondsElapsed - oneSecondInterval));
      // Necessary to check for existence in case hunger kills the object
      if (object.Consumer) object.Consumer.adjustThirst((World.Time.millisecondsElapsed - oneSecondInterval));
    });
    oneSecondInterval = World.Time.millisecondsElapsed;
  }

  World.Camera.updatePosition();
  if (isEngine('RotJs') || World.playerMapTransition) {
    if (World.playerMapTransition) {
      World.MainDisplay.displayEngineHandler.destroyAllSprites();
      World.MainDisplay.setRenderScreenDimensions();
    }
    World.playerMapTransition = false;
    World.MainDisplay.renderAll();
  }
  World.totalTurnsTaken += 1;
}

function rotJsLoop() {
  if (!World.worldPaused) { mainLoop(); }
  if (!World.worldEnd) {
    window.requestAnimationFrame(rotJsLoop);
  }
}

export default function startApp() {
  initializeWorld();
  buildUI();
  World.MainDisplay = new MainDisplay();
  generateAllMaps();
  if (isEngine('RotJs')) {
    initializeInputimeAndCamera();
    window.requestAnimationFrame(rotJsLoop);
  }
}

export function endSim() {
  World.worldEnd = true;
  World.worldPaused = true;
  World.MainDisplay.displayEngineHandler.stopDisplayEngine();
  alert('The simulation has ended.');
}