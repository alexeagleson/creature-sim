import { publishEvent } from './../constructors/WorldEvent';
import { isNotObject } from './../main/filters';
import { normalizeToValue } from './../main/general-utility';
import { isEngine, convertToCoords, getActivePrototypesByName } from './../main/world-utility';

const DAMAGE_THRESHOLD = 25;
const EXHAUSTION_ADJUSTMENT_FACTOR = 100;

function Living(worldObject) {
  this.owner = worldObject;
  World.allObjectsLiving.push(this.owner);

  if (!this.owner.Destructible) { applyDestructible(this.owner); }

  this.stamina = 100;
  this.asleep = false;

  this.isTired = () => this.stamina < ProtoCs.CONCERNED_VALUE;
  this.isVeryTired = () => this.stamina < ProtoCs.PROBLEM_VALUE;

  this.fallAsleep = () => { this.asleep = true; };
  this.wakeUp = () => { this.asleep = false; };

  this.adjustStamina = (timePassedMilliseconds) => {
    this.stamina += this.asleep ? (ProtoCs.STAMINA_LOSS_PER_MILLISECOND * timePassedMilliseconds) : (0 - (ProtoCs.STAMINA_LOSS_PER_MILLISECOND * timePassedMilliseconds));
    this.stamina = normalizeToValue(this.stamina, 0, 100);

    const staminaDamage = Math.round((100 - this.stamina) / EXHAUSTION_ADJUSTMENT_FACTOR);

    this.takingStaminaDamage = false;
    if (this.stamina < DAMAGE_THRESHOLD && staminaDamage > 0) {
      this.takingStaminaDamage = true;
      const causeOfConditionLoss = 'exhaustion';
      this.owner.Destructible.adjustConditionBy(0 - staminaDamage, causeOfConditionLoss);
    }
  };

  this.checkAdequateStaminaForAction = (actionName) => {
    if (actionName === 'Attack' && this.stamina > 10) {
      return true;
    }
    return false;
  };

  this.reduceStaminaBasedOnAction = (actionName) => {
    if (actionName === 'Attack') {
      this.stamina -= 1;
    }
  };

  this.canIExamineObject = examineTargetObject => this.owner.isAdjacentTo(examineTargetObject, ProtoCs.EXAMINE_MAX_DISTANCE);

  this.examineObject = examineTargetObject => publishEvent(`${this.owner.name} examines ${examineTargetObject.name}.`);

  this.death = () => {
    if (isEngine('RotJs')) {
      this.owner.RotJsObject.fgColour = Colours.HEX_RED;
    } else {
      this.owner.PhaserObject.spriteFilename = 'Corpse';
      this.owner.destroySprite();
      this.owner.placeSprite(convertToCoords(this.owner));
    }
    this.owner.char = '%';
    this.owner.name = `Remains of ${this.owner.name}`;
    getActivePrototypesByName(this.owner, ['Consumer', 'DecisionAI', 'Inventory', 'Living', 'Moving', 'Pathing', 'Social', 'Temperature']).forEach(objectProtoype => objectProtoype.revokePrototype());
  };

  this.revokePrototype = () => {
    World.allObjectsLiving = World.allObjectsLiving.filter(isNotObject.bind(this.owner));
    this.owner.Living = null;
  };
}

export default function applyLiving(worldObject, arg = {}) {
  worldObject.Living = worldObject.Living || new Living(worldObject, arg);
}
