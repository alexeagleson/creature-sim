import { displayDialogue } from './../ui/components/HoveringText';
import { publishEvent } from './../constructors/WorldEvent';

export default function evaluateHunger(worldObject) {

  if (worldObject.Consumer && (worldObject.Consumer.hunger < ProtoCs.CONCERNED_VALUE || worldObject.Consumer.thirst < ProtoCs.CONCERNED_VALUE)) {
    const consumableObjects = World.allObjectsConsumable;

    consumableObjects.some((consumableObject) => {
      if ((consumableObject.Consumable.hungerValue > 0 && worldObject.Consumer.hunger < ProtoCs.CONCERNED_VALUE) || (consumableObject.Consumable.thirstValue > 0 && worldObject.Consumer.thirst < ProtoCs.CONCERNED_VALUE)) {
        worldObject.Pathing.createPath({ pathTo: consumableObject });
        publishEvent(`${worldObject.name} wants to consume ${consumableObject.name}.`);

        worldObject.DecisionAI.currentAction = () => {
          return worldObject.Pathing.movePath();
        };

        worldObject.DecisionAI.successCondition = () => {
          return worldObject.isAdjacentTo(consumableObject);
        };

        worldObject.DecisionAI.onSuccess = () => {
          return worldObject.Consumer.consume(consumableObject);
        };

        worldObject.DecisionAI.onFail = () => {
          publishEvent(`${worldObject.name} fails to consume ${consumableObject.name}.`);
          displayDialogue(worldObject, `what the fuck where did the ${consumableObject.name} go`);
        };

        worldObject.DecisionAI.hasObjective = true;
        return true;
      }
      return false;
    });
  }
}
