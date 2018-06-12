import { shortestPath } from './../constructors/MapNodeTree';

import { isOnMapOfObject, isOnTile } from './../main/filters';

import { displayError } from './../main/general-utility';
import { distanceTo, convertToMap, convertToCoords } from './../main/world-utility';

function Pathing(worldObject) {
  this.owner = worldObject;
  World.allObjectsPathing.push(this.owner);

  if (!this.owner.Moving) { applyMoving(this.owner); }

  this.createPath = (arg = { pathTo: null, pathFrom: null, worldMapTo: null, worldMapFrom: null }) => {
    this.currentPath = this.calculatePath(arg);
  };

  this.calculatePath = (arg = { pathTo: null, pathFrom: null, worldMapTo: null, worldMapFrom: null }) => {
    if (!arg.pathTo) { return displayError(`Invalid argument given for pathTo: ${arg.pathTo}.`); }
    arg.pathFrom = arg.pathFrom || this.owner;

    arg.worldMapTo = arg.worldMapTo || convertToMap(arg.pathTo) || this.owner.WorldMap;
    arg.worldMapFrom = arg.worldMapFrom || convertToMap(arg.pathFrom) || this.owner.WorldMap;

    arg.pathTo = convertToCoords(arg.pathTo);
    arg.pathFrom = convertToCoords(arg.pathFrom);

    const mapPathIDs = shortestPath(arg.worldMapFrom, arg.worldMapTo);

    if (mapPathIDs.length > 1) {
      const nextMapID = mapPathIDs[1];
      const portal = World.allObjectsPortal.filter(isOnMapOfObject.bind(this.owner)).filter(portalObject => portalObject.Portal.warpToMap.uniqueID === nextMapID)[0];
      return this.calculateSinglePath({ pathToCoords: convertToCoords(portal), pathFromCoords: arg.pathFrom, worldMap: arg.worldMapFrom });
    }

    return this.calculateSinglePath({ pathToCoords: arg.pathTo, pathFromCoords: arg.pathFrom, worldMap: arg.worldMapFrom });
  };

  this.calculateSinglePath = (arg = { pathToCoords: null, pathFromCoords: null, worldMap: null }) => {
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
      finalPath.push([thisNode.x, thisNode.y]);
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
    const h = distanceTo(convertToCoords(this.owner), [x, y]);
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
    // Travel through portal if it is the object's only remaining move
    if (this.currentPath.length === 1 && World.allObjectsPortal.filter(isOnTile.bind(this.owner.myTile())).length > 0) {
      this.owner.Moving.move(this.currentPath[0]);
    }

    this.currentPath.shift();

    if (this.currentPath.length > 0) {
      return this.owner.Moving.move(this.currentPath[0]);
    }
    return false;
  };

}

export default function applyPathing(worldObject, arg = {}) {
  worldObject.Pathing = worldObject.Pathing || new Pathing(worldObject, arg);
}
