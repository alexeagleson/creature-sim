import { tileToPixel, canvasPixelOffset, actualToScreen, convertToCoords, onSameMap } from './../../main/world-utility';

export function displayNamesOfObjects(objectsAtCoords) {
  let objectNamesElement = document.getElementById('objectNames');

  if (!objectNamesElement) {
    objectNamesElement = document.createElement('p');
    objectNamesElement.id = 'objectNames';
    objectNamesElement.className = 'strokeme hover-text no-click';
    document.getElementById('canvas-wrapper-id').append(objectNamesElement);
  }

  let objectNames = '';
  objectNamesElement.innerHTML = '';

  if (objectsAtCoords.length === 0) { return; }

  objectsAtCoords.forEach((worldObject) => {
    const nameToDisplay = worldObject.name;
    objectNames = `${objectNames}${nameToDisplay}, `;
  });

  objectNames = objectNames.slice(0, -2);
  objectNamesElement.innerHTML = objectNames;

  const pixelCoords = canvasPixelOffset(tileToPixel(actualToScreen(convertToCoords(objectsAtCoords[0]))));
  objectNamesElement.style.left = `${pixelCoords[0]}px`;
  objectNamesElement.style.top = `${pixelCoords[1]}px`;
}

export function displayDialogue(speakerObject, dialogue) {
  if (World.disableDialogue) return;
  if (!onSameMap(World.player, speakerObject)) return;
  let dialogueElement = document.getElementById(`dialogue${speakerObject.uniqueID}`);

  if (!dialogueElement) {
    dialogueElement = document.createElement('p');
    dialogueElement.id = `dialogue${speakerObject.uniqueID}`;
    dialogueElement.className = 'strokeme hover-text no-click';
    document.getElementById('canvas-wrapper-id').append(dialogueElement);
  }

  dialogueElement.innerHTML = dialogue;

  speakerObject.updateDialoguePosition = () => {
    if (!onSameMap(World.player, speakerObject)) {
      dialogueElement.innerHTML = '';
      return;
    }
    dialogueElement.innerHTML = dialogue;
    const pixelCoords = canvasPixelOffset(tileToPixel(actualToScreen(convertToCoords(speakerObject))));
    dialogueElement.style.left = `${pixelCoords[0]}px`;
    dialogueElement.style.top = `${pixelCoords[1]}px`;
  };

  setTimeout(() => {
    dialogueElement.innerHTML = '';
    speakerObject.updateDialoguePosition = null;
  }, ProtoCs.DIALOGUE_DURATION_MILLISECONDS);
}
