import { publishEvent } from './../constructors/WorldEvent';
import { isNotObject } from './../main/filters';
import { normalizeToValue, pickRandom } from './../main/general-utility';
import { displayDialogue } from './../ui/components/HoveringText';

const DAMAGE_THRESHOLD = 50;
const HUNGER_THIRST_ADJUSTMENT_FACTOR = 100;

function Consumer(worldObject) {
  this.owner = worldObject;
  World.allObjectsConsumer.push(this.owner);

  if (!this.owner.Living) { applyLiving(this.owner); }

  this.hunger = 50;
  this.thirst = 100;

  this.takingHungerDamage = false;
  this.takingThirstDamage = false;

  this.getHungerPriority = () => Math.round(this.hunger);
  this.getThirstPriority = () => Math.round(this.thirst);

  this.isHungry = () => this.getHungerPriority() < ProtoCs.PROBLEM_VALUE;
  this.isThirsty = () => this.getThirstPriority() < ProtoCs.PROBLEM_VALUE;

  this.canIConsumeObject = (anObject) => {
    if (!anObject.Consumable) { return false; }
    if (!this.owner.inMyInventoryOrAdjacent(anObject)) { return false; }
    return true;
  };

  this.consume = (anObject) => {
    this.hunger += anObject.Consumable.hungerValue;
    this.hunger = normalizeToValue(this.hunger, 0, 100);

    this.thirst += anObject.Consumable.thirstValue;
    this.thirst = normalizeToValue(this.thirst, 0, 100);

    anObject.removeFromUniverse();
    publishEvent(`${this.owner.name} consumes ${anObject.name}.`);
    displayDialogue(this.owner, pickRandom(['yum!', '*crunch*']));
  };

  this.adjustHunger = (timePassedMilliseconds) => {
    this.hunger -= ProtoCs.HUNGER_LOSS_PER_MILLISECOND * timePassedMilliseconds;
    this.hunger = normalizeToValue(this.hunger, 0, 100);

    const hungerDamage = Math.round((100 - this.hunger) / HUNGER_THIRST_ADJUSTMENT_FACTOR);

    this.takingHungerDamage = false;
    if (this.hunger < DAMAGE_THRESHOLD && hungerDamage > 0) {
      this.takingHungerDamage = true;
      const causeOfConditionLoss = 'hunger';
      this.owner.Destructible.adjustConditionBy(0 - hungerDamage, causeOfConditionLoss);
    }
  };

  this.adjustThirst = (timePassedMilliseconds) => {
    this.thirst -= ProtoCs.THIRST_LOSS_PER_MILLISECOND * timePassedMilliseconds;
    this.thirst = normalizeToValue(this.thirst, 0, 100);

    const thirstDamage = Math.round((100 - this.thirst) / HUNGER_THIRST_ADJUSTMENT_FACTOR);

    this.takingThirstDamage = false;
    if (this.thirst < DAMAGE_THRESHOLD && thirstDamage > 0) {
      this.takingThirstDamage = true;
      const causeOfConditionLoss = 'thirst';
      this.owner.Destructible.adjustConditionBy(0 - thirstDamage, causeOfConditionLoss);
    }
  };

  this.revokePrototype = () => {
    World.allObjectsConsumer = World.allObjectsConsumer.filter(isNotObject.bind(this.owner));
    this.owner.Consumer = null;
  };
}

export default function applyConsumer(worldObject, arg = {}) {
  worldObject.Consumer = worldObject.Consumer || new Consumer(worldObject, arg);
}
