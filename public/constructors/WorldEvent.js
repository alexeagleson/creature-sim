import { uniqueNumber } from './../main/general-utility';

export default function WorldEvent(text) {
  this.uniqueID = uniqueNumber();
  this.text = text;

  this.addToTimeline = () => {
    World.allEvents.push(this);
  };
}

export function publishEvent(text) {
  const event = new WorldEvent(text);
  event.addToTimeline();
}
