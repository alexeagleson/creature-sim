const WorldObject = function(objectName) {
  this.name = objectName;
  this.uniqueID = uniqueNumber();
  this.char = null;
  this.WorldMap = null;
  this.WorldTile = null;

  this.myCoords = function() {
    if (!this.WorldTile) {
      displayError(`${this.name} is not on a tile and cannot call myCoords.`);
      return null;
    }
    return [this.WorldTile.x, this.WorldTile.y];
  }
};
