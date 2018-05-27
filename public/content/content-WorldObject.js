function createWorldObject(objectName) {
  let createdObject = new WorldObject(objectName);;

  if (objectName === 'Player') {
    applyBasePrototypes(createdObject);
    applyLivingPrototypes(createdObject);
    createdObject.char = '@';
    createdObject.RotJsObject.fgColour = HEX_RED;
    createdObject.PhaserObject.spriteFilename = 'Rabbit';

  } else if (objectName === 'Squirrel') {
    applyBasePrototypes(createdObject);
    applyLivingPrototypes(createdObject);
    applyNPCPrototypes(createdObject);
    createdObject.char = 'S';
    createdObject.RotJsObject.fgColour = HEX_BLUE;
    createdObject.PhaserObject.spriteFilename = 'Squirrel';

  } else if (objectName === 'Acorn') {
    applyBasePrototypes(createdObject);
    createdObject.char = 'o';
    createdObject.RotJsObject.fgColour = HEX_GREEN;
    createdObject.Consumable.hungerValue = 100;
    createdObject.PhaserObject.spriteFilename = 'Acorn';

  } else if (objectName === 'Rabbit') {
    applyBasePrototypes(createdObject);
    applyLivingPrototypes(createdObject);
    applyNPCPrototypes(createdObject);
    createdObject.char = 'R';
    createdObject.RotJsObject.fgColour = HEX_BLUE;
    createdObject.PhaserObject.spriteFilename = 'Rabbit';

  } else if (objectName === 'Carrot') {
    applyBasePrototypes(createdObject);
    createdObject.char = 'c';
    createdObject.RotJsObject.fgColour = HEX_GREEN;
    createdObject.Consumable.hungerValue = 100;
    createdObject.PhaserObject.spriteFilename = 'Carrot';

  }

  if (objectName === 'Player') {
    addObjectToUniverse(createdObject);
    return createdObject;
  }

  createdObject.WorldMap = World.player.WorldMap;
  createdObject.WorldTile = getRandomFreeTile(World.player.WorldMap);
  addObjectToUniverse(createdObject);
  return createdObject;
};

function applyBasePrototypes(thisObject) {
  thisObject.RotJsObject = new RotJsObject(thisObject);
  thisObject.PhaserObject = new PhaserObject(thisObject);
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
