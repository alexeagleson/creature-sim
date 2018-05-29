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

function rollDie(dieSize) {
  var value = Math.floor(Math.random() * (dieSize)) + 1;
  return value;
};

function pickRandom(arrayOfThings) {
  randomPosition = rollDie(arrayOfThings.length) - 1;
  return arrayOfThings[randomPosition];
};

function runXTimes(givenFunction, numberOfTimes, optionalArg = null) {
  for (let i = 0; i < numberOfTimes; i++) { givenFunction(optionalArg); }
};

function randBetween(min, max) {
  // Function is inclusive of max number
  return Math.floor(Math.random() * (max - min + 1) + min);
};

function normalizeToValue(number, minValue, maxValue) {
  if (number < minValue) {
    number = minValue;
  } else if (number > maxValue) {
    number = maxValue;
  }
  return number;
};

uniqueNumber.previous = 0;
function uniqueNumber() {
    var date = Date.now();

    // If created at same millisecond as previous
    if (date <= uniqueNumber.previous) {
        date = ++uniqueNumber.previous;
    } else {
        uniqueNumber.previous = date;
    }
    return date;
};

function displayError(errorText) {
  if (!errorAlertHasBeenTriggered) {
    alert(`Error: ${errorText}`);
    errorAlertHasBeenTriggered = true;
  }
  console.log(`Error: ${errorText}`);
  return null;
};

function directionTextToCoords(directionText) {
  if (directionText.toLowerCase() === 'up') {
    return UP_COORDS;
  } else if (directionText.toLowerCase() === 'down') {
    return DOWN_COORDS;
  } else if (directionText.toLowerCase() === 'left') {
    return LEFT_COORDS;
  } else if (directionText.toLowerCase() === 'right') {
    return RIGHT_COORDS;
  } else if (directionText.toLowerCase() === 'nodir') {
    return NODIR_COORDS;
  } else {
    displayError(`Invalid argument ${directionText} in function ${directionTextToCoords}.`);
    return null;
  }
};
