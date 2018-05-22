const WorldObject = function(objectName, arg = {}) {
  this.name = objectName;
  this.uniqueID = uniqueNumber();

  this.char = arg.char || null;
  this.WorldMap = arg.WorldMap || null;
  this.WorldTile = arg.WorldMap || null;

  this.myCoords = function() {
    if (!this.WorldTile) {
      displayError(`${this.name} is not on a tile and cannot call myCoords.`);
      return null;
    }
    return [this.WorldTile.x, this.WorldTile.y];
  };

  this.destroy = function() {
    World.allObjects.delete(this.uniqueID);
    World.allRotJSs.delete(this.uniqueID);
    World.allTurnTakingObjects.delete(this.uniqueID);
  };
};
