function initializeInput() {
  window.addEventListener('keydown', keyboardHandler);
  World.displayCanvas.addEventListener('pointerdown', mouseHandler);
};

function mouseHandler(pointerEvent) {
  console.log(pointerEvent);
  const clickedTileCoords = pixelToTile([pointerEvent.offsetX, pointerEvent.offsetY]);
  //World.player.move(directionTextToCoords(directionTo(World.player.myCoords(), clickedTileCoords)));
  //alert(World.currentMap.checkBlocked(clickedTileCoords));
  World.player.createPath(clickedTileCoords);
  if (World.player.path.length > 0) {
    World.player.moveAbsolute(World.player.path[0]);
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
