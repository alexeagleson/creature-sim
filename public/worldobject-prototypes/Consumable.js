function Consumable(worldObject) {
  this.owner = worldObject;
  World.allObjectsConsumable.push(this.owner);

  this.hungerValue = 0;
  this.thirstValue = 0;
};

export default function applyConsumable(worldObject, arg = {}) {
  worldObject.Consumable = worldObject.Consumable || new Consumable(worldObject, arg);
};
