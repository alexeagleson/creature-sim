const PhaserObject = function(worldObject, arg = {}) {
  this.owner = worldObject;

  this.spriteFilename = arg.spriteFilename || 'Rabbit';
  this.sprite = null;

  this.destroySprite = function() {
    this.sprite.destroy();
    this.sprite = null;
  };

}
