import { publishEvent } from './../constructors/WorldEvent';
import { normalizeToValue, pickRandom } from './../main/general-utility';

import { displayDialogue } from './../../src/components/HoveringText';

function Consumer(worldObject) {
  this.owner = worldObject;
  World.allObjectsConsumer.push(this.owner);

  if (!this.owner.Living) { applyLiving(this.owner); }

  this.hunger = 100;
  this.thirst = 100;

  this.hungerImportance = 5;
  this.thirstImportance = 10;


  this.canIConsumeObject = (worldObject) => {
    if (!worldObject.Consumable) { return false; }
    if (!this.owner.inMyInventoryOrAdjacent(worldObject)) { return false; }
    return true;
  };

  this.consume = (worldObject) => {
    this.hunger += worldObject.Consumable.hungerValue;
    this.hunger = normalizeToValue(this.hunger, 0, 100);

    this.thirst += worldObject.Consumable.thirstValue;
    this.thirst = normalizeToValue(this.thirst, 0, 100);

    worldObject.removeFromUniverse();
    publishEvent(`${this.owner.name} consumes ${worldObject.name}.`);
    displayDialogue(this.owner, pickRandom(['yum!', '*crunch*']));
  };

  this.adjustHunger = (timePassedMilliseconds) => {
    this.hunger -= ProtoCs.HUNGER_LOSS_PER_MILLISECOND * timePassedMilliseconds;
    this.hunger = normalizeToValue(this.hunger, 0, 100);
  };

  this.adjustThirst = (timePassedMilliseconds) => {
    this.thirst -= ProtoCs.THIRST_LOSS_PER_MILLISECOND * timePassedMilliseconds;
    this.thirst = normalizeToValue(this.thirst, 0, 100);
  };



};

export default function applyConsumer(worldObject, arg = {}) {
  worldObject.Consumer = worldObject.Consumer || new Consumer(worldObject, arg);
};
