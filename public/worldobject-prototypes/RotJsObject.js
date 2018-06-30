import { isNotObject } from './../main/filters';

function RotJsObject(worldObject, arg = {}) {
  this.owner = worldObject;
  World.allObjectsRotJsObject.push(this.owner);

  this.fgColour = arg.fgColour || Colours.HEX_WHITE;
  this.bgColour = arg.bgColour || Colours.HEX_BLACK;

  this.revokePrototype = () => {
    World.allObjectsRotJsObject = World.allObjectsRotJsObject.filter(isNotObject.bind(this.owner));
    this.owner.RotJsObject = null;
  };
}

const applyRotJsObject = (worldObject, arg = {}) => {
  worldObject.RotJsObject = worldObject.RotJsObject || new RotJsObject(worldObject, arg);
};

export default applyRotJsObject;
