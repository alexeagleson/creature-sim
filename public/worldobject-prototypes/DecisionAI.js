import taskPath from '../ai/taskPath';

import takeActionOnCold from './../ai/cold';
import takeActionOnHot from './../ai/hot';
import takeActionOnHunger from './../ai/hunger';
import takeActionOnThirst from './../ai/thirst';
import takeActionOnSocial from './../ai/social';
import takeActionOnSleep from './../ai/sleep';

import { pickRandom } from './../main/general-utility';
import { isNotObject } from './../main/filters';

function DecisionAI(worldObject) {
  this.owner = worldObject;
  World.allObjectsDecisionAI.push(this.owner);

  if (!this.owner.TurnTaking) { applyTurnTaking(this.owner); }

  this.taskQueue = [];

  this.nextTask = () => {
    this.taskQueue.shift();
    this.startNewTask();
  }

  this.startNewTask = () => { if (this.taskQueue.length > 0) this.taskQueue[0].initialAction(); }

  this.resetAllTasks = () => {
    this.taskQueue = [];
  };

  this.determineAction = () => {
    const item = pickRandom(World.allObjectsConsumable);
    const social = pickRandom(World.allObjectsSocial.filter(isNotObject.bind(this.owner)));

    this.taskQueue.push(taskPath(this.owner, {pathTo: item }));
    this.taskQueue.push(taskPath(this.owner, {pathTo: social }));
    
    this.startNewTask();
    return false;

    if (this.owner.Consumer) {
      if (this.owner.Consumer.isHungry()) {
        this.hasObjective = takeActionOnHunger(this.owner);
        if (this.hasObjective) return true;
      }
    }

    if (this.owner.Consumer) {
      if (this.owner.Consumer.isThirsty()) {
        this.hasObjective = takeActionOnThirst(this.owner);
        if (this.hasObjective) return true;
      }
    }

    if (this.owner.Social) {
      if (this.owner.Social.needsToTalk()) {
        this.hasObjective = takeActionOnSocial(this.owner);
        if (this.hasObjective) return true;
      }
    }

    if (this.owner.Temperature) {
      if (this.owner.Temperature.isCold() && this.owner.WorldMap.isCold()) {
        this.hasObjective = takeActionOnCold(this.owner);
        if (this.hasObjective) return true;
      }
    }

    if (this.owner.Temperature) {
      if (this.owner.Temperature.isHot() && this.owner.WorldMap.isHot()) {
        this.hasObjective = takeActionOnHot(this.owner);
        if (this.hasObjective) return true;
      }
    }

    if (this.owner.Living) {
      if (this.owner.Living.isVeryTired()) {
        this.hasObjective = takeActionOnSleep(this.owner);
        if (this.hasObjective) return true;
      }
    }

    if (this.owner.Moving) { this.owner.Moving.moveRandom(); }
    return false;
  };

  this.revokePrototype = () => {
    World.allObjectsDecisionAI = World.allObjectsDecisionAI.filter(isNotObject.bind(this.owner));
    this.owner.DecisionAI = null;
  };
}

export default function applyDecisionAI(worldObject, arg = {}) {
  worldObject.DecisionAI = worldObject.DecisionAI || new DecisionAI(worldObject, arg);
}
