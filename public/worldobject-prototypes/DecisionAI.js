
import { hungerTask, searchFoodTask } from '../ai/hungerTask';
import { uniqueNumber } from './../main/general-utility';
import { toTile } from './../main/world-utility';
import { isNotObject, isFood } from './../main/filters';

export function Task(taskOwner, taskType) {
  this.taskOwner = taskOwner;
  this.taskType = taskType;
  this.uniqueID = uniqueNumber();

  this.taskTarget = null;

  this.locateTarget = () => null;

  this.calculatePathToTarget = (pathType = 'dijkstra') => {
    // If a Dijkstra map already exists for the given tile, use that, otherwise try a dumb direct path
    // if (!pathType && toTile(this.taskTarget)) pathType = toTile(this.taskTarget).dijkstraMap ? 'dijkstra' : 'direct';
    return this.taskOwner.Pathing.createPathTo(this.taskTarget, this.taskOwner, pathType);
  };

  this.pathTowardTarget = () => {
    if (this.taskOwner.Pathing.currentPath.length === 0) {
      if (this.taskOwner.Pathing.pathDetails.hasNextTarget()) {
        this.taskOwner.Pathing.pathDetails.updatePathTarget();
        return this.calculatePathToTarget();
      }
      return false;
    }
    if (!this.taskOwner.Pathing.movePath()) {
      if (this.taskOwner.Pathing.pathDetails.pathType === 'direct') return this.calculatePathToTarget('dijkstra');
      if (this.taskOwner.Pathing.pathDetails.pathType === 'dijkstra') return this.calculatePathToTarget('astar');
    }
    return true;
  };

  this.successCondition = () => null;
  this.onSuccess = () => null;
  this.onFail = () => null;

  this.initializeTask = () => {
    if (this.locateTarget()) return this.calculatePathToTarget();
    return false;
  };
}

function DecisionAI(worldObject) {
  this.owner = worldObject;
  World.allObjectsDecisionAI.push(this.owner);

  this.currentTask = null;
  this.clearTask = () => { this.currentTask = null; }

  this.updatePriorities = () => {
    this.priorities = [
      { need: 'Hunger', priority: this.owner.Consumer ? this.owner.Consumer.getHungerPriority() : null },
      // { need: 'Thirst', priority: this.owner.Consumer ? this.owner.Consumer.getThirstPriority() : null },
      // { need: 'Hot', priority: this.owner.Temperature ? this.owner.Temperature.getHotPriority() : null },
      { need: 'Cold', priority: this.owner.Temperature ? this.owner.Temperature.getColdPriority() : null },
      { need: 'Speak', priority: this.owner.Social ? this.owner.Social.getSocialPriority() : null },
      { need: 'Sleep', priority: this.owner.Living ? this.owner.Living.getSleepPriority() : null },
    ];
    this.priorities.sort((a, b) => a.priority - b.priority);
  };

  this.startNewTask = () => {
    if (this.owner.Memory.knownObjects.filter(isFood).length === 0) {
      this.currentTask = searchFoodTask(this.owner);
    } else {
      this.currentTask = hungerTask(this.owner);
    }
    
    if (this.currentTask) {
      if (!this.currentTask.initializeTask()) {
        this.clearTask();
        this.owner.Moving.moveRandom();
      }
    }
    return true;
  };

  this.revokePrototype = () => {
    World.allObjectsDecisionAI = World.allObjectsDecisionAI.filter(isNotObject.bind(this.owner));
    this.owner.DecisionAI = null;
  };
}

export default function applyDecisionAI(worldObject, arg = {}) {
  worldObject.DecisionAI = worldObject.DecisionAI || new DecisionAI(worldObject, arg);
}
