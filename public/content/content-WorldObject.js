function createWorldObject(objectName) {
  let createdObject = new WorldObject(objectName);;


  if (objectName === 'Generic') {
    createdObject.char = '@';
  } else if (objectName === 'NPC') {
    createdObject.char = 'N';

    createdObject.RotObject = new RotObject(createdObject, arg = {fgColour: HEX_BLUE});
    createdObject.Moving = new Moving(createdObject);
    createdObject.Pathing = new Pathing(createdObject);
    createdObject.TurnTaking = new TurnTaking(createdObject);
    createdObject.AI = new AI(createdObject);

    createdObject.WorldMap = World.player.WorldMap;
    createdObject.WorldTile = getRandomFreeTile(World.player.WorldMap);
  }
  addObjectToUniverse(createdObject);
  return createdObject;
};
