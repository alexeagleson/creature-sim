const Inventory = function(worldObject, arg = {}) {
  this.owner = worldObject;
  this.currentInventory = [];

  this.addToInventory = function(worldObject) {
    if (!worldObject.Item) {
      displayError(`${worldObject.name} is not an inventory compatible object.`);
      return null;
    }

    worldObject.removeLocationData();
    this.currentInventory.push(worldObject);
  };
};
