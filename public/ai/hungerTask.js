import { getAvailableTile } from './../constructors/WorldMap';
import { publishEvent } from './../constructors/WorldEvent';
import Task from './../constructors/Task';
import { getClosestObjectInListFast } from './../main/world-utility';
import { isFood, portalToHotOrComfortable } from './../main/filters';

export function hungerTask(taskOwner) {
  const thisTask = new Task(taskOwner, 'Hunger');
  thisTask.locateTarget = () => { thisTask.taskTarget = getClosestObjectInListFast(thisTask.taskOwner, World.allObjectsConsumable.filter(isFood)); };
  thisTask.onSuccess = () => thisTask.taskOwner.Consumer.consume(thisTask.taskTarget);
  thisTask.onFail = () => publishEvent(`${thisTask.taskOwner.name} fails to consume ${thisTask.taskTarget.name}.`);
  return thisTask;
}

export function speakTask(taskOwner) {
  const thisTask = new Task(taskOwner, 'Speak');
  thisTask.locateTarget = () => { thisTask.taskTarget = getClosestObjectInListFast(thisTask.taskOwner, World.allObjectsSocial); };
  thisTask.onSuccess = () => thisTask.taskOwner.Social.speak(thisTask.taskTarget);
  thisTask.onFail = () => publishEvent(`${thisTask.taskOwner.name} fails to speak to ${thisTask.taskTarget.name}.`);
  thisTask.successProximity = ProtoCs.SPEAK_MAX_DISTANCE;
  return thisTask;
}

export function coldTask(taskOwner) {
  const thisTask = new Task(taskOwner, 'Cold');
  thisTask.locateTarget = () => {
    const foundPortal = getClosestObjectInListFast(thisTask.taskOwner, World.allObjectsPortal.filter(portalToHotOrComfortable));
    thisTask.taskTarget = getAvailableTile({ worldMap: foundPortal.Portal.warpToMap });
  };
  thisTask.onSuccess = () => publishEvent(`${thisTask.taskOwner.name} arrives safely at ${thisTask.taskTarget.WorldMap.name}.`);
  thisTask.onFail = () => publishEvent(`${thisTask.taskOwner.name} fails to arrive at ${thisTask.taskTarget.WorldMap.name}.`);
  return thisTask;
}



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