const Portal = function(worldObject, arg = {}) {
  this.owner = worldObject;
  World.allObjectsPortal.push(this.owner);

  this.warpToMap = getMapByName(arg.warpToMap) || null;
  this.warpCoords = (arg.warpToTileX && arg.warpToTileY) ? [arg.warpToTileX, arg.warpToTileY] : convertToCoords(getRandomFreeTile(this.warpToMap));

  this.owner.onStep = (objectThatTriggered) => {
    objectThatTriggered.placeOnMap(arg = {worldMap: this.warpToMap, coords: this.warpCoords});
  };
};

function applyPortal(worldObject, arg = {}) {
  worldObject.Portal = worldObject.Portal || new Portal(worldObject, arg);
};
