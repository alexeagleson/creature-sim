const HUNGER_LOSS_PER_MILLISECOND = 0.0001;
const THIRST_LOSS_PER_MILLISECOND = 0.0001;

const Consumer = function(worldObject, arg = {}) {
  this.owner = worldObject;
  if (!this.owner.Living) { applyLiving(this.owner); }

  this.hunger = 50;
  this.thirst = 100;

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
    publishEvent(`${this.owner.name} consumes ${worldObject.name}.`);
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

function applyConsumer(worldObject, arg = {}) {
  worldObject.Consumer = worldObject.Consumer || new Consumer(worldObject, arg);
};
