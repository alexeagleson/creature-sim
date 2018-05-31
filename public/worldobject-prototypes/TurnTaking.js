const TurnTaking = function(worldObject, arg = {}) {
  this.owner = worldObject;
  World.allObjectsTurnTaking.push(this.owner);

  this.lastTurnMilliseconds = arg.lastTurnMilliseconds || 0;
  this.millisecondsBetweenTurns = arg.millisecondsBetweenTurns || 200;

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

function applyTurnTaking(worldObject, arg = {}) {
  worldObject.TurnTaking = worldObject.TurnTaking || new TurnTaking(worldObject, arg);
};
