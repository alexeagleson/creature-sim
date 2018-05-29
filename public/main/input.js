function initializeInput() {
  window.addEventListener('keydown', keydownHandler);
  World.MainDisplay.canvas.addEventListener('pointerdown', pointerdownHandler);
  World.MainDisplay.canvas.addEventListener('mousemove', mousemoveHandler);
};

function mousemoveHandler(mousemoveEvent) {
  const hoverTileCoords = screenToActual(pixelToTile([mousemoveEvent.offsetX, mousemoveEvent.offsetY]));
  const objectsAtCoords = World.player.WorldMap.getTile(hoverTileCoords).objectsOnTile();
  displayNamesOfObjects(objectsAtCoords);
};

function pointerdownHandler(pointerEvent) {
  const clickedTileCoords = screenToActual(pixelToTile([pointerEvent.offsetX, pointerEvent.offsetY]));
  const objectsAtCoords = World.player.WorldMap.getTile(clickedTileCoords).objectsOnTile().filter(isNotObject.bind(World.player));

  if (objectsAtCoords.length > 0) {
    promptSelectObject(objectsAtCoords);
  } else {
    World.player.Pathing.createPath(clickedTileCoords);
    World.player.Pathing.movePath();
  }
};

function keydownHandler(keyboardEvent) {
  if (keyboardEvent.key === 'q') {
    endSim();
  } else if (keyboardEvent.key === 'e') {
    World.allUI.hudUI.toggle();
  } else if (keyboardEvent.key === 't') {
    World.allUI.timelineUI.Timeline.update();
    World.allUI.timelineUI.toggle();
  } else if (keyboardEvent.key === 'r') {
    if (!World.allUI.selectUI.isHidden()) {
      World.allUI.selectUI.hide()
    } else {
      promptSelectObject(World.allObjects.filter(isInInventoryOf.bind(World.player)));
    }
  } else if (keyboardEvent.key === 'f') {
    World.player.myTile().wall = true;
    World.player.myTile().char = '#';
  } else if (keyboardEvent.key === 'g') {
    const newMap = getMapByName('Map 2');
    World.player.placeOnMap(newMap, getRandomFreeTile(newMap).myCoords());
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
