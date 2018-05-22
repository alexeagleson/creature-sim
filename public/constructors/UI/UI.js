const UI = function(arg = {}) {
  if (!arg.id) {
    displayError('UI object must be initialized with an ID.');
    return null;
  }

  arg.width = arg.width || 'auto';
  arg.height = arg.height || 'auto';
  arg.class = arg.class || 'defaultClass';

  this.htmlElement = document.createElement('div');

  this.htmlElement.id = arg.id;
  this.htmlElement.className = arg.class;
  this.htmlElement.style['width'] = `${arg.width}px`;
  this.htmlElement.style['height'] = `${arg.height}px`;

  this.moveToObject = function(worldObject) {
    this.htmlElement.style['left'] = `${World.Camera.getObjectPixelCoords(World.player)[0]}px`;
    this.htmlElement.style['top'] = `${World.Camera.getObjectPixelCoords(World.player)[1]}px`;
  };

  this.hide = function() {
    this.htmlElement.style['display'] = 'none';
  };

  this.show = function() {
    this.htmlElement.style['display'] = 'block';
  };
};
