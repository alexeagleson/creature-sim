function Item(worldObject) {
  this.owner = worldObject;
  World.allObjectsItem.push(this.owner);

  this.inInventoryOf = null;
  this.weight = 100;
}

export default function applyItem(worldObject, arg = {}) {
  worldObject.Item = worldObject.Item || new Item(worldObject, arg);
}
