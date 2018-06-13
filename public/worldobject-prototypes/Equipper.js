import { publishEvent } from './../constructors/WorldEvent';
import { isNotObject } from './../main/filters';

function Equipper(worldObject) {
  this.owner = worldObject;
  World.allObjectsEquipper.push(this.owner);

  if (!this.owner.Living) { applyLiving(this.owner); }

  this.currentEquipment = null;

  this.canIEquipObject = (worldObject) => {
    if (!worldObject.Equipment) { return false; }
    if (!this.owner.inMyInventoryOrAdjacent(worldObject)) { return false; }
    return true;
  };

  this.equip = (worldObject) => {
    if (this.owner.isAdjacentTo(worldObject)) { this.owner.Inventory.addToInventory(worldObject); }
    this.currentEquipment = worldObject;
    publishEvent(`${this.owner.name} equips ${worldObject.name}.`);
  };

  this.unequip = () => {
    this.currentEquipment = null;
  };

  this.revokePrototype = () => {
    World.allObjectsEquipper = World.allObjectsEquipper.filter(isNotObject.bind(this.owner));
    this.owner.Equipper = null;
  };
}

export default function applyEquipper(worldObject, arg = {}) {
  worldObject.Equipper = worldObject.Equipper || new Equipper(worldObject, arg);
}
