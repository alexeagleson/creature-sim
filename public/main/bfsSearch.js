function MapNodeTree() {
  this.neighbors = {};                      // Key = vertex, value = array of neighbors.

  this.addConnection = function (u, v) {
    if (this.neighbors[u] === undefined) {  // Add the edge u -> v.
      this.neighbors[u] = [];
    }
    this.neighbors[u].push(v);
    // if (this.neighbors[v] === undefined) {  // Also add the edge v -> u in order
    //   this.neighbors[v] = [];               // to implement an undirected mapNodeTree.
    // }                                       // For a directed mapNodeTree, delete
    // this.neighbors[v].push(u);              // these four lines.
  };
  return this;
};

function bfs(mapNodeTree, source) {
  const queue = [ {vertex: source, count: 0} ];
  const visited = {source: true};
  let tail = 0;

  while (tail < queue.length) {
    const u = queue[tail].vertex;
    const count = queue[tail++].count;  // Pop a vertex off the queue.
    mapNodeTree.neighbors[u].forEach((v) => {
      if (!visited[v]) {
        visited[v] = true;
        queue.push({vertex: v, count: count + 1});
      }
    });
  }
};

function shortestPath(mapNodeTree, source, target) {
  // If node you are searching for is the one you start on this runs
  if (source == target) { return null; }

  const queue = [source];
  const visited = {source: true};
  const predecessor = {};
  let tail = 0;

  while (tail < queue.length) {
    let u = queue[tail++];    // Pop a vertex off the queue.
    const neighbors = mapNodeTree.neighbors[u];

    for (var i = 0; i < neighbors.length; ++i) {
      const v = neighbors[i];

      if (visited[v]) { continue; }
      visited[v] = true;

      if (v === target) {       // Check if the path is complete.
        const path = [v];       // If so, backtrack through the path.
        while (u !== source) {
          path.push(u);
          u = predecessor[u];
        }
        path.push(u);
        path.reverse();
        return path;
      }
      predecessor[v] = u;
      queue.push(v);
    }
  }
  // No path exists
  return null;
};

function populateMapNodeTree() {
  World.allObjectsPortal.filter(isOnAMap).forEach((portalObject) => {
    World.MapNodeTree.addConnection(portalObject.WorldMap.uniqueID, portalObject.Portal.warpToMap.uniqueID);
  });
};
