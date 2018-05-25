const Inventory = function(worldObject, arg = {}) {
  this.owner = worldObject;

  this.currentInventory = [];

  this.canIAddToInventory = function(worldObject) {
    if (!worldObject.Item) { return false; }
    if (!this.owner.isAdjacentTo(worldObject)) { return false; }
    return true;
  };

  this.addToInventory = function(worldObject) {
    worldObject.removeLocationData();
    this.currentInventory.push(worldObject);
  };

  this.inventoryContains = function(worldObject) {
    if (this.currentInventory.includes(worldObject)) { return true; }
    return false;
  };
};
