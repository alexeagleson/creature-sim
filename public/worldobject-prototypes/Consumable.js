const Consumable = function(worldObject, arg = {}) {
  this.owner = worldObject;
  this.hungerValue = 100;
  this.thirstValue = 100;
};
