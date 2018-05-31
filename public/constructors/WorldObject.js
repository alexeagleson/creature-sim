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

    World.allObjectsCombat = World.allObjectsCombat.filter(isNotObject.bind(this));
    World.allObjectsConsumable = World.allObjectsConsumable.filter(isNotObject.bind(this));
    World.allObjectsConsumer = World.allObjectsConsumer.filter(isNotObject.bind(this));
    World.allObjectsDecisionAI = World.allObjectsDecisionAI.filter(isNotObject.bind(this));
    World.allObjectsDestructible = World.allObjectsDestructible.filter(isNotObject.bind(this));
    World.allObjectsEquipment = World.allObjectsEquipment.filter(isNotObject.bind(this));
    World.allObjectsEquipper = World.allObjectsEquipper.filter(isNotObject.bind(this));
    World.allObjectsInventory = World.allObjectsInventory.filter(isNotObject.bind(this));
    World.allObjectsItem = World.allObjectsItem.filter(isNotObject.bind(this));
    World.allObjectsLiving = World.allObjectsLiving.filter(isNotObject.bind(this));
    World.allObjectsMoving = World.allObjectsMoving.filter(isNotObject.bind(this));
    World.allObjectsPathing = World.allObjectsPathing.filter(isNotObject.bind(this));
    World.allObjectsPhaserObject = World.allObjectsPhaserObject.filter(isNotObject.bind(this));
    World.allObjectsPortal = World.allObjectsPortal.filter(isNotObject.bind(this));
    World.allObjectsRotJsObject = World.allObjectsRotJsObject.filter(isNotObject.bind(this));
    World.allObjectsSocial = World.allObjectsSocial.filter(isNotObject.bind(this));
    World.allObjectsTemperature = World.allObjectsTemperature.filter(isNotObject.bind(this));
    World.allObjectsTurnTaking = World.allObjectsTurnTaking.filter(isNotObject.bind(this));

    World.allObjects = World.allObjects.filter(isNotObject.bind(this));
    World.allObjectsMap.delete(this.uniqueID);
  };

  this.destroySprite = function() {
    if (this.PhaserObject && displayEngineIsActive()) {
      this.PhaserObject.destroySprite();
    }
  };

  this.placeSprite = function(tileCoords) {
    if (this.PhaserObject && displayEngineIsActive()) {
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

    if (!arg.ignoreTriggers) {
      const onStepTriggers = World.allObjects.filter(worldObject => worldObject.onStep).filter(isOnMapOfObject.bind(this)).filter(isOnTile.bind(this.WorldTile)).filter(isNotObject.bind(this));
      onStepTriggers.forEach((triggerObject) => { triggerObject.onStep(this); })
    }
  };

  this.isAdjacentTo = function(worldObject, maxDistance = INTERACT_MAX_DISTANCE) {
    if (!onSameMap(this, worldObject)) { return false; }
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
