const Item = function(worldObject, arg = {}) {
  this.owner = worldObject;
  this.inInventoryOf = null;
  this.weight = 100;
};

function applyItem(worldObject, arg = {}) {
  worldObject.Item = worldObject.Item || new Item(worldObject, arg);
};
