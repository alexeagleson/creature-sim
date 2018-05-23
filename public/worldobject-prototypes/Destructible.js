const Destructible = function(worldObject, arg = {}) {
  this.owner = worldObject;
  this.condition = 100;

  this.adjustConditionBy = function(value) {
    this.condition += value;
    this.condition = normalizeToValue(this.condition, 0, 100);
    this.checkIfDestroyed();
  };

  this.checkIfDestroyed = function() {
    if (this.condition <= 0) {
      if (this.owner.Living) { this.owner.Living.death(); }
      this.destroy();
      return true;
    }
    return false;
  };

  this.destroy = function() {
    this.owner.removeFromUniverse();
  };
}
