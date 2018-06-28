
import { hungerTask, speakTask, coldTask } from '../ai/hungerTask';
import { rollDie } from './../main/general-utility';
import { getClosestObjects, getClosestMaps, convertToCoords, distanceBetweenCoords, mergeLists } from './../main/world-utility';
import { isNotObject, isOnMapOfObject, isFood, isDrink, portalToHotOrComfortable, portalToColdOrComfortable } from './../main/filters';

function OverallPlan(decisionObject) {
  this.owner = decisionObject;

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
}

function DecisionAI(worldObject) {
  this.owner = worldObject;
  World.allObjectsDecisionAI.push(this.owner);

  this.familiarObjects = [];

  this.taskQueue = [];
  this.currentTask = null;
  this.OverallPlan = new OverallPlan(worldObject);

  // this.addTask = (taskObject) => {
  //   this.taskQueue.push(taskObject);
  //   return taskObject;
  // };

  this.clearTask = () => {
    this.OverallPlan = null;
    this.taskQueue = [];
    this.currentTask = null;
  };

  // this.getHighestPriorityTask = () => {
  //   const taskQueueExcludingPaths = this.taskQueue.filter(task => task.taskType !== 'path');
  //   taskQueueExcludingPaths.forEach(task => task.updatePriorityVsDistance());
  //   const chosenTask = taskQueueExcludingPaths.reduce((acc, task) => {
  //     if (task.priorityVsDistance < acc.priorityVsDistance) return task;
  //     return acc;
  //   });
  //   if (chosenTask.prerequisiteTask) return chosenTask.prerequisiteTask;
  //   return chosenTask;
  // };

  this.startNewTask = () => {
    if (World.allObjectsConsumable.length === 0) {
      World.allObjectsDecisionAI.forEach(decObject => decObject.DecisionAI.clearTask());
      World.disableAI = true;
      return false;
    }

    this.familiarObjects = this.familiarObjects.filter(object => object.hasLocation());
    this.familiarObjects = mergeLists(this.familiarObjects, this.owner.WorldMap.getVisibleObjects(convertToCoords(this.owner)));


    this.currentTask = hungerTask(this.owner);
    if (this.currentTask) {
      if (!this.currentTask.initializeTask()) {
        this.clearTask();
        this.owner.Moving.moveRandom();
      }
    }
    return true;


    // const followUpTask = this.currentTask ? this.currentTask.followUpTask : null;
    // if (this.currentTask) {
    //   this.taskQueue = this.taskQueue.filter(task => task !== this.currentTask);
    //   this.currentTask = null;
    // }

    // if (followUpTask) {
    //   this.currentTask = followUpTask;
    // } else {
    //   this.updateTasks();
    //   if (this.taskQueue.length === 0) return;
    //   this.currentTask = this.getHighestPriorityTask(this.taskQueue);
    // }

    // if (!this.currentTask) alert('this should never run --- if there is a task in the queue at leats one should be returned by getHighestPriorityTask')
    // this.currentTask.initialAction();

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
      if (this.owner.Temperature.isCold() || this.owner.WorldMap.isCold()) {
        if (!this.taskQueue.find(task => task.taskType === 'cold')) {
          const closestPortalObjects = getClosestObjects(this.owner, World.allObjectsPortal.filter(portalToHotOrComfortable));
          if (closestPortalObjects.length > 0) this.addTask(coldTask(this.owner, closestPortalObjects[0].Portal.warpToMap));
        }
      }
    }

    // if (this.owner.Temperature) {
    //   if (this.owner.Temperature.isHot() || this.owner.WorldMap.isHot()) {
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
