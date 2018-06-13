import { uniqueNumber } from './../main/general-utility';

export default function WorldEvent(text) {
  this.uniqueID = uniqueNumber();
  this.text = text;

  this.addToTimeline = () => {
    World.allEvents.push(this);
  };
}

export function publishEvent(text, colour) {
  const event = new WorldEvent(text);
  event.colour = colour || 'white';
  event.addToTimeline(colour);
  return true;
}
