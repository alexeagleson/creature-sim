function addObjectToUniverse(object) {
  Game.allObjects.set(object.uniqueID, object);
};

function initializePlayer() {
  Game.player = createWorldObject('Generic');
  becomeRotObject(Game.player, {fgColour: 'red'});
  Game.player.tileX = 15;
  Game.player.tileY = 15;
};
