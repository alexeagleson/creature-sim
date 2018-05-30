const Pathing = function(worldObject, arg = {}) {
  this.owner = worldObject;
  World.allObjectsPathing.push(this.owner);

  if (!this.owner.Moving) { applyMoving(this.owner); }

  this.createMultiMapPath = function() {
    let portal = World.allObjects.filter(isPortal).filter(isOnMapOfObject.bind(this.owner));
    portal = portal ? portal[0] : null;

    let treasure = World.allObjects.filter((object) => object.name === 'Treasure');
    treasure = treasure ? treasure[0] : null;

    let firstPath = this.calculatePath({pathTo: portal});
    let secondPath = this.calculatePath({pathTo: treasure, pathFrom: portal.Portal.warpCoords, worldMap: treasure.WorldMap});

    this.currentPath = firstPath.concat(secondPath);
  };

  this.createPath = function(arg = {pathTo: null, pathFrom: null, worldMap: null}) {
    this.currentPath = this.calculatePath(arg);
  };

  this.calculatePath = function(arg = {pathTo: null, pathFrom: null, worldMap: null}) {
    arg.worldMap = arg.worldMap
      ? arg.worldMap
      : arg.pathTo instanceof WorldObject
        ? arg.worldMap = arg.pathTo.WorldMap
        : arg.worldMap = this.owner.WorldMap

    arg.pathTo = convertToCoords(arg.pathTo);

    arg.pathFrom = arg.pathFrom
      ? convertToCoords(arg.pathFrom)
      : convertToCoords(this.owner);

    this.todo = [];
    this.done = {};

    const fromX = arg.pathFrom[0];
    const fromY = arg.pathFrom[1];
    const toX = arg.pathTo[0];
    const toY = arg.pathTo[1];
    const worldMap = arg.worldMap;
    const finalPath = [];

    let thisNode = null;

    this.add(toX, toY, null);

    while (this.todo.length) {
      thisNode = this.todo.shift();
      let id = thisNode.x + "," + thisNode.y;
      if (id in this.done) { continue; }
      this.done[id] = thisNode;
      if (thisNode.x == fromX && thisNode.y == fromY) { break; }

      let neighbors = this.getNeighbors(thisNode.x, thisNode.y, worldMap);

      for (let i = 0; i < neighbors.length; i++) {
        const neighbor = neighbors[i];
        const x = neighbor[0];
        const y = neighbor[1];
        id = x + "," + y;
        if (id in this.done) { continue; }
        this.add(x, y, thisNode);
      }
    }

    thisNode = this.done[fromX + "," + fromY];
    if (!thisNode) { return finalPath; }

    while (thisNode) {
      finalPath.push([thisNode.x, thisNode.y]);
      thisNode = thisNode.prev;
    }
    return finalPath;
  };

  this.getNeighbors = function(cx, cy, worldMap) {
  	let result = [];
    const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];

  	for (let i = 0; i < dirs.length; i++) {
  		const dir = dirs[i];
  		const x = cx + dir[0];
  		const y = cy + dir[1];

  		if (!this.owner.Moving.checkBlockedAgainstObject(x, y, worldMap)) { continue; }
  		result.push([x, y]);
  	}

  	return result;
  };

  this.add = function(x, y, prev) {
    let h = distanceTo(convertToCoords(this.owner), [x, y]);
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

  this.movePath = function() {
    this.currentPath.shift();
    if (this.currentPath.length > 0) {
      return this.owner.Moving.move(this.currentPath[0]);
    }
    return false;
  };


  this.calculateMapPath
};

function applyPathing(worldObject, arg = {}) {
  worldObject.Pathing = worldObject.Pathing || new Pathing(worldObject, arg);
};
