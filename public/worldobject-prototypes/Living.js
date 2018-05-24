const STAMINA_LOSS_PER_MILLISECOND = 0.0001;

const Living = function(worldObject, arg = {}) {
  this.owner = worldObject;
  this.stamina = 100;
  this.currentEquipment = null;

  if (!this.owner.Destructible) {
    displayError(`${this.owner.name} must be a Destructible object in order to be a Living object.`);
    return null;
  }

  this.adjustStamina = function(timePassedMilliseconds) {
    this.stamina -= STAMINA_LOSS_PER_MILLISECOND * timePassedMilliseconds;
    this.stamina = normalizeToValue(this.stamina, 0, 100);
  };

  this.checkAdequateStaminaForAction = function(actionName) {
    if (actionName === 'Attack' && this.stamina > 10) {
      return true;
    }
    return false;
  };

  this.reduceStaminaBasedOnAction = function(actionName) {
    if (actionName === 'Attack') {
      this.stamina -= 10;
    }
  };

  this.death = function() {
    // game handles destruction, only need living-specific death code here
  };

  this.equip = function(worldObject) {
    if (!worldObject.Equipment) {
      displayError(`${worldObject.name} must be an Equipment object to be equipped.`);
      return null;
    }
    this.currentEquipment = worldObject;
  };

  this.unequip = function() {
    this.currentEquipment = null;
  };
};
