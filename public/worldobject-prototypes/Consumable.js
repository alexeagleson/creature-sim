const Consumable = function(worldObject, arg = {}) {
  this.owner = worldObject;
  World.allObjectsConsumable.push(this.owner);

  this.hungerValue = 0;
  this.thirstValue = 0;
};

function applyConsumable(worldObject, arg = {}) {
  worldObject.Consumable = worldObject.Consumable || new Consumable(worldObject, arg);
};
