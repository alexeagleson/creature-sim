import WorldObject from './../constructors/WorldObject';
import WorldTile from './../constructors/WorldTile';
import { shortestMapPath } from './../constructors/MapNodeTree';
import { isNotObject } from './../main/filters';
import { displayError, directionTextToCoords } from './../main/general-utility';
import { distanceBetweenCoords, directionToCoords, compareCoords, toMap, toCoords, toTile } from './../main/world-utility';
import { getPortal } from './../worldobject-prototypes/Portal';

function AStarPath() {
  this.todo = [];
  this.done = {};

  this.getUnblockedNeighbors = (cx, cy, worldMap, movingObject) => {
    const result = [];
    const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    for (let i = 0; i < dirs.length; i += 1) {
      const dir = dirs[i];
      const x = cx + dir[0];
      const y = cy + dir[1];

      if (!movingObject.WorldMap.checkPassableAtLocation(x, y, movingObject)) continue;
      result.push([x, y]);
    }
    return result;
  };

  this.add = (x, y, prev, pathFromCoords) => {
    const h = distanceBetweenCoords(pathFromCoords, [x, y]);
    const obj = { x, y, prev, g: (prev ? prev.g + 1 : 0), h };
    const f = obj.g + obj.h;

    for (let i = 0; i < this.todo.length; i += 1) {
      const thisNode = this.todo[i];
      const thisNodeF = thisNode.g + thisNode.h;
      if (f < thisNodeF || (f === thisNodeF && h < thisNode.h)) {
        this.todo.splice(i, 0, obj);
        return;
      }
    }
    this.todo.push(obj);
  };
}

function PathDetails(pathTo, pathFrom, pathType) {
  this.pathType = pathType;
  if (this.pathType === 'dijkstra' || this.pathType === 'astar') console.log(this.pathType);

  this.originalPathTo = pathTo;
  this.originalPathFrom = pathFrom;

  this.mapPathPortals = [];

  this.updatePathDetails = (newTo, newFrom) => {
    this.pathToObject = newTo instanceof WorldObject ? newTo : null;
    this.pathToMap = toMap(newTo);
    this.pathToTile = toTile(newTo);

    this.pathFromObject = newFrom instanceof WorldObject ? newFrom : null;
    this.pathFromMap = toMap(newFrom);
    this.pathFromTile = toTile(newFrom);
  };

  this.updatePathDetails(this.originalPathTo, this.originalPathFrom);

  this.nextTarget = (fromObject) => {
    this.updatePathDetails(this.mapPathPortals[0], fromObject);
    this.mapPathPortals.shift();
  };

  if (this.pathFromMap !== this.pathToMap) {
    this.mapPathIDs = shortestMapPath(this.pathFromMap, this.pathToMap);
    for (let i = 0; i < this.mapPathIDs.length - 1; i += 1) {
      this.mapPathPortals.push(getPortal(this.mapPathIDs[i], this.mapPathIDs[i + 1], true));
    }
    this.mapPathPortals.push(this.originalPathTo);
    this.nextTarget(this.originalPathFrom);
  }

  this.hasNextTarget = () => this.mapPathPortals.length > 0;
}

