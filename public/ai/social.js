import { displayDialogue } from './../ui/components/HoveringText';
import { publishEvent } from './../constructors/WorldEvent';
import { isNotObject } from './../main/filters';
import { getClosestObjects } from './../main/world-utility';

export default function takeActionOnSocial(worldObject) {
  const closestSocialObjects = getClosestObjects(worldObject, World.allObjectsSocial.filter(isNotObject.bind(worldObject)));
  if (closestSocialObjects.length > 0) {
    worldObject.Pathing.createPath({ pathTo: closestSocialObjects[0] });
    publishEvent(`${worldObject.name} wants to speak to ${closestSocialObjects[0].name}.`);

    worldObject.DecisionAI.currentAction = () => worldObject.Pathing.movePath();

    worldObject.DecisionAI.successCondition = () => worldObject.isAdjacentTo(closestSocialObjects[0], ProtoCs.SPEAK_MAX_DISTANCE);

    worldObject.DecisionAI.onSuccess = () => worldObject.Social.speak(closestSocialObjects[0]);

    worldObject.DecisionAI.onFail = () => {
      publishEvent(`${worldObject.name} fails to speak to ${closestSocialObjects[0].name}.`);
      displayDialogue(worldObject, `stop moving ${closestSocialObjects[0].name} im trying to talk to you`);
    };
    return true;
  }
  return false;
}
