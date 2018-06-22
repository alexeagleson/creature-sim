import { isNotObject } from './../main/filters';

function TurnTaking(worldObject, arg = {}) {
  this.owner = worldObject;
  World.allObjectsTurnTaking.push(this.owner);

  this.lastTurnMilliseconds = arg.lastTurnMilliseconds || 0;
  this.millisecondsBetweenTurns = arg.millisecondsBetweenTurns || ProtoCs.TURN_SPEED;

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
      if (this.owner.DecisionAI.taskQueue.length > 0) {
        if (this.owner.DecisionAI.taskQueue[0].successCondition()) {
          this.owner.DecisionAI.taskQueue[0].onSuccess();
          this.owner.DecisionAI.nextTask();
        } else if (!this.owner.DecisionAI.taskQueue[0].currentAction()) {
          this.owner.DecisionAI.taskQueue[0].onFail();
          this.owner.DecisionAI.resetAllTasks();
        }
      } else {
        this.owner.DecisionAI.determineAction();
      }
    }
    return this.turnOver();
  };

  this.revokePrototype = () => {
    World.allObjectsTurnTaking = World.allObjectsTurnTaking.filter(isNotObject.bind(this.owner));
    this.owner.TurnTaking = null;
  };
}

export default function applyTurnTaking(worldObject, arg = {}) {
  worldObject.TurnTaking = worldObject.TurnTaking || new TurnTaking(worldObject, arg);
}
