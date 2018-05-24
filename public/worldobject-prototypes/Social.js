const Social = function(worldObject, arg = {}) {
  this.owner = worldObject;

  if (!this.owner.Living) {
    displayError(`${this.owner.name} must be a Living object in order to be a Social object.`);
    return null;
  }

  this.speak = function(objectSpeakTo) {
    publishEvent(`${this.owner.name} hello ${objectSpeakTo.name}!`)
  };
};
