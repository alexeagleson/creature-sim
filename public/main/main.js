let lastRender = 0;
let oneSecondInterval = 0;

window.onload = () => {
  initializeWorld();
  initializeRotDisplay();
  initializeInput();
  World.Time = new Time();
  World.Time.startTimer();
  window.requestAnimationFrame(mainLoop);
};

function initializeWorld() {
  World.player = createWorldObject('Generic');

  applyBasePrototypes(World.player);
  World.player.RotJS.fgColour = HEX_RED;

  World.player.WorldMap = new WorldMap();
  World.player.WorldMap.generateCellularMap();
  World.player.WorldTile = getRandomFreeTile(World.player.WorldMap);
  World.worldActive = true;

  createWorldObject('NPC');
};

function mainLoop(timestamp) {
  const progress = timestamp - lastRender;


  World.allTurnTakingObjects.forEach((object) => {
    if (object.TurnTaking.checkForTurnReady()) {
      object.TurnTaking.takeTurn();
    }
  });

  rotUpdate();

  if (World.Time.millisecondsElapsed > oneSecondInterval + 1000) {
    World.player.Living.adjustStamina(timePassedMilliseconds = (World.Time.millisecondsElapsed - oneSecondInterval));
    World.player.Consumer.adjustHunger(timePassedMilliseconds = (World.Time.millisecondsElapsed - oneSecondInterval));
    World.player.Consumer.adjustThirst(timePassedMilliseconds = (World.Time.millisecondsElapsed - oneSecondInterval));
    World.player.Temperature.adjustTemperature(timePassedMilliseconds = (World.Time.millisecondsElapsed - oneSecondInterval));
    World.player.Temperature.adjustConditionBasedOnTemperature(timePassedMilliseconds = (World.Time.millisecondsElapsed - oneSecondInterval));

    World.allUI.hudUI.Hud.update();
    oneSecondInterval = World.Time.millisecondsElapsed;
  }


  lastRender = timestamp;
  if (World.worldActive) {
    window.requestAnimationFrame(mainLoop);
  }
};

function endSim() {
  World.worldActive = false;
  alert('The simulation has ended.');
}
