const WorldObject = function(objectName) {
  this.name = objectName;
  this.uniqueID = uniqueNumber();
  this.char = null;
  this.tileX = null
  this.tileY = null;
};
