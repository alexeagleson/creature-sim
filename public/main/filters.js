// Filters
function isOnTile(worldObject) {
  // Bind 'this' to desired lookup tile
  if (!worldObject.WorldMap || !worldObject.WorldTile) { return false; }
  return worldObject.WorldTile === this;
};

function isOnMapOfObject(worldObject) {
  // Bind 'this' to desired lookup object
  return onSameMap(worldObject, this);
};

function isNotObject(worldObject) {
  // Bind 'this' to desired lookup object
  return worldObject != this;
};

function isInInventoryOf(worldObject) {
  // Bind 'this' to desired lookup object
  if (!worldObject.Item) { return false; }
  return worldObject.Item.inInventoryOf === this;
};



// Filters no bind
function isTurnTaking(worldObject) {
  return worldObject.TurnTaking != undefined;
};

function isConsumable(worldObject) {
  return worldObject.Consumable != undefined;
};

function isSocial(worldObject) {
  return worldObject.Social != undefined;
};

function isItem(worldObject) {
  return worldObject.Item != undefined;
};

function isPortal(worldObject) {
  return worldObject.Portal != undefined;
};

function isOnAMap(worldObject) {
  if (!worldObject.WorldMap) { return false; }
  return worldObject.WorldTile != null;
};



// Sorts
function distanceToSort(objectA, objectB) {
  // Bind 'this' to desired lookup object
  if (!objectA.WorldTile || !objectB.WorldTile || !this.WorldTile) { return null; }

  const objectACoords = [objectA.WorldTile.x, objectA.WorldTile.y];
  const objectBCoords = [objectB.WorldTile.x, objectB.WorldTile.y];
  const targetCoords = [this.WorldTile.x, this.WorldTile.y];

  return distanceTo(objectACoords, targetCoords) - distanceTo(objectBCoords, targetCoords);
};

function shortestPathToSort(objectA, objectB) {
  // Bind 'this' to desired lookup object
  if (!this.Pathing) { return displayError(`shortestPathToSort used on non-Pathing object $this.name}`); }
  if (!objectA.WorldTile || !objectB.WorldTile || !this.WorldTile) { return null; }

  const objectACoords = [objectA.WorldTile.x, objectA.WorldTile.y];
  const objectBCoords = [objectB.WorldTile.x, objectB.WorldTile.y];

  const objectAPathLength = this.Pathing.calculatePath(objectACoords).length || 9999;
  const objectBPathLength = this.Pathing.calculatePath(objectBCoords).length || 9999;

  return objectAPathLength - objectBPathLength;
};
