function createWorldObject(objectName) {
  let createdObject = new WorldObject(objectName);;


  if (objectName === 'Generic') {
    createdObject.char = '@';
    addObjectToUniverse(createdObject);
    return createdObject;
  } else if (objectName === 'NPC') {
    createdObject.char = 'N';
    applyBasePrototypes(createdObject);
    applyNPCPrototypes(createdObject);
    createdObject.RotJS.fgColour = HEX_BLUE;
  }
  createdObject.WorldMap = World.player.WorldMap;
  createdObject.WorldTile = getRandomFreeTile(World.player.WorldMap);
  addObjectToUniverse(createdObject);
  return createdObject;
};



function applyBasePrototypes(thisObject) {
  thisObject.RotJS = new RotJS(thisObject, arg = {fgColour: HEX_BLUE});
  thisObject.Moving = new Moving(thisObject);
  thisObject.Pathing = new Pathing(thisObject);
  thisObject.Consumer = new Consumer(thisObject);
  thisObject.Consumable = new Consumable(thisObject);
  thisObject.Destructible = new Destructible(thisObject);
  thisObject.Temperature = new Temperature(thisObject);
};

function applyNPCPrototypes(thisObject) {
  thisObject.TurnTaking = new TurnTaking(thisObject);
  thisObject.AI = new AI(thisObject);
};
