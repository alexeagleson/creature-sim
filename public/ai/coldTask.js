import { getAvailableTile } from './../constructors/WorldMap';
import { publishEvent } from './../constructors/WorldEvent';
import Task from './../constructors/Task';
import pathTask from './../ai/pathTask';

export default function coldTask(tempObject, tempLocationMap, overwrite = {}) {
  const thisTempTask = Object.assign(new Task(tempObject, 'cold'), overwrite);
  thisTempTask.prerequisiteTask = tempObject.DecisionAI.addTask(pathTask(tempObject, { pathTo: getAvailableTile({ worldMap: tempLocationMap }) }));
  thisTempTask.prerequisiteTask.followUpTask = thisTempTask;
  thisTempTask.target = tempLocationMap;
  thisTempTask.initialAction = () => null;
  thisTempTask.currentAction = () => tempObject.Moving.moveRandom();
  if (overwrite.successCondition === undefined) thisTempTask.successCondition = () => tempObject.Temperature.isComfortable();
  if (overwrite.onSuccess === undefined) thisTempTask.onSuccess = () => publishEvent(`${tempObject.name} is feeling much more comfortable now.`);
  if (overwrite.onFail === undefined) thisTempTask.onFail = () => publishEvent(`${tempObject.name} fails to get comfortable in ${tempLocationMap.name}.`);
  thisTempTask.getPriority = tempObject.Temperature.getColdPriority;
  thisTempTask.updatePriorityVsDistance();
  publishEvent(`${tempObject.name} wants to get to a more comfortable temperature in ${tempLocationMap.name} (Priority: ${thisTempTask.priorityVsDistance}).`);
  return thisTempTask;
}
