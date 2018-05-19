const Path = function(fromObject) {
  this.todo = [];
  this.done = {};
  this.fromObject = fromObject;
  this.checkBlockedAgainstObject = fromObject.checkBlockedAgainstObject;

  this.calculatePath = function(toCoords, callbackAddToPath) {

    const toX = toCoords[0];
    const toY = toCoords[1];
    let item = null;

    this.add(toX, toY, null);

    while (this.todo.length) {
      item = this.todo.shift();
      let id = item.x + "," + item.y;
      if (id in this.done) { continue; }
      this.done[id] = item;
      if (item.x == fromObject.tile.x && item.y == fromObject.tile.y) { break; }

      var neighbors = this.getNeighbors(item.x, item.y);

      for (let i = 0; i < neighbors.length; i++) {
        const neighbor = neighbors[i];
        const x = neighbor[0];
        const y = neighbor[1];
        id = x + "," + y;
        if (id in this.done) { continue; }


        World.pathTraverse.push([x, y]);





        this.add(x, y, item);
      }
    }

    item = this.done[fromObject.tile.x + "," + fromObject.tile.y];
    if (!item) { return; }

    while (item) {
      callbackAddToPath(item.x, item.y);
      item = item.prev;
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
      const item = this.todo[i];
      const itemF = item.g + item.h;
      if (f < itemF || (f == itemF && h < item.h)) {
        this.todo.splice(i, 0, obj);
        return;
      }
    }

    this.todo.push(obj);
  };
};
