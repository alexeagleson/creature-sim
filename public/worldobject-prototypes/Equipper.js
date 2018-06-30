import { publishEvent } from './../constructors/WorldEvent';
import { isNotObject } from './../main/filters';

function Equipper(worldObject) {
  this.owner = worldObject;
  World.allObjectsEquipper.push(this.owner);

  this.currentEquipment = null;

  this.canIEquipObject = (argObject) => {
    if (!argObject.Equipment) { return false; }
    if (!this.owner.inMyInventoryOrAdjacent(argObject)) { return false; }
    return true;
  };

  this.equip = (argObject) => {
    if (this.owner.isAdjacentTo(argObject)) { this.owner.Inventory.addToInventory(argObject); }
    this.currentEquipment = argObject;
    publishEvent(`${this.owner.name} equips ${argObject.name}.`);
  };

  this.unequip = () => {
    this.currentEquipment = null;
  };

  this.revokePrototype = () => {
    World.allObjectsEquipper = World.allObjectsEquipper.filter(isNotObject.bind(this.owner));
    this.owner.Equipper = null;
  };
}

const applyEquipper = (worldObject, arg = {}) => {
  worldObject.Equipper = worldObject.Equipper || new Equipper(worldObject, arg);
};

export default applyEquipper;
