import { pickRandom } from './../main/general-utility';
import { isOnTile } from './../main/filters';

export default function WorldTile(arg = {
  x: null,
  y: null,
  worldMap: null,
  wall: null,
  buildingLot: null,
}) {
  this.x = arg.x;
  this.y = arg.y;
  this.WorldMap = arg.worldMap;
  this.wall = arg.wall;
  this.char = null;

  this.objectsOnTile = [];

  this.toggleWall = (wall) => {
    this.wall = wall;
    if (wall) {
      this.char = (this.WorldMap.name === 'Home' || this.WorldMap.name === 'Building') ? '♦' : pickRandom(['♠', '♣']);
    } else {
      this.char = '.';
    }
    return this;
  };

  this.toggleBuildingLot = (buildingLot) => {
    this.buildingLot = buildingLot;
    return this;
  };

  this.checkPassable = (optionalComparisonObject) => !(this.wall);
}
