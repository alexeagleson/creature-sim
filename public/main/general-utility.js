// Relative coordinates
const NODIR_COORDS = [0, 0];

const UP_COORDS = [0, -1];
const DOWN_COORDS = [0, 1];
const LEFT_COORDS = [-1, 0];
const RIGHT_COORDS = [1, 0];

const UPLEFT_COORDS = [-1, -1];
const UPRIGHT_COORDS = [1, -1];
const DOWNLEFT_COORDS = [-1, 1];
const DOWNRIGHT_COORDS = [1, 1];

let errorAlertHasBeenTriggered = false;

export function rollDie(dieSize) {
  const value = Math.floor(Math.random() * (dieSize)) + 1;
  return value;
}

export function pickRandom(arrayOfThings) {
  const randomPosition = rollDie(arrayOfThings.length) - 1;
  return arrayOfThings[randomPosition];
}

export function runXTimes(givenFunction, numberOfTimes, optionalArg = null) {
  const functionResults = [];
  for (let i = 0; i < numberOfTimes; i += 1) {
    functionResults.push(givenFunction(optionalArg));
  }
  return functionResults;
}

export function randBetween(min, max) {
  // Function is inclusive of max number
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function normalizeToValue(number, minValue, maxValue) {
  if (number < minValue) {
    number = minValue;
  } else if (number > maxValue) {
    number = maxValue;
  }
  return number;
}

export function uniqueNumber() {
  let date = Date.now();
  // If created at same millisecond as previous
  if (date <= uniqueNumber.previous) {
    uniqueNumber.previous += 1;
    date = uniqueNumber.previous;
  } else {
    uniqueNumber.previous = date;
  }
  return date;
}
uniqueNumber.previous = 0;

export function displayError(errorText, errorArguments) {
  if (!errorAlertHasBeenTriggered) {
    alert(`Error: ${errorText}`);
    errorAlertHasBeenTriggered = true;
  }
  console.log(`Error: ${errorText}`);
  errorArguments.forEach(arg => console.log(arg));
  return null;
}

export function randomDirectionCoords(noDirAllowed = true) {
  const directionOptions = [UP_COORDS, DOWN_COORDS, LEFT_COORDS, RIGHT_COORDS];
  if (noDirAllowed) { directionOptions.push(NODIR_COORDS); }
  return pickRandom(directionOptions);
}

export function directionTextToCoords(directionText) {
  if (directionText.toLowerCase() === 'up') {
    return UP_COORDS;
  } else if (directionText.toLowerCase() === 'down') {
    return DOWN_COORDS;
  } else if (directionText.toLowerCase() === 'left') {
    return LEFT_COORDS;
  } else if (directionText.toLowerCase() === 'right') {
    return RIGHT_COORDS;
  } else if (directionText.toLowerCase() === 'up') {
    return UP_COORDS;
  } else if (directionText.toLowerCase() === 'downleft') {
    return DOWNLEFT_COORDS;
  } else if (directionText.toLowerCase() === 'downright') {
    return DOWNRIGHT_COORDS;
  } else if (directionText.toLowerCase() === 'upleft') {
    return UPLEFT_COORDS;
  } else if (directionText.toLowerCase() === 'upright') {
    return UPRIGHT_COORDS;
  } else if (directionText.toLowerCase() === 'nodir') {
    return NODIR_COORDS;
  }
  displayError(`Invalid argument ${directionText} in function ${directionTextToCoords}.`);
  return null;
}