const WorldTile = function (x, y, WorldMap, wall) {
  this.x = x;
  this.y = y;
  this.WorldMap = WorldMap;
  this.wall = wall;
  this.char = null;

  this.myCoords = function() {
    return [this.x, this.y];
  };

  this.checkBlocked = function(checkAgainstObject = null) {
    return (!this.wall);
  };
};
