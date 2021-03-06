import { getAvailableTile } from './../constructors/WorldMap';
import { displayEngineIsActive } from './../display-engines/MainDisplay';
import { uniqueNumber, displayError } from './../main/general-utility';
import { getAllActivePrototypes, distanceBetweenCoords, toCoords, toMap, onSameMap } from './../main/world-utility';
import { isOnMapOfObject, isInInventoryOf, isOnTile, isNotObject } from './../main/filters';

export default function WorldObject(objectName, arg = {}) {
  this.name = objectName;
  this.uniqueID = uniqueNumber();

  this.objectsFamiliarWithMe = [];

  World.allObjects.push(this);
  World.allObjectsMap.set(this.uniqueID, this);

  this.char = arg.char || null;
  this.WorldMap = arg.WorldMap || null;
  this.WorldTile = arg.WorldMap || null;

  this.hasLocation = () => (this.WorldMap && this.WorldTile);

  this.removeLocationData = () => {
    this.WorldTile.objectsOnTile = this.WorldTile.objectsOnTile.filter(isNotObject.bind(this));
    if (this.WorldTile.objectsOnTile.length === 0) this.WorldTile.dijkstraMap = null;
    this.destroySprite();
    this.WorldMap = null;
    this.WorldTile = null;
  };

  this.removeFromUniverse = () => {
    this.removeLocationData();
    getAllActivePrototypes(this).forEach(objectPrototype => objectPrototype.revokePrototype());
    World.allObjects = World.allObjects.filter(isNotObject.bind(this));
    World.allObjectsMap.delete(this.uniqueID);
  };

  this.destroySprite = () => {
    if (this.PhaserObject && displayEngineIsActive()) {
      this.PhaserObject.destroySprite();
    }
  };

  this.placeSprite = (tileCoords) => {
    if (this.PhaserObject && displayEngineIsActive()) {
      this.PhaserObject.generateSprite();
      this.PhaserObject.placeSprite(tileCoords);
    }
  };

  this.placeOnMap = (placeOnMapArg = { worldMap: null, coords: null, ignoreTriggers: null }) => {
    const coords = placeOnMapArg.coords || toCoords(getAvailableTile({ worldMap: placeOnMapArg.worldMap }));
    const ignoreTriggers = placeOnMapArg.ignoreTriggers || false;
    const mapTransition = (this.WorldMap !== null && this.WorldMap !== placeOnMapArg.worldMap) || false;

    if (this.hasLocation()) this.removeLocationData();

    if (this === World.player && mapTransition) { World.playerMapTransition = true; }
    this.WorldMap = toMap(placeOnMapArg.worldMap) || displayError(`Could not convert to map: ${placeOnMapArg.worldMap}`);
    this.WorldTile = this.WorldMap.getTile(coords);

    if (onSameMap(this, World.player)) {
      this.placeSprite(coords);
    }

    if (!ignoreTriggers) {
      const onStepTriggers = World.allObjects.filter(worldObject => worldObject.onStep).filter(isOnMapOfObject.bind(this)).filter(isOnTile.bind(this.WorldTile)).filter(isNotObject.bind(this));
      onStepTriggers.forEach(triggerObject => triggerObject.onStep(this));
    }

    this.WorldTile.objectsOnTile.push(this);
    return this;
  };

  this.isAdjacentTo = (worldObject, maxDistance = ProtoCs.INTERACT_MAX_DISTANCE) => {
    if (!onSameMap(this, worldObject)) { return false; }
    if (distanceBetweenCoords(toCoords(this), toCoords(worldObject)) <= maxDistance) { return true; }
    return false;
  };

  this.inMyInventoryOrAdjacent = (worldObject) => {
    const myInventory = this.Inventory ? World.allObjects.filter(isInInventoryOf.bind(this)) : false;
    const adjacentTo = this.isAdjacentTo(worldObject);
    if (!(myInventory.length > 0) && !adjacentTo) { return false; }
    return true;
  };

  this.promptAction = () => {
    World.ReactUI.HudTarget.targetObject = this;
    World.ReactUI.SelectAction.prompt(this);
  };
}

export function getInventory(worldObject) {
  return World.allObjectsItem.filter(isInInventoryOf.bind(worldObject));
}
