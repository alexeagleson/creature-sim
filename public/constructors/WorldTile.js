const WorldTile = function (x, y, worldMap, wall) {
  this.x = x;
  this.y = y;
  this.worldMap = worldMap;
  this.wall = wall;

  this.checkBlocked = function(checkAgainstObject = null) {
    return (!this.wall);
  };
};
