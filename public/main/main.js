let lastRender = 0;
let oneSecondInterval = 0;
let oneTenthSecondInterval = 0;

window.onload = () => {
  initializeWorld();
  World.MainDisplay = new MainDisplay();
  if (isEngine('RotJs')) {
    initializeUiTimeAndCamera();
    window.requestAnimationFrame(rotJsLoop);
  }
};

function initializeWorld() {
  World.player = createWorldObject('Player');
  World.player.placeOnMap({worldMap: getMapByName('Home')});
};

function initializeUiTimeAndCamera() {
  initializeUI();
  initializeInput();
  World.Camera = new MainCamera();
  World.Time = new Time();
};

function rotJsLoop(timestamp) {
  const progress = timestamp - lastRender;
  lastRender = timestamp;
    if (!World.worldPaused) { mainLoop(); }
  if (!World.worldEnd) {
    window.requestAnimationFrame(rotJsLoop);
  }
};

function mainLoop() {
  World.allObjects.filter(isTurnTaking).filter(isOnAMap).forEach((object) => {
    if (object.TurnTaking.checkForTurnReady()) {
      object.TurnTaking.takeTurn();
    }
  });

  if (World.Time.millisecondsElapsed > oneTenthSecondInterval + 100) {
    World.allUI.hudUI.Hud.update();
    oneTenthSecondInterval = World.Time.millisecondsElapsed;
  }

  if (World.Time.millisecondsElapsed > oneSecondInterval + 1000) {
    World.player.Living.adjustStamina(timePassedMilliseconds = (World.Time.millisecondsElapsed - oneSecondInterval));
    World.player.Consumer.adjustHunger(timePassedMilliseconds = (World.Time.millisecondsElapsed - oneSecondInterval));
    World.player.Consumer.adjustThirst(timePassedMilliseconds = (World.Time.millisecondsElapsed - oneSecondInterval));
    World.player.Temperature.adjustTemperature(timePassedMilliseconds = (World.Time.millisecondsElapsed - oneSecondInterval));
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
};

function endSim() {
  World.worldEnd = true;
  World.worldPaused = true;
  World.MainDisplay.displayEngineHandler.stopDisplayEngine();
  removeAllChildren(World.allUI.mainWrapper.htmlElement);
  alert('The simulation has ended.');
}
