function Equipment(worldObject, arg = {}) {
  this.owner = worldObject;
  World.allObjectsEquipment.push(this.owner);

  if (!this.owner.Item) { applyItem(this.owner); }

  this.bonusAttack = arg.bonusAttack || 0;
  this.bonusArmour = arg.bonusArmour || 0;
  this.dieQuantity = arg.dieQuantity || 2;
  this.dieValue = arg.dieValue || 35;
  this.temperatureProtection = arg.temperatureProtection || 0;;
};

export default function applyEquipment(worldObject, arg = {}) {
  worldObject.Equipment = worldObject.Equipment || new Equipment(worldObject, arg);
};
