const Pathing = function(worldObject, arg = {}) {
  this.owner = worldObject;
  World.allObjectsPathing.push(this.owner);

  if (!this.owner.Moving) { applyMoving(this.owner); }

  this.createPath = function(arg = {pathTo: null, pathFrom: null, worldMapTo: null, worldMapFrom: null}) {
    this.currentPath = this.calculatePath(arg);
  };

  this.calculatePath = function(arg = {pathTo: null, pathFrom: null, worldMapTo: null, worldMapFrom: null}) {
    if (!arg.pathTo) { return displayError(`Invalid argument given for pathTo: ${arg.pathTo}.`) }
    arg.pathFrom = arg.pathFrom || this.owner;

    arg.worldMapTo = arg.worldMapTo || convertToMap(arg.pathTo) || this.owner.WorldMap;
    arg.worldMapFrom = arg.worldMapFrom || convertToMap(arg.pathFrom) || this.owner.WorldMap;

    arg.pathTo = convertToCoords(arg.pathTo);
    arg.pathFrom = convertToCoords(arg.pathFrom);

    const mapPathIDs = shortestPath(arg.worldMapFrom, arg.worldMapTo);

    if (mapPathIDs.length > 1) {
      const nextMapID = mapPathIDs[1];
      const portal = World.allObjectsPortal.filter((portalObject) => portalObject.Portal.warpToMap.uniqueID === nextMapID)[0];
      return this.calculateSinglePath({pathToCoords: convertToCoords(portal), pathFromCoords: arg.pathFrom, worldMap: arg.worldMapFrom});
    }

    return this.calculateSinglePath({pathToCoords: arg.pathTo, pathFromCoords: arg.pathFrom, worldMap: arg.worldMapFrom});
  };

  this.calculateSinglePath = function(arg = {pathToCoords: null, pathFromCoords: null, worldMap: null}) {
    this.todo = [];
    this.done = {};

    const fromX = arg.pathFromCoords[0];
    const fromY = arg.pathFromCoords[1];
    const toX = arg.pathToCoords[0];
    const toY = arg.pathToCoords[1];
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
