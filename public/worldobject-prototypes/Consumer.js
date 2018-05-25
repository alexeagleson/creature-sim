const HUNGER_LOSS_PER_MILLISECOND = 0.0001;
const THIRST_LOSS_PER_MILLISECOND = 0.0001;

const Consumer = function(worldObject, arg = {}) {
  this.owner = worldObject;
  this.hunger = 50;
  this.thirst = 100;

  if (!this.owner.Living) {
    displayError(`${this.owner.name} must be a Living object in order to be a Consumer object.`);
    return null;
  }

  this.canIConsumeObject = function(worldObject) {
    if (!worldObject.Consumable) { return false; }
    if (!this.owner.inMyInventoryOrAdjacent(worldObject)) { return false; }
    return true;
  };

  this.consume = function(worldObject) {
    this.hunger += worldObject.Consumable.hungerValue;
    this.hunger = normalizeToValue(this.hunger, 0, 100);

    this.thirst += worldObject.Consumable.thirstValue;
    this.thirst = normalizeToValue(this.thirst, 0, 100);

    worldObject.removeFromUniverse();
  };

  this.adjustHunger = function(timePassedMilliseconds) {
    this.hunger -= HUNGER_LOSS_PER_MILLISECOND * timePassedMilliseconds;
    this.hunger = normalizeToValue(this.hunger, 0, 100);
  };

  this.adjustThirst = function(timePassedMilliseconds) {
    this.thirst -= THIRST_LOSS_PER_MILLISECOND * timePassedMilliseconds;
    this.thirst = normalizeToValue(this.thirst, 0, 100);
  };

};
