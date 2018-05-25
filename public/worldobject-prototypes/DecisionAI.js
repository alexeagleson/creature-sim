const DecisionAI = function(worldObject, arg = {}) {
  this.owner = worldObject;
  this.currentAction = null;

  if (!this.owner.TurnTaking) {
    displayError(`${this.name} must be a TurnTaking object in order to be an AI object.`);
    return null;
  }

  this.determineAction = function() {

    let decisionMade = false;

    if (this.owner.Consumer && !decisionMade) {
      World.allObjects.forEach((object) => {

        if (decisionMade) { return null; }
        if (!this.owner.onMapOf(object)) { return null; }

        if (object.Consumable) {
          if (object.Consumable.hungerValue > 0) {
            this.owner.Pathing.calculatePath(object.myCoords());
            this.owner.Pathing.movePath();
            decisionMade = true;
          }
        }
      });
    }

    if (this.owner.Moving && !decisionMade) {
      this.currentAction = this.owner.Moving.moveRandom.bind(this.owner.Moving);
      decisionMade = true;
    }

    if (!decisionMade) {
      this.currentAction = null;
    }
  };

  this.processCurrentAction = function() {
    null;
  };
};
