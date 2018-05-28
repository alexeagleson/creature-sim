const Pathing = function(worldObject, arg = {}) {
  this.owner = worldObject;
  if (!this.owner.Moving) { applyMoving(this.owner); }

  this.createPath = function(toCoords) {
    this.currentPath = this.calculatePath(toCoords);
  };

  this.calculatePath = function(toCoords) {
    this.todo = [];
    this.done = {};

    const toX = toCoords[0];
    const toY = toCoords[1];
    const finalPath = [];

    let thisNode = null;

    this.add(toX, toY, null);

    while (this.todo.length) {
      thisNode = this.todo.shift();
      let id = thisNode.x + "," + thisNode.y;
      if (id in this.done) { continue; }
      this.done[id] = thisNode;
      if (thisNode.x == this.owner.WorldTile.x && thisNode.y == this.owner.WorldTile.y) { break; }

      let neighbors = this.getNeighbors(thisNode.x, thisNode.y);

      for (let i = 0; i < neighbors.length; i++) {
        const neighbor = neighbors[i];
        const x = neighbor[0];
        const y = neighbor[1];
        id = x + "," + y;
        if (id in this.done) { continue; }
        this.add(x, y, thisNode);
      }
    }

    thisNode = this.done[this.owner.WorldTile.x + "," + this.owner.WorldTile.y];
    if (!thisNode) { return finalPath; }

    while (thisNode) {
      finalPath.push([thisNode.x, thisNode.y]);
      thisNode = thisNode.prev;
    }
    return finalPath;
  };

  this.getNeighbors = function(cx, cy) {
  	let result = [];
    const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];

  	for (let i = 0; i < dirs.length; i++) {
  		const dir = dirs[i];
  		const x = cx + dir[0];
  		const y = cy + dir[1];

  		if (!this.owner.Moving.checkBlockedAgainstObject(x, y)) { continue; }
  		result.push([x, y]);
  	}

  	return result;
  };

  this.add = function(x, y, prev) {
    let h = distanceTo(this.owner.myCoords(), [x, y]);
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
};

function applyPathing(worldObject, arg = {}) {
  worldObject.Pathing = worldObject.Pathing || new Pathing(worldObject, arg);
};
