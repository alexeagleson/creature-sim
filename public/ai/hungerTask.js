import { Task } from './../worldobject-prototypes/DecisionAI';
import { getAvailableTile } from './../constructors/WorldMap';
import { publishEvent } from './../constructors/WorldEvent';
import { getClosestObjectInListFast } from './../main/world-utility';
import { isFood } from './../main/filters';
import { pickRandom } from './../main/general-utility';

export function hungerTask(taskOwner) {
  const thisTask = new Task(taskOwner, 'Hunger');
  thisTask.locateTarget = () => {
    thisTask.taskTarget = getClosestObjectInListFast(thisTask.taskOwner, thisTask.taskOwner.Memory.knownObjects.filter(isFood));
    // thisTask.taskTarget = getClosestObjectInListFast(thisTask.taskOwner, World.allObjectsConsumable.filter(isFood));
    return !!thisTask.taskTarget;
  };
  thisTask.successCondition = () => thisTask.taskOwner.isAdjacentTo(thisTask.taskTarget, ProtoCs.INTERACT_MAX_DISTANCE);
  thisTask.onSuccess = () => thisTask.taskOwner.Consumer.consume(thisTask.taskTarget);
  thisTask.onFail = () => publishEvent(`${thisTask.taskOwner.name} fails to consume ${thisTask.taskTarget.name}.`);
  return thisTask;
}

export function searchFoodTask(taskOwner) {
  const thisTask = new Task(taskOwner, 'SearchFood');
  thisTask.locateTarget = () => {
    thisTask.taskTarget = getAvailableTile({ worldMap: pickRandom(World.allMaps) });
    return !!thisTask.taskTarget;
  };

  thisTask.successCondition = () => thisTask.taskOwner.Memory.knownObjects.filter(isFood).length > 0;

  thisTask.onSuccess = () => publishEvent(`${thisTask.taskOwner.name} finds food!.`);
  thisTask.onFail = () => publishEvent(`${thisTask.taskOwner.name} fails to find food.`);
  return thisTask;
}
