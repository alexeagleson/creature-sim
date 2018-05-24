const WorldEvent = function(text) {
  this.uniqueID = uniqueNumber();
  this.text = text;

  this.addToTimeline = function() {
    World.allEvents.push(this);
  };
}

function publishEvent(text) {
  const event = new WorldEvent(text);
  event.addToTimeline();
};
