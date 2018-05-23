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

  this.removeLocationData = function() {
    this.WorldMap = null;
    this.WorldTile = null;
  };

  this.removeFromUniverse = function() {
    World.allObjects.delete(this.uniqueID);
    World.allRotJSObjects.delete(this.uniqueID);
    World.allTurnTakingObjects.delete(this.uniqueID);
  };

  this.onPlayerMap = function() {
    if (!this.onAnyMap) { return false; }
    if (this.WorldMap != World.player.WorldMap) { return false; }
    return true;
  };

  this.onAnyMap = function() {
    if (!this.WorldMap) { return false; }
    if (!this.WorldTile) { return false; }
    return true;
  };
};
