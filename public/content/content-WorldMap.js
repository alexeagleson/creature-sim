function getMapByName(mapName) {
  let existingMap = World.allMaps.find((worldMap) => { return worldMap.name === mapName });
  if (!existingMap) { existingMap = createWorldMap(mapName); }
  return existingMap;
};

function createWorldMap(mapName) {
  let createdMap = null;

  if (mapName === 'Home') {
    createdMap = new WorldMap(mapName, arg = {mapType: 'Arena'});
    createWorldObject('Squirrel').placeOnMap({worldMap: createdMap});
    createWorldObject('Acorn').placeOnMap({worldMap: createdMap});
    createWorldObject('Rabbit').placeOnMap({worldMap: createdMap});
    createWorldObject('Carrot').placeOnMap({worldMap: createdMap});
    createWorldObject('Portal', arg = {warpToMap: 'Map 2'}).placeOnMap({worldMap: createdMap});
    runXTimes(createWorldObject, 6, 'Trash').forEach((object) => { object.placeOnMap({worldMap: createdMap}); });

  } else if (mapName === 'Map 2') {
    createdMap = new WorldMap(mapName, arg = {mapType: 'Cellular'});
    createWorldObject('Treasure').placeOnMap({worldMap: createdMap});
    createWorldObject('Portal', arg = {warpToMap: 'Home'}).placeOnMap({worldMap: createdMap});
    createWorldObject('Portal', arg = {warpToMap: 'Map 3'}).placeOnMap({worldMap: createdMap});

  } else if (mapName === 'Map 3') {
    createdMap = new WorldMap(mapName, arg = {mapType: 'Cellular'});
    createWorldObject('Portal', arg = {warpToMap: 'Map 2'}).placeOnMap({worldMap: createdMap});

  } else {
    return displayError(`No predefined map found with name ${mapName} in createWorldMap function.`)
  }
  return createdMap;
};
