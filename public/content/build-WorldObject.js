function createWorldObject(objectName) {
  let createdObject = null;
  if (objectName === 'Generic') {
    createdObject = new WorldObject(objectName);
    createdObject.char = '@';
  }
  addObjectToUniverse(createdObject);
  return createdObject;
};
