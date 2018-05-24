const Equipment = function(worldObject, arg = {}) {
  this.owner = worldObject;
  this.bonusAttack = arg.bonusAttack || 0;
  this.bonusArmour = arg.bonusArmour || 0;
  this.dieQuantity = arg.dieQuantity || 2;
  this.dieValue = arg.dieValue || 35;
  this.temperatureProtection = arg.temperatureProtection || 0;;

  if (!this.owner.Item) {
    displayError(`${this.owner.name} must be an Item object in order to be an Equipment object.`);
    return null;
  }
};
