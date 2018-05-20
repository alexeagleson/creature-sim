function initializeInput() {
  window.addEventListener('keydown', keyboardHandler);
  World.displayCanvas.addEventListener('pointerdown', mouseHandler);
};

function mouseHandler(pointerEvent) {
  console.log(pointerEvent);
  const clickedTileCoords = pixelToTile([pointerEvent.offsetX, pointerEvent.offsetY]);
  World.player.path = new Path(World.player);
  World.player.path.calculatePath(clickedTileCoords);
  World.player.path.currentPath.shift();

  if (World.player.path.currentPath.length > 0) {
    World.player.move(World.player.path.currentPath[0]);
  }
};


function keyboardHandler(keyboardEvent) {
  console.log(keyboardEvent);
  if (keyboardEvent.key === 'q') {
    endSim();
  } else if (keyboardEvent.key === 'ArrowUp') {
    World.player.moveRelative(directionTextToCoords('up'));
  } else if (keyboardEvent.key === 'ArrowDown') {
    World.player.moveRelative(directionTextToCoords('down'));
  } else if (keyboardEvent.key === 'ArrowLeft') {
    World.player.moveRelative(directionTextToCoords('left'));
  } else if (keyboardEvent.key === 'ArrowRight') {
    World.player.moveRelative(directionTextToCoords('right'));
  }
};
