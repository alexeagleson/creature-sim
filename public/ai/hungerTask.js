import { displayDialogue } from './../ui/components/HoveringText';
import { publishEvent } from './../constructors/WorldEvent';
import Task from './../constructors/Task';
import pathTask from './../ai/pathTask';

export default function hungerTask(hungryObject, consumeObject, overwrite = {}) {
  const pathOverwrite = { successCondition: () => hungryObject.isAdjacentTo(consumeObject) };
  const thisConsumeTask = Object.assign(new Task(hungryObject, 'hunger'), overwrite);
  thisConsumeTask.prerequisiteTask = hungryObject.DecisionAI.addTask(pathTask(hungryObject, { pathTo: consumeObject }, pathOverwrite));
  thisConsumeTask.prerequisiteTask.followUpTask = thisConsumeTask;
  thisConsumeTask.target = consumeObject;
  thisConsumeTask.initialAction = () => null;
  thisConsumeTask.currentAction = () => false;
  if (overwrite.successCondition === undefined) thisConsumeTask.successCondition = () => hungryObject.isAdjacentTo(consumeObject);
  if (overwrite.onSuccess === undefined) thisConsumeTask.onSuccess = () => hungryObject.Consumer.consume(consumeObject);
  if (overwrite.onFail === undefined) {
    thisConsumeTask.onFail = () => {
      publishEvent(`${hungryObject.name} fails to consume ${consumeObject.name}.`);
      displayDialogue(hungryObject, `what the fuck where did the ${consumeObject.name} go`);
    };
  }
  thisConsumeTask.getPriority = hungryObject.Consumer.getHungerPriority;
  thisConsumeTask.updatePriorityVsDistance();
  publishEvent(`${hungryObject.name} wants to consume ${consumeObject.name} (Priority: ${thisConsumeTask.priorityVsDistance}).`);
  return thisConsumeTask;
}
