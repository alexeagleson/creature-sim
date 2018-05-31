const Portal = function(worldObject, arg = {warpToMap: null, warpCoords: null}) {
  this.owner = worldObject;
  World.allObjectsPortal.push(this.owner);

  this.warpToMap = convertToMap(arg.warpToMap) || null;
  this.warpCoords = (arg.warpCoords) ? arg.warpCoords : convertToCoords(getRandomFreeTile(this.warpToMap));

  this.owner.onStep = (objectThatTriggered) => {
    objectThatTriggered.placeOnMap(arg = {worldMap: this.warpToMap, coords: this.warpCoords, ignoreTriggers: true});
  };
};

function applyPortal(worldObject, arg = {}) {
  worldObject.Portal = worldObject.Portal || new Portal(worldObject, arg);
};
