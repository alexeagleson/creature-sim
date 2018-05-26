const MainCamera = function() {
  this.tileX = null;
  this.tileY = null;

  this.cameraEngineHandler = RENDER_ENGINE === 'Rot-JS' ? new RotJsCamera(this) : new PhaserCamera(this);
  this.cameraEngineHandler.initialize();
  this.cameraEngineHandler.updatePosition();

  this.updatePosition = function() {
    this.cameraEngineHandler.updatePosition();
  };
};

const RotJsCamera = function(mainCamera) {
  this.owner = mainCamera;

  this.initialize = function() {
    null;
  };

  this.updatePosition = function() {
    const displayScreenWidth = Math.min(MAIN_DISPLAY_TILE_WIDTH, World.player.WorldMap.mapWidth);
    const displayScreenHeight = Math.min(MAIN_DISPLAY_TILE_HEIGHT, World.player.WorldMap.mapHeight);

    this.owner.tileX = this.computeCoord(World.player.WorldTile.x, displayScreenWidth, World.player.WorldMap.mapWidth);
    this.owner.tileY = this.computeCoord(World.player.WorldTile.y, displayScreenHeight, World.player.WorldMap.mapHeight);
  };

  this.computeCoord = function(playerPosition, screenSize, mapSize) {
    const halfScreenSize = Math.floor(screenSize / 2);
    if (playerPosition < halfScreenSize) {
      return 0;
    } else if (playerPosition >= mapSize - halfScreenSize) {
      return mapSize - screenSize;
    } else {
      return playerPosition - halfScreenSize;
    }
  };
};

const PhaserCamera = function(mainCamera) {
  this.owner = mainCamera;

  this.initialize = function() {
    World.MainDisplay.displayEngineHandler.mainScene.cameras.main._bounds.width = TILE_SIZE * World.player.WorldMap.mapWidth;
    World.MainDisplay.displayEngineHandler.mainScene.cameras.main._bounds.height = TILE_SIZE * World.player.WorldMap.mapHeight;
    World.MainDisplay.displayEngineHandler.mainScene.cameras.main.useBounds = true;
  };

  this.updatePosition = function() {
    // const cameraCoords = tileToPixel(World.player.WorldTile);
    // this.owner.pixelX = cameraCoords[0] - Math.floor(SCREEN_WIDTH / 2);
    // this.owner.pixelY = cameraCoords[1] - Math.floor(SCREEN_HEIGHT / 2);
    //
    // this.owner.tileX = Math.floor(this.owner.pixelX / TILE_SIZE);
    // this.owner.tileY = Math.floor(this.owner.pixelY / TILE_SIZE);

    const displayScreenWidth = Math.min(MAIN_DISPLAY_TILE_WIDTH, World.player.WorldMap.mapWidth);
    const displayScreenHeight = Math.min(MAIN_DISPLAY_TILE_HEIGHT, World.player.WorldMap.mapHeight);

    this.owner.tileX = this.computeCoord(World.player.WorldTile.x, displayScreenWidth, World.player.WorldMap.mapWidth);
    this.owner.tileY = this.computeCoord(World.player.WorldTile.y, displayScreenHeight, World.player.WorldMap.mapHeight);

    const pixelCoords = tileToPixel(World.player.WorldMap.getTile([this.owner.tileX, this.owner.tileY]));


    World.MainDisplay.displayEngineHandler.mainScene.cameras.main.setScroll(pixelCoords[0] - TILE_SIZE / 2, pixelCoords[1] - TILE_SIZE / 2);
  };

  this.computeCoord = function(playerPosition, screenSize, mapSize) {
    const halfScreenSize = Math.floor(screenSize / 2);
    if (playerPosition < halfScreenSize) {
      return 0;
    } else if (playerPosition >= mapSize - halfScreenSize) {
      return mapSize - screenSize;
    } else {
      return playerPosition - halfScreenSize;
    }
  };
};
