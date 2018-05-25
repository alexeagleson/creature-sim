const Social = function(worldObject, arg = {}) {
  this.owner = worldObject;

  if (!this.owner.Living) {
    displayError(`${this.owner.name} must be a Living object in order to be a Social object.`);
    return null;
  }

  this.canISpeakTo = function(worldObject) {
    if (!worldObject.Social) { return false; }
    if (!this.owner.isAdjacentTo(worldObject)) { return false; }
    return true;
  };

  this.speak = function(objectSpeakTo) {
    publishEvent(`${this.owner.name} says: hello ${objectSpeakTo.name}!`)
  };
};
