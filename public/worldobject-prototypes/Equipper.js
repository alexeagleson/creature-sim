const Equipper = function(worldObject, arg = {}) {
  this.owner = worldObject;
  if (!this.owner.Living) { applyLiving(this.owner); }

  this.currentEquipment = null;

  this.canIEquipObject = function(worldObject) {
    if (!worldObject.Equipment) { return false; }
    if (!this.owner.inMyInventoryOrAdjacent(worldObject)) { return false; }
    return true;
  };

  this.equip = function(worldObject) {
    if (this.owner.isAdjacentTo(worldObject)) { this.owner.Inventory.addToInventory(worldObject); }
    this.currentEquipment = worldObject;
    publishEvent(`${this.owner.name} equips ${worldObject.name}.`);
  };

  this.unequip = function() {
    this.currentEquipment = null;
  };
};

function applyEquipper(worldObject, arg = {}) {
  worldObject.Equipper = worldObject.Equipper || new Equipper(worldObject, arg);
};
