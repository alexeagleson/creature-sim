import WorldTile from './../constructors/WorldTile';

import createWorldObject from './../content/content-WorldObject';
import createWorldMap from './../content/content-WorldMap';

import { displayError, uniqueNumber, randBetween } from './../main/general-utility';
import { convertToMap, convertToCoords } from './../main/world-utility';

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

  this.mapWidth = arg.mapWidth || 75;
  this.mapHeight = arg.mapHeight || 40;
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


export function getAvailableTile(arg = { worldMap: null, radius: null, checkForWall: null, checkForObjects: null, checkForBuildings: null }) {
  const { worldMap } = arg;
  let { radius, checkForWall, checkForObjects, checkForBuildings } = arg;

  radius = (radius !== undefined) ? radius : 0;
  checkForWall = (checkForWall !== undefined) ? checkForWall : true;
  checkForObjects = (checkForObjects !== undefined) ? checkForObjects : false;
  checkForBuildings = (checkForBuildings !== undefined) ? checkForBuildings : false;

  let randomTile = null;
  for (let i = 0; i < 9999; i += 1) {
    const randomX = randBetween(1 + radius, (worldMap.mapWidth - 2) - radius);
    const randomY = randBetween(1 + radius, (worldMap.mapHeight - 2) - radius);

    let conflictFound = false;
    for (let x = (randomX - radius); x <= (randomX + radius); x += 1) {
      if (conflictFound) { break; }
      for (let y = (randomY - radius); y <= (randomY + radius); y += 1) {
        if (conflictFound) { break; }
        const thisTile = worldMap.getTile([x, y]);

        if (checkForWall && thisTile.wall) { conflictFound = true; }
        if (checkForObjects && (thisTile.objectsOnTile().length > 0)) { conflictFound = true; }
        if (checkForBuildings && thisTile.buildingLot) { conflictFound = true; }
      }
    }

    if (!conflictFound) {
      randomTile = worldMap.getTile([randomX, randomY]);
      break;
    }
  }
  if (!randomTile) {
    displayError(`No available empty tile found in ${worldMap.name}.`);
  }
  return randomTile;
}


export function connectMaps(arg = {
  mapTo: null,
  mapFrom: null,
  coordsTo: null,
  coordsFrom: null,
}) {
  const mapTo = convertToMap(arg.mapTo);
  const mapFrom = convertToMap(arg.mapFrom);

  const coordsTo = arg.coordsTo || convertToCoords(getAvailableTile({ worldMap: arg.mapTo }));
  const coordsFrom = arg.coordsFrom || convertToCoords(getAvailableTile({ worldMap: arg.mapFrom }));

  mapTo.getTile(coordsTo).toggleWall(false);
  mapFrom.getTile(coordsFrom).toggleWall(false);

  createWorldObject('Portal', { warpToMap: mapTo, warpCoords: coordsTo }).placeOnMap({ worldMap: mapFrom, coords: coordsFrom });
  createWorldObject('Portal', { warpToMap: mapFrom, warpCoords: coordsFrom }).placeOnMap({ worldMap: mapTo, coords: coordsTo });
}


export function digBuildingLot(arg = { worldMap: null, size: null, outerPadding: null }) {
  const { worldMap } = arg;
  let { size, outerPadding } = arg;
  size = size || 2;
  outerPadding = outerPadding || 1;
  outerPadding = (outerPadding >= size) ? (size - 1) : outerPadding;

  const centreCoords = convertToCoords(getAvailableTile({ worldMap, radius: (size + outerPadding), checkForWall: false, checkForObjects: false, checkForBuildings: true }));

  for (let x = (centreCoords[0] - size); x <= (centreCoords[0] + size); x += 1) {
    for (let y = (centreCoords[1] - size - 1); y < (centreCoords[1] + size); y += 1) {
      worldMap.getTile([x, y]).toggleWall(false).toggleBuildingLot(true);
    }
  }
  return { worldMap, size: (size - outerPadding), centreCoords };
}


export function createBuilding(buildingName, arg = { worldMap: null, size: null, centreCoords: null }) {
  const { worldMap, size, centreCoords } = arg;
  const doorwayCoords = [centreCoords[0], centreCoords[1] + (size - 1)];

  for (let x = (centreCoords[0] - size); x <= (centreCoords[0] + size); x += 1) {
    for (let y = (centreCoords[1] - size - 1); y < (centreCoords[1] + size); y += 1) {
      worldMap.getTile([x, y]).toggleWall(true);
    }
  }
  const thisBuilding = createWorldMap(buildingName, (size * 2) + 1, (size * 2) + 1);
  const buildingDoorwayCoords = [Math.floor(thisBuilding.mapWidth / 2), (thisBuilding.mapHeight - 1)];

  connectMaps({ mapFrom: worldMap, mapTo: thisBuilding, coordsFrom: doorwayCoords, coordsTo: buildingDoorwayCoords });
  return thisBuilding;
}
