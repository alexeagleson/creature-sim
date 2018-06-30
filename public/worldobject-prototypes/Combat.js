import { publishEvent } from './../constructors/WorldEvent';
import { isNotObject } from './../main/filters';

function Combat(worldObject, arg = {}) {
  this.owner = worldObject;
  World.allObjectsCombat.push(this.owner);

  this.baseAttack = arg.baseAttack || 10;

  this.canIAttackObject = (argObject) => {
    if (!argObject.Destructible) { return false; }
    if (!this.owner.isAdjacentTo(argObject)) { return false; }
    return true;
  };

  this.attackObject = (attackTarget) => {
    if (!this.owner.Living.checkAdequateStaminaForAction('Attack')) { return false; }
    this.owner.Living.reduceStaminaBasedOnAction('Attack');
    const damageNumber = attackTarget.Destructible.calculateDamageAttackedBy(this.owner);
    const causeOfConditionLoss = 'being attacked';
    attackTarget.Destructible.adjustConditionBy(0 - damageNumber, causeOfConditionLoss);
    publishEvent(`${this.owner.name} attacks ${attackTarget.name} for ${damageNumber} damage.`);

    World.ReactUI.HudTarget.targetObject = attackTarget;
    // World.AllSounds.hotDog.play();
    return true;
  };

  this.revokePrototype = () => {
    World.allObjectsCombat = World.allObjectsCombat.filter(isNotObject.bind(this.owner));
    this.owner.Combat = null;
  };
}

const applyCombat = (worldObject, arg = {}) => {
  worldObject.Combat = worldObject.Combat || new Combat(worldObject, arg);
};

export default applyCombat;
