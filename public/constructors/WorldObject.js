const WorldObject = function(objectName) {
  this.name = objectName;
  this.uniqueID = uniqueNumber();
  this.char = null;
  this.worldMap = null;
  this.tile = null;

  this.myCoords = function() {
    if (!this.tile) {
      displayError(`${this.name} is not on a tile and cannot call myCoords.`);
      return null;
    }
    return [this.tile.x, this.tile.y];
  }
};
