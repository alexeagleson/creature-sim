import { publishEvent } from './../constructors/WorldEvent';
import { uniqueNumber } from './../main/general-utility';
import { isNotObject } from './../main/filters';

function applyHungerTask(thisTask) {
  thisTask.successCondition = () => thisTask.owner.isAdjacentTo(thisTask.taskTarget, ProtoCs.INTERACT_MAX_DISTANCE);
  thisTask.onSuccess = () => thisTask.owner.Consumer.consume(thisTask.taskTarget);
  thisTask.onFail = () => publishEvent(`${thisTask.owner.name} fails to eat ${thisTask.taskTarget.name}.`);
}

function applyThirstTask(thisTask) {
  thisTask.successCondition = () => thisTask.owner.isAdjacentTo(thisTask.taskTarget, ProtoCs.INTERACT_MAX_DISTANCE);
  thisTask.onSuccess = () => thisTask.owner.Consumer.consume(thisTask.taskTarget);
  thisTask.onFail = () => publishEvent(`${thisTask.owner.name} fails to drink ${thisTask.taskTarget.name}.`);
}

function applySpeakTask(thisTask) {
  thisTask.successCondition = () => thisTask.owner.isAdjacentTo(thisTask.taskTarget, ProtoCs.SPEAK_MAX_DISTANCE);
  thisTask.onSuccess = () => thisTask.owner.Social.speak(thisTask.taskTarget);
  thisTask.onFail = () => publishEvent(`${thisTask.owner.name} fails to speak to ${thisTask.taskTarget.name}.`);
}

function applySleepTask(thisTask) {
  thisTask.successCondition = () => thisTask.owner.isAdjacentTo(thisTask.taskTarget, ProtoCs.STANDING_ON_MAX_DISTANCE);
  thisTask.onSuccess = () => thisTask.owner.Living.fallAsleep();
  thisTask.onFail = () => publishEvent(`${thisTask.owner.name} fails to sleep.`);
}

function applyColdTask(thisTask) {
  thisTask.successCondition = () => thisTask.owner.isAdjacentTo(thisTask.taskTarget, ProtoCs.STANDING_ON_MAX_DISTANCE);
  thisTask.onSuccess = () => thisTask.owner.Temperature.startAdjustTemperature();
  thisTask.onFail = () => publishEvent(`${thisTask.owner.name} fails get warm.`);
}

function applyHotTask(thisTask) {
  thisTask.successCondition = () => thisTask.owner.isAdjacentTo(thisTask.taskTarget, ProtoCs.STANDING_ON_MAX_DISTANCE);
  thisTask.onSuccess = () => thisTask.owner.Temperature.startAdjustTemperature();
  thisTask.onFail = () => publishEvent(`${thisTask.owner.name} fails get cool.`);
}

function applyExploreTask(thisTask) {
  thisTask.successCondition = () => thisTask.owner.isAdjacentTo(thisTask.taskTarget);
  thisTask.onSuccess = () => publishEvent(`${thisTask.owner.name} explore success!.`);
  thisTask.onFail = () => publishEvent(`${thisTask.owner.name} fails to find stuff.`);
}

function Task(worldObject) {
  this.owner = worldObject;
  World.allObjectsTask.push(this.owner);
  this.uniqueID = uniqueNumber();

  this.clearTask = () => {
    this.taskType = null;
    this.taskTarget = null;
    this.estimatedTurnsToComplete = null;
    this.currentlyActive = false;
    this.successCondition = () => null;
    this.onSuccess = () => null;
    this.onFail = () => null;
  };

  this.clearTask();

  this.calculatePathToTarget = (pathType = 'dijkstra') => this.owner.Pathing.createPathTo(this.taskTarget, this.owner, pathType);

  this.pathToTarget = () => {
    if (this.owner.Pathing.currentPath.length === 0) {
      if (this.owner.Pathing.pathDetails.hasNextTarget()) {
        this.owner.Pathing.pathDetails.updatePathTarget();
        return this.calculatePathToTarget();
      }
      this.clearTask();
      return false;
    }
    if (!this.owner.Pathing.movePath()) {
      if (this.owner.Pathing.pathDetails.pathType === 'direct') return this.calculatePathToTarget('dijkstra');
      if (this.owner.Pathing.pathDetails.pathType === 'dijkstra') return this.calculatePathToTarget('astar');
    }
    return true;
  };

  this.initializeTask = (currentNeed) => {
    if (!currentNeed.bestTarget) return false;
    this.taskType = currentNeed.needType;
    this.taskTarget = currentNeed.bestTarget;
    this.estimatedTurnsToComplete = currentNeed.estimatedTurnsToComplete;


    if (this.taskType === 'hunger') applyHungerTask(this);
    else if (this.taskType === 'thirst') applyThirstTask(this);
    else if (this.taskType === 'speak') applySpeakTask(this);
    else if (this.taskType === 'sleep') applySleepTask(this);
    else if (this.taskType === 'cold') applyColdTask(this);
    else if (this.taskType === 'hot') applyHotTask(this);
    if (this.taskType === 'explore') applyExploreTask(this);

    if (currentNeed.successCondition) this.successCondition = currentNeed.successCondition;

    if (this.taskTarget) {
      this.currentlyActive = true;
      const targetPathSuccess = this.calculatePathToTarget();
      if (targetPathSuccess) return true;
    }
    this.clearTask();
    return false;
  };

  this.revokePrototype = () => {
    World.allObjectsTask = World.allObjectsTask.filter(isNotObject.bind(this.owner));
    this.owner.Task = null;
  };
}

const applyTask = (worldObject, arg = {}) => {
  worldObject.Task = worldObject.Task || new Task(worldObject, arg);
};

export default applyTask;
