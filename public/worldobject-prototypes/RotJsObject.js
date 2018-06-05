function RotJsObject(worldObject, arg = {}) {
  this.owner = worldObject;
  World.allObjectsRotJsObject.push(this.owner);

  this.fgColour = arg.fgColour || Colours.HEX_WHITE;
  this.bgColour = arg.bgColour || Colours.HEX_BLACK;
}

export default function applyRotJsObject(worldObject, arg = {}) {
  worldObject.RotJsObject = worldObject.RotJsObject || new RotJsObject(worldObject, arg);
}
