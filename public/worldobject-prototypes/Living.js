import { publishEvent } from './../constructors/WorldEvent';
import { normalizeToValue } from './../main/general-utility';

function Living(worldObject) {
  this.owner = worldObject;
  World.allObjectsLiving.push(this.owner);

  if (!this.owner.Destructible) { applyDestructible(this.owner); }

  this.stamina = 100;

  this.adjustStamina = (timePassedMilliseconds) => {
    this.stamina -= ProtoCs.STAMINA_LOSS_PER_MILLISECOND * timePassedMilliseconds;
    this.stamina = normalizeToValue(this.stamina, 0, 100);
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

  this.canIExamineObject = (worldObject) => {
    if (!this.owner.isAdjacentTo(worldObject, ProtoCs.EXAMINE_MAX_DISTANCE)) { return false; }
    return true;
  };

  this.examineObject = (examineTarget) => {
    publishEvent(`${this.owner.name} examines ${examineTarget.name}.`);
    World.ReactUI.SelectAction.hide();
    return true;
  };

  this.death = () => {};
}

export default function applyLiving(worldObject, arg = {}) {
  worldObject.Living = worldObject.Living || new Living(worldObject, arg);
}
