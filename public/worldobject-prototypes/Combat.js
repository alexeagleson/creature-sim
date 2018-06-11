import { publishEvent } from './../constructors/WorldEvent';

function Combat(worldObject, arg = {}) {
  this.owner = worldObject;
  World.allObjectsCombat.push(this.owner);

  if (!this.owner.Living) { applyLiving(this.owner); }

  this.baseAttack = arg.baseAttack || 10;

  this.canIAttackObject = (worldObject) => {
    if (!worldObject.Destructible) { return false; }
    if (!this.owner.isAdjacentTo(worldObject)) { return false; }
    return true;
  };

  this.attackObject = (attackTarget) => {
    if (!this.owner.Living.checkAdequateStaminaForAction('Attack')) { return false; }
    this.owner.Living.reduceStaminaBasedOnAction('Attack');
    const damageNumber = attackTarget.Destructible.calculateDamageAttackedBy(this.owner);
    attackTarget.Destructible.adjustConditionBy(0 - damageNumber);
    publishEvent(`${this.owner.name} attacks ${attackTarget.name} for ${damageNumber} damage.`);

    World.ReactUI.HudTarget.targetObject = attackTarget;
    World.AllSounds.hotDog.play();
    return true;
  };
}

export default function applyCombat(worldObject, arg = {}) {
  worldObject.Combat = worldObject.Combat || new Combat(worldObject, arg);
}
