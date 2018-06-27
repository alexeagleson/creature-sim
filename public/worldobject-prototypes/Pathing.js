import Path from './../constructors/Path';
import WorldObject from './../constructors/WorldObject';
import WorldTile from './../constructors/WorldTile';
import { shortestMapPath } from './../constructors/MapNodeTree';
import { isNotObject } from './../main/filters';
import { displayError } from './../main/general-utility';
import { distanceBetweenCoords, convertToMap, convertToCoords } from './../main/world-utility';
import { getPortalToMap, getPortalFromMap } from './../worldobject-prototypes/Portal';

function Pathing(worldObject) {
  this.owner = worldObject;
  World.allObjectsPathing.push(this.owner);

  if (!this.owner.Moving) { applyMoving(this.owner); }

  this.createPath = (pathArg = { pathTo: null, pathFrom: null }) => {
    this.currentPath = this.calculatePath(pathArg);
  };

  this.calculatePath = (pathArg = { pathTo: null, pathFrom: null }) => {
    if (!(pathArg instanceof Path)) {
      if (!(pathArg.pathTo instanceof WorldObject) && !(pathArg.pathTo instanceof WorldTile)) return displayError(`pathTo (${pathArg.pathTo}) must be a WorldTile or WorldObject`);
      if (!(pathArg.pathFrom instanceof WorldObject) && !(pathArg.pathFrom instanceof WorldTile)) pathArg.pathFrom = this.owner;
    }
    const pathObject = pathArg instanceof Path ? pathArg : new Path(pathArg.pathTo, pathArg.pathFrom);

    if (pathObject.pathFromMap !== pathObject.pathToMap) {
      const mapPathIDs = shortestMapPath(pathObject.pathFromMap, pathObject.pathToMap);
      let totalPath = [];

      for (let i = 0; i < mapPathIDs.length; i += 1) {
        if (i === 0) {
          // This branch is the first path toward the first portal
          const portalTo = getPortalToMap(convertToMap(mapPathIDs[i]), convertToMap(mapPathIDs[i + 1]));
          totalPath = totalPath.concat(this.calculateTilePath({ pathToCoords: convertToCoords(portalTo), pathFromCoords: pathObject.pathFromCoords, pathToMap: portalTo.WorldMap }));
        } else if (i === (mapPathIDs.length - 1)) {
          // This branch is on the final map where the goal is
          const portalFrom = getPortalFromMap(convertToMap(mapPathIDs[i - 1]), convertToMap(mapPathIDs[i]));
          totalPath = totalPath.concat(this.calculateTilePath({ pathToCoords: pathObject.pathToCoords, pathFromCoords: convertToCoords(portalFrom), pathToMap: portalFrom.WorldMap }));
        } else {
          // This branch is a middle map between two portals on the way to the goal
          const portalTo = getPortalToMap(convertToMap(mapPathIDs[i]), convertToMap(mapPathIDs[i + 1]));
          const portalFrom = getPortalFromMap(convertToMap(mapPathIDs[i - 1]), convertToMap(mapPathIDs[i]));
          totalPath = totalPath.concat(this.calculateTilePath({ pathToCoords: convertToCoords(portalTo), pathFromCoords: convertToCoords(portalFrom), pathToMap: portalFrom.WorldMap }));
        }
      }
      return totalPath;
    }
    return this.calculateTilePath(pathObject);
  };

  this.calculateTilePath = (pathArg = { pathFromCoords: null, pathToCoords: null, pathToMap: null  }) => {
    this.todo = [];
    this.done = {};

    const fromX = pathArg.pathFromCoords[0];
    const fromY = pathArg.pathFromCoords[1];
    const toX = pathArg.pathToCoords[0];
    const toY = pathArg.pathToCoords[1];
    const worldMap = pathArg.pathToMap;
    const finalPath = [];

    let thisNode = null;

    this.add(toX, toY, null);

    while (this.todo.length) {
      thisNode = this.todo.shift();
      let id = `${thisNode.x},${thisNode.y}`;
      if (id in this.done) { continue; }
      this.done[id] = thisNode;
      if (thisNode.x === fromX && thisNode.y === fromY) { break; }

      const neighbors = this.getNeighbors(thisNode.x, thisNode.y, worldMap);

      for (let i = 0; i < neighbors.length; i += 1) {
        const neighbor = neighbors[i];
        const x = neighbor[0];
        const y = neighbor[1];
        id = `${x},${y}`;
        if (id in this.done) { continue; }
        this.add(x, y, thisNode);
      }
    }

    thisNode = this.done[`${fromX},${fromY}`];
    if (!thisNode) { return finalPath; }

    while (thisNode) {
      const { x, y } = thisNode;
      const ignoreTriggers = thisNode.prev || false;
      finalPath.push(() => this.owner.Moving.move([x, y], ignoreTriggers));
      thisNode = thisNode.prev;
    }
    return finalPath;
  };

  this.getNeighbors = (cx, cy, worldMap) => {
    const result = [];
    const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];

    for (let i = 0; i < dirs.length; i += 1) {
      const dir = dirs[i];
      const x = cx + dir[0];
      const y = cy + dir[1];

      if (!this.owner.Moving.checkBlockedAgainstObject(x, y, worldMap)) { continue; }
      result.push([x, y]);
    }

    return result;
  };

  this.add = (x, y, prev) => {
    const h = distanceBetweenCoords(convertToCoords(this.owner), [x, y]);
    const obj = {
      x,
      y,
      prev,
      g: (prev ? prev.g + 1 : 0),
      h,
    };

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

  this.movePath = () => {
    const pathSuccess = this.currentPath[0] ? this.currentPath[0]() : false;
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
