const WorldMap = function(mapName, arg = {mapWidth: null, mapHeight: null, mapTemp: null, mapType: null}) {
  World.allMaps.push(this);
  this.name = mapName;
  this.uniqueID = uniqueNumber();

  World.allMapsMap.set(this.uniqueID, this);

  this.mapWidth = arg.mapWidth || 70;
  this.mapHeight = arg.mapHeight || 40;
  this.mapTemp =  arg.mapTemp || 20;
  this.mapType = arg.mapType || 'Cellular';
  this.tileMap = {};

  this.getTile = function(coords) {
    return this.tileMap[coords[0] + ',' + coords[1]];
  };

  this.generateCellularMap = function() {
    const map = new ROT.Map.Cellular(this.mapWidth, this.mapHeight, {connected: true});

    // Cells have a 1/2 probability
    map.randomize(0.5);
    for (let i = 0; i < 5; i++) {
      // Run a few generations
      map.create();
    }
    map.connect(null, 1);

    for (let i = 0; i < this.mapWidth; i++) {
      for (let j = 0; j < this.mapHeight; j ++) {
        const key = i + ',' + j;
        if (map._map[i][j]) {
          this.tileMap[key] = new WorldTile(i, j, this, false);
          this.tileMap[key].char = ".";
        } else {
          this.tileMap[key] = new WorldTile(i, j, this, true);
          this.tileMap[key].char = "#";
        }
      }
    }
  };

  this.generateMapByType = function(arg = {mapType: null}) {
    let map = null;

    if (arg.mapType === "Arena") {
      map = new ROT.Map.Arena(this.mapWidth, this.mapHeight);
    } else if (arg.mapType === "Rogue") {
      map = new ROT.Map.Rogue(this.mapWidth, this.mapHeight);
    } else if (arg.mapType === "EllerMaze") {
      map = new ROT.Map.EllerMaze(this.mapWidth, this.mapHeight);
    }

    const createMapCallback = function(x, y, isWall) {
      const key = x + ',' + y;
      if (isWall) {
        this.tileMap[key] = new WorldTile(x, y, this, isWall);
        this.tileMap[key].char = "#";
        return;
      }
      this.tileMap[key] = new WorldTile(x, y, this, isWall);
      this.tileMap[key].char = ".";
    }
    map.create(createMapCallback.bind(this));
  };

  if (this.mapType === 'Cellular') {
    this.generateCellularMap();
  } else {
    this.generateMapByType({mapType: this.mapType});
  }
};

function connectMaps(arg = {mapTo: null, mapFrom: null, coordsTo: null, coordsFrom: null}) {
  arg.mapTo = convertToMap(arg.mapTo);
  arg.mapFrom = convertToMap(arg.mapFrom);

  arg.coordsTo = arg.coordsTo || convertToCoords(getRandomFreeTile(arg.mapTo));
  arg.coordsFrom = arg.coordsFrom || convertToCoords(getRandomFreeTile(arg.mapFrom));

  createWorldObject('Portal', {warpToMap: arg.mapTo, warpCoords: arg.coordsTo}).placeOnMap({worldMap: arg.mapFrom, coords: arg.coordsFrom});
  createWorldObject('Portal', {warpToMap: arg.mapFrom, warpCoords: arg.coordsFrom}).placeOnMap({worldMap: arg.mapTo, coords: arg.coordsTo});
};
