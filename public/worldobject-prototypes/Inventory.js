const Inventory = function(worldObject, arg = {}) {
  this.owner = worldObject;

  this.canIAddToInventory = function(worldObject) {
    if (!worldObject.Item) { return false; }
    if (!this.owner.isAdjacentTo(worldObject)) { return false; }
    return true;
  };

  this.addToInventory = function(worldObject) {
    worldObject.removeLocationData();
    worldObject.Item.inInventoryOf = this.owner;
    publishEvent(`${this.owner.name} picks up ${worldObject.name}.`);
    displayDialogue(this.owner, pickRandom(['who is leaving all this shit everywhere?', 'all i do is clean']));
  };
};

function applyInventory(worldObject, arg = {}) {
  worldObject.Inventory = worldObject.Inventory || new Inventory(worldObject, arg);
};
