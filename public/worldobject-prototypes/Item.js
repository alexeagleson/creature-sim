import { isNotObject } from './../main/filters';

function Item(worldObject) {
  this.owner = worldObject;
  World.allObjectsItem.push(this.owner);

  this.inInventoryOf = null;
  this.weight = 100;

  this.revokePrototype = () => {
    World.allObjectsItem = World.allObjectsItem.filter(isNotObject.bind(this.owner));
    this.owner.Item = null;
  };
}

const applyItem = (worldObject, arg = {}) => {
  worldObject.Item = worldObject.Item || new Item(worldObject, arg);
};

export default applyItem;
