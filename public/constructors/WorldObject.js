const WorldObject = function(objectName, arg = {}) {
  this.name = objectName;
  this.uniqueID = uniqueNumber();

  World.allObjects.push(this);
  World.allObjectsMap.set(this.uniqueID, this);

  this.char = arg.char || null;
  this.WorldMap = arg.WorldMap || null;
  this.WorldTile = arg.WorldMap || null;

  this.myTile = function() {
    return this.WorldMap.getTile(convertToCoords(this));
  };

  this.removeLocationData = function() {
    this.destroySprite();
    this.WorldMap = null;
    this.WorldTile = null;
  };

  this.removeFromUniverse = function() {
    this.removeLocationData();
    World.allObjectsMap.delete(this.uniqueID);
    World.allObjects = World.allObjects.filter(isNotObject.bind(this));
  };

  this.destroySprite = function() {
    if (isEngine('Phaser') && this.PhaserObject) { this.PhaserObject.destroySprite(); }
  };

  this.placeSprite = function(tileCoords) {
    if (isEngine('Phaser') && this.PhaserObject) {
      this.PhaserObject.generateSprite();
      this.PhaserObject.placeSprite(tileCoords);
    }
  };

  this.placeOnMap = function(arg = {worldMap: null, coords: null, ignoreTriggers: null}) {
    arg.coords = arg.coords || convertToCoords(getRandomFreeTile(arg.worldMap));
    arg.ignoreTriggers = arg.ignoreTriggers || false;
    const mapTransition = (this.WorldMap != null && this.WorldMap != arg.worldMap) ? true : false;

    if (mapTransition) { this.removeLocationData(); }

    if (this === World.player && mapTransition) { World.playerMapTransition = true; }
    this.WorldMap = arg.worldMap;
    this.WorldTile = this.WorldMap.getTile(arg.coords);
    if (onSameMap(this, World.player)) {
      this.placeSprite(arg.coords);
    }

    const walkTriggers = World.allObjects.filter(worldObject => worldObject.onStep).filter(isOnMapOfObject.bind(this)).filter(isOnTile.bind(this.WorldTile)).filter(isNotObject.bind(this));
    walkTriggers.forEach((triggerObject) => { triggerObject.onStep(this); })
  };

  this.isAdjacentTo = function(worldObject, maxDistance = INTERACT_MAX_DISTANCE) {
    if (!this.WorldTile || !worldObject.WorldTile) { return false; }
    if (!this.WorldMap || !worldObject.WorldMap) { return false; }
    if (distanceTo(convertToCoords(this), convertToCoords(worldObject)) <= maxDistance) { return true; }
    return false;
  };

  this.inMyInventoryOrAdjacent = function(worldObject) {
    const myInventory = this.Inventory ? World.allObjects.filter(isInInventoryOf.bind(worldObject)) : false;
    const adjacentTo = this.isAdjacentTo(worldObject);
    if (!(myInventory.length > 0) && !adjacentTo) { return false; }
    return true;
  };

};
