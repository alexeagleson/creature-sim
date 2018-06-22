import { displayDialogue } from './../ui/components/HoveringText';
import { publishEvent } from './../constructors/WorldEvent';
import { isFood } from './../main/filters';
import { getClosestObjects } from './../main/world-utility';

export default function takeActionOnHunger(worldObject) {
  const closestFoodObjects = getClosestObjects(worldObject, World.allObjectsConsumable.filter(isFood));
  if (closestFoodObjects.length > 0) {
    worldObject.Pathing.createPath({ pathTo: closestFoodObjects[0] });
    publishEvent(`${worldObject.name} wants to eat ${closestFoodObjects[0].name}.`);

    worldObject.DecisionAI.currentAction = () => worldObject.Pathing.movePath();

    worldObject.DecisionAI.successCondition = () => worldObject.isAdjacentTo(closestFoodObjects[0]);

    worldObject.DecisionAI.onSuccess = () => worldObject.Consumer.consume(closestFoodObjects[0]);

    worldObject.DecisionAI.onFail = () => {
      publishEvent(`${worldObject.name} fails to consume ${closestFoodObjects[0].name}.`);
      displayDialogue(worldObject, `what the fuck where did the ${closestFoodObjects[0].name} go`);
    };
    return true;
  }
  return false;
}
