let lastRender = 0;
let oneSecondInterval = 0;
let oneTenthSecondInterval = 0;

window.onload = () => {
  initializeWorld();
  World.MainDisplay = new MainDisplay();


  // 
  //
  //
  // function Graph() {
  //   var neighbors = this.neighbors = {}; // Key = vertex, value = array of neighbors.
  //
  //   this.addEdge = function (u, v) {
  //     if (neighbors[u] === undefined) {  // Add the edge u -> v.
  //       neighbors[u] = [];
  //     }
  //     neighbors[u].push(v);
  //     if (neighbors[v] === undefined) {  // Also add the edge v -> u in order
  //       neighbors[v] = [];               // to implement an undirected graph.
  //     }                                  // For a directed graph, delete
  //     neighbors[v].push(u);              // these four lines.
  //   };
  //
  //   return this;
  // }
  //
  // function bfs(graph, source) {
  //   var queue = [ { vertex: source, count: 0 } ],
  //       visited = { source: true },
  //       tail = 0;
  //   while (tail < queue.length) {
  //     var u = queue[tail].vertex,
  //         count = queue[tail++].count;  // Pop a vertex off the queue.
  //     print('distance from ' + source + ' to ' + u + ': ' + count);
  //     graph.neighbors[u].forEach(function (v) {
  //       if (!visited[v]) {
  //         visited[v] = true;
  //         queue.push({ vertex: v, count: count + 1 });
  //       }
  //     });
  //   }
  // }
  //
  // function shortestPath(graph, source, target) {
  //   if (source == target) {   // Delete these four lines if
  //     print(source);          // you want to look for a cycle
  //     return;                 // when the source is equal to
  //   }                         // the target.
  //   var queue = [ source ],
  //       visited = { source: true },
  //       predecessor = {},
  //       tail = 0;
  //   while (tail < queue.length) {
  //     var u = queue[tail++],  // Pop a vertex off the queue.
  //         neighbors = graph.neighbors[u];
  //     for (var i = 0; i < neighbors.length; ++i) {
  //       var v = neighbors[i];
  //       if (visited[v]) {
  //         continue;
  //       }
  //       visited[v] = true;
  //       if (v === target) {   // Check if the path is complete.
  //         var path = [ v ];   // If so, backtrack through the path.
  //         while (u !== source) {
  //           path.push(u);
  //           u = predecessor[u];
  //         }
  //         path.push(u);
  //         path.reverse();
  //         print(path);
  //         return;
  //       }
  //       predecessor[v] = u;
  //       queue.push(v);
  //     }
  //   }
  //   print('there is no path from ' + source + ' to ' + target);
  // }
  //
  // function print(s) {  // A quick and dirty way to display output.
  //   s = s || '';
  //   console.log(s);
  // }
  //
  //   var graph = new Graph();
  //   graph.addEdge('A', 'B');
  //   graph.addEdge('B', 'C');
  //   graph.addEdge('B', 'E');
  //   graph.addEdge('C', 'D');
  //   graph.addEdge('C', 'E');
  //   graph.addEdge('C', 'G');
  //   graph.addEdge('D', 'E');
  //   graph.addEdge('E', 'F');
  //
  //   bfs(graph, 'A');
  //   print();
  //   shortestPath(graph, 'B', 'G');
  //   print();
  //   shortestPath(graph, 'G', 'A');
  //














  if (isEngine('RotJs')) {
    initializeUiTimeAndCamera();
    window.requestAnimationFrame(rotJsLoop);
  }
};

function initializeWorld() {
  World.player = createWorldObject('Player');
  World.player.placeOnMap({worldMap: getMapByName('Home')});
};

function initializeUiTimeAndCamera() {
  initializeUI();
  initializeInput();
  World.Camera = new MainCamera();
  World.Time = new Time();
};

function rotJsLoop(timestamp) {
  const progress = timestamp - lastRender;
  lastRender = timestamp;
    if (!World.worldPaused) { mainLoop(); }
  if (!World.worldEnd) {
    window.requestAnimationFrame(rotJsLoop);
  }
};

function mainLoop() {
  World.allObjects.filter(isTurnTaking).filter(isOnAMap).forEach((object) => {
    if (object.TurnTaking.checkForTurnReady()) {
      object.TurnTaking.takeTurn();
    }
  });

  if (World.Time.millisecondsElapsed > oneTenthSecondInterval + 100) {
    World.allUI.hudUI.Hud.update();
    oneTenthSecondInterval = World.Time.millisecondsElapsed;
  }

  if (World.Time.millisecondsElapsed > oneSecondInterval + 1000) {
    World.player.Living.adjustStamina(timePassedMilliseconds = (World.Time.millisecondsElapsed - oneSecondInterval));
    World.player.Consumer.adjustHunger(timePassedMilliseconds = (World.Time.millisecondsElapsed - oneSecondInterval));
    World.player.Consumer.adjustThirst(timePassedMilliseconds = (World.Time.millisecondsElapsed - oneSecondInterval));
    World.player.Temperature.adjustTemperature(timePassedMilliseconds = (World.Time.millisecondsElapsed - oneSecondInterval));
    oneSecondInterval = World.Time.millisecondsElapsed;
  }

  World.Camera.updatePosition();
  if (isEngine('RotJs') || World.playerMapTransition) {
    if (World.playerMapTransition) {
      World.MainDisplay.displayEngineHandler.destroyAllSprites();
      World.MainDisplay.setRenderScreenDimensions();
    }
    World.playerMapTransition = false;
    World.MainDisplay.renderAll();
  }
};

function endSim() {
  World.worldEnd = true;
  World.worldPaused = true;
  World.MainDisplay.displayEngineHandler.stopDisplayEngine();
  removeAllChildren(World.allUI.mainWrapper.htmlElement);
  alert('The simulation has ended.');
}
