import { getInventory } from './../constructors/WorldObject';
import { publishEvent } from './../constructors/WorldEvent';
import { endSim } from './../main/app';
import { isNotObject } from './../main/filters';
import { normalizeToValue, rollDie } from './../main/general-utility';
import { toCoords } from './../main/world-utility';

function Destructible(worldObject, arg = {}) {
  this.owner = worldObject;
  World.allObjectsDestructible.push(this.owner);

  this.condition = 100;
  this.baseArmour = arg.baseArmour || 0;

  this.adjustConditionBy = (value, causeOfConditionLoss) => {
    this.condition += value;
    this.condition = normalizeToValue(this.condition, 0, 100);
    // Debug
    if (this.owner === World.player) this.condition = 100;
    this.checkIfDestroyed(causeOfConditionLoss);
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

    const damage = normalizeToValue(((baseDamage + bonusDamage) - (baseArmour + bonusArmour)), 1, 9999);
    return damage;
  };

  this.checkIfDestroyed = (causeOfConditionLoss) => {
    if (this.condition <= 0) {
      this.destroy(causeOfConditionLoss);
      if (this.owner === World.player) { endSim(); }
      return true;
    }
    return false;
  };

  this.destroy = (causeOfConditionLoss) => {
    if (this.owner.Inventory) {
      getInventory(this.owner).forEach(object => object.placeOnMap({ worldMap: this.owner.WorldMap, coords: toCoords(this.owner), ignoreTriggers: true }));
    }

    const destroyterm = this.owner.Living ? 'died' : 'been destroyed';
    publishEvent(`${this.owner.name} has ${destroyterm} from ${causeOfConditionLoss}.`, 'red');

    if (this.owner.Living) {
      this.condition = 100;
      this.owner.Living.death();
    } else {
      this.owner.removeFromUniverse();
    }
  };

  this.revokePrototype = () => {
    World.allObjectsDestructible = World.allObjectsDestructible.filter(isNotObject.bind(this.owner));
    this.owner.Destructible = null;
  };
}

const applyDestructible = (worldObject, arg = {}) => {
  worldObject.Destructible = worldObject.Destructible || new Destructible(worldObject, arg);
};

export default applyDestructible;
