const Equipment = function(worldObject, arg = {}) {
  this.owner = worldObject;
  if (!this.owner.Item) { applyItem(this.owner); }

  this.bonusAttack = arg.bonusAttack || 0;
  this.bonusArmour = arg.bonusArmour || 0;
  this.dieQuantity = arg.dieQuantity || 2;
  this.dieValue = arg.dieValue || 35;
  this.temperatureProtection = arg.temperatureProtection || 0;;
};

function applyEquipment(worldObject, arg = {}) {
  worldObject.Equipment = worldObject.Equipment || new Equipment(worldObject, arg);
};
