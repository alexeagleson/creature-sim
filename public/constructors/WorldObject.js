import { displayEngineIsActive } from './../display-engines/MainDisplay';
import { uniqueNumber, displayError } from './../main/general-utility';
import { distanceTo, convertToCoords, convertToMap, getRandomFreeTile, onSameMap } from './../main/world-utility';
import { isOnMapOfObject, isInInventoryOf, isOnTile, isNotObject } from './../main/filters';

export default function WorldObject(objectName, arg = {}) {
  this.name = objectName;
  this.uniqueID = uniqueNumber();

  World.allObjects.push(this);
  World.allObjectsMap.set(this.uniqueID, this);

  this.char = arg.char || null;
  this.WorldMap = arg.WorldMap || null;
  this.WorldTile = arg.WorldMap || null;

  this.myTile = () => this.WorldMap.getTile(convertToCoords(this));

  this.removeLocationData = () => {
    this.destroySprite();
    this.WorldMap = null;
    this.WorldTile = null;
  };

  this.removeFromUniverse = () => {
    this.removeLocationData();

    World.allObjectsCombat = World.allObjectsCombat.filter(isNotObject.bind(this));
    World.allObjectsConsumable = World.allObjectsConsumable.filter(isNotObject.bind(this));
    World.allObjectsConsumer = World.allObjectsConsumer.filter(isNotObject.bind(this));
    World.allObjectsDecisionAI = World.allObjectsDecisionAI.filter(isNotObject.bind(this));
    World.allObjectsDestructible = World.allObjectsDestructible.filter(isNotObject.bind(this));
    World.allObjectsEquipment = World.allObjectsEquipment.filter(isNotObject.bind(this));
    World.allObjectsEquipper = World.allObjectsEquipper.filter(isNotObject.bind(this));
    World.allObjectsInventory = World.allObjectsInventory.filter(isNotObject.bind(this));
    World.allObjectsItem = World.allObjectsItem.filter(isNotObject.bind(this));
    World.allObjectsLiving = World.allObjectsLiving.filter(isNotObject.bind(this));
    World.allObjectsMoving = World.allObjectsMoving.filter(isNotObject.bind(this));
    World.allObjectsPathing = World.allObjectsPathing.filter(isNotObject.bind(this));
    World.allObjectsPhaserObject = World.allObjectsPhaserObject.filter(isNotObject.bind(this));
    World.allObjectsPortal = World.allObjectsPortal.filter(isNotObject.bind(this));
    World.allObjectsRotJsObject = World.allObjectsRotJsObject.filter(isNotObject.bind(this));
    World.allObjectsSocial = World.allObjectsSocial.filter(isNotObject.bind(this));
    World.allObjectsTemperature = World.allObjectsTemperature.filter(isNotObject.bind(this));
    World.allObjectsTurnTaking = World.allObjectsTurnTaking.filter(isNotObject.bind(this));

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
    const coords = placeOnMapArg.coords || convertToCoords(getRandomFreeTile(placeOnMapArg.worldMap));
    const ignoreTriggers = placeOnMapArg.ignoreTriggers || false;
    const mapTransition = (this.WorldMap !== null && this.WorldMap !== placeOnMapArg.worldMap) || false;

    if (mapTransition) { this.removeLocationData(); }

    if (this === World.player && mapTransition) { World.playerMapTransition = true; }
    this.WorldMap = convertToMap(placeOnMapArg.worldMap) || displayError(`Could not convert to map: ${placeOnMapArg.worldMap}`);
    this.WorldTile = this.WorldMap.getTile(coords);

    if (onSameMap(this, World.player)) {
      this.placeSprite(coords);
    }

    if (!ignoreTriggers) {
      const onStepTriggers = World.allObjects.filter(worldObject => worldObject.onStep).filter(isOnMapOfObject.bind(this)).filter(isOnTile.bind(this.WorldTile)).filter(isNotObject.bind(this));
      onStepTriggers.forEach(triggerObject => triggerObject.onStep(this));
    }
  };

  this.isAdjacentTo = (worldObject, maxDistance = ProtoCs.INTERACT_MAX_DISTANCE) => {
    if (!onSameMap(this, worldObject)) { return false; }
    if (distanceTo(convertToCoords(this), convertToCoords(worldObject)) <= maxDistance) { return true; }
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
