const WorldTile = function (x, y, WorldMap, wall) {
  this.x = x;
  this.y = y;
  this.WorldMap = WorldMap;
  this.wall = wall;
  this.char = null;

  this.checkBlocked = function(checkAgainstObject = null) {
    return (!this.wall);
  };
};
