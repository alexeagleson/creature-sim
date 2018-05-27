const TurnTaking = function(worldObject, arg = {}) {
  this.owner = worldObject;
  World.allTurnTakingObjects.set(this.owner.uniqueID, this.owner);

  this.lastTurnMilliseconds = arg.lastTurnMilliseconds || 0;
  this.millisecondsBetweenTurns = arg.millisecondsBetweenTurns || 300;

  this.checkForTurnReady = function() {
    if (World.Time.millisecondsElapsed - this.lastTurnMilliseconds > this.millisecondsBetweenTurns) {
      return true;
    }
    return false;
  };

  this.turnOver = function() {
    this.lastTurnMilliseconds = World.Time.millisecondsElapsed;
    return true;
  };

  this.takeTurn = function() {
    if (!this.owner.onAnyMap()) { return null; }

    if (this.owner.DecisionAI) {
      if (this.owner.DecisionAI.hasObjective) {
        if (this.owner.DecisionAI.successCondition()) {
          this.owner.DecisionAI.onSuccess();
          this.owner.DecisionAI.resetObjective();
        } else {
          if (!this.owner.DecisionAI.currentAction()) {
            this.owner.DecisionAI.onFail();
            this.owner.DecisionAI.resetObjective();
          }
        }
      } else {
        this.owner.DecisionAI.determineAction();
      }
    }
    return this.turnOver();
  };
};
