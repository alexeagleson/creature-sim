const Social = function(worldObject, arg = {}) {
  this.owner = worldObject;
  World.allObjectsSocial.push(this.owner);
  if (!this.owner.Living) { applyLiving(this.owner); }

  this.socialLevel = 50;

  this.canISpeakTo = function(worldObject) {
    if (!worldObject.Social) { return false; }
    if (!this.owner.isAdjacentTo(worldObject, SPEAK_MAX_DISTANCE)) { return false; }
    return true;
  };

  this.speak = function(objectSpeakTo) {
    const dialogue = `Hello ${objectSpeakTo.name}!`;
    publishEvent(`${this.owner.name} says: ${dialogue}`);
    displayDialogue(this.owner, dialogue);
    this.socialLevel += 10;
  };
};

function applySocial(worldObject, arg = {}) {
  worldObject.Social = worldObject.Social || new Social(worldObject, arg);
};
