let lastRender = 0;
let oneSecondInterval = 0;
let oneTenthSecondInterval = 0;

window.onload = () => {
  initializeWorld();
  World.MainDisplay = new MainDisplay();
};

function beginSim() {
  initializeUI();
  initializeInput();
  World.Camera = new Camera();
  World.Camera.updatePosition();
  World.Time = new Time();
  World.Time.startTimer();
  window.requestAnimationFrame(mainLoop);
};

function initializeWorld() {
  World.player = createWorldObject('Player');

  World.player.WorldMap = new WorldMap();
  World.player.WorldMap.generateCellularMap();
  World.player.WorldTile = getRandomFreeTile(World.player.WorldMap);

  createWorldObject('Squirrel');
  createWorldObject('Acorn');
};

function mainLoop(timestamp) {
  const progress = timestamp - lastRender;

  if (!World.worldPaused) {
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

    World.MainDisplay.renderAll();
  }

  lastRender = timestamp;
  if (!World.worldEnd) {
    window.requestAnimationFrame(mainLoop);
  }
};

function endSim() {
  World.worldEnd = true;
  World.MainDisplay.displayEngineHandler.stopDisplayEngine();
  removeAllChildren(World.allUI.mainWrapper.htmlElement);
  alert('The simulation has ended.');
}
