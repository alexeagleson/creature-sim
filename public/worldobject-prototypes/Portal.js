import { isNotObject } from './../main/filters';
import { getAvailableTile } from './../constructors/WorldMap';
import { toMap, toCoords } from './../main/world-utility';
import { displayError } from './../main/general-utility';

export function getPortal(comingFromMap, goingToMap, portalAway = true) {
  const mapA = toMap(comingFromMap);
  const mapB = toMap(goingToMap);
  if (!comingFromMap || !goingToMap) return displayError('getPortalFromMap: Could not convert to map:', [comingFromMap, goingToMap]);
  let portalArray = null;
  if (portalAway) {
    portalArray = World.allObjectsPortal.filter(portalObject => portalObject.WorldMap === mapA && portalObject.Portal.warpToMap === mapB);
  } else {
    portalArray = World.allObjectsPortal.filter(portalObject => portalObject.WorldMap === mapB && portalObject.Portal.warpFromMap === mapA);
  }
  return portalArray.length > 0 ? portalArray[0] : null;
}

function Portal(worldObject, arg = { warpToMap: null, warpCoords: null }) {
  this.owner = worldObject;
  World.allObjectsPortal.push(this.owner);

  this.warpToMap = toMap(arg.warpToMap) || null;
  this.warpFromMap = null;
  this.warpCoords = (arg.warpCoords) ? arg.warpCoords : toCoords(getAvailableTile({ worldMap: this.warpToMap }));

  this.owner.onStep = (objectThatTriggered) => {
    objectThatTriggered.placeOnMap({ worldMap: this.warpToMap, coords: this.warpCoords, ignoreTriggers: true });
  };

  this.revokePrototype = () => {
    World.allObjectsPortal = World.allObjectsPortal.filter(isNotObject.bind(this.owner));
    this.owner.Portal = null;
  };
}

const applyPortal = (worldObject, arg = {}) => {
  worldObject.Portal = worldObject.Portal || new Portal(worldObject, arg);
};

export default applyPortal;
