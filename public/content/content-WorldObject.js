function createWorldObject(objectName, arg = {}) {
  let createdObject = new WorldObject(objectName);

  if (objectName === 'Player') {
    applyBasePrototypes(createdObject);
    applyLivingPrototypes(createdObject);
    createdObject.char = '@';
    isEngine('RotJs')
      ? createdObject.RotJsObject.fgColour = HEX_RED
      : createdObject.PhaserObject.spriteFilename = 'Rabbit';

  } else if (objectName === 'Squirrel') {
    applyBasePrototypes(createdObject);
    applyLivingPrototypes(createdObject);
    applyAIPrototypes(createdObject);
    createdObject.char = 'S';
    isEngine('RotJs')
      ? createdObject.RotJsObject.fgColour = HEX_BLUE
      : createdObject.PhaserObject.spriteFilename = 'Squirrel';

  } else if (objectName === 'Acorn') {
    applyBasePrototypes(createdObject);
    createdObject.char = 'o';
    isEngine('RotJs')
      ? createdObject.RotJsObject.fgColour = HEX_GREEN
      : createdObject.PhaserObject.spriteFilename = 'Acorn';
    applyConsumable(createdObject);
    createdObject.Consumable.hungerValue = 100;

  } else if (objectName === 'Rabbit') {
    applyBasePrototypes(createdObject);
    applyLivingPrototypes(createdObject);
    applyAIPrototypes(createdObject);
    createdObject.char = 'R';
    isEngine('RotJs')
      ? createdObject.RotJsObject.fgColour = HEX_BLUE
      : createdObject.PhaserObject.spriteFilename = 'Rabbit';

  } else if (objectName === 'Carrot') {
    applyBasePrototypes(createdObject);
    createdObject.char = 'c';
    isEngine('RotJs')
      ? createdObject.RotJsObject.fgColour = HEX_GREEN
      : createdObject.PhaserObject.spriteFilename = 'Carrot';

    applyConsumable(createdObject);
    createdObject.Consumable.hungerValue = 100;

  } else if (objectName === 'Trash') {
    applyBasePrototypes(createdObject);
    createdObject.char = '%';
    if(isEngine('RotJs')) {
      createdObject.RotJsObject.fgColour = HEX_ORANGE
    } else {
      createdObject.PhaserObject.spriteFilename = 'Trash';
      createdObject.PhaserObject.defaultFrameNumber = randBetween(0, 3);
    }
    applyItem(createdObject);

  } else if (objectName === 'Treasure') {
    applyBasePrototypes(createdObject);
    createdObject.char = 'T';
    isEngine('RotJs')
      ? createdObject.RotJsObject.fgColour = HEX_GREEN
      : createdObject.PhaserObject.spriteFilename = 'Carrot';
    applyItem(createdObject);

  } else if (objectName === 'Portal') {
    applyBasePrototypes(createdObject);
    createdObject.char = 'P';
    isEngine('RotJs')
      ? createdObject.RotJsObject.fgColour = HEX_YELLOW
      : createdObject.PhaserObject.spriteFilename = 'Hotdog1';
    applyPortal(createdObject, arg);

  }
  return createdObject;
};

function applyBasePrototypes(createdObject) {
  isEngine('RotJs') ? applyRotJsObject(createdObject) : applyPhaserObject(createdObject);
  applyDestructible(createdObject);
}


function unused(createdObject) {
  applyConsumable(createdObject);
  applyItem(createdObject);
  applyEquipment(createdObject);
};

function applyLivingPrototypes(createdObject) {
  applyMoving(createdObject);
  applyPathing(createdObject);
  applyInventory(createdObject);
  applyLiving(createdObject);
  applyEquipper(createdObject);
  applySocial(createdObject);
  applyConsumer(createdObject);
  applyTemperature(createdObject);
  applyCombat(createdObject);
};

function applyAIPrototypes(createdObject) {
  applyTurnTaking(createdObject);
  applyDecisionAI(createdObject);
};
