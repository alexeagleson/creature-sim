const Combat = function(worldObject, arg = {}) {
  this.owner = worldObject;
  this.baseAttack = arg.baseAttack || 10;

  if (!this.owner.Living) {
    displayError(`${this.owner.name} must be a Living object in order to be a Combat object.`);
    return null;
  }

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
    publishEvent(`${this.owner.name} attacks ${attackTarget.name} for ${damageNumber} damage.`)

    //badCode
    World.allUI.hudUI.hudTargetObject = attackTarget;
    setTimeout(() => { World.allUI.hudUI.hudTargetObject = World.player; }, 3000);

    return true;
  };
};
