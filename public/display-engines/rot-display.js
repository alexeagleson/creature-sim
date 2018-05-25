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

  World.allUI.hudUI = new UI(arg = {id: 'mainMenu', class: 'basicMenu top-left'});
  World.allUI.hudUI.Hud = new Hud(World.allUI.hudUI);

  World.allUI.timelineUI = new UI(arg = {id: 'worldTimeline', class: 'basicMenu bottom-left'});
  World.allUI.timelineUI.Timeline = new Timeline(World.allUI.timelineUI);

  World.allUI.selectUI = new UI(arg = {id: 'selectObject', class: 'basicMenu top-right'});
  World.allUI.selectUI.Select = new Select(World.allUI.selectUI);



  document.body.append(World.allUI.mainWrapper.htmlElement);
  World.allUI.mainWrapper.htmlElement.append(World.allUI.displayCanvas);

  World.Camera = new Camera();
  World.Camera.updatePosition();

  World.allUI.selectUI.hide();
};

function rotUpdate() {
  const displayScreenWidth = Math.min(ROT_TILE_WIDTH, World.player.WorldMap.mapWidth);
  const displayScreenHeight = Math.min(ROT_TILE_HEIGHT, World.player.WorldMap.mapHeight);

  for (let i = 0; i < displayScreenWidth; i++) {
    for (let j = 0; j < displayScreenHeight; j++) {
      World.rotDisplay.draw(i,  j, World.player.WorldMap.tileMap[(i + World.Camera.x) + ',' + (j + World.Camera.y)].char);
    }
  }

  World.allRotJSObjects.forEach((object) => {
    if (!object.onMapOf(World.player)) { return null; }
    World.rotDisplay.draw(object.WorldTile.x - World.Camera.x, object.WorldTile.y - World.Camera.y, object.char, object.RotJS.fgColour, object.RotJS.bgColour);
  });

  World.rotDisplay.drawText(2, 2, millisecondsToHHMMSS(World.Time.millisecondsSinceDayStart()), ROT_TILE_WIDTH);
};
