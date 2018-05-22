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
    if (this.owner.AI) {
      this.owner.AI.determineAction();
      if (this.owner.AI.currentAction) {
        this.owner.AI.currentAction();
      }
    } else if (this.owner.Moving) {
      this.owner.Moving.moveRandom();
    } else {
      // Do nothing
    }
    return this.turnOver();
  };
};
