const PhaserObject = function(worldObject, arg = {}) {
  this.owner = worldObject;

  this.spriteFilename = arg.spriteFilename || 'Rabbit';
  this.sprite = null;
}
