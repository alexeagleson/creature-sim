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
  } else if (objectName === 'Onion') {
    createdObject.char = 'N';
    applyBasePrototypes(createdObject);
    applyNPCPrototypes(createdObject);
    createdObject.RotJS.fgColour = HEX_GREEN;
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
  thisObject.Consumable = new Consumable(thisObject);
  thisObject.Destructible = new Destructible(thisObject);
  thisObject.Inventory = new Inventory(thisObject);
  thisObject.Living = new Living(thisObject);
  thisObject.Social = new Social(thisObject);
  thisObject.Consumer = new Consumer(thisObject);
  thisObject.Temperature = new Temperature(thisObject);
  thisObject.Combat = new Combat(thisObject);
  thisObject.Item = new Item(thisObject);
  thisObject.Equipment = new Equipment(thisObject);
};

function applyNPCPrototypes(thisObject) {
  thisObject.TurnTaking = new TurnTaking(thisObject);
  thisObject.AI = new AI(thisObject);

};
