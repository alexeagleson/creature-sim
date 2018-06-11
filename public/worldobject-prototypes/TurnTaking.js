function TurnTaking(worldObject, arg = {}) {
  this.owner = worldObject;
  World.allObjectsTurnTaking.push(this.owner);

  this.lastTurnMilliseconds = arg.lastTurnMilliseconds || 0;
  this.millisecondsBetweenTurns = arg.millisecondsBetweenTurns || 500;

  this.checkForTurnReady = () => {
    if (World.Time.millisecondsElapsed - this.lastTurnMilliseconds > this.millisecondsBetweenTurns) {
      return true;
    }
    return false;
  };

  this.turnOver = () => {
    this.lastTurnMilliseconds = World.Time.millisecondsElapsed;
    return true;
  };

  this.takeTurn = () => {
    if (this.owner.DecisionAI) {
      if (this.owner.DecisionAI.hasObjective) {
        if (this.owner.DecisionAI.successCondition()) {
          this.owner.DecisionAI.onSuccess();
          this.owner.DecisionAI.resetObjective();
        } else if (!this.owner.DecisionAI.currentAction()) {
          this.owner.DecisionAI.onFail();
          this.owner.DecisionAI.resetObjective();
        }
      } else {
        this.owner.DecisionAI.determineAction();
      }
    }
    return this.turnOver();
  };
}

export default function applyTurnTaking(worldObject, arg = {}) {
  worldObject.TurnTaking = worldObject.TurnTaking || new TurnTaking(worldObject, arg);
}
