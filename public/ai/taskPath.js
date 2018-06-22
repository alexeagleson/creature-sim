import Task from './../constructors/Task';

import { onSameTile } from './../main/world-utility';

export default function pathTo(pathingObject, pathArg = { pathTo: null, pathFrom: null, worldMapTo: null, worldMapFrom: null }) {
  const thisTask = new Task();
  thisTask.taskOwner = pathingObject;
  thisTask.initialAction = () => thisTask.taskOwner.Pathing.createPath(pathArg);
  thisTask.currentAction = () => thisTask.taskOwner.Pathing.movePath();
  thisTask.successCondition = () => onSameTile(pathingObject, pathArg.pathTo);
  thisTask.onSuccess = () => alert('success');
  thisTask.onFail = () => {
    alert('fail');
  };
  return thisTask;
}
