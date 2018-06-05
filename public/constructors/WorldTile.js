import { isOnTile } from './../main/filters';

export default function WorldTile(arg = {
  x: null,
  y: null,
  worldMap: null,
  wall: null,
}) {
  this.x = arg.x;
  this.y = arg.y;
  this.WorldMap = arg.worldMap;
  this.wall = arg.wall;
  this.char = null;

  this.checkBlocked = () => !(this.wall);

  this.objectsOnTile = () => {
    const listOfObjects = World.allObjects.filter(isOnTile.bind(this));
    return listOfObjects;
  };
}
