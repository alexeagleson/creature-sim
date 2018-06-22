import { publishEvent } from './../constructors/WorldEvent';
import { getClosestObjects } from './../main/world-utility';

export default function takeActionOnCold(worldObject) {
  const validPortals = World.allObjectsPortal.filter(portalObject => portalObject.Portal.warpToMap.isComfortable() || portalObject.Portal.warpToMap.isHot());
  const portalsToWarmPlaces = getClosestObjects(worldObject, validPortals);

  if (portalsToWarmPlaces.length > 0) {
    worldObject.Pathing.createPath({ pathTo: portalsToWarmPlaces[0] });
    publishEvent(`${worldObject.name} wants to go to ${portalsToWarmPlaces[0].Portal.warpToMap.name} to get warm.`);

    worldObject.DecisionAI.currentAction = () => worldObject.Pathing.movePath();

    worldObject.DecisionAI.successCondition = () => worldObject.WorldMap === portalsToWarmPlaces[0].Portal.warpToMap;

    worldObject.DecisionAI.onSuccess = () => publishEvent(`${worldObject.name} arrives safely at ${portalsToWarmPlaces[0].Portal.warpToMap.name}, now time to get warm.`);

    worldObject.DecisionAI.onFail = () => {
      publishEvent(`${worldObject.name} fails to reach ${portalsToWarmPlaces[0].Portal.warpToMap.name}.`);
    };
    return true;
  }
  return false;
}
