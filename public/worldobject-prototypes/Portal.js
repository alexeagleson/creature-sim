import { getAvailableTile } from './../constructors/WorldMap';
import { convertToMap, convertToCoords } from './../main/world-utility';

function Portal(worldObject, arg = { warpToMap: null, warpCoords: null }) {
  this.owner = worldObject;
  World.allObjectsPortal.push(this.owner);

  this.warpToMap = convertToMap(arg.warpToMap) || null;
  this.warpCoords = (arg.warpCoords) ? arg.warpCoords : convertToCoords(getAvailableTile({ worldMap: this.warpToMap }));

  this.owner.onStep = (objectThatTriggered) => {
    objectThatTriggered.placeOnMap({ worldMap: this.warpToMap, coords: this.warpCoords, ignoreTriggers: true });
  };
}

export default function applyPortal(worldObject, arg = {}) {
  worldObject.Portal = worldObject.Portal || new Portal(worldObject, arg);
}
