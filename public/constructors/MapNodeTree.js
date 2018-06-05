import { isOnAMap } from './../main/filters';

export default function MapNodeTree() {
  // Key = vertex, value = array of neighbors.
  this.neighbors = {};

  this.addConnection = (u, v) => {
    // Add the edge u -> v.
    if (this.neighbors[u] === undefined) {
      this.neighbors[u] = [];
    }
    this.neighbors[u].push(v);
    // For a directed mapNodeTree, delete or comment these 4 lines
    // if (this.neighbors[v] === undefined) {
    //   this.neighbors[v] = [];
    // }
    // this.neighbors[v].push(u);
  };

  this.populate = () => {
    World.allObjectsPortal.filter(isOnAMap).forEach((portalObject) => {
      World.MapNodeTree.addConnection(portalObject.WorldMap.uniqueID, portalObject.Portal.warpToMap.uniqueID);
    });
  };
}

export function bfs(mapNodeTree, source) {
  const queue = [{ vertex: source, count: 0 }];
  const visited = { source: true };
  let tail = 0;

  while (tail < queue.length) {
    const u = queue[tail].vertex;
    // Pop a vertex off the queue.
    const { count } = queue[tail];
    tail += 1;
    mapNodeTree.neighbors[u].forEach((v) => {
      if (!visited[v]) {
        visited[v] = true;
        queue.push({ vertex: v, count: count + 1 });
      }
    });
  }
}

export function shortestPath(sourceMap, targetMap) {
  const mapNodeTree = World.MapNodeTree;
  const source = sourceMap.uniqueID;
  const target = targetMap.uniqueID;

  // If node you are searching for is the one you start on this runs
  if (source === target) { return [target]; }

  const queue = [source];
  const visited = { source: true };
  const predecessor = {};
  let tail = 0;

  while (tail < queue.length) {
    // Pop a vertex off the queue.
    let u = queue[tail];
    tail += 1;
    const neighbors = mapNodeTree.neighbors[u];

    for (let i = 0; i < neighbors.length; i += 1) {
      const v = neighbors[i];

      if (visited[v]) { continue; }
      visited[v] = true;

      // Check if the path is complete.
      // If so, backtrack through the path.
      if (v === target) {
        const path = [v];
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
}

