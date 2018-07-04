
import { getAvailableTile } from './../constructors/WorldMap';
import { isNotObject, isFood, isDrink, isSocial, portalToHotOrComfortable, portalToColdOrComfortable } from './../main/filters';
import { pickRandom } from './../main/general-utility';
import { getClosestObjectInListFast, estimateTotalDistance } from './../main/world-utility';

function wantsToSwitchTasks(worldObject) {
  let wantsToSwitch = false;
  if (worldObject.DecisionAI.needs.length > 0) {
    if (worldObject.DecisionAI.needs[0].needType !== worldObject.Task.taskType) wantsToSwitch = true;
  }
  return wantsToSwitch;
}

function DecisionAI(worldObject) {
  this.owner = worldObject;
  World.allObjectsDecisionAI.push(this.owner);

  this.updateNeeds = () => {
    this.needs = [
      { needType: 'hunger', priority: this.owner.Consumer ? this.owner.Consumer.getHungerPriority() : null },
      { needType: 'thirst', priority: this.owner.Consumer ? this.owner.Consumer.getThirstPriority() : null },
      { needType: 'hot', priority: this.owner.Temperature ? this.owner.Temperature.getHotPriority() : null },
      { needType: 'cold', priority: this.owner.Temperature ? this.owner.Temperature.getColdPriority() : null },
      { needType: 'speak', priority: this.owner.Social ? this.owner.Social.getSocialPriority() : null },
      { needType: 'sleep', priority: this.owner.Living ? this.owner.Living.getSleepPriority() : null },
      { needType: 'explore', priority: 50 },
    ];
    // Filter out the low-priority tasks
    this.needs = this.needs.filter((currentNeed) => {
      if (currentNeed.priority > ProtoCs.PROBLEM_VALUE) return false;

      if (currentNeed.needType === 'hunger') {
        currentNeed.bestTarget = getClosestObjectInListFast(this.owner, this.owner.Memory.knownObjects.filter(isFood));
      } else if (currentNeed.needType === 'thirst') {
        currentNeed.bestTarget = getClosestObjectInListFast(this.owner, this.owner.Memory.knownObjects.filter(isDrink));
      } else if (currentNeed.needType === 'speak') {
        currentNeed.bestTarget = getClosestObjectInListFast(this.owner, this.owner.Memory.knownObjects.filter(isSocial).filter(isNotObject.bind(this.owner)).filter(isNotObject.bind(World.player)));
      } else if (currentNeed.needType === 'sleep') {
        if (this.owner.WorldMap.isComfortable()) {
          currentNeed.bestTarget = getAvailableTile({ worldMap: this.owner.WorldMap });
        } else {
          const warmMapPortal = getClosestObjectInListFast(this.owner, this.owner.Memory.knownObjects.filter(portalToHotOrComfortable));
          if (warmMapPortal) currentNeed.bestTarget = getAvailableTile({ worldMap: warmMapPortal.Portal.warpToMap });
        }
      } else if (currentNeed.needType === 'cold') {
        if (this.owner.WorldMap.isComfortable() || this.owner.WorldMap.isHot()) {
          currentNeed.bestTarget = getAvailableTile({ worldMap: this.owner.WorldMap });
        } else {
          const warmMapPortal = getClosestObjectInListFast(this.owner, this.owner.Memory.knownObjects.filter(portalToHotOrComfortable));
          if (warmMapPortal) currentNeed.bestTarget = getAvailableTile({ worldMap: warmMapPortal.Portal.warpToMap });
        }
      } else if (currentNeed.needType === 'hot') {
        if (this.owner.WorldMap.isComfortable() || this.owner.WorldMap.isCold()) {
          currentNeed.bestTarget = getAvailableTile({ worldMap: this.owner.WorldMap });
        } else {
          const warmMapPortal = getClosestObjectInListFast(this.owner, this.owner.Memory.knownObjects.filter(portalToColdOrComfortable));
          if (warmMapPortal) currentNeed.bestTarget = getAvailableTile({ worldMap: warmMapPortal.Portal.warpToMap });
        }
      }
      if (!currentNeed.bestTarget) return false;
      currentNeed.estimatedTurnsToComplete = estimateTotalDistance(this.owner, currentNeed.bestTarget);
      currentNeed.priorityVsDistance = currentNeed.estimatedTurnsToComplete * currentNeed.priority;
      return true;
    });
    this.needs.sort((a, b) => a.priorityVsDistance - b.priorityVsDistance);
  };

  this.reviewTasks = () => {
    this.updateNeeds();
    if (worldObject.Task.currentlyActive && !wantsToSwitchTasks(this.owner)) return true;

    if (this.needs.length === 0) {
      const exploreNeed = { needType: 'explore', priority: 0 };
      exploreNeed.bestTarget = getAvailableTile({ worldMap: pickRandom(World.allMaps) });
      if (exploreNeed.bestTarget) {
        exploreNeed.estimatedTurnsToComplete = estimateTotalDistance(this.owner, exploreNeed.bestTarget);
        exploreNeed.priorityVsDistance = exploreNeed.estimatedTurnsToComplete * exploreNeed.priority;
        this.needs = [exploreNeed];
      }
    }

    this.needs.some(currentNeed => this.owner.Task.initializeTask(currentNeed));

    if (!this.owner.Task.currentlyActive) this.owner.Moving.moveRandom();
    return true;
  };

  this.revokePrototype = () => {
    World.allObjectsDecisionAI = World.allObjectsDecisionAI.filter(isNotObject.bind(this.owner));
    this.owner.DecisionAI = null;
  };
}

const applyDecisionAI = (worldObject, arg = {}) => {
  worldObject.DecisionAI = worldObject.DecisionAI || new DecisionAI(worldObject, arg);
};

export default applyDecisionAI;
