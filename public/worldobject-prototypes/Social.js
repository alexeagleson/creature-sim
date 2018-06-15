import { publishEvent } from './../constructors/WorldEvent';
import { getDialogueByID, getResponsesByID } from './../content/content-Dialogue';
import { isNotObject } from './../main/filters';
import { pickRandom } from './../main/general-utility';
import { displayDialogue } from './../../src/components/HoveringText';

function Social(worldObject) {
  this.owner = worldObject;
  World.allObjectsSocial.push(this.owner);
  if (!this.owner.Living) { applyLiving(this.owner); }

  this.socialLevel = 60;
  this.myDialogue = ['5cb5d08d36337a277eb5e67a452d2c44'];

  this.assignNewDialogue = (dialogueArray) => {
    this.myDialogue = this.myDialogue.concat(dialogueArray);
  };

  this.canISpeakTo = (worldObject) => {
    if (!worldObject.Social) { return false; }
    if (!this.owner.isAdjacentTo(worldObject, ProtoCs.SPEAK_MAX_DISTANCE)) { return false; }
    return true;
  };

  this.speak = (objectSpeakTo, chosenDialogueID) => {
    const dialogueID = chosenDialogueID || pickRandom(this.myDialogue);
    const dialogueText = getDialogueByID(dialogueID, objectSpeakTo);
    const responseIDs = getResponsesByID(dialogueID);

    publishEvent(`${this.owner.name} says to ${objectSpeakTo.name}: ${dialogueText}`, 'green');
    displayDialogue(this.owner, dialogueText);
    if (objectSpeakTo === World.player) { 
      World.ReactUI.SelectOption.prompt(this.owner, dialogueID, responseIDs);
    } else if (responseIDs.length > 0) {
      objectSpeakTo.Social.speak(this.owner, pickRandom(responseIDs));
    }

    this.socialLevel += 20;
  };

  this.revokePrototype = () => {
    World.allObjectsSocial = World.allObjectsSocial.filter(isNotObject.bind(this.owner));
    this.owner.Social = null;
  };
}

export default function applySocial(worldObject, arg = {}) {
  worldObject.Social = worldObject.Social || new Social(worldObject, arg);
}
