const becomeRotObject = function(object, arg = {}) {
  object.RotObject = true;
  World.allRotObjects.set(object.uniqueID, object);

  object.fgColour = arg.fgColour || HEX_WHITE;
  object.bgColour = arg.bgColour || HEX_BLACK;
}
