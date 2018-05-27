let lastRender = 0;
let oneSecondInterval = 0;
let oneTenthSecondInterval = 0;

window.onload = () => {
  initializeWorld();
  World.MainDisplay = new MainDisplay();
  if (RENDER_ENGINE === 'RotJs') {
    initializeUiTimeAndCamera();
    window.requestAnimationFrame(rotJsLoop);
  }
};

function initializeWorld() {
  World.player = createWorldObject('Player');

  World.player.WorldMap = new WorldMap();
  World.player.WorldMap.generateCellularMap();
  World.player.WorldTile = getRandomFreeTile(World.player.WorldMap);

  createWorldObject('Squirrel');
  createWorldObject('Acorn');
  createWorldObject('Rabbit');
  createWorldObject('Carrot');
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
  World.allTurnTakingObjects.forEach((object) => {
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
  World.MainDisplay.renderAll();
};

function endSim() {
  World.worldEnd = true;
  World.MainDisplay.displayEngineHandler.stopDisplayEngine();
  removeAllChildren(World.allUI.mainWrapper.htmlElement);
  alert('The simulation has ended.');
}
