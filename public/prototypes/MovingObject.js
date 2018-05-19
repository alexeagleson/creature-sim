const becomeMovingObject = function(object, arg = {}) {
  object.MovingObject = true;
  World.allMovingObjects.set(object.uniqueID, object);

  object.path = null;

  object.moveRelative = function(movementCoords) {
    object.tile = object.worldMap.getTile([object.tile.x + movementCoords[0], object.tile.y + movementCoords[1]]);
  };

  object.moveAbsolute = function(movementCoords) {
    object.tile = object.worldMap.getTile([movementCoords[0], movementCoords[1]]);
  };

  object.createPath = function(targetCoords) {
    object.path = [];
    const astar = new ROT.Path.AStar(targetCoords[0], targetCoords[1], object.checkBlockedAgainstObject, {topology: 4});
    const addPath = (x, y) => object.path.push([x, y]);
    astar.compute(object.tile.x, object.tile.y, addPath);
    // Remove the first movement tile, as it is the tile the object is already standing on
    object.path.shift();
    console.log(object.path);
    object.path.forEach((coords) => {
      World.rotDisplay.draw(coords[0], coords[1], '*', 'red');
    })
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