function Pathing(worldObject) {
  this.owner = worldObject;
  World.allObjectsPathing.push(this.owner);

  this.calculateDirectPath = (pathDetails) => {
    const finalPath = [];
    let currentCoords = toCoords(pathDetails.pathFromTile);
    finalPath.push(currentCoords);
    while (!compareCoords(currentCoords, toCoords(pathDetails.pathToTile))) {
      const nextCoordsRelative = directionTextToCoords(directionToCoords(currentCoords, toCoords(pathDetails.pathToTile)));
      const nextCoords = [currentCoords[0] + nextCoordsRelative[0], currentCoords[1] + nextCoordsRelative[1]];
      finalPath.push(nextCoords);
      currentCoords = nextCoords;
    }
    return finalPath;
  };

  this.calculateDijkstraPath = (pathDetails) => {
    if (!pathDetails.pathToTile.dijkstraMap) {
      pathDetails.pathToTile.dijkstraMap = new ROT.Path.Dijkstra(pathDetails.pathToTile.x, pathDetails.pathToTile.y, pathDetails.pathToMap.checkPassableAtLocation, { topology: 4 });
    }
    const finalPath = [];
    pathDetails.pathToTile.dijkstraMap.compute(pathDetails.pathFromTile.x, pathDetails.pathFromTile.y, (x, y) => { finalPath.push([x, y]); });
    return finalPath;
  };

  this.calculateAStarPath = (pathDetails) => {
    const starPath = new AStarPath();
    const finalPath = [];
    let thisNode = null;
    starPath.add(pathDetails.pathToTile.x, pathDetails.pathToTile.y, null, [pathDetails.pathFromTile.x, pathDetails.pathFromTile.y]);

    while (starPath.todo.length) {
      thisNode = starPath.todo.shift();
      let id = `${thisNode.x},${thisNode.y}`;
      if (id in starPath.done) { continue; }
      starPath.done[id] = thisNode;
      if (thisNode.x === pathDetails.pathFromTile.x && thisNode.y === pathDetails.pathFromTile.y) { break; }

      const neighbors = starPath.getUnblockedNeighbors(thisNode.x, thisNode.y, pathDetails.pathToMap, this.owner);
      for (let i = 0; i < neighbors.length; i += 1) {
        const neighbor = neighbors[i];
        const x = neighbor[0];
        const y = neighbor[1];
        id = `${x},${y}`;
        if (id in starPath.done) { continue; }
        starPath.add(x, y, thisNode, [pathDetails.pathFromTile.x, pathDetails.pathFromTile.y]);
      }
    }
    thisNode = starPath.done[`${pathDetails.pathFromTile.x},${pathDetails.pathFromTile.y}`];
    if (!thisNode) return finalPath;

    while (thisNode) {
      finalPath.push([thisNode.x, thisNode.y]);
      thisNode = thisNode.prev;
    }
    return finalPath;
  };

  this.generatePathDetails = (pathTo, pathFrom, pathType) => {
    if (!(pathTo instanceof WorldObject) && !(pathTo instanceof WorldTile)) return displayError('getPath: pathTo must be WorldTile or WorldObject', [pathTo]);
    if (!(pathFrom instanceof WorldObject) && !(pathFrom instanceof WorldTile)) pathFrom = this.owner;
    return new PathDetails(pathTo, pathFrom, pathType);
  };

  this.getPathTo = (pathTo, pathFrom, pathType) => {
    if (pathTo instanceof WorldObject) if (!pathTo.hasLocation()) return false;
    if (pathFrom instanceof WorldObject) if (!pathFrom.hasLocation()) return false;

    this.pathDetails = this.generatePathDetails(pathTo, pathFrom, pathType);
    if (this.pathDetails.pathType.toLowerCase() === 'direct') return this.calculateDirectPath(this.pathDetails);
    if (this.pathDetails.pathType.toLowerCase() === 'dijkstra') return this.calculateDijkstraPath(this.pathDetails);
    if (this.pathDetails.pathType.toLowerCase() === 'astar') return this.calculateAStarPath(this.pathDetails);
    return displayError('getPathTo invalid pathType', [pathType]);
  };

  this.createPathTo = (pathTo, pathFrom, pathType) => {
    this.currentPath = this.getPathTo(pathTo, pathFrom, pathType);
    if (this.currentPath.length > 0) return true;
    return false;
  };

  this.clearPath = () => { this.currentPath = []; };

  this.movePath = () => {
    if (this.currentPath.length === 0) return false;
    if (distanceBetweenCoords(this.currentPath[0], toCoords(this.owner)) > 1) {
      this.clearPath();
      return false;
    }
    const pathSuccess = this.owner.Moving.move(this.currentPath[0], true);
    this.currentPath.shift();
    return pathSuccess;
  };

  this.revokePrototype = () => {
    World.allObjectsPathing = World.allObjectsPathing.filter(isNotObject.bind(this.owner));
    this.owner.Pathing = null;
  };
}

export default function applyPathing(worldObject, arg = {}) {
  worldObject.Pathing = worldObject.Pathing || new Pathing(worldObject, arg);
}

















// this.calculatePath = (pathArg = { pathTo: null, pathFrom: null }) => {
//   if (!(pathArg instanceof Path)) {
//     if (!(pathArg.pathTo instanceof WorldObject) && !(pathArg.pathTo instanceof WorldTile)) return displayError(`pathTo (${pathArg.pathTo}) must be a WorldTile or WorldObject`);
//     if (!(pathArg.pathFrom instanceof WorldObject) && !(pathArg.pathFrom instanceof WorldTile)) pathArg.pathFrom = this.owner;
//   }
//   const pathObject = pathArg instanceof Path ? pathArg : new Path(pathArg.pathTo, pathArg.pathFrom);

//   if (pathObject.pathFromMap !== pathObject.pathToMap) {
//     const mapPathIDs = shortestMapPath(pathObject.pathFromMap, pathObject.pathToMap);
//     let totalPath = [];

//     for (let i = 0; i < mapPathIDs.length; i += 1) {
//       if (i === 0) {
//         // This branch is the first path toward the first portal
//         const portalTo = getPortalToMap(toMap(mapPathIDs[i]), toMap(mapPathIDs[i + 1]));
//         totalPath = totalPath.concat(this.calculateDijkstraPath({ pathToCoords: toCoords(portalTo), pathFromCoords: pathObject.pathFromCoords, pathToMap: portalTo.WorldMap }));
//       } else if (i === (mapPathIDs.length - 1)) {
//         // This branch is on the final map where the goal is
//         const portalFrom = getPortalFromMap(toMap(mapPathIDs[i - 1]), toMap(mapPathIDs[i]));
//         totalPath = totalPath.concat(this.calculateDijkstraPath({ pathToCoords: pathObject.pathToCoords, pathFromCoords: toCoords(portalFrom), pathToMap: portalFrom.WorldMap }));
//       } else {
//         // This branch is a middle map between two portals on the way to the goal
//         const portalTo = getPortalToMap(toMap(mapPathIDs[i]), toMap(mapPathIDs[i + 1]));
//         const portalFrom = getPortalFromMap(toMap(mapPathIDs[i - 1]), toMap(mapPathIDs[i]));
//         totalPath = totalPath.concat(this.calculateDijkstraPath({ pathToCoords: toCoords(portalTo), pathFromCoords: toCoords(portalFrom), pathToMap: portalFrom.WorldMap }));
//       }
//     }
//     return totalPath;
//   }
//   return this.calculateDijkstraPath(pathObject);
// };