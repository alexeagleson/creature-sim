import { shortestMapPath } from './../constructors/MapNodeTree';
import { onSameMap, toCoords, toMap, toTile, distanceBetweenCoords } from './../main/world-utility';
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
  return !!worldObject.TurnTaking;
}

export function isConsumable(worldObject) {
  return !!worldObject.Consumable;
}

export function isFood(worldObject) {
  if (!worldObject.Consumable) return false;
  return worldObject.Consumable.hungerValue > 0;
}

export function isDrink(worldObject) {
  if (!worldObject.Consumable) return false;
  return worldObject.Consumable.thirstValue > 0;
}

export function portalToHotOrComfortable(worldObject) {
  if (!worldObject.Portal) return false;
  return worldObject.Portal.warpToMap.isHot() || worldObject.Portal.warpToMap.isComfortable();
}

export function portalToColdOrComfortable(worldObject) {
  if (!worldObject.Portal) return false;
  return worldObject.Portal.warpToMap.isCold() || worldObject.Portal.warpToMap.isComfortable();
}

export function isSocial(worldObject) {
  return !!worldObject.Social;
}

export function isItem(worldObject) {
  return !!worldObject.Item;
}

function isPortal(worldObject) {
  return !!worldObject.Portal;
}

export function isOnAMap(worldObject) {
  if (!worldObject.WorldMap) { return false; }
  return !!worldObject.WorldTile;
}

// Sorts
export function worldPathSizeSort(mapA, mapB) {
  // Bind 'this' to desired lookup map or object
  const startingMap = toMap(this);
  const mapADistance = shortestMapPath(startingMap, mapA) || 9999;
  const mapBDistance = shortestMapPath(startingMap, mapB) || 9999;
  return mapADistance.length - mapBDistance.length;
}

export function localPathSizeSort(objectA, objectB) {
  // Bind 'this' to desired lookup object
  if (!this.Pathing) return displayError('localPathSizeSort used on non-Pathing object:', [this]);
  if (!objectA.WorldTile || !objectB.WorldTile || !this.WorldTile) { return null; }

  const objectAPathLength = this.Pathing.calculatePath({ pathTo: objectA.WorldTile }).length || 9999;
  const objectBPathLength = this.Pathing.calculatePath({ pathTo: objectB.WorldTile }).length || 9999;

  return objectAPathLength - objectBPathLength;
}

export function localDistanceToSort(objectA, objectB) {
  // Bind 'this' to desired lookup object
  const objectATile = toTile(objectA);
  const objectBTile = toTile(objectB);
  const startingTile = toTile(this);
  if (!objectATile || !objectBTile || !startingTile) return displayError('Cannot convert one of these to WorldTile in localDistanceToSort:', [objectA, objectB, this]);

  const objectADistanceTo = distanceBetweenCoords(toCoords(startingTile), toCoords(objectATile));
  const objectBDistanceTo = distanceBetweenCoords(toCoords(startingTile), toCoords(objectBTile));
  return objectADistanceTo - objectBDistanceTo;
}
