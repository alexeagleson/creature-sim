import { isNotObject } from './../main/filters';
import { toCoords, mergeLists } from './../main/world-utility';

function Memory(worldObject) {
  this.owner = worldObject;
  World.allObjectsMemory.push(this.owner);

  this.knownObjects = [];

  this.cleanMemory = () => { this.knownObjects = this.knownObjects.filter(object => object.hasLocation()); };

  this.examineSurroundings = () => {
    this.cleanMemory();
    this.knownObjects = mergeLists(this.knownObjects, this.owner.WorldMap.getVisibleObjects(toCoords(this.owner)));
  };

  this.revokePrototype = () => {
    World.allObjectsMemory = World.allObjectsMemory.filter(isNotObject.bind(this.owner));
    this.owner.Memory = null;
  };
}

const applyMemory = (worldObject, arg = {}) => {
  worldObject.Memory = worldObject.Memory || new Memory(worldObject, arg);
};

export default applyMemory;
