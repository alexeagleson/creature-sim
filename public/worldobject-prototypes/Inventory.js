const Inventory = function(worldObject, arg = {}) {
  this.owner = worldObject;
  World.allInventoryObjects.set(this.owner.uniqueID, this.owner);

  this.currentInventory = [];

  this.addToInventory = function(worldObject) {
    if (!worldObject.Item) {
      displayError(`${worldObject.name} is not an inventory compatible object.`);
      return null;
    }

    worldObject.removeLocationData();
    this.currentInventory.push(worldObject);
  };

  this.inventoryContains = function(worldObject) {
    if (this.currentInventory.includes(worldObject)) { return true; }
    return false;
  };
};
