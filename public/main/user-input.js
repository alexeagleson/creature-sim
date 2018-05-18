function initializeInput() {
  window.addEventListener('keydown', mouseHandler);
  Game.displayCanvas.addEventListener('pointerdown', keyboardHandler);
};

function mouseHandler(pointerEvent) {
  console.log(thing);
};

function keyboardHandler(keyboardEvent) {
  console.log(thing);
};
