import { displayDialogue } from './../ui/components/HoveringText';
import { publishEvent } from './../constructors/WorldEvent';
import { isDrink } from './../main/filters';
import { getClosestObjects } from './../main/world-utility';

export default function takeActionOnThirst(worldObject) {
  const closestDrinkObjects = getClosestObjects(worldObject, World.allObjectsConsumable.filter(isDrink));
  if (closestDrinkObjects.length > 0) {
    worldObject.Pathing.createPath({ pathTo: closestDrinkObjects[0] });
    publishEvent(`${worldObject.name} wants to drink ${closestDrinkObjects[0].name}.`);

    worldObject.DecisionAI.currentAction = () => worldObject.Pathing.movePath();

    worldObject.DecisionAI.successCondition = () => worldObject.isAdjacentTo(closestDrinkObjects[0]);

    worldObject.DecisionAI.onSuccess = () => worldObject.Consumer.consume(closestDrinkObjects[0]);

    worldObject.DecisionAI.onFail = () => {
      publishEvent(`${worldObject.name} fails to consume ${closestDrinkObjects[0].name}.`);
      displayDialogue(worldObject, `im so thirsty where is the ${closestDrinkObjects[0].name} go`);
    };
    return true;
  }
  return false;
}
