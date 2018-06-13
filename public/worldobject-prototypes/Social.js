import { isNotObject } from './../main/filters';
import { publishEvent } from './../constructors/WorldEvent';
import { pickRandom } from './../main/general-utility';
import { displayDialogue } from './../../src/components/HoveringText';

function Social(worldObject) {
  this.owner = worldObject;
  World.allObjectsSocial.push(this.owner);
  if (!this.owner.Living) { applyLiving(this.owner); }

  this.socialLevel = 60;

  this.canISpeakTo = (worldObject) => {
    if (!worldObject.Social) { return false; }
    if (!this.owner.isAdjacentTo(worldObject, ProtoCs.SPEAK_MAX_DISTANCE)) { return false; }
    return true;
  };

  this.speak = (objectSpeakTo, forcedDialogue) => {
    const dialogue = forcedDialogue || pickRandom([`Hello ${objectSpeakTo.name}!`, `Whut up?`]);
    if (objectSpeakTo === World.player) { World.ReactUI.SelectOption.prompt(this.owner, dialogue, ['Ok']); }
    publishEvent(`${this.owner.name} says: ${dialogue}`, 'green');
    displayDialogue(this.owner, dialogue);
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
