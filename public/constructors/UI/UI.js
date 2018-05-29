const UI = function(arg = {}) {
  if (!arg.id) {
    displayError('UI object must be initialized with an ID.');
    return null;
  }

  arg.width = arg.width || 'auto';
  arg.height = arg.height || 'auto';
  arg.class = arg.class || 'defaultClass';

  this.hudTargetObject = World.player;
  this.htmlElement = document.createElement('div');

  this.htmlElement.id = arg.id;
  this.htmlElement.className = arg.class;
  this.htmlElement.style['width'] = `${arg.width}px`;
  this.htmlElement.style['height'] = `${arg.height}px`;

  this.addChildMenu = function(htmlElement) {
    this.htmlElement.append(htmlElement);
  };

  this.isHidden = function() {
    if (this.htmlElement.style['display'] === 'none') { return true; }
    return false;
  };

  this.toggle = function() {
    if (this.isHidden()) {
      this.show();
    } else {
      this.hide();
    }
  };

  this.hide = function() {
    this.htmlElement.style['display'] = 'none';
    if (this.Select) { resumeSim(); }
  };

  this.show = function() {
    this.htmlElement.style['display'] = 'block';
    if (this.Select) { pauseSim(); }
  };
};

function displayNamesOfObjects(objectsAtCoords) {
  let objectNamesElement = document.getElementById('objectNames');

  if (!objectNamesElement) {
    objectNamesElement = document.createElement('p');
    objectNamesElement.id = 'objectNames';
    objectNamesElement.className = 'strokeme';
    World.allUI.mainWrapper.htmlElement.append(objectNamesElement);
  }

  let objectNames = "";

  objectsAtCoords.forEach((worldObject) => {
    const nameToDisplay = worldObject.name;
    objectNames = objectNames + nameToDisplay + ", ";
  });

  objectNames = objectNames.slice(0, -2);

  objectNamesElement.innerHTML = objectNames;
  if (objectsAtCoords.length > 0) {
    const pixelCoords = tileToPixel(actualToScreen(objectsAtCoords[0].myCoords()));
    objectNamesElement.innerHTML = objectNames;
    objectNamesElement.style['left'] = `${pixelCoords[0]}px`;
    objectNamesElement.style['top'] = `${pixelCoords[1]}px`;
    objectNamesElement.style['position'] = "absolute";
    objectNamesElement.style['z-index'] = "2";
    objectNamesElement.style['pointer-events'] = "none";
  }
};

function displayDialogue(speakerObject, dialogue) {
  let dialogueElement = document.getElementById(`dialogue${speakerObject.uniqueID}`);

  if (!dialogueElement) {
    dialogueElement = document.createElement('p');
    dialogueElement.id = `dialogue${speakerObject.uniqueID}`;
    dialogueElement.className = 'strokeme';
    World.allUI.mainWrapper.htmlElement.append(dialogueElement);
  }

  const pixelCoords = tileToPixel(actualToScreen(speakerObject.myCoords()));
  dialogueElement.innerHTML = dialogue;
  dialogueElement.style['left'] = `${pixelCoords[0]}px`;
  dialogueElement.style['top'] = `${pixelCoords[1]}px`;
  dialogueElement.style['position'] = "absolute";
  dialogueElement.style['z-index'] = "2";
  dialogueElement.style['pointer-events'] = "none";

  setTimeout(() => { removeAllChildren(dialogueElement); }, 3000);
};

function initializeUI() {
  World.MainDisplay.canvas.className = 'displayCanvas';
  World.allUI.mainWrapper = new UI(arg = {id: 'mainWrapper', class: 'mainWrapper', width: World.MainDisplay.canvas.width, height: World.MainDisplay.canvas.height});
  document.body.append(World.allUI.mainWrapper.htmlElement);
  World.allUI.mainWrapper.htmlElement.append(World.MainDisplay.canvas);

  World.allUI.hudUI = new UI(arg = {id: 'mainMenu', class: 'basicMenu top-left'});
  World.allUI.hudUI.Hud = new Hud(World.allUI.hudUI);

  World.allUI.timelineUI = new UI(arg = {id: 'worldTimeline', class: 'basicMenu bottom-left'});
  World.allUI.timelineUI.Timeline = new Timeline(World.allUI.timelineUI);

  World.allUI.selectUI = new UI(arg = {id: 'selectObject', class: 'basicMenu top-right'});
  World.allUI.selectUI.Select = new Select(World.allUI.selectUI);
}

function removeAllChildren(htmlElement) {
  while(htmlElement.firstChild) { htmlElement.removeChild(htmlElement.firstChild); }
};
