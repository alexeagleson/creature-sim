import WorldTile from './../constructors/WorldTile';

import createWorldObject from './../content/content-WorldObject';

import { uniqueNumber } from './../main/general-utility';
import { convertToMap, convertToCoords, getRandomFreeTile } from './../main/world-utility';

export default function WorldMap(mapName, arg = {
  mapWidth: null,
  mapHeight: null,
  mapTemp: null,
  mapType: null,
}) {
  World.allMaps.push(this);
  this.name = mapName;
  this.uniqueID = uniqueNumber();

  World.allMapsMap.set(this.uniqueID, this);

  this.mapWidth = arg.mapWidth || 60;
  this.mapHeight = arg.mapHeight || 30;
  this.mapTemp = arg.mapTemp || 20;
  this.mapType = arg.mapType || 'Cellular';
  this.tileMap = {};

  this.getTile = coords => this.tileMap[`${coords[0]},${coords[1]}`];

  this.generateCellularMap = () => {
    const map = new ROT.Map.Cellular(this.mapWidth, this.mapHeight, { connected: true });

    // Cells have a 1/2 probability
    map.randomize(0.5);
    for (let i = 0; i < 5; i += 1) {
      // Run a few generations
      map.create();
    }
    map.connect(null, 1);

    for (let i = 0; i < this.mapWidth; i += 1) {
      for (let j = 0; j < this.mapHeight; j += 1) {
        const key = `${i},${j}`;
        let isWall = null;
        let tileChar = null;
        if (map._map[i][j]) {
          isWall = false;
          tileChar = '.';
        } else {
          isWall = true;
          tileChar = '#';
        }
        this.tileMap[key] = new WorldTile({
          x: i,
          y: j,
          worldMap: this,
          wall: isWall,
        });
        this.tileMap[key].char = tileChar;
      }
    }
  };

  this.generateMapByType = (mapArg = { mapType: null }) => {
    let map = null;

    if (mapArg.mapType === 'Arena') {
      map = new ROT.Map.Arena(this.mapWidth, this.mapHeight);
    } else if (mapArg.mapType === 'Rogue') {
      map = new ROT.Map.Rogue(this.mapWidth, this.mapHeight);
    } else if (mapArg.mapType === 'EllerMaze') {
      map = new ROT.Map.EllerMaze(this.mapWidth, this.mapHeight);
    }

    const createMapCallback = (x, y, isWall) => {
      const key = `${x},${y}`;
      this.tileMap[key] = new WorldTile({
        x,
        y,
        worldMap: this,
        wall: isWall,
      });
      if (isWall) {
        this.tileMap[key].char = '#';
        return;
      }
      this.tileMap[key].char = '.';
    };
    map.create(createMapCallback.bind(this));
  };

  if (this.mapType === 'Cellular') {
    this.generateCellularMap();
  } else {
    this.generateMapByType({ mapType: this.mapType });
  }
}

export function connectMaps(arg = {
  mapTo: null,
  mapFrom: null,
  coordsTo: null,
  coordsFrom: null,
}) {
  const mapTo = convertToMap(arg.mapTo);
  const mapFrom = convertToMap(arg.mapFrom);

  const coordsTo = arg.coordsTo || convertToCoords(getRandomFreeTile(arg.mapTo));
  const coordsFrom = arg.coordsFrom || convertToCoords(getRandomFreeTile(arg.mapFrom));

  createWorldObject('Portal', { warpToMap: mapTo, warpCoords: coordsTo }).placeOnMap({ worldMap: mapFrom, coords: coordsFrom });
  createWorldObject('Portal', { warpToMap: mapFrom, warpCoords: coordsFrom }).placeOnMap({ worldMap: mapTo, coords: coordsTo });
}
