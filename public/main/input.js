function initializeInput() {
  window.addEventListener('keydown', keyboardHandler);
  World.allUI.displayCanvas.addEventListener('pointerdown', mouseHandler);
};

function mouseHandler(pointerEvent) {
  const clickedTileCoords = pixelToTile([pointerEvent.offsetX, pointerEvent.offsetY]);
  const objectsAtCoords = getObjectsAtCoordinates(clickedTileCoords);

  if (objectsAtCoords.length > 0) {
    promptSelectObject(objectsAtCoords);
  } else {
    World.player.Pathing.calculatePath(clickedTileCoords);
    World.player.Pathing.movePath();
  }
};

function keyboardHandler(keyboardEvent) {
  if (keyboardEvent.key === 'q') {
    endSim();
  } else if (keyboardEvent.key === 'e') {
    World.allUI.hudUI.toggle();
  } else if (keyboardEvent.key === 't') {
    World.allUI.timelineUI.Timeline.update();
    World.allUI.timelineUI.toggle();
  } else if (keyboardEvent.key === 'r') {
    promptSelectObject(World.player.Inventory.currentInventory);
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
