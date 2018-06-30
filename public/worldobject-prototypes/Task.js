import { getAvailableTile } from './../constructors/WorldMap';
import { publishEvent } from './../constructors/WorldEvent';
import { getClosestObjectInListFast } from './../main/world-utility';
import { pickRandom, uniqueNumber } from './../main/general-utility';
import { isNotObject, isFood } from './../main/filters';

function applyFoodTask(thisTask) {
  thisTask.determineTarget = () => {
    thisTask.taskTarget = getClosestObjectInListFast(thisTask.owner, thisTask.owner.Memory.knownObjects.filter(isFood));
    return !!thisTask.taskTarget;
  };
  thisTask.successCondition = () => thisTask.owner.isAdjacentTo(thisTask.taskTarget, ProtoCs.INTERACT_MAX_DISTANCE);
  thisTask.onSuccess = () => thisTask.owner.Consumer.consume(thisTask.taskTarget);
  thisTask.onFail = () => publishEvent(`${thisTask.owner.name} fails to consume ${thisTask.taskTarget.name}.`);
}

function applyExploreTask(thisTask) {
  thisTask.determineTarget = () => {
    thisTask.taskTarget = getAvailableTile({ worldMap: pickRandom(World.allMaps) });
    return !!thisTask.taskTarget;
  };
  thisTask.successCondition = () => thisTask.owner.Memory.knownObjects.filter(isFood).length > 0;
  thisTask.onSuccess = () => publishEvent(`${thisTask.owner.name} finds food!.`);
  thisTask.onFail = () => publishEvent(`${thisTask.owner.name} fails to find food.`);
  return thisTask;
}

function Task(worldObject) {
  this.owner = worldObject;
  World.allObjectsTask.push(this.owner);
  this.uniqueID = uniqueNumber();

  this.clearTask = () => {
    this.taskType = null;
    this.taskTarget = null;
    this.currentlyActive = false;
    this.determineTarget = () => null;
    this.successCondition = () => null;
    this.onSuccess = () => null;
    this.onFail = () => null;
  };

  this.clearTask();

  this.calculatePathToTarget = (pathType = 'dijkstra') => this.owner.Pathing.createPathTo(this.taskTarget, this.owner, pathType);

  this.pathTowardTarget = () => {
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

  this.initializeTask = (taskType) => {
    this.taskType = taskType;
    if (this.taskType === 'explore') applyExploreTask(this);
    if (this.taskType === 'food') applyFoodTask(this);
    this.determineTarget();
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
