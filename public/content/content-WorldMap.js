function getMapByName(mapName) {
  let existingMap = World.allMaps.find((worldMap) => { return worldMap.name === mapName });
  if (!existingMap) { existingMap = createWorldMap(mapName); }
  return existingMap;
};

function generateAllMaps() {
  let a = getMapByName('Home');
  let b = getMapByName('Map 2');
  let c = getMapByName('Map 3');

  connectMaps({mapFrom: a, mapTo: b, coordsFrom: null, coordsTo: null});
  connectMaps({mapFrom: b, mapTo: c, coordsFrom: null, coordsTo: null});

  populateMapNodeTree();
  console.log(World.MapNodeTree)
  //bfs(World.MapNodeTree, a.uniqueID);

  console.log(shortestPath(World.MapNodeTree, a.uniqueID, b.uniqueID));
  console.log(shortestPath(World.MapNodeTree, a.uniqueID, c.uniqueID));
};

function createWorldMap(mapName) {
  let createdMap = null;

  if (mapName === 'Home') {
    createdMap = new WorldMap(mapName, arg = {mapType: 'Arena'});
    createWorldObject('Squirrel').placeOnMap({worldMap: createdMap});
    createWorldObject('Acorn').placeOnMap({worldMap: createdMap});
    createWorldObject('Rabbit').placeOnMap({worldMap: createdMap});
    createWorldObject('Carrot').placeOnMap({worldMap: createdMap});
    runXTimes(createWorldObject, 6, 'Trash').forEach((object) => { object.placeOnMap({worldMap: createdMap}); });

  } else if (mapName === 'Map 2') {
    createdMap = new WorldMap(mapName, arg = {mapType: 'Cellular'});
    createWorldObject('Treasure').placeOnMap({worldMap: createdMap});

  } else if (mapName === 'Map 3') {
    createdMap = new WorldMap(mapName, arg = {mapType: 'Cellular'});

  } else {
    return displayError(`No predefined map found with name ${mapName} in createWorldMap function.`)
  }
  return createdMap;
};
