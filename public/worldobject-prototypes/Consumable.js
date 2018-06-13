import { isNotObject } from './../main/filters';

function Consumable(worldObject) {
  this.owner = worldObject;
  World.allObjectsConsumable.push(this.owner);

  this.hungerValue = 0;
  this.thirstValue = 0;

  this.revokePrototype = () => {
    World.allObjectsConsumable = World.allObjectsConsumable.filter(isNotObject.bind(this.owner));
    this.owner.Consumable = null;
  };
}

export default function applyConsumable(worldObject, arg = {}) {
  worldObject.Consumable = worldObject.Consumable || new Consumable(worldObject, arg);
}
