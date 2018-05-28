const Combat = function(worldObject, arg = {}) {
  this.owner = worldObject;
  if (!this.owner.Living) { applyLiving(this.owner); }

  this.baseAttack = arg.baseAttack || 10;

  this.canIAttackObject = function(worldObject) {
    if (!worldObject.Destructible) { return false; }
    if (!this.owner.isAdjacentTo(worldObject)) { return false; }
    return true;
  };

  this.attackObject = function(attackTarget) {
    if (!this.owner.Living.checkAdequateStaminaForAction('Attack')) { return false; }
    this.owner.Living.reduceStaminaBasedOnAction('Attack');
    const damageNumber = attackTarget.Destructible.calculateDamageAttackedBy(this.owner);
    attackTarget.Destructible.adjustConditionBy(0 - damageNumber);
    publishEvent(`${this.owner.name} attacks ${attackTarget.name} for ${damageNumber} damage.`);

    //badCode
    World.allUI.hudUI.hudTargetObject = attackTarget;
    setTimeout(() => { World.allUI.hudUI.hudTargetObject = World.player; }, 3000);

    return true;
  };
};

function applyCombat(worldObject, arg = {}) {
  worldObject.Combat = worldObject.Combat || new Combat(worldObject, arg);
};
