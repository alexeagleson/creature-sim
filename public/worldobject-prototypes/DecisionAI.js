const DecisionAI = function(worldObject, arg = {}) {
  this.owner = worldObject;
  if (!this.owner.TurnTaking) { applyTurnTaking(this.owner); }

  this.resetObjective = function() {
    this.hasObjective = false;
    this.currentAction = () => null;
    this.successCondition = () => null;
    this.onSuccess = () => null;
    this.onFail = () => null;
  };

  this.determineAction = function() {
    const objectsOnMyMap = World.allObjects.filter(isOnMapOfObject.bind(this.owner)).filter(isNotObject.bind(this.owner));

    if (this.owner.Consumer) {
      let consumableObjectsOnMyMap = objectsOnMyMap.filter(isConsumable);
      consumableObjectsOnMyMap.sort(shortestPathToSort.bind(this.owner));

      consumableObjectsOnMyMap.some((consumableObject) => {
        if (consumableObject.Consumable.hungerValue > 0) {
          this.owner.Pathing.createPath(consumableObject.myCoords());
          publishEvent(`${this.owner.name} wants to consume ${consumableObject.name}.`);

          this.currentAction = () => {
            return this.owner.Pathing.movePath();
          };

          this.successCondition = () => {
            return this.owner.isAdjacentTo(consumableObject);
          };

          this.onSuccess = () => {
            return this.owner.Consumer.consume(consumableObject);
          };

          this.onFail = () => {
            publishEvent(`${this.owner.name} fails to consume ${consumableObject.name}.`);
          };

          this.hasObjective = true;
          return true;
        }
        return false;
      });
    }
  };

  this.resetObjective();
};

function applyDecisionAI(worldObject, arg = {}) {
  worldObject.DecisionAI = worldObject.DecisionAI || new DecisionAI(worldObject, arg);
};
