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
      if (this.owner.Task.currentlyActive) {
        if (rollDie(ProtoCs.VISIBILITY_RADIUS) === 1) this.owner.Memory.examineSurroundings();

        if (this.owner.Task.successCondition()) {
          this.owner.Task.onSuccess();
          this.owner.DecisionAI.generateNewTask();
        } else if (!this.owner.Task.pathTowardTarget()) {
          this.owner.Task.onFail();
          this.owner.DecisionAI.generateNewTask();
        }
      } else {
        this.owner.DecisionAI.generateNewTask();
      }
    }
    return this.turnOver();
  };

  this.revokePrototype = () => {
    World.allObjectsTurnTaking = World.allObjectsTurnTaking.filter(isNotObject.bind(this.owner));
    this.owner.TurnTaking = null;
  };
}

const applyTurnTaking = (worldObject, arg = {}) => {
  worldObject.TurnTaking = worldObject.TurnTaking || new TurnTaking(worldObject, arg);
};

export default applyTurnTaking;
