function createWorldObject(objectName) {
  let createdObject = new WorldObject(objectName);;

  if (objectName === 'Player') {
    applyBasePrototypes(createdObject);
    applyLivingPrototypes(createdObject);
    createdObject.char = '@';
    createdObject.RotJS.fgColour = HEX_RED;
    addObjectToUniverse(createdObject);

  } else if (objectName === 'Squirrel') {
    applyBasePrototypes(createdObject);
    applyLivingPrototypes(createdObject);
    applyNPCPrototypes(createdObject);
    createdObject.char = 'S';
    createdObject.RotJS.fgColour = HEX_BLUE;

  } else if (objectName === 'Acorn') {
    applyBasePrototypes(createdObject);
    createdObject.char = 'o';
    createdObject.RotJS.fgColour = HEX_GREEN;
    createdObject.Consumable.hungerValue = 100;
  }

  if (objectName === 'Player') { return createdObject; }

  createdObject.WorldMap = World.player.WorldMap;
  createdObject.WorldTile = getRandomFreeTile(World.player.WorldMap);
  addObjectToUniverse(createdObject);
  return createdObject;
};

function applyBasePrototypes(thisObject) {
  thisObject.RotJS = new RotJS(thisObject, arg = {fgColour: HEX_BLUE});
  thisObject.PhaserObject = new PhaserObject(thisObject, arg = {spriteFilename: 'Squirrel'});
  thisObject.Consumable = new Consumable(thisObject);
  thisObject.Destructible = new Destructible(thisObject);
  thisObject.Item = new Item(thisObject);
  thisObject.Equipment = new Equipment(thisObject);
};

function applyLivingPrototypes(thisObject) {
  thisObject.Moving = new Moving(thisObject);
  thisObject.Pathing = new Pathing(thisObject);
  thisObject.Inventory = new Inventory(thisObject);
  thisObject.Living = new Living(thisObject);
  thisObject.Equipper = new Equipper(thisObject);
  thisObject.Social = new Social(thisObject);
  thisObject.Consumer = new Consumer(thisObject);
  thisObject.Temperature = new Temperature(thisObject);
  thisObject.Combat = new Combat(thisObject);
};

function applyNPCPrototypes(thisObject) {
  thisObject.TurnTaking = new TurnTaking(thisObject);
  thisObject.DecisionAI = new DecisionAI(thisObject);
};
