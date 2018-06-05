import WorldObject from './../constructors/WorldObject';
import WorldMap, { connectMaps } from './../constructors/WorldMap';
import WorldTile from './../constructors/WorldTile';

import createWorldObject from './../content/content-WorldObject';

import { convertToMap } from './../main/world-utility';
import { runXTimes } from './../main/general-utility';

export default function createWorldMap(mapName) {
  let createdMap = null;

  if (mapName === 'Home') {
    createdMap = new WorldMap(mapName, { mapType: 'Arena' });
    createWorldObject('Squirrel').placeOnMap({ worldMap: createdMap });
    createWorldObject('Acorn').placeOnMap({ worldMap: createdMap });
    createWorldObject('Rabbit').placeOnMap({ worldMap: createdMap });
    createWorldObject('Carrot').placeOnMap({ worldMap: createdMap });
    runXTimes(createWorldObject, 2, 'Trash').forEach((object) => { object.placeOnMap({ worldMap: createdMap }); });
  } else if (mapName === 'Map 2') {
    createdMap = new WorldMap(mapName, { mapType: 'Cellular' });
  } else if (mapName === 'Map 3') {
    createdMap = new WorldMap(mapName, { mapType: 'Cellular' });
  } else if (mapName === 'Map 4') {
    createdMap = new WorldMap(mapName, { mapType: 'Cellular' });
    createWorldObject('Treasure').placeOnMap({ worldMap: createdMap });
  } else {
    return displayError(`No predefined map found with name ${mapName} in createWorldMap function.`);
  }
  return createdMap;
}

export function generateAllMaps() {
  const a = convertToMap('Home');
  const b = convertToMap('Map 2');
  const c = convertToMap('Map 3');
  const d = convertToMap('Map 4');

  connectMaps({
    mapFrom: a, mapTo: b, coordsFrom: null, coordsTo: null,
  });
  connectMaps({
    mapFrom: b, mapTo: c, coordsFrom: null, coordsTo: null,
  });
  connectMaps({
    mapFrom: c, mapTo: d, coordsFrom: null, coordsTo: null,
  });

  World.MapNodeTree.populate();
}
