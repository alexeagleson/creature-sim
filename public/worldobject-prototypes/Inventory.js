import { publishEvent } from './../constructors/WorldEvent';

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
    World.ReactUI.SelectAction.hide();
  };
}

export default function applyInventory(worldObject, arg = {}) {
  worldObject.Inventory = worldObject.Inventory || new Inventory(worldObject, arg);
}
