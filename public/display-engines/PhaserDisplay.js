import { initializeInputimeAndCamera, mainLoop } from './../main/app';

import { tileToPixel, toCoords } from './../main/world-utility';

const playGame = new Phaser.Class({
  Extends: Phaser.Scene,

  initialize: function playGame() {
    Phaser.Scene.call(this, {key: 'PlayGame'});
  },

  preload() {
    // 32x32
    this.load.spritesheet('Squirrel', 'https://kalospace.com/gameassets/active_game_assets/sprites/32x32/Squirrel.png', {frameWidth: ScreenCs.TILE_SIZE, frameHeight: ScreenCs.TILE_SIZE});
    this.load.spritesheet('Acorn', 'https://kalospace.com/gameassets/active_game_assets/sprites/32x32/Acorn.png', {frameWidth: ScreenCs.TILE_SIZE, frameHeight: ScreenCs.TILE_SIZE});
    this.load.spritesheet('Rabbit', 'https://kalospace.com/gameassets/active_game_assets/sprites/32x32/Rabbit.png', {frameWidth: ScreenCs.TILE_SIZE, frameHeight: ScreenCs.TILE_SIZE});
    this.load.spritesheet('Carrot', 'https://kalospace.com/gameassets/active_game_assets/sprites/32x32/Carrot.png', {frameWidth: ScreenCs.TILE_SIZE, frameHeight: ScreenCs.TILE_SIZE});
    this.load.spritesheet('Floor_Grass', 'https://kalospace.com/gameassets/active_game_assets/sprites/32x32/Floor_Grass.png', {frameWidth: ScreenCs.TILE_SIZE, frameHeight: ScreenCs.TILE_SIZE});
    this.load.spritesheet('Floor_Ice', 'https://kalospace.com/gameassets/active_game_assets/sprites/32x32/Floor_Ice.png', {frameWidth: ScreenCs.TILE_SIZE, frameHeight: ScreenCs.TILE_SIZE});
    this.load.spritesheet('Trash', 'https://kalospace.com/gameassets/active_game_assets/sprites/32x32/Trash.png', {frameWidth: ScreenCs.TILE_SIZE, frameHeight: ScreenCs.TILE_SIZE});
    this.load.spritesheet('Hotdog1', 'https://kalospace.com/gameassets/active_game_assets/sprites/32x32/Hotdog1.png', {frameWidth: ScreenCs.TILE_SIZE, frameHeight: ScreenCs.TILE_SIZE});
    this.load.spritesheet('Corpse', 'https://kalospace.com/gameassets/active_game_assets/sprites/32x32/Corpse.png', {frameWidth: ScreenCs.TILE_SIZE, frameHeight: ScreenCs.TILE_SIZE});
    this.load.spritesheet('Portal', 'https://kalospace.com/gameassets/active_game_assets/sprites/32x32/Portal.png', {frameWidth: ScreenCs.TILE_SIZE, frameHeight: ScreenCs.TILE_SIZE});

    // 32x64
    this.load.spritesheet('Ishi', 'https://kalospace.com/gameassets/active_game_assets/sprites/32x64/Ishi.png', {frameWidth: ScreenCs.TILE_SIZE, frameHeight: ScreenCs.TILE_SIZE * 2});
    this.load.spritesheet('Tree', 'https://kalospace.com/gameassets/active_game_assets/sprites/32x64/Tree.png', {frameWidth: ScreenCs.TILE_SIZE, frameHeight: ScreenCs.TILE_SIZE * 2});
  },

  create() {
    World.MainDisplay.displayEngineHandler.mainScene = this;
    World.MainDisplay.renderAll();
    initializeInputimeAndCamera();
  },

  update() {
    if (!World.worldPaused) { mainLoop(); }
  },
});

export default function PhaserDisplay(mainDisplay) {
  this.owner = mainDisplay;
  this.mainScene = null;

  this.initialize = () => {
    this.engine = new Phaser.Game({
      type: Phaser.WEBGL,
      width: ScreenCs.SCREEN_WIDTH,
      height: ScreenCs.SCREEN_HEIGHT,
      backgroundColor: '#000044',
      scene: [playGame],
    });
    this.owner.canvas = this.engine.canvas;
  };

  this.drawTile = (tileCoords) => {
    const worldTile = World.player.WorldMap.getTile(tileCoords);
    const pixelCoords = tileToPixel(toCoords(worldTile));

    if (worldTile.char === '.') {
      World.allActiveTileSprites.push(this.mainScene.add.sprite(pixelCoords[0], pixelCoords[1], 'Floor_Grass', 0));
    } else {
      World.allActiveTileSprites.push(this.mainScene.add.sprite(pixelCoords[0], pixelCoords[1], 'Floor_Grass', 0));
      const tree = this.mainScene.add.sprite(pixelCoords[0], pixelCoords[1], 'Tree', 0);
      tree.depth = 0.5;
      World.allActiveTileSprites.push(tree);
    }
  };

  this.drawObject = (worldObject) => {
    const pixelCoords = tileToPixel(toCoords(worldObject));
    worldObject.PhaserObject.sprite = this.mainScene.add.sprite(pixelCoords[0], pixelCoords[1], worldObject.PhaserObject.spriteFilename, worldObject.PhaserObject.defaultFrameNumber);
  };

  this.destroyAllSprites = () => {
    World.allObjects.forEach((object) => {
      if (object.PhaserObject) { object.PhaserObject.destroySprite(); }
    });
    World.allActiveTileSprites.forEach((tileSprite) => {
      tileSprite.destroy();
    });
    World.allActiveTileSprites = [];
  };

  this.stopDisplayEngine = () => {
    this.engine.scene.stop();
  };
};
