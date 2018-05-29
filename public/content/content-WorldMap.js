function getMapByName(mapName) {
  let existingMap = World.allMaps.find((worldMap) => { return worldMap.name === mapName });
  if (!existingMap) { existingMap = createWorldMap(mapName); }
  return existingMap;
};

function createWorldMap(mapName) {
  let createdMap = null;

  if (mapName === 'Home') {
    createdMap = new WorldMap(mapName, arg = {mapType: 'Arena'});
  } else if (mapName === 'Map 2') {
    createdMap = new WorldMap(mapName, arg = {mapType: 'Cellular'});
  } else {
    return displayError(`No predefined map found with name ${mapName} in createWorldMap function.`)
  }

  World.allMaps.push(createdMap);
  return createdMap;
};
