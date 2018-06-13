import { isNotObject } from './../main/filters';
import { tileToPixel } from './../main/world-utility';

function PhaserObject(worldObject, arg = {}) {
  this.owner = worldObject;
  World.allObjectsPhaserObject.push(this.owner);

  this.spriteFilename = arg.spriteFilename || 'Rabbit';
  this.defaultFrameNumber = arg.defaultFrameNumber || 0;
  this.sprite = null;

  this.destroySprite = () => {
    if (this.sprite) {
      this.sprite.destroy();
    }
    this.sprite = null;
  };

  this.generateSprite = () => {
    if (!this.sprite) { World.MainDisplay.displayEngineHandler.drawObject(this.owner); }
  };

  this.placeSprite = (tileCoords) => {
    const pixelCoords = tileToPixel(tileCoords);
    this.sprite.x = pixelCoords[0];
    this.sprite.y = pixelCoords[1];
    this.sprite.visible = true;
    this.sprite.depth = 1;
  };

  this.revokePrototype = () => {
    World.allObjectsPhaserObject = World.allObjectsPhaserObject.filter(isNotObject.bind(this.owner));
    this.owner.PhaserObject = null;
  };
}

export default function applyPhaserObject(worldObject, arg = {}) {
  worldObject.PhaserObject = worldObject.PhaserObject || new PhaserObject(worldObject, arg);
}
