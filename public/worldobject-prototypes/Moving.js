const Moving = function(worldObject, arg = {}) {
  this.owner = worldObject;

  this.move = function(movementCoords) {
    if (!this.owner.WorldMap.getTile(movementCoords).wall) {
      this.owner.WorldMap.addObjectToTile(this.owner, movementCoords);
      return true;
    }
    return false;
  };

  this.moveRelative = function(relativeMovementCoords) {
    return this.move([this.owner.WorldTile.x + relativeMovementCoords[0], this.owner.WorldTile.y + relativeMovementCoords[1]]);
  };

  this.moveRandom = function() {
    const relativeMovementCoords = pickRandom([UP_COORDS, DOWN_COORDS, LEFT_COORDS, RIGHT_COORDS, NODIR_COORDS]);
    return this.moveRelative(relativeMovementCoords);
  };

  this.checkBlockedAgainstObject = function(x, y) {
    if (!this.owner.WorldMap) {
      displayError(`${this.owner.name} must be on a map to call checkBlockedAgainstObject.`);
      return null;
    }
    if (!withinMapBounds(this.owner.WorldMap, [x, y])) {
      return false;
    }
    return this.owner.WorldMap.getTile([x, y]).checkBlocked(this.owner);
  };
};
