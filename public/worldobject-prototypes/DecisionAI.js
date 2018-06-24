
import hungerTask from '../ai/hungerTask';
import speakTask from './../ai/speakTask';
import sleepTask from './../ai/sleepTask';
import coldTask from '../ai/coldTask';
import { getClosestObjects, getClosestMaps } from './../main/world-utility';
import { isNotObject, isFood, isDrink, portalToHotOrComfortable, portalToColdOrComfortable } from './../main/filters';

function DecisionAI(worldObject) {
  this.owner = worldObject;
  World.allObjectsDecisionAI.push(this.owner);

  if (!this.owner.TurnTaking) { applyTurnTaking(this.owner); }

  this.taskQueue = [];

  this.currentTask = null;

  this.addTask = (taskObject) => {
    this.taskQueue.push(taskObject);
    return taskObject;
  };

  this.getHighestPriorityTask = () => {
    const taskQueueExcludingPaths = this.taskQueue.filter(task => task.taskType !== 'path');
    taskQueueExcludingPaths.forEach(task => task.updatePriorityVsDistance());
    const chosenTask = taskQueueExcludingPaths.reduce((acc, task) => {
      if (task.priorityVsDistance < acc.priorityVsDistance) return task;
      return acc;
    });
    if (chosenTask.prerequisiteTask) return chosenTask.prerequisiteTask;
    return chosenTask;
  };

  this.startNewTask = () => {
    const followUpTask = this.currentTask ? this.currentTask.followUpTask : null;
    if (this.currentTask) {
      this.taskQueue = this.taskQueue.filter(task => task !== this.currentTask);
      this.currentTask = null;
    }

    if (followUpTask) {
      this.currentTask = followUpTask;
    } else {
      this.updateTasks();
      this.currentTask = this.getHighestPriorityTask(this.taskQueue);
    }

    if (!this.currentTask) alert('this should never run --- if there is a task in the queue at leats one should be returned by getHighestPriorityTask')
    this.currentTask.initialAction();
    return true;
  };

  this.resetAllTasks = () => { this.taskQueue = []; };

  this.updateTasks = () => {
    if (this.owner.Consumer) {
      if (this.owner.Consumer.isHungry()) {
        if (!this.taskQueue.find(task => task.taskType === 'hunger')) {
          const closestFoodObjects = getClosestObjects(this.owner, World.allObjectsConsumable.filter(isFood));
          if (closestFoodObjects.length > 0) this.addTask(hungerTask(this.owner, closestFoodObjects[0]));
        }
      }
    }

    // if (this.owner.Consumer) {
    //   if (this.owner.Consumer.isThirsty()) {
    //     const closestDrinkObjects = getClosestObjects(this.owner, World.allObjectsConsumable.filter(isDrink));
    //     if (closestDrinkObjects.length > 0) this.addTask(consumeTask(this.owner, closestDrinkObjects[0]));
    //   }
    // }

    if (this.owner.Social) {
      if (this.owner.Social.needsToTalk()) {
        if (!this.taskQueue.find(task => task.taskType === 'speak')) {
          const closestSocialObjects = getClosestObjects(this.owner, World.allObjectsSocial.filter(isNotObject.bind(this.owner)));
          if (closestSocialObjects.length > 0) this.addTask(speakTask(this.owner, closestSocialObjects[0]));
        }
      }
    }

    if (this.owner.Temperature) {
      if (this.owner.Temperature.isCold() && this.owner.WorldMap.isCold()) {
        if (!this.taskQueue.find(task => task.taskType === 'cold')) {
          const closestPortalObjects = getClosestObjects(this.owner, World.allObjectsPortal.filter(portalToHotOrComfortable));
          if (closestPortalObjects.length > 0) this.addTask(coldTask(this.owner, closestPortalObjects[0].Portal.warpToMap));
        }
      }
    }

    // if (this.owner.Temperature) {
    //   if (this.owner.Temperature.isHot() && this.owner.WorldMap.isHot()) {
    //     const closestPortalObjects = getClosestObjects(this.owner, World.allObjectsPortal.filter(portalToColdOrComfortable));
    //     if (closestPortalObjects.length > 0) this.addTask(tempTask(this.owner, closestPortalObjects[0].Portal.warpToMap));
    //   }
    // }

    if (this.owner.Living) {
      if (this.owner.Living.isTired()) {
        if (!this.taskQueue.find(task => task.taskType === 'sleep')) {
          const comfortableMaps = getClosestMaps(this.owner, World.allMaps.filter(worldMap => worldMap.isComfortable()));
          if (comfortableMaps.length > 0) this.addTask(sleepTask(this.owner, comfortableMaps[0]));
        }
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
