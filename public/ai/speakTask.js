import { displayDialogue } from './../ui/components/HoveringText';
import { publishEvent } from './../constructors/WorldEvent';
import Task from './../constructors/Task';
import pathTask from './../ai/pathTask';

export default function speakTask(socialSpeaker, socialReceiver, overwrite = {}) {
  const thisSpeakTask = Object.assign(new Task(socialSpeaker, 'speak'), overwrite);
  const pathOverwrite = { successCondition: () => socialSpeaker.isAdjacentTo(socialReceiver, ProtoCs.SPEAK_MAX_DISTANCE) };

  thisSpeakTask.prerequisiteTask = socialSpeaker.DecisionAI.addTask(pathTask(socialSpeaker, { pathTo: socialReceiver }, pathOverwrite));
  thisSpeakTask.prerequisiteTask.followUpTask = thisSpeakTask;

  thisSpeakTask.target = socialReceiver;
  thisSpeakTask.initialAction = () => null;
  thisSpeakTask.currentAction = () => false;
  if (overwrite.successCondition === undefined) thisSpeakTask.successCondition = () => socialSpeaker.isAdjacentTo(socialReceiver, ProtoCs.SPEAK_MAX_DISTANCE);
  if (overwrite.onSuccess === undefined) thisSpeakTask.onSuccess = () => socialSpeaker.Social.speak(socialReceiver);
  if (overwrite.onFail === undefined) {
    thisSpeakTask.onFail = () => {
      publishEvent(`${socialSpeaker.name} fails to talk to ${socialReceiver.name}.`);
      displayDialogue(socialSpeaker, `quit moving ${socialReceiver.name} I want to talk to you`);
    };
  }
  thisSpeakTask.getPriority = socialSpeaker.Social.getSocialPriority;
  thisSpeakTask.updatePriorityVsDistance();
  publishEvent(`${socialSpeaker.name} wants to talk to ${socialReceiver.name} (Priority: ${thisSpeakTask.priorityVsDistance}).`);
  return thisSpeakTask;
}
