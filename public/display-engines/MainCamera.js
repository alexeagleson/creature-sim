import { isEngine, tileToPixel } from './../main/world-utility';

export default function MainCamera() {
  this.tileX = null;
  this.tileY = null;

  this.updatePosition = () => {
    const displayScreenWidth = Math.min(ScreenCs.SCREEN_TILE_WIDTH, World.player.WorldMap.mapWidth);
    const displayScreenHeight = Math.min(ScreenCs.SCREEN_TILE_HEIGHT, World.player.WorldMap.mapHeight);
    this.tileX = this.computeTileCoord(World.player.WorldTile.x, displayScreenWidth, World.player.WorldMap.mapWidth);
    this.tileY = this.computeTileCoord(World.player.WorldTile.y, displayScreenHeight, World.player.WorldMap.mapHeight);
    if (isEngine('Phaser')) { this.updatePhaserCameraPosition(); }
  };

  this.updatePhaserCameraPosition = () => {
    const pixelPosition = tileToPixel([this.tileX, this.tileY]);
    const pixelOffset = Math.floor(ScreenCs.TILE_SIZE / 2);
    World.MainDisplay.displayEngineHandler.mainScene.cameras.main.setScroll(pixelPosition[0] - pixelOffset, pixelPosition[1] - pixelOffset);
  };

  this.computeTileCoord = (playerPosition, screenSize, mapSize) => {
    const halfScreenSize = Math.floor(screenSize / 2);
    if (playerPosition < halfScreenSize) {
      return 0;
    } else if (playerPosition >= mapSize - halfScreenSize) {
      return mapSize - screenSize;
    }
    return playerPosition - halfScreenSize;
  };

  this.updatePosition();
}
