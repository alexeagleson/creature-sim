import { publishEvent } from './../constructors/WorldEvent';

import { convertToCoords, isInInventoryOf } from './../main/world-utility';

function Inventory(worldObject) {
  this.owner = worldObject;
  World.allObjectsInventory.push(this.owner);

  this.canIAddToInventory = (worldObject) => {
    if (!worldObject.Item) { return false; }
    if (!this.owner.isAdjacentTo(worldObject)) { return false; }
    return true;
  };

  this.addToInventory = (worldObject) => {
    worldObject.removeLocationData();
    worldObject.Item.inInventoryOf = this.owner;
    publishEvent(`${this.owner.name} picks up ${worldObject.name}.`);
  };

  this.canIRemoveFromInventory = (worldObject) => {
    if (!worldObject.Item) { return false; }
    if (worldObject.Item.inInventoryOf !== this.owner) { return false; }
    return true;
  };

  this.removeFromInventory = (worldObject) => {
    worldObject.placeOnMap({ worldMap: this.owner.WorldMap, coords: convertToCoords(this.owner) });
    worldObject.Item.inInventoryOf = null;
    publishEvent(`${this.owner.name} drops ${worldObject.name}.`);
  };
}

export default function applyInventory(worldObject, arg = {}) {
  worldObject.Inventory = worldObject.Inventory || new Inventory(worldObject, arg);
}
