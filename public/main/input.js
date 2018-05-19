function initializeInput() {
  window.addEventListener('keydown', keyboardHandler);
  World.displayCanvas.addEventListener('pointerdown', mouseHandler);
};

function mouseHandler(pointerEvent) {
  console.log(pointerEvent);
  const clickedTileCoords = pixelToTile([pointerEvent.offsetX, pointerEvent.offsetY]);


  let cheese = new Path(World.player);

  World.player.path = [];

  const addPath = (x, y) => World.player.path.push([x, y]);

  cheese.calculatePath(clickedTileCoords, addPath);
  // World.player.path.shift();
  //
  // if (World.player.path.length > 0) {
  //   World.player.moveAbsolute(cheesePath[0]);
  // }
  //
  // World.player.path.forEach((coords) => {
  //   World.rotDisplay.draw(coords[0], coords[1], '*', 'red');
  // })
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
