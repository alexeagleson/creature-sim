let lastRender = 0

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
  World.player.RotObject = new RotObject(World.player, arg = {fgColour: HEX_RED});
  World.player.Moving = new Moving(World.player);
  World.player.Pathing = new Pathing(World.player);
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

  lastRender = timestamp;
  if (World.worldActive) {
    window.requestAnimationFrame(mainLoop);
  }
};

function endSim() {
  World.worldActive = false;
  alert('The simulation has ended.');
}
