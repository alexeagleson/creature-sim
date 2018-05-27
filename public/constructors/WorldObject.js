const WorldObject = function(objectName, arg = {}) {
  this.name = objectName;
  this.uniqueID = uniqueNumber();

  this.char = arg.char || null;
  this.WorldMap = arg.WorldMap || null;
  this.WorldTile = arg.WorldMap || null;

  this.myCoords = function() {
    if (!this.WorldTile) {
      displayError(`${this.name} is not on a tile and cannot call myCoords.`);
      return null;
    }
    return [this.WorldTile.x, this.WorldTile.y];
  };

  this.removeLocationData = function() {
    this.WorldMap = null;
    this.WorldTile = null;
  };

  this.removeFromUniverse = function() {
    if (RENDER_ENGINE === 'Phaser' && this.PhaserObject) { this.PhaserObject.destroySprite(); }
    this.removeLocationData();
    World.allObjects.delete(this.uniqueID);
    World.allTurnTakingObjects.delete(this.uniqueID);
  };

  this.onMapOf = function(worldObject) {
    if (!this.onAnyMap) { return false; }
    if (!worldObject.onAnyMap) { return false; }
    if (this.WorldMap != worldObject.WorldMap) { return false; }
    return true;
  };

  this.onAnyMap = function() {
    if (!this.WorldMap) { return false; }
    if (!this.WorldTile) { return false; }
    return true;
  };

  this.isAdjacentTo = function(worldObject) {
    if (!this.WorldTile || !worldObject.WorldTile) { return false; }
    if (distanceTo(this.myCoords(), worldObject.myCoords()) <= OBJECT_INTERACT_MIN_DISTANCE) { return true; }
    return false;
  };

  this.inMyInventoryOrAdjacent = function(worldObject) {
    const inMyInventory = this.Inventory ? this.Inventory.inventoryContains(worldObject) : false;
    const adjacentTo = this.isAdjacentTo(worldObject);
    if (!inMyInventory && !adjacentTo) { return false; }
    return true;
  };
};
