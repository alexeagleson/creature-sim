import { shortestMapPath } from './../constructors/MapNodeTree';
import { isNotObject } from './../main/filters';
import { displayError } from './../main/general-utility';
import { distanceTo, convertToMap, convertToCoords } from './../main/world-utility';
import { getPortalToMap, getPortalFromMap } from './../worldobject-prototypes/Portal';

function Pathing(worldObject) {
  this.owner = worldObject;
  World.allObjectsPathing.push(this.owner);

  if (!this.owner.Moving) { applyMoving(this.owner); }

  this.createPath = (arg = { pathTo: null, pathFrom: null, worldMapTo: null, worldMapFrom: null }) => {
    this.currentPath = this.calculatePath(arg);
  };

  this.calculatePath = (arg = { pathTo: null, pathFrom: null, worldMapTo: null, worldMapFrom: null }) => {
    if (!arg.pathTo) { return displayError(`Invalid argument given for pathTo: ${arg.pathTo}.`); }

    let { pathTo, pathFrom, worldMapTo, worldMapFrom } = arg;
    pathFrom = pathFrom || this.owner;

    // Very important that these stay in this order
    worldMapTo = worldMapTo || convertToMap(pathTo) || this.owner.WorldMap;
    worldMapFrom = worldMapFrom || convertToMap(pathFrom) || this.owner.WorldMap;
    pathTo = convertToCoords(pathTo);
    pathFrom = convertToCoords(pathFrom);

    if (worldMapTo !== worldMapFrom) {
      const mapPathIDs = shortestMapPath(worldMapFrom, worldMapTo);
      let totalPath = [];

      for (let i = 0; i < mapPathIDs.length; i += 1) {
        if (i === 0) {
          const portalTo = getPortalToMap(convertToMap(mapPathIDs[i]), convertToMap(mapPathIDs[i + 1]));
          totalPath = totalPath.concat(this.calculateTilePath({ pathToCoords: convertToCoords(portalTo), pathFromCoords: convertToCoords(this.owner), worldMap: this.owner.WorldMap }));
        } else if (i === (mapPathIDs.length - 1)) {
          const portalFrom = getPortalFromMap(convertToMap(mapPathIDs[i - 1]), convertToMap(mapPathIDs[i]));
          totalPath = totalPath.concat(this.calculateTilePath({ pathToCoords: pathTo, pathFromCoords: convertToCoords(portalFrom), worldMap: portalFrom.WorldMap }));
        } else {
          const portalTo = getPortalToMap(convertToMap(mapPathIDs[i]), convertToMap(mapPathIDs[i + 1]));
          const portalFrom = getPortalFromMap(convertToMap(mapPathIDs[i - 1]), convertToMap(mapPathIDs[i]));
          totalPath = totalPath.concat(this.calculateTilePath({ pathToCoords: convertToCoords(portalTo), pathFromCoords: convertToCoords(portalFrom), worldMap: portalFrom.WorldMap }));
        }
      }
      return totalPath;
    }
    return this.calculateTilePath({ pathToCoords: pathTo, pathFromCoords: pathFrom, worldMap: worldMapFrom });
  };

  this.calculateTilePath = (arg = { pathToCoords: null, pathFromCoords: null, worldMap: null }) => {
    this.todo = [];
    this.done = {};

    const fromX = arg.pathFromCoords[0];
    const fromY = arg.pathFromCoords[1];
    const toX = arg.pathToCoords[0];
    const toY = arg.pathToCoords[1];
    const { worldMap } = arg;
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
    this.currentPath.shift();
    if (this.currentPath[0]) return this.currentPath[0]();
    return false;
  };

  this.revokePrototype = () => {
    World.allObjectsPathing = World.allObjectsPathing.filter(isNotObject.bind(this.owner));
    this.owner.Pathing = null;
  };
}

export default function applyPathing(worldObject, arg = {}) {
  worldObject.Pathing = worldObject.Pathing || new Pathing(worldObject, arg);
}
