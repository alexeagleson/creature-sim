const Social = function(worldObject, arg = {}) {
  this.owner = worldObject;
  if (!this.owner.Living) { applyLiving(this.owner); }

  this.canISpeakTo = function(worldObject) {
    if (!worldObject.Social) { return false; }
    if (!this.owner.isAdjacentTo(worldObject)) { return false; }
    return true;
  };

  this.speak = function(objectSpeakTo) {
    publishEvent(`${this.owner.name} says: Hello ${objectSpeakTo.name}!`);
  };
};

function applySocial(worldObject, arg = {}) {
  worldObject.Social = worldObject.Social || new Social(worldObject, arg);
};
