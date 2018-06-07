import createWorldObject from './../content/content-WorldObject';
import { generateAllMaps } from './../content/content-WorldMap';

import MapNodeTree from './../constructors/MapNodeTree';
import Time from './../constructors/Time';
import MainDisplay from './../display-engines/MainDisplay';
import MainCamera from './../display-engines/MainCamera';

import initializeInput from './../main/input';
import { convertToMap, isEngine } from './../main/world-utility';
import { isOnAMap } from './../main/filters';

import buildUI from './../../src/app.jsx';

let lastRender = 0;
let oneSecondInterval = 0;
let oneTenthSecondInterval = 0;

function initializeWorld() {
  World.MapNodeTree = new MapNodeTree();
  World.player = createWorldObject('Player');
  World.player.placeOnMap({ worldMap: convertToMap('Home') });
}

export function initializeUiTimeAndCamera() {
  initializeInput();
  World.Camera = new MainCamera();
  World.Time = new Time();
  buildUI();
  document.getElementById('canvas-wrapper-id').append(World.MainDisplay.canvas);
}

function rotJsLoop(timestamp) {
  const progress = timestamp - lastRender;
  lastRender = timestamp;
  if (!World.worldPaused) { mainLoop(); }
  if (!World.worldEnd) {
    window.requestAnimationFrame(rotJsLoop);
  }
}

export function mainLoop() {
  World.allObjectsTurnTaking.filter(isOnAMap).forEach((object) => {
    if (object.TurnTaking.checkForTurnReady()) {
      object.TurnTaking.takeTurn();
      if (object.updateDialoguePosition) { object.updateDialoguePosition(); }
    }
  });

  if (World.Time.millisecondsElapsed > oneTenthSecondInterval + 100) {
    World.ReactUI.Hud.updateState();
    World.ReactUI.EventLog.updateState();
    oneTenthSecondInterval = World.Time.millisecondsElapsed;
  }

  if (World.Time.millisecondsElapsed > oneSecondInterval + 1000) {
    World.player.Living.adjustStamina((World.Time.millisecondsElapsed - oneSecondInterval));
    World.player.Consumer.adjustHunger((World.Time.millisecondsElapsed - oneSecondInterval));
    World.player.Consumer.adjustThirst((World.Time.millisecondsElapsed - oneSecondInterval));
    World.player.Temperature.adjustTemperature((World.Time.millisecondsElapsed - oneSecondInterval));
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

  
}

export default function startApp() {
  initializeWorld();
  World.MainDisplay = new MainDisplay();
  generateAllMaps();
  if (isEngine('RotJs')) {
    initializeUiTimeAndCamera();
    window.requestAnimationFrame(rotJsLoop);
  }
}

export function endSim() {
  World.worldEnd = true;
  World.worldPaused = true;
  World.MainDisplay.displayEngineHandler.stopDisplayEngine();
  alert('The simulation has ended.');
}