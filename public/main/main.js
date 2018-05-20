let lastRender = 0

window.onload = () => {
  initializeWorld();
  initializeRotDisplay();
  initializeInput();
  startTimer();
  window.requestAnimationFrame(mainLoop);
};

function initializeWorld() {
  World.player = createWorldObject('Generic');
  becomeRotObject(World.player, {fgColour: HEX_RED});
  becomeMovingObject(World.player);
  World.player.WorldMap = new WorldMap();
  World.player.WorldMap.generateCellularMap();
  World.player.WorldTile = getRandomFreeTile(World.player.WorldMap);
  World.worldActive = true;
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
