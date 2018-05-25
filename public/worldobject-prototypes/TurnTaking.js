const TurnTaking = function(worldObject, arg = {}) {
  this.owner = worldObject;
  World.allTurnTakingObjects.set(this.owner.uniqueID, this.owner);

  this.lastTurnMilliseconds = arg.lastTurnMilliseconds || 0;
  this.millisecondsBetweenTurns = arg.millisecondsBetweenTurns || 1000;

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
      this.owner.DecisionAI.determineAction();
      if (this.owner.DecisionAI.currentAction) {
        this.owner.DecisionAI.currentAction();
      }
    }
    return this.turnOver();
  };
};
