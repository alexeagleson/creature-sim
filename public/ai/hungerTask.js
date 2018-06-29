import { getAvailableTile } from './../constructors/WorldMap';
import { publishEvent } from './../constructors/WorldEvent';
import { getClosestObjectInListFast, estimateTotalDistance, mergeLists, toTile, toCoords } from './../main/world-utility';
import { isFood, portalToHotOrComfortable } from './../main/filters';
import { uniqueNumber } from './../main/general-utility';

export default function Task(taskOwner, taskType) {
  this.taskOwner = taskOwner;
  this.taskType = taskType;
  this.uniqueID = uniqueNumber();

  this.taskTarget = null;
  this.exploreFrequency = null;

  this.locateTarget = () => null;

  this.calculatePathToTarget = (pathType) => {
    // If a Dijkstra map already exists for the given tile, use that, otherwise try a dumb direct path
    if (!pathType && toTile(this.taskTarget)) pathType = toTile(this.taskTarget).dijkstraMap ? 'dijkstra' : 'direct';
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

  this.explore = () => {
    this.taskOwner.DecisionAI.familiarObjects = this.taskOwner.DecisionAI.familiarObjects.filter(object => object.hasLocation());
    this.taskOwner.DecisionAI.familiarObjects = mergeLists(this.taskOwner.DecisionAI.familiarObjects, this.taskOwner.WorldMap.getVisibleObjects(toCoords(this.taskOwner)));
  };

  this.successCondition = () => null;
  this.onSuccess = () => null;
  this.onFail = () => null;

  this.initializeTask = () => {
    if (this.locateTarget()) return this.calculatePathToTarget();
    return false;
  };

  // this.getPriority = () => null;
  // this.estimatedActionsToComplete = () => this.target ? estimateTotalDistance(this.taskOwner, this.target) : null;
  // this.updatePriorityVsDistance = () => { this.priorityVsDistance = Math.round(this.estimatedActionsToComplete() * this.getPriority()); };
}

export function hungerTask(taskOwner) {
  const thisTask = new Task(taskOwner, 'Hunger');
  thisTask.locateTarget = () => {
    thisTask.taskTarget = getClosestObjectInListFast(thisTask.taskOwner, thisTask.taskOwner.DecisionAI.familiarObjects.filter(isFood));
    // thisTask.taskTarget = getClosestObjectInListFast(thisTask.taskOwner, World.allObjectsConsumable.filter(isFood));
    return !!thisTask.taskTarget;
  };
  thisTask.successCondition = () => thisTask.taskOwner.isAdjacentTo(thisTask.taskTarget, ProtoCs.INTERACT_MAX_DISTANCE);
  thisTask.onSuccess = () => thisTask.taskOwner.Consumer.consume(thisTask.taskTarget);
  thisTask.onFail = () => publishEvent(`${thisTask.taskOwner.name} fails to consume ${thisTask.taskTarget.name}.`);
  return thisTask;
}

export function exploreTask(taskOwner) {
  const thisTask = new Task(taskOwner, 'Explore');
  thisTask.locateTarget = () => {
    thisTask.taskTarget = getClosestObjectInListFast(thisTask.taskOwner, World.allObjectsConsumable);
    return !!thisTask.taskTarget;
  };
  thisTask.successCondition = () => thisTask.taskOwner.isAdjacentTo(thisTask.taskTarget, ProtoCs.INTERACT_MAX_DISTANCE) || thisTask.taskOwner.DecisionAI.familiarObjects.filter(isFood).length > 0;
  thisTask.onSuccess = () => null;
  thisTask.onFail = () => publishEvent(`${thisTask.taskOwner.name} fails to discover anything new.`);
  thisTask.exploreFrequency = 5;
  return thisTask;
}

// export function speakTask(taskOwner) {
//   const thisTask = new Task(taskOwner, 'Speak');
//   thisTask.locateTarget = () => { thisTask.taskTarget = getClosestObjectInListFast(thisTask.taskOwner, World.allObjectsSocial); };
//   thisTask.onSuccess = () => thisTask.taskOwner.Social.speak(thisTask.taskTarget);
//   thisTask.onFail = () => publishEvent(`${thisTask.taskOwner.name} fails to speak to ${thisTask.taskTarget.name}.`);
//   thisTask.successProximity = ProtoCs.SPEAK_MAX_DISTANCE;
//   return thisTask;
// }

// export function coldTask(taskOwner) {
//   const thisTask = new Task(taskOwner, 'Cold');
//   thisTask.locateTarget = () => {
//     const foundPortal = getClosestObjectInListFast(thisTask.taskOwner, World.allObjectsPortal.filter(portalToHotOrComfortable));
//     thisTask.taskTarget = getAvailableTile({ worldMap: foundPortal.Portal.warpToMap });
//   };
//   thisTask.onSuccess = () => publishEvent(`${thisTask.taskOwner.name} arrives safely at ${thisTask.taskTarget.WorldMap.name}.`);
//   thisTask.onFail = () => publishEvent(`${thisTask.taskOwner.name} fails to arrive at ${thisTask.taskTarget.WorldMap.name}.`);
//   return thisTask;
// }



// const pathOverwrite = { successCondition: () => hungryObject.isAdjacentTo(consumeObject) };
// const thisConsumeTask = Object.assign(new Task(hungryObject, 'hunger'), overwrite);


// thisConsumeTask.prerequisiteTask = hungryObject.DecisionAI.addTask(pathTask(hungryObject, { pathTo: consumeObject }, pathOverwrite));
// thisConsumeTask.prerequisiteTask.followUpTask = thisConsumeTask;
// thisConsumeTask.target = consumeObject;



// thisConsumeTask.initialAction = () => null;
// thisConsumeTask.currentAction = () => false;



// if (overwrite.successCondition === undefined) thisConsumeTask.successCondition = () => hungryObject.isAdjacentTo(consumeObject);
// if (overwrite.onSuccess === undefined) thisConsumeTask.onSuccess = () => hungryObject.Consumer.consume(consumeObject);
// if (overwrite.onFail === undefined) {
//   thisConsumeTask.onFail = () => {
//     publishEvent(`${hungryObject.name} fails to consume ${consumeObject.name}.`);
//     displayDialogue(hungryObject, `what the fuck where did the ${consumeObject.name} go`);
//   };
// }
// thisConsumeTask.getPriority = hungryObject.Consumer.getHungerPriority;
// thisConsumeTask.updatePriorityVsDistance();
// publishEvent(`${hungryObject.name} wants to consume ${consumeObject.name} (Priority: ${thisConsumeTask.priorityVsDistance}).`);