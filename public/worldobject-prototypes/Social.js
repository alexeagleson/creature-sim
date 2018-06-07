import { publishEvent } from './../constructors/WorldEvent';

import { displayDialogue } from './../../src/components/HoveringText';

function Social(worldObject) {
  this.owner = worldObject;
  World.allObjectsSocial.push(this.owner);
  if (!this.owner.Living) { applyLiving(this.owner); }

  this.socialLevel = 100;

  this.canISpeakTo = (worldObject) => {
    if (!worldObject.Social) { return false; }
    if (!this.owner.isAdjacentTo(worldObject, ProtoCs.SPEAK_MAX_DISTANCE)) { return false; }
    return true;
  };

  this.speak = (objectSpeakTo) => {
    const dialogue = `Hello ${objectSpeakTo.name}!`;
    publishEvent(`${this.owner.name} says: ${dialogue}`);
    displayDialogue(this.owner, dialogue);
    this.socialLevel += 10;
  };
}

export default function applySocial(worldObject, arg = {}) {
  worldObject.Social = worldObject.Social || new Social(worldObject, arg);
}
