import { getAvailableTile } from './../constructors/WorldMap';
import { publishEvent } from './../constructors/WorldEvent';
import { displayDialogue } from './../ui/components/HoveringText';
import Task from './../constructors/Task';
import pathTask from './../ai/pathTask';

export default function sleepTask(sleepObject, sleepMap, overwrite = {}) {
  const thisSleepTask = Object.assign(new Task(sleepObject, 'sleep'), overwrite);
  const sleepTile = getAvailableTile({ worldMap: sleepMap });
  thisSleepTask.prerequisiteTask = sleepObject.DecisionAI.addTask(pathTask(sleepObject, { pathTo: sleepTile }));
  thisSleepTask.prerequisiteTask.followUpTask = thisSleepTask;
  thisSleepTask.target = sleepTile;
  thisSleepTask.initialAction = () => sleepObject.Living.fallAsleep();
  thisSleepTask.currentAction = () => {
    displayDialogue(sleepObject, 'Zzz');
    return true;
  };
  if (overwrite.successCondition === undefined) thisSleepTask.successCondition = () => sleepObject.Living.isRested();
  if (overwrite.onSuccess === undefined) {
    thisSleepTask.onSuccess = () => {
      publishEvent(`${sleepObject.name} wakes up rested.`);
      sleepObject.Living.wakeUp();
    };
  }
  if (overwrite.onFail === undefined) thisSleepTask.onFail = () => publishEvent(`${sleepObject.name} fails to get any sleep in ${sleepMap.name}.`);
  thisSleepTask.getPriority = sleepObject.Living.getSleepPriority;
  thisSleepTask.updatePriorityVsDistance();
  publishEvent(`${sleepObject.name} wants to get some rest in ${sleepMap.name} (Priority: ${thisSleepTask.priorityVsDistance}).`);
  return thisSleepTask;
}
