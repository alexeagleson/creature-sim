const WorldMap = function() {
  this.name = null;
  this.uniqueID = uniqueNumber();
  this.mapWidth = 80;
  this.mapHeight = 50;
  this.temp = 40;
  this.tileMap = {};

  this.getTile = function(coords) {
    return this.tileMap[coords[0] + ',' + coords[1]];
  };

  this.addObjectToTile = function(object, coords) {
    object.WorldMap = this;
    object.WorldTile = this.getTile(coords);
    if (object === World.player) { World.Camera.updatePosition(); }
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
}
