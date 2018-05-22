const Consumer = function(worldObject, arg = {}) {
  this.owner = worldObject;
  this.hunger = 50;
  this.thirst = 100;

  this.consume = function(worldObject) {
    if (!worldObject.Consumable) {
      displayError('${worldObject.name} is not a consumable object.');
      return null;
    }

    this.hunger += worldObject.Consumable.hungerValue;
    this.hunger = normalizeToValue(this.hunger, 1, 100);

    this.thirst += worldObject.Consumable.thirstValue;
    this.thirst = normalizeToValue(this.thirst, 1, 100);
  };
};
