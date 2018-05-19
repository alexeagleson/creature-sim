const becomeMovingObject = function(object, arg = {}) {
  object.MovingObject = true;
  World.allMovingObjects.set(object.uniqueID, object);

  object.path = [];

  object.moveRelative = function(movementCoords) {
    object.tile = object.worldMap.getTile([object.tile.x + movementCoords[0], object.tile.y + movementCoords[1]]);
  };

  object.moveAbsolute = function(movementCoords) {
    object.tile = object.worldMap.getTile([movementCoords[0], movementCoords[1]]);
  };


  object.checkBlockedAgainstObject = function(x, y) {
    if (!object.worldMap) {
      displayError(`${object.name} must be on a map to call checkBlockedAgainstObject.`);
      return null;
    }
    if (!withinMapBounds(object.worldMap, [x, y])) {
      console.log("AII");
      return false;
    }
    return object.worldMap.getTile([x, y]).checkBlocked(checkAgainstObject = object);
  };
};
