const Equipper = function(worldObject, arg = {}) {
  this.owner = worldObject;
  this.currentEquipment = null;

  if (!this.owner.Living) {
    displayError(`${this.owner.name} must be a Living object in order to be an Equipper object.`);
    return null;
  }

  this.canIEquipObject = function(worldObject) {
    if (!worldObject.Equipment) { return false; }
    if (!this.owner.inMyInventoryOrAdjacent(worldObject)) { return false; }
    return true;
  };

  this.equip = function(worldObject) {
    if (this.owner.isAdjacentTo(worldObject)) { this.owner.Inventory.addToInventory(worldObject); }
    this.currentEquipment = worldObject;
  };

  this.unequip = function() {
    this.currentEquipment = null;
  };
};
