import { shortestMapPath } from './../constructors/MapNodeTree';
import { onSameMap, convertToMap } from './../main/world-utility';
import { displayError } from './../main/general-utility';

// Filters
export function isOnTile(worldObject) {
  // Bind 'this' to desired lookup tile
  if (!worldObject.WorldMap || !worldObject.WorldTile) { return false; }
  return worldObject.WorldTile === this;
}

export function isOnMapOfObject(worldObject) {
  // Bind 'this' to desired lookup object
  return onSameMap(worldObject, this);
}

export function isNotObject(worldObject) {
  // Bind 'this' to desired lookup object
  return worldObject !== this;
}

export function isInInventoryOf(worldObject) {
  // Bind 'this' to desired lookup object
  if (!worldObject.Item) { return false; }
  return worldObject.Item.inInventoryOf === this;
}

export function isNamed(worldObject) {
  // Bind 'this' to desired name
  return worldObject.name.toLowerCase() === this.toLowerCase();
}

// Filters no bind
function isTurnTaking(worldObject) {
  return worldObject.TurnTaking !== undefined;
}

export function isConsumable(worldObject) {
  return worldObject.Consumable !== undefined;
}

export function isFood(worldObject) {
  if (!worldObject.Consumable) return false;
  return worldObject.Consumable.hungerValue > 0;
}

export function isSocial(worldObject) {
  return worldObject.Social !== undefined;
}

export function isItem(worldObject) {
  return worldObject.Item !== undefined;
}

function isPortal(worldObject) {
  return worldObject.Portal !== undefined;
}

export function isOnAMap(worldObject) {
  if (!worldObject.WorldMap) { return false; }
  return worldObject.WorldTile != null;
}

// Sorts
function distanceToSort(objectA, objectB) {
  // Bind 'this' to desired lookup object
  if (!objectA.WorldTile || !objectB.WorldTile || !this.WorldTile) { return null; }

  const objectACoords = [objectA.WorldTile.x, objectA.WorldTile.y];
  const objectBCoords = [objectB.WorldTile.x, objectB.WorldTile.y];
  const targetCoords = [this.WorldTile.x, this.WorldTile.y];

  return distanceTo(objectACoords, targetCoords) - distanceTo(objectBCoords, targetCoords);
}

export function worldPathSizeSort(mapA, mapB) {
  // Bind 'this' to desired lookup map or object
  const startingMap = convertToMap(this);
  const mapADistance = shortestMapPath(startingMap, mapA) || 9999;
  const mapBDistance = shortestMapPath(startingMap, mapB) || 9999;
  return mapADistance.length - mapBDistance.length;
}

export function localPathSizeSort(objectA, objectB) {
  // Bind 'this' to desired lookup object
  if (!this.Pathing) { return displayError(`localPathSizeSort used on non-Pathing object $this.name}`); }
  if (!objectA.WorldTile || !objectB.WorldTile || !this.WorldTile) { return null; }

  const objectACoords = [objectA.WorldTile.x, objectA.WorldTile.y];
  const objectBCoords = [objectB.WorldTile.x, objectB.WorldTile.y];

  const objectAPathLength = this.Pathing.calculatePath({ pathTo: objectACoords }).length || 9999;
  const objectBPathLength = this.Pathing.calculatePath({ pathTo: objectBCoords }).length || 9999;

  return objectAPathLength - objectBPathLength;
}
