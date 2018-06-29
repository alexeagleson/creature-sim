import { isNotObject } from './../main/filters';
import { rollDie } from './../main/general-utility';

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
      if (World.disableAI) return this.owner.Moving.moveRandom();
      if (this.owner.DecisionAI.currentTask) {
        if (rollDie(ProtoCs.VISIBILITY_RADIUS) === 1) this.owner.Memory.examineSurroundings();
        if (this.owner.DecisionAI.currentTask.successCondition()) {
          this.owner.DecisionAI.currentTask.onSuccess();
          this.owner.DecisionAI.startNewTask();
        } else if (!this.owner.DecisionAI.currentTask.pathTowardTarget()) {
          this.owner.DecisionAI.currentTask.onFail();
          this.owner.DecisionAI.startNewTask();
        }
      } else {
        this.owner.DecisionAI.startNewTask();
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
