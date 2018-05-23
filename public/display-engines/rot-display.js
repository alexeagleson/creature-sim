function initializeRotDisplay() {
  World.rotDisplay = new ROT.Display({
    width: ROT_TILE_WIDTH,
    height: ROT_TILE_HEIGHT,
    fg: HEX_WHITE,
    bg: HEX_BLACK,
    fontSize: ROT_FONT_SIZE,
    forceSquareRatio: true,
    fontFamily: FONT_FAMILY
  });

  World.allUI.displayCanvas = World.rotDisplay.getContainer();
  World.allUI.displayCanvas.className = 'displayCanvas';
  World.allUI.mainWrapper = new UI(arg = {id: 'mainWrapper', class: 'mainWrapper', width: World.allUI.displayCanvas.width, height: World.allUI.displayCanvas.height});


  World.allUI.hudUI = new UI(arg = {id: 'mainMenu', class: 'basicMenu'});
  World.allUI.hudUI.Hud = new Hud(World.allUI.hudUI);

  World.allUI.selectUI = new UI(arg = {id: 'selectObject', class: 'basicMenu'});
  World.allUI.selectUI.Select = new Select(World.allUI.selectUI);

  document.body.append(World.allUI.mainWrapper.htmlElement);
  World.allUI.mainWrapper.htmlElement.append(World.allUI.displayCanvas);
  World.allUI.mainWrapper.htmlElement.append(World.allUI.hudUI.htmlElement);
  World.allUI.mainWrapper.htmlElement.append(World.allUI.selectUI.htmlElement);

  World.Camera = new Camera();
  World.Camera.updatePosition();

  World.allUI.selectUI.hide();

  //initializeHUD(World.allUI.hud);
  //selectObject(World.allUI.hud);
  //moveUiToObject(World.allUI.hud, World.player);

};

function rotUpdate() {
  for (let i = 0; i < ROT_TILE_WIDTH; i++) {
    for (let j = 0; j < ROT_TILE_HEIGHT; j++) {
      World.rotDisplay.draw(i,  j, World.player.WorldMap.tileMap[(i + World.Camera.x) + ',' + (j + World.Camera.y)].char);
    }
  }

  World.allRotJSObjects.forEach((object) => {
    if (!object.onPlayerMap()) { return null; }
    World.rotDisplay.draw(object.WorldTile.x - World.Camera.x, object.WorldTile.y - World.Camera.y, object.char, object.RotJS.fgColour, object.RotJS.bgColour);
  });

  World.rotDisplay.drawText(2, 2, millisecondsToHHMMSS(World.Time.millisecondsSinceDayStart()), ROT_TILE_WIDTH);
};
