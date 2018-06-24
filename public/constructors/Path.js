import WorldObject from './../constructors/WorldObject';
import WorldTile from './../constructors/WorldTile';
import { displayError } from './../main/general-utility';
import { convertToCoords, convertToMap, convertToTile } from './../main/world-utility';

export default function Path(pathTo, pathFrom) {
  if (!(pathTo instanceof WorldObject) && !(pathTo instanceof WorldTile)) return displayError(`pathTo (${pathTo}) must be a WorldTile or WorldObject`);
  if (!(pathFrom instanceof WorldObject) && !(pathFrom instanceof WorldTile)) return displayError(`pathFrom (${pathFrom}) must be a WorldTile or WorldObject`);

  this.pathToObject = pathTo instanceof WorldObject ? pathTo : null;
  this.pathToCoords = convertToCoords(pathTo);
  this.pathToMap = convertToMap(pathTo);
  this.pathToTile = convertToTile(pathTo);

  this.pathFromObject = pathFrom instanceof WorldObject ? pathFrom : null;
  this.pathFromCoords = convertToCoords(pathFrom);
  this.pathFromMap = convertToMap(pathFrom);
  this.pathFromTile = convertToTile(pathFrom);
}
