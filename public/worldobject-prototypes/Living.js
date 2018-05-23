const Living = function(worldObject, arg = {}) {
  this.owner = worldObject;
  this.stamina = 100;

  if (!this.owner.Destructible) {
    displayError(`${this.owner.name} must be a Destructible object in order to be a Living object.`);
    return null;
  }

  this.adjustStamina = function(timePassedMilliseconds) {
    this.stamina += timePassedMilliseconds / 100;
    this.stamina = normalizeToValue(this.stamina, 0, 100);
  };

  this.death = function() {
    // game handles destruction, only need living-specific death code here
  };
};
