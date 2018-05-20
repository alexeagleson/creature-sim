const becomeMovingObject = function(object, arg = {}) {
  object.MovingObject = true;
  World.allMovingObjects.set(object.uniqueID, object);

  object.path = [];

  object.move = function(movementCoords) {
    if (!object.WorldMap.getTile(movementCoords).wall) {
      object.WorldMap.addObjectToTile(object, movementCoords);
    }
  };

  object.moveRelative = function(relativeMovementCoords) {
    object.move([object.WorldTile.x + relativeMovementCoords[0], object.WorldTile.y + relativeMovementCoords[1]]);
  };

  object.checkBlockedAgainstObject = function(x, y) {
    if (!object.WorldMap) {
      displayError(`${object.name} must be on a map to call checkBlockedAgainstObject.`);
      return null;
    }
    if (!withinMapBounds(object.WorldMap, [x, y])) {
      return false;
    }
    return object.WorldMap.getTile([x, y]).checkBlocked(checkAgainstObject = object);
  };
};

const Path = function(fromObject) {
  this.currentPath = [];
  this.todo = [];
  this.done = {};
  this.fromObject = fromObject;
  this.checkBlockedAgainstObject = fromObject.checkBlockedAgainstObject;

  this.calculatePath = function(toCoords) {
    const toX = toCoords[0];
    const toY = toCoords[1];
    let thisNode = null;

    this.add(toX, toY, null);

    while (this.todo.length) {
      thisNode = this.todo.shift();
      let id = thisNode.x + "," + thisNode.y;
      if (id in this.done) { continue; }
      this.done[id] = thisNode;
      if (thisNode.x == fromObject.WorldTile.x && thisNode.y == fromObject.WorldTile.y) { break; }

      var neighbors = this.getNeighbors(thisNode.x, thisNode.y);

      for (let i = 0; i < neighbors.length; i++) {
        const neighbor = neighbors[i];
        const x = neighbor[0];
        const y = neighbor[1];
        id = x + "," + y;
        if (id in this.done) { continue; }
        this.add(x, y, thisNode);
      }
    }

    thisNode = this.done[fromObject.WorldTile.x + "," + fromObject.WorldTile.y];
    if (!thisNode) { return; }

    while (thisNode) {
      this.currentPath.push([thisNode.x, thisNode.y]);
      thisNode = thisNode.prev;
    }

  };

  this.getNeighbors = function(cx, cy) {
  	let result = [];
    const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];

  	for (let i = 0; i < dirs.length; i++) {
  		const dir = dirs[i];
  		const x = cx + dir[0];
  		const y = cy + dir[1];

  		if (!this.checkBlockedAgainstObject(x, y)) { continue; }
  		result.push([x, y]);
  	}

  	return result;
  };

  this.add = function(x, y, prev) {
    let h = distanceTo(fromObject.myCoords(), [x, y]);
    const obj = {
      x: x,
      y: y,
      prev: prev,
      g: (prev ? prev.g + 1 : 0),
      h: h
    };

    const f = obj.g + obj.h;

    for (let i = 0; i < this.todo.length; i++) {
      const thisNode = this.todo[i];
      const thisNodeF = thisNode.g + thisNode.h;
      if (f < thisNodeF || (f == thisNodeF && h < thisNode.h)) {
        this.todo.splice(i, 0, obj);
        return;
      }
    }

    this.todo.push(obj);
  };
};
