const RotJS = function(worldObject, arg = {}) {
  this.owner = worldObject;
  World.allRotJSs.set(this.owner.uniqueID, this.owner);

  this.fgColour = arg.fgColour || HEX_WHITE;
  this.bgColour = arg.bgColour || HEX_BLACK;
}
