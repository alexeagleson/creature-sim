const RotJsObject = function(worldObject, arg = {}) {
  this.owner = worldObject;

  this.fgColour = arg.fgColour || HEX_WHITE;
  this.bgColour = arg.bgColour || HEX_BLACK;
}

function applyRotJsObject(worldObject, arg = {}) {
  worldObject.RotJsObject = worldObject.RotJsObject || new RotJsObject(worldObject, arg);
};
