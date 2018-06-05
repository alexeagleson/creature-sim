import { normalizeToValue, rollDie } from './../main/general-utility';

function Destructible(worldObject, arg = {}) {
  this.owner = worldObject;
  World.allObjectsDestructible.push(this.owner);

  this.condition = 100;
  this.baseArmour = arg.baseArmour || 0;

  this.adjustConditionBy = (value) => {
    this.condition += value;
    this.condition = normalizeToValue(this.condition, 0, 100);
    this.checkIfDestroyed();
  };

  this.calculateDamageAttackedBy = (attackerObject) => {
    const baseDamage = attackerObject.Combat.baseAttack;
    const baseArmour = this.baseArmour;

    let bonusDamage = 0;
    let bonusArmour = 0;

    if (attackerObject.Equipper.currentEquipment) {
      bonusDamage += attackerObject.Equipper.currentEquipment.Equipment.bonusAttack;
      for (let i = 0; i < attackerObject.Equipper.currentEquipment.Equipment.dieQuantity; i++) {
        bonusDamage += rollDie(attackerObject.Equipper.currentEquipment.Equipment.dieValue);
      }
    }

    if (this.Living) {
      if (this.Equipper.currentEquipment) {
        bonusArmour = this.Equipper.currentEquipment.Equipment.bonusArmour;
      }
    }

    damage = normalizeToValue(((baseDamage + bonusDamage) - (baseArmour + bonusArmour)), 1, 9999);
    return damage;
  };

  this.checkIfDestroyed = () => {
    if (this.condition <= 0) {
      if (this.owner.Living) { this.owner.Living.death(); }
      this.destroy();
      return true;
    }
    return false;
  };

  this.destroy = () => this.owner.removeFromUniverse();
}

export default function applyDestructible(worldObject, arg = {}) {
  worldObject.Destructible = worldObject.Destructible || new Destructible(worldObject, arg);
};
