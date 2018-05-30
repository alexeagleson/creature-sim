const Moving = function(worldObject, arg = {}) {
  this.owner = worldObject;

  this.move = function(movementCoords) {
    if (!this.owner.WorldMap.getTile(movementCoords).wall) {
      this.owner.placeOnMap({worldMap: this.owner.WorldMap, coords: movementCoords});
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

  this.checkBlockedAgainstObject = function(x, y, worldMap = null) {
    if (!worldMap) { worldMap = this.owner.WorldMap; }
    if (!worldMap) { return displayError(`${this.owner.name} must be on a map to call checkBlockedAgainstObject.`); }

    if (!withinMapBounds(worldMap, [x, y])) {
      return false;
    }
    return worldMap.getTile([x, y]).checkBlocked(this.owner);
  };
};

function applyMoving(worldObject, arg = {}) {
  worldObject.Moving = worldObject.Moving || new Moving(worldObject, arg);
};
