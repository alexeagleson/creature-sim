function MapNodeTree() {
  var neighbors = this.neighbors = {}; // Key = vertex, value = array of neighbors.

  this.addConnection = function (u, v) {
    if (neighbors[u] === undefined) {  // Add the edge u -> v.
      neighbors[u] = [];
    }
    neighbors[u].push(v);
    if (neighbors[v] === undefined) {  // Also add the edge v -> u in order
      neighbors[v] = [];               // to implement an undirected mapNodeTree.
    }                                  // For a directed mapNodeTree, delete
    neighbors[v].push(u);              // these four lines.
  };
  return this;
}

function bfs(mapNodeTree, source) {
  var queue = [ { vertex: source, count: 0 } ],
      visited = { source: true },
      tail = 0;
  while (tail < queue.length) {
    var u = queue[tail].vertex,
        count = queue[tail++].count;  // Pop a vertex off the queue.
    console.log(World.allMapsMap)
    print('distance from ' + convertToMap(source).name + ' to ' + convertToMap(u).name + ': ' + count);
    mapNodeTree.neighbors[u].forEach(function (v) {
      if (!visited[v]) {
        visited[v] = true;
        queue.push({ vertex: v, count: count + 1 });
      }
    });
  }
}

function shortestPath(mapNodeTree, source, target) {
  if (source == target) {
    // If node you are searching for is the one you start on this runs
    print(source);
    return null;
  }
  var queue = [ source ],
      visited = { source: true },
      predecessor = {},
      tail = 0;
  while (tail < queue.length) {
    var u = queue[tail++],  // Pop a vertex off the queue.
        neighbors = mapNodeTree.neighbors[u];
    for (var i = 0; i < neighbors.length; ++i) {
      var v = neighbors[i];
      if (visited[v]) {
        continue;
      }
      visited[v] = true;
      if (v === target) {   // Check if the path is complete.
        var path = [ v ];   // If so, backtrack through the path.
        while (u !== source) {
          path.push(u);
          u = predecessor[u];
        }
        path.push(u);
        path.reverse();
        console.log('Start:');
        path.forEach((id) => { print(convertToMap(id).name) });
        console.log('End:');
        return;
      }
      predecessor[v] = u;
      queue.push(v);
    }
  }
  print('there is no path from ' + source + ' to ' + target);
}

function print(s) {  // A quick and dirty way to display output.
  if (!s) return null;
  console.log(s)
}

function populateMapNodeTree() {
  World.allObjectsPortal.filter(isOnAMap).forEach((portalObject) => {
    World.MapNodeTree.addConnection(portalObject.WorldMap.uniqueID, portalObject.Portal.warpToMap.uniqueID);
  });
};
