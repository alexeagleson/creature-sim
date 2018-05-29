const PhaserObject = function(worldObject, arg = {}) {
  this.owner = worldObject;

  this.spriteFilename = arg.spriteFilename || 'Rabbit';
  this.defaultFrameNumber = arg.defaultFrameNumber || 0;
  this.sprite = null;

  this.destroySprite = function() {
    this.sprite.destroy();
    this.sprite = null;
  };

  this.generateSprite = function() {
    if (!this.sprite) { this.sprite = World.MainDisplay.displayEngineHandler.drawObject(this); }
  };

  this.placeSprite = function(tileCoords) {
    const pixelCoords = tileToPixel(tileCoords);
    this.sprite.x = pixelCoords[0];
    this.sprite.y = pixelCoords[1];
    this.sprite.depth = 1;
  };
};

function applyPhaserObject(worldObject, arg = {}) {
  worldObject.PhaserObject = worldObject.PhaserObject || new PhaserObject(worldObject, arg);
};
