import { publishEvent } from './../constructors/WorldEvent';
import { isNotObject } from './../main/filters';
import { toCoords } from './../main/world-utility';

function Inventory(worldObject) {
  this.owner = worldObject;
  World.allObjectsInventory.push(this.owner);

  this.canIAddToInventory = (argObject) => {
    if (!argObject.Item) { return false; }
    if (!this.owner.isAdjacentTo(argObject)) { return false; }
    return true;
  };

  this.addToInventory = (argObject) => {
    argObject.removeLocationData();
    argObject.Item.inInventoryOf = this.owner;
    publishEvent(`${this.owner.name} picks up ${argObject.name}.`);
  };

  this.canIRemoveFromInventory = (argObject) => {
    if (!argObject.Item) { return false; }
    if (argObject.Item.inInventoryOf !== this.owner) { return false; }
    return true;
  };

  this.removeFromInventory = (argObject) => {
    argObject.placeOnMap({ worldMap: this.owner.WorldMap, coords: toCoords(this.owner) });
    argObject.Item.inInventoryOf = null;
    if (this.owner.Equipper) this.owner.Equipper.unequip();
    publishEvent(`${this.owner.name} drops ${argObject.name}.`);
  };

  this.revokePrototype = () => {
    World.allObjectsInventory = World.allObjectsInventory.filter(isNotObject.bind(this.owner));
    this.owner.Inventory = null;
  };
}

const applyInventory = (worldObject, arg = {}) => {
  worldObject.Inventory = worldObject.Inventory || new Inventory(worldObject, arg);
};

export default applyInventory;
