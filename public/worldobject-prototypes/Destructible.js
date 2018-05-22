const Destructible = function(worldObject, arg = {}) {
  this.owner = worldObject;
  this.condition = 100;

  this.destroy = function() {
    null;
  };
}
