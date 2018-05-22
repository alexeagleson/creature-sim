function initializeInput() {
  window.addEventListener('keydown', keyboardHandler);
  World.allUI.displayCanvas.addEventListener('pointerdown', mouseHandler);
};

function mouseHandler(pointerEvent) {
  console.log(pointerEvent);
  const clickedTileCoords = pixelToTile([pointerEvent.offsetX, pointerEvent.offsetY]);
  const objectsAtCoords = getObjectsAtCoordinates(clickedTileCoords);

  if (objectsAtCoords.size > 0) {
    World.allUI.selectUI.Select.promptObject(objectsAtCoords);
  } else {
    World.player.Pathing.calculatePath(clickedTileCoords);
    World.player.Pathing.movePath();
  }
};

function keyboardHandler(keyboardEvent) {
  console.log(keyboardEvent);
  if (keyboardEvent.key === 'q') {
    endSim();
  } else if (keyboardEvent.key === 'ArrowUp') {
    World.player.Moving.moveRelative(directionTextToCoords('up'));
  } else if (keyboardEvent.key === 'ArrowDown') {
    World.player.Moving.moveRelative(directionTextToCoords('down'));
  } else if (keyboardEvent.key === 'ArrowLeft') {
    World.player.Moving.moveRelative(directionTextToCoords('left'));
  } else if (keyboardEvent.key === 'ArrowRight') {
    World.player.Moving.moveRelative(directionTextToCoords('right'));
  }
};
