import { displayDialogue } from './../ui/components/HoveringText';
import { publishEvent } from './../constructors/WorldEvent';
import Task from './../constructors/Task';
import { onSameTile } from './../main/world-utility';

export default function pathTask(pathingObject, pathArg, overwrite = {}) {
  const thisPathTask = Object.assign(new Task(pathingObject, 'path'), overwrite);
  thisPathTask.target = pathArg.pathTo;
  thisPathTask.initialAction = () => thisPathTask.taskOwner.Pathing.createPath(pathArg);
  thisPathTask.currentAction = () => thisPathTask.taskOwner.Pathing.movePath();
  if (overwrite.successCondition === undefined) thisPathTask.successCondition = () => onSameTile(pathingObject, pathArg.pathTo);
  if (overwrite.onSuccess === undefined) thisPathTask.onSuccess = () => true;
  if (overwrite.onFail === undefined) {
    thisPathTask.onFail = () => {
      publishEvent(`${pathingObject.name} fails to reach its destination.`);
      displayDialogue(pathingObject, 'where am i going?');
    };
  }
  return thisPathTask;
}
