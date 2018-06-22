import { displayDialogue } from './../ui/components/HoveringText';
import { publishEvent } from './../constructors/WorldEvent';

export default function takeActionOnSleep(worldObject) {
  publishEvent(`${worldObject.name} is very tired and decides to fall asleep.`);
  worldObject.Living.fallAsleep();

  worldObject.DecisionAI.currentAction = () => {
    displayDialogue(worldObject, 'Zzz');
    return true;
  };

  worldObject.DecisionAI.successCondition = () => !worldObject.Living.isTired();

  worldObject.DecisionAI.onSuccess = () => {
    publishEvent(`${worldObject.name} wakes up rested.`);
    worldObject.Living.wakeUp();
  };

  worldObject.DecisionAI.onFail = () => null;
  return true;
}
