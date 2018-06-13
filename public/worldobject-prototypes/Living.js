import { publishEvent } from './../constructors/WorldEvent';
import { isNotObject } from './../main/filters';
import { normalizeToValue } from './../main/general-utility';
import { getActivePrototypesByName } from './../main/world-utility';

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

  this.canIExamineObject = examineTargetObject => this.owner.isAdjacentTo(examineTargetObject, ProtoCs.EXAMINE_MAX_DISTANCE);

  this.examineObject = examineTargetObject => publishEvent(`${this.owner.name} examines ${examineTargetObject.name}.`);

  this.death = () => {
    if (this.owner.RotJsObject) this.owner.RotJsObject.fgColour = Colours.HEX_RED;
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
