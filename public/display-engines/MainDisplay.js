import RotJsDisplay from './../display-engines/RotJsDisplay';
import PhaserDisplay from './../display-engines/PhaserDisplay';

import { isEngine } from './../main/world-utility';

import { isOnMapOfObject } from './../main/filters';

export default function MainDisplay() {
  this.canvas = null;
  this.displayScreenTileWidth = null;
  this.displayScreenTileHeight = null;

  this.setRenderScreenDimensions = () => {
    this.displayScreenTileWidth = isEngine('RotJs') ? Math.min(ScreenCs.SCREEN_TILE_WIDTH, World.player.WorldMap.mapWidth) : World.player.WorldMap.mapWidth;
    this.displayScreenTileHeight = isEngine('RotJs') ? Math.min(ScreenCs.SCREEN_TILE_HEIGHT, World.player.WorldMap.mapHeight) : World.player.WorldMap.mapHeight;
  };

  this.renderAll = () => {
    // Run only once for Phaser on scene create, run on every update loop for RotJs
    this.renderTiles();
    this.renderObjects();
  };

  this.renderTiles = () => {
    for (let i = 0; i < this.displayScreenTileWidth; i += 1) {
      for (let j = 0; j < this.displayScreenTileHeight; j += 1) {
        this.displayEngineHandler.drawTile([i, j]);
      }
    }
  };

  this.renderObjects = () => {
    World.allObjects.filter(isOnMapOfObject.bind(World.player)).forEach((object) => {
      this.displayEngineHandler.drawObject(object);
    });
  };

  this.setRenderScreenDimensions();
  this.displayEngineHandler = isEngine('Phaser') ? new PhaserDisplay(this) : new RotJsDisplay(this);
  this.displayEngineHandler.initialize();
}

export function displayEngineIsActive() {
  if (World.MainDisplay) {
    if (World.MainDisplay.displayEngineHandler) {
      if (isEngine('Phaser')) {
        if (World.MainDisplay.displayEngineHandler.mainScene) {
          return true;
        }
      } else if (isEngine('RotJs')) {
        return true;
      }
    }
  }
  return false;
}
