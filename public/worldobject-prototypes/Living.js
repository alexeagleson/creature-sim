const STAMINA_LOSS_PER_MILLISECOND = 0.0001;

const Living = function(worldObject, arg = {}) {
  this.owner = worldObject;
  if (!this.owner.Destructible) { applyDestructible(this.owner); }
  
  this.stamina = 100;

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
};

function applyLiving(worldObject, arg = {}) {
  worldObject.Living = worldObject.Living || new Living(worldObject, arg);
};
