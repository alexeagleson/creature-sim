const RotJsObject = function(worldObject, arg = {}) {
  this.owner = worldObject;
  World.allObjectsRotJsObject.push(this.owner);

  this.fgColour = arg.fgColour || HEX_WHITE;
  this.bgColour = arg.bgColour || HEX_BLACK;
}

function applyRotJsObject(worldObject, arg = {}) {
  worldObject.RotJsObject = worldObject.RotJsObject || new RotJsObject(worldObject, arg);
};
