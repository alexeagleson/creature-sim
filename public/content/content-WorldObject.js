import WorldObject from './../constructors/WorldObject';

import applyCombat from './../worldobject-prototypes/Combat';
import applyConsumable from './../worldobject-prototypes/Consumable';
import applyConsumer from './../worldobject-prototypes/Consumer';
import applyDecisionAI from './../worldobject-prototypes/DecisionAI';
import applyDestructible from './../worldobject-prototypes/Destructible';
import applyEquipment from './../worldobject-prototypes/Equipment';
import applyEquipper from './../worldobject-prototypes/Equipper';
import applyInventory from './../worldobject-prototypes/Inventory';
import applyItem from './../worldobject-prototypes/Item';
import applyLiving from './../worldobject-prototypes/Living';
import applyMemory from './../worldobject-prototypes/Memory';
import applyMoving from './../worldobject-prototypes/Moving';
import applyPathing from './../worldobject-prototypes/Pathing';
import applyPhaserObject from './../worldobject-prototypes/PhaserObject';
import applyPortal from './../worldobject-prototypes/Portal';
import applyRotJsObject from './../worldobject-prototypes/RotJsObject';
import applySocial from './../worldobject-prototypes/Social';
import applyTask from './../worldobject-prototypes/Task';
import applyTemperature from './../worldobject-prototypes/Temperature';
import applyTurnTaking from './../worldobject-prototypes/TurnTaking';

import { randBetween } from './../main/general-utility';
import { isEngine } from './../main/world-utility';

function applyBasePrototypes(createdObject) {
  isEngine('RotJs') ? applyRotJsObject(createdObject) : applyPhaserObject(createdObject);
  applyDestructible(createdObject);
}

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
}

function applyAIPrototypes(createdObject) {
  applyTurnTaking(createdObject);
  applyDecisionAI(createdObject);
  applyMemory(createdObject);
  applyTask(createdObject);
}

export default function createWorldObject(objectName, arg = {}) {
  let createdObject = new WorldObject(objectName);

  if (objectName === 'Player') {
    applyBasePrototypes(createdObject);
    applyLivingPrototypes(createdObject);
    applyTurnTaking(createdObject);
    //createdObject.Temperature.revokePrototype();
    //createdObject.Consumer.revokePrototype();

    createdObject.TurnTaking.millisecondsBetweenTurns = 200;
    createdObject.char = '@';
    isEngine('RotJs')
      ? createdObject.RotJsObject.fgColour = Colours.HEX_RED
      : createdObject.PhaserObject.spriteFilename = 'Ishi';

  } else if (objectName === 'Squirrel') {
    applyBasePrototypes(createdObject);
    applyLivingPrototypes(createdObject);
    applyAIPrototypes(createdObject);
    createdObject.Social.myDialogue = ['5ef3a151b344368b2de5355e74b50579', 'b9cb3efae1450b76f9e419403c5b0518'];
    createdObject.char = 'S';
    isEngine('RotJs')
      ? createdObject.RotJsObject.fgColour = Colours.HEX_BLUE
      : createdObject.PhaserObject.spriteFilename = 'Squirrel';

  } else if (objectName === 'Acorn') {
    applyBasePrototypes(createdObject);
    createdObject.char = 'o';
    isEngine('RotJs')
      ? createdObject.RotJsObject.fgColour = Colours.HEX_GREEN
      : createdObject.PhaserObject.spriteFilename = 'Acorn';
    applyConsumable(createdObject);
    applyItem(createdObject);
    createdObject.Consumable.hungerValue = 100;

  } else if (objectName === 'Club Soda') {
    applyBasePrototypes(createdObject);
    createdObject.char = 's';
    isEngine('RotJs')
      ? createdObject.RotJsObject.fgColour = Colours.HEX_GREEN
      : createdObject.PhaserObject.spriteFilename = 'Water';
    applyConsumable(createdObject);
    applyItem(createdObject);
    createdObject.Consumable.thirstValue = 100;

  } else if (objectName === 'Rabbit') {
    applyBasePrototypes(createdObject);
    applyLivingPrototypes(createdObject);
    applyAIPrototypes(createdObject);
    createdObject.Social.myDialogue = ['5ef3a151b344368b2de5355e74b50579', 'b9cb3efae1450b76f9e419403c5b0518'];
    createdObject.char = 'R';
    isEngine('RotJs')
      ? createdObject.RotJsObject.fgColour = Colours.HEX_BLUE
      : createdObject.PhaserObject.spriteFilename = 'Rabbit';

  } else if (objectName === 'Carrot') {
    applyBasePrototypes(createdObject);
    createdObject.char = 'c';
    isEngine('RotJs')
      ? createdObject.RotJsObject.fgColour = Colours.HEX_GREEN
      : createdObject.PhaserObject.spriteFilename = 'Carrot';

    applyConsumable(createdObject);
    createdObject.Consumable.hungerValue = 100;

  } else if (objectName === 'Heavy Jacket') {
    applyBasePrototypes(createdObject);
    createdObject.char = 'j';
    isEngine('RotJs')
      ? createdObject.RotJsObject.fgColour = Colours.HEX_YELLOW
      : createdObject.PhaserObject.spriteFilename = 'Carrot';

    applyEquipment(createdObject);
    createdObject.Equipment.temperatureProtection = 99;

  } else if (objectName === 'Trash') {
    applyBasePrototypes(createdObject);
    createdObject.char = '%';
    if (isEngine('RotJs')) {
      createdObject.RotJsObject.fgColour = Colours.HEX_ORANGE
    } else {
      createdObject.PhaserObject.spriteFilename = 'Trash';
      createdObject.PhaserObject.defaultFrameNumber = randBetween(0, 3);
    }
    applyItem(createdObject);

  } else if (objectName === 'Treasure') {
    applyBasePrototypes(createdObject);
    createdObject.char = 'T';
    isEngine('RotJs')
      ? createdObject.RotJsObject.fgColour = Colours.HEX_GREEN
      : createdObject.PhaserObject.spriteFilename = 'Carrot';
    applyItem(createdObject);

  } else if (objectName === 'Portal') {
    applyBasePrototypes(createdObject);
    createdObject.char = 'P';
    isEngine('RotJs')
      ? createdObject.RotJsObject.fgColour = Colours.HEX_YELLOW
      : createdObject.PhaserObject.spriteFilename = 'Portal';
    applyPortal(createdObject, arg);
  } else {
    alert(`No object found in content-WorldObjects with the name ${objectName}`);
  }
  return createdObject;
}
