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
  };

  this.show = function() {
    this.htmlElement.style['display'] = 'block';
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
    const pixelX = World.Camera.getObjectPixelCoords(objectsAtCoords[0])[0];
    const pixelY = World.Camera.getObjectPixelCoords(objectsAtCoords[0])[1];
    objectNamesElement.innerHTML = objectNames;
    objectNamesElement.style['left'] = `${pixelX}px`;
    objectNamesElement.style['top'] = `${pixelY}px`;
    objectNamesElement.style['position'] = "absolute";
    objectNamesElement.style['z-index'] = "2";
    objectNamesElement.style['pointer-events'] = "none";
  }
};
