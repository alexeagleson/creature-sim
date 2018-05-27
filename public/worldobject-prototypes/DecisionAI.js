const DecisionAI = function(worldObject, arg = {}) {
  this.owner = worldObject;

  if (!this.owner.TurnTaking) {
    displayError(`${this.name} must be a TurnTaking object in order to be an AI object.`);
    return null;
  }

  this.resetObjective = function() {
    this.hasObjective = false;
    this.currentAction = () => null;
    this.successCondition = () => null;
    this.onSuccess = () => null;
    this.onFail = () => null;
  };

  this.determineAction = function() {
    if (this.owner.Consumer) {
      World.allObjects.forEach((object) => {
        if (!this.owner.onMapOf(object)) { return null; }

        if (object.Consumable) {
          if (object.Consumable.hungerValue > 0) {

            this.owner.Pathing.calculatePath(object.myCoords());

            this.currentAction = () => {
              return this.owner.Pathing.movePath();
            };

            this.successCondition = () => {
              return this.owner.isAdjacentTo(object);
            };

            this.onSuccess = () => {
              return this.owner.Consumer.consume(object);
            };

            this.onFail = () => {
              return alert(`${this.owner.name}: im so hungry`);
            };

            this.hasObjective = true;
          }
        }
      });
    }
  };

  this.resetObjective();
};
