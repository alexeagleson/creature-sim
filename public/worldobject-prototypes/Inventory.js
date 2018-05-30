const Inventory = function(worldObject, arg = {}) {
  this.owner = worldObject;

  this.canIAddToInventory = function(worldObject) {
    if (!worldObject.Item) { return false; }
    if (!this.owner.isAdjacentTo(worldObject)) { return false; }
    return true;
  };

  this.addToInventory = function(worldObject) {
    if (worldObject.name === 'Treasure') alert('what');
    worldObject.removeLocationData();
    worldObject.Item.inInventoryOf = this.owner;
    publishEvent(`${this.owner.name} picks up ${worldObject.name}.`);
  };
};

function applyInventory(worldObject, arg = {}) {
  worldObject.Inventory = worldObject.Inventory || new Inventory(worldObject, arg);
};
