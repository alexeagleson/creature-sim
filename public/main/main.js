let lastRender = 0

window.onload = () => {
  initializeWorld();
  initializeRotDisplay();
  initializeInput();
  initializePlayer();
  startTimer();
  window.requestAnimationFrame(mainLoop);
};

function initializeWorld() {
  World.currentMap = new WorldMap();
  World.currentMap.generateCellularMap();
  World.worldActive = true;
};

function initializePlayer() {
  World.player = createWorldObject('Generic');
  becomeRotObject(World.player, {fgColour: 'red'});
  becomeMovingObject(World.player);
  World.player.worldMap = World.currentMap;
  World.player.tile = getRandomFreeTile(World.player.worldMap);
};

function mainLoop(timestamp) {
  const progress = timestamp - lastRender;
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
