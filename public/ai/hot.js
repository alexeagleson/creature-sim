import { publishEvent } from './../constructors/WorldEvent';
import { getClosestObjects } from './../main/world-utility';

export default function takeActionOnHot(worldObject) {
  const validPortals = World.allObjectsPortal.filter(portalObject => portalObject.Portal.warpToMap.isComfortable() || portalObject.Portal.warpToMap.isCold());
  const portalsToColdPlaces = getClosestObjects(worldObject, validPortals);

  if (portalsToColdPlaces.length > 0) {
    worldObject.Pathing.createPath({ pathTo: portalsToColdPlaces[0] });
    publishEvent(`${worldObject.name} wants to go to ${portalsToColdPlaces[0].Portal.warpToMap.name} to get cool.`);

    worldObject.DecisionAI.currentAction = () => worldObject.Pathing.movePath();

    worldObject.DecisionAI.successCondition = () => worldObject.WorldMap === portalsToColdPlaces[0].Portal.warpToMap;

    worldObject.DecisionAI.onSuccess = () => publishEvent(`${worldObject.name} arrives safely at ${portalsToColdPlaces[0].Portal.warpToMap.name}, now time to get cool.`);

    worldObject.DecisionAI.onFail = () => {
      publishEvent(`${worldObject.name} fails to reach ${portalsToColdPlaces[0].Portal.warpToMap.name}.`);
    };
    return true;
  }
  return false;
}
