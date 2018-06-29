import WorldObject from './../constructors/WorldObject';
import WorldMap, { connectMaps, digBuildingLot, createBuilding } from './../constructors/WorldMap';
import WorldTile from './../constructors/WorldTile';

import createWorldObject from './../content/content-WorldObject';

import { toMap } from './../main/world-utility';
import { displayError, runXTimes, directionTextToCoords } from './../main/general-utility';

export default function createWorldMap(mapName, width, height) {
  let createdMap = null;

  if (mapName === 'Home') {
    createdMap = new WorldMap(mapName, { mapType: 'Arena' });


    // createBuilding('Building', digBuildingLot({ worldMap: createdMap, size: 4, outerPadding: 1 }));
    // createBuilding('Building', digBuildingLot({ worldMap: createdMap, size: 4, outerPadding: 1 }));
    // createBuilding('Building', digBuildingLot({ worldMap: createdMap, size: 4, outerPadding: 1 }));
    // createBuilding('Building', digBuildingLot({ worldMap: createdMap, size: 4, outerPadding: 1 }));
    createBuilding('Building', digBuildingLot({ worldMap: createdMap, size: 4, outerPadding: 1 }));
    createBuilding('Building', digBuildingLot({ worldMap: createdMap, size: 4, outerPadding: 1 }));
    createBuilding('Building', digBuildingLot({ worldMap: createdMap, size: 4, outerPadding: 1 }));
    createBuilding('Building', digBuildingLot({ worldMap: createdMap, size: 4, outerPadding: 1 }));
    createBuilding('Building', digBuildingLot({ worldMap: createdMap, size: 4, outerPadding: 1 }));
    createBuilding('Building', digBuildingLot({ worldMap: createdMap, size: 4, outerPadding: 1 }));

    // createWorldObject('Squirrel').placeOnMap({ worldMap: createdMap });
    // createWorldObject('Rabbit').placeOnMap({ worldMap: createdMap });

    runXTimes(createWorldObject, 500, 'Squirrel').forEach((object) => { object.placeOnMap({ worldMap: createdMap, ignoreTriggers: true }); });
    runXTimes(createWorldObject, 500, 'Acorn').forEach((object) => { object.placeOnMap({ worldMap: createdMap, ignoreTriggers: true }); });

    // createWorldObject('Heavy Jacket').placeOnMap({ worldMap: createdMap });
    runXTimes(createWorldObject, 2, 'Trash').forEach((object) => { object.placeOnMap({ worldMap: createdMap, ignoreTriggers: true }); });
  } else if (mapName === 'Map 2') {
    createdMap = new WorldMap(mapName, { mapType: 'Cellular' });
    createBuilding('Building', digBuildingLot({ worldMap: createdMap, size: 3, outerPadding: 1 }));
    createBuilding('Building', digBuildingLot({ worldMap: createdMap, size: 3, outerPadding: 1 }));
    createBuilding('Building', digBuildingLot({ worldMap: createdMap, size: 3, outerPadding: 1 }));

    //createWorldObject('Acorn').placeOnMap({ worldMap: createdMap });

  } else if (mapName === 'Map 3') {
    createdMap = new WorldMap(mapName, { mapType: 'Cellular' });
    createWorldObject('Treasure').placeOnMap({ worldMap: createdMap, ignoreTriggers: true });

    createdMap.mapTemp = 20;
    runXTimes(createWorldObject, 50, 'Acorn').forEach((object) => { object.placeOnMap({ worldMap: createdMap }); });
    

  } else if (mapName === 'Building') {
    createdMap = new WorldMap(mapName, { mapWidth: width, mapHeight: height, mapType: 'Arena' });
    createdMap.mapTemp = 22;
  } else {
    return displayError(`No predefined map found with name ${mapName} in createWorldMap function.`);
  }
  return createdMap;
}

export function generateAllMaps() {
  const a = toMap('Home');
  const b = toMap('Map 2');
  const c = toMap('Map 3');

  connectMaps({ mapFrom: a, mapTo: b, coordsFrom: null, coordsTo: null });
  connectMaps({ mapFrom: b, mapTo: c, coordsFrom: null, coordsTo: null });

  World.MapNodeTree.populate();
}
