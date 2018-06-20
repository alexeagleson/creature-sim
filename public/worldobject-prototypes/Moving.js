import { isNotObject } from './../main/filters';
import { displayError, randomDirectionCoords } from './../main/general-utility';
import { withinMapBounds, distanceTo, convertToCoords } from './../main/world-utility';

function Moving(worldObject) {
  this.owner = worldObject;
  World.allObjectsMoving.push(this.owner);

  this.move = (movementCoords, ignoreTriggers) => {
    const moveTile = this.owner.WorldMap.getTile(movementCoords);
    if (!moveTile) { return false; }
    const moveDistance = distanceTo(convertToCoords(this.owner), movementCoords);
    if (moveDistance > 1.5) return displayError(`${this.owner.name} Is trying to move ${moveDistance} tiles on map ${this.owner.WorldMap.name}.`);

    if (!moveTile.wall) {
      this.owner.placeOnMap({ worldMap: this.owner.WorldMap, coords: movementCoords, ignoreTriggers });
      return true;
    }
    return false;
  };

  this.moveRelative = relativeMovementCoords => this.move([this.owner.WorldTile.x + relativeMovementCoords[0], this.owner.WorldTile.y + relativeMovementCoords[1]]);

  this.moveRandom = () => this.moveRelative(randomDirectionCoords());

  this.checkBlockedAgainstObject = (x, y, worldMap = null) => {
    if (!worldMap) worldMap = this.owner.WorldMap;
    if (!worldMap) return displayError(`${this.owner.name} must be on a map to call checkBlockedAgainstObject.`);

    if (!withinMapBounds(worldMap, [x, y])) {
      return false;
    }
    return worldMap.getTile([x, y]).checkBlocked(this.owner);
  };

  this.revokePrototype = () => {
    World.allObjectsMoving = World.allObjectsMoving.filter(isNotObject.bind(this.owner));
    this.owner.Moving = null;
  };
}

export default function applyMoving(worldObject, arg = {}) {
  worldObject.Moving = worldObject.Moving || new Moving(worldObject, arg);
}
