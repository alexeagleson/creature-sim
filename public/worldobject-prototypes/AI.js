const AI = function(worldObject, arg = {}) {
  this.owner = worldObject;
  this.currentAction = null;

  if (!this.owner.TurnTaking) {
    displayError(`${this.name} must be a TurnTaking object in order to be an AI object.`);
    return null;
  }

  this.determineAction = function() {
    if (this.owner.Moving) {
      this.currentAction = this.owner.Moving.moveRandom.bind(this.owner.Moving);
    } else {
      this.currentAction = null;
    }
  };

  this.processCurrentAction = function() {
    null;
  };
};
